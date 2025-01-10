"""
Backend Chat Service Module

This module implements the core chat functionality using Google's Generative AI models.
It handles real-time chat interactions, image analysis, and rate limiting.

Key Components:
- RateLimiter: Controls API request frequency
- ChatService: Main class managing chat interactions
- Model management and configuration
- WebSocket communication
- Image processing and analysis

Dependencies:
- google.generativeai: Google's Generative AI API
- fastapi: For WebSocket and HTTP endpoints
- PIL: For image processing
- asyncio: For asynchronous operations
"""

import json
import asyncio
import base64
from typing import List, Dict, Optional, Literal
import google.generativeai as genai
from fastapi import WebSocket, UploadFile, HTTPException
from PIL import Image
import io
import time
from datetime import datetime, timedelta
from fastapi.websockets import WebSocketState
import requests

ModelType = Literal['gemini-pro', 'gemini-pro-vision', 'embedding-001']

class RateLimiter:
    """
    Rate limiting implementation to control API request frequency.
    
    Attributes:
        max_requests (int): Maximum number of requests allowed in the window
        window_seconds (int): Time window in seconds
        requests (List[float]): List of request timestamps
    """
    def __init__(self, max_requests: int = 10, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = []

    def can_proceed(self) -> bool:
        """
        Check if a new request can proceed based on rate limits.
        
        Returns:
            bool: True if request can proceed, False otherwise
        """
        current_time = time.time()
        self.requests = [req_time for req_time in self.requests 
                        if current_time - req_time < self.window_seconds]
        
        if len(self.requests) < self.max_requests:
            self.requests.append(current_time)
            return True
        return False

class ChatService:
    """
    Main service class for handling chat interactions with Gemini AI models.
    
    This class manages:
    - Multiple AI model configurations
    - Real-time chat streaming
    - Image analysis
    - Rate limiting
    - Chat history tracking
    - PDF context integration
    
    Attributes:
        AVAILABLE_MODELS (Dict): Dictionary of available AI models
        api_key (str): API key for Gemini AI
        models (Dict): Initialized model instances
        current_text_model (str): Currently selected text model
        current_vision_model (str): Currently selected vision model
        chat_history (List): List of chat messages
        rate_limiter (RateLimiter): Rate limiting instance
        pdf_context (Optional[str]): Current PDF context for chat
    """

    AVAILABLE_MODELS = {
        'gemini-2.0-flash-exp': 'gemini-2.0-flash-exp',  # Latest experimental model
        'gemini-1.5-flash': 'gemini-1.5-flash',  # Standard flash model
        'gemini-1.0-pro': 'gemini-1.0-pro',  # Original pro model
        'gemini-1.5-pro': 'gemini-1.5-pro',  # Updated pro model
        'gemini-2.0-flash-thinking-exp-1219': 'gemini-2.0-flash-thinking-exp-1219',  # Experimental thinking model
        'gemini-pro-vision': 'gemini-pro-vision',  # For images
        'embedding-001': 'embedding-001'  # For embeddings
    }

    def __init__(self, api_key: str = "AIzaSyBQfQ7sN-ASKnlFe8Zg50xsp6qmDdZoweU"):
        """
        Initialize the ChatService with API key and model configurations.
        
        Args:
            api_key (str): Gemini AI API key
        
        Raises:
            ValueError: If API key format is invalid
        """
        # Clean and validate the API key
        self.api_key = api_key.replace(r'^AIzaSyB-', '').replace(r'lBxinyrKi9Jlx2m-AXfPwuDP4uVlYpU$', '').strip()
        
        if not self.api_key.startswith('AIzaSy'):
            raise ValueError('Invalid API key format')
            
        print(f"Using API key: {self.api_key}")  # For debugging
        
        genai.configure(api_key=self.api_key)
        self.models: Dict[str, genai.GenerativeModel] = {}
        self.current_text_model: str = 'gemini-1.5-flash'
        self.current_vision_model: str = 'gemini-pro-vision'
        self.chat_history: List[Dict[str, str]] = []
        self.rate_limiter = RateLimiter()
        self.pdf_context = None
        self._initialize_models()

    def _initialize_models(self):
        for model_name, api_name in self.AVAILABLE_MODELS.items():
            try:
                self.models[model_name] = genai.GenerativeModel(api_name)
            except Exception as e:
                print(f"Failed to initialize model {model_name}: {e}")

    def set_model(self, model_type: ModelType):
        if model_type not in self.AVAILABLE_MODELS:
            raise HTTPException(status_code=400, detail=f"Invalid model type. Available models: {list(self.AVAILABLE_MODELS.keys())}")
        
        if 'vision' in model_type:
            self.current_vision_model = model_type
        elif 'embedding' in model_type:
            pass
        else:
            self.current_text_model = model_type

    def get_available_models(self):
        return {
            'text_models': [m for m in self.AVAILABLE_MODELS.keys() if 'vision' not in m and 'embedding' not in m],
            'vision_models': [m for m in self.AVAILABLE_MODELS.keys() if 'vision' in m],
            'embedding_models': [m for m in self.AVAILABLE_MODELS.keys() if 'embedding' in m],
            'current_text_model': self.current_text_model,
            'current_vision_model': self.current_vision_model
        }

    def set_pdf_context(self, context: str):
        """Set the current PDF context for chat"""
        self.pdf_context = context

    async def stream_message(self, message: str, image: Optional[str] = None, websocket: WebSocket = None):
        try:
            if not self.rate_limiter.can_proceed():
                if websocket and websocket.client_state != WebSocketState.DISCONNECTED:
                    await websocket.send_json({"error": "Rate limit exceeded"})
                return

            if image:
                try:
                    # Process base64 image
                    try:
                        # Remove the data URL prefix if present
                        if ',' in image:
                            image_data = base64.b64decode(image.split(',')[1])
                        else:
                            image_data = base64.b64decode(image)
                    except Exception as e:
                        if websocket and websocket.client_state != WebSocketState.DISCONNECTED:
                            await websocket.send_json({"error": "Invalid image data"})
                        return

                    # Use user's message if provided, otherwise use default prompt
                    prompt = message if message.strip() else "Please analyze this image in detail."

                    # Format request data for image analysis
                    url = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent'
                    headers = {
                        'Content-Type': 'application/json',
                    }
                    
                    # Format the request according to the Gemini Vision API specification
                    data = {
                        'contents': [
                            {
                                'parts': [
                                    {
                                        'text': prompt
                                    },
                                    {
                                        'inline_data': {
                                            'mime_type': 'image/jpeg',
                                            'data': base64.b64encode(image_data).decode('utf-8')
                                        }
                                    }
                                ]
                            }
                        ],
                        'safety_settings': {
                            'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
                            'threshold': 'BLOCK_NONE'
                        },
                        'generation_config': {
                            'temperature': 0.4,
                            'topP': 1,
                            'topK': 32,
                            'maxOutputTokens': 2048
                        }
                    }

                    print("Sending request to Gemini Vision API...")
                    print(f"URL: {url}")
                    print(f"Prompt: {prompt}")

                    # Make request to Gemini Vision API
                    response = requests.post(
                        f'{url}?key={self.api_key}',
                        headers=headers,
                        json=data
                    )

                    print(f"Response status: {response.status_code}")

                    if not response.ok:
                        error_msg = f"API request failed with status {response.status_code}"
                        try:
                            error_data = response.json()
                            print(f"Error response: {error_data}")
                            if 'error' in error_data:
                                error_msg = f"{error_msg}: {error_data['error'].get('message', '')}"
                        except:
                            pass
                        raise Exception(error_msg)

                    # Process the response
                    response_data = response.json()
                    print(f"Response data: {response_data}")

                    if 'candidates' in response_data and len(response_data['candidates']) > 0:
                        # Extract the text from the response
                        analysis_text = response_data['candidates'][0]['content']['parts'][0]['text']
                        
                        # Send the complete analysis
                        if websocket and websocket.client_state != WebSocketState.DISCONNECTED:
                            await websocket.send_json({
                                "chunk": analysis_text,
                                "done": True,
                                "full_response": analysis_text
                            })

                        # Store in chat history
                        self.chat_history.append({
                            "role": "user",
                            "content": prompt,
                            "image": image,
                            "timestamp": datetime.now().isoformat()
                        })
                        self.chat_history.append({
                            "role": "assistant",
                            "content": analysis_text,
                            "timestamp": datetime.now().isoformat()
                        })
                    else:
                        raise Exception("No valid response from the vision model")

                except Exception as e:
                    print(f"Error in image analysis: {str(e)}")
                    if websocket and websocket.client_state != WebSocketState.DISCONNECTED:
                        await websocket.send_json({"error": str(e)})
                    return
            else:
                try:
                    # Get the model name from the current chat
                    model_name = self.current_text_model
                    url = f'https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent'
                    headers = {
                        'Content-Type': 'application/json'
                    }
                    
                    # If we have PDF context, include it in the prompt
                    if self.pdf_context:
                        prompt = f"""Based on the following context from a PDF document:

                        {self.pdf_context}

                        Question: {message}

                        Please provide a clear and concise answer based only on the information in the context."""
                    else:
                        prompt = message
                    
                    data = {
                        'contents': [{
                            'parts': [{
                                'text': prompt
                            }]
                        }]
                    }
                    
                    # Get streaming response
                    response = requests.post(
                        f'{url}?key={self.api_key}',
                        headers=headers,
                        json=data,
                        stream=True
                    )
                    
                    if not response.ok:
                        error_msg = f"API request failed with status {response.status_code}"
                        try:
                            error_data = response.json()
                            if 'error' in error_data:
                                error_msg = f"{error_msg}: {error_data['error'].get('message', '')}"
                        except:
                            pass
                        raise Exception(error_msg)
                    
                except Exception as e:
                    if websocket and websocket.client_state != WebSocketState.DISCONNECTED:
                        await websocket.send_json({"error": str(e)})
                    return

            # Stream chunks with small delay and typing sound
            full_response = ""
            try:
                for line in response.iter_lines():
                    if line:
                        try:
                            json_response = json.loads(line.decode('utf-8').replace('data: ', ''))
                            if 'candidates' in json_response:
                                chunk_text = json_response['candidates'][0]['content']['parts'][0]['text']
                                full_response += chunk_text
                                if websocket and websocket.client_state != WebSocketState.DISCONNECTED:
                                    await websocket.send_json({
                                        "chunk": chunk_text,
                                        "done": False
                                    })
                                await asyncio.sleep(0.05)  # Small delay for typing effect
                        except json.JSONDecodeError:
                            continue
            except Exception as e:
                print(f"Error processing stream: {e}")
                if websocket and websocket.client_state != WebSocketState.DISCONNECTED:
                    await websocket.send_json({"error": str(e)})
                return

            # Store in chat history
            self.chat_history.append({
                "role": "user",
                "content": message,
                "timestamp": datetime.now().isoformat()
            })
            self.chat_history.append({
                "role": "assistant",
                "content": full_response,
                "timestamp": datetime.now().isoformat()
            })

            if websocket and websocket.client_state != WebSocketState.DISCONNECTED:
                await websocket.send_json({
                    "chunk": "",
                    "done": True,
                    "full_response": full_response
                })

        except Exception as e:
            if websocket and websocket.client_state != WebSocketState.DISCONNECTED:
                await websocket.send_json({"error": str(e)})

    def get_chat_history(self) -> List[Dict[str, str]]:
        return self.chat_history

    def clear_chat_history(self):
        self.chat_history = []

    def format_content(self, content: str) -> str:
        """Format the content based on its type (code, JSON, or regular text)."""
        try:
            # Try to parse as JSON first
            import json
            json_obj = json.loads(content)
            return f"```json\n{json.dumps(json_obj, indent=2)}\n```"
        except json.JSONDecodeError:
            # Check if it looks like code
            if self.is_code_block(content):
                lang = self.detect_language(content)
                return f"```{lang}\n{self.format_code(content, lang)}\n```"
            return content

    def is_code_block(self, text: str) -> bool:
        """Detect if the text is likely a code block."""
        code_indicators = [
            # Common language keywords
            'def ', 'class ', 'function', 'import ', 'from ', 'return', 
            'const ', 'let ', 'var ', 'if ', 'for ', 'while ',
            # Common symbols
            '{', '}', '=>', '->', ';;', ';;',
            # Indentation patterns
            '\n    ', '\n\t',
            # File extensions in text
            '.py', '.js', '.ts', '.java', '.cpp'
        ]
        return any(indicator in text for indicator in code_indicators)

    def detect_language(self, code: str) -> str:
        """Detect the programming language of the code."""
        language_patterns = {
            'python': ['def ', 'import ', 'from ', '.py', 'print('],
            'javascript': ['const ', 'let ', 'var ', 'function', '.js'],
            'typescript': ['interface ', 'type ', '.ts', 'export '],
            'java': ['public ', 'private ', 'class ', '.java'],
            'cpp': ['#include', '::', '.cpp', '->'],
            'html': ['<html', '<div', '<body', '.html'],
            'css': ['{', '}', ':', ';', '.css'],
            'sql': ['SELECT ', 'FROM ', 'WHERE ', 'JOIN '],
        }
        
        for lang, patterns in language_patterns.items():
            if any(pattern in code for pattern in patterns):
                return lang
        return 'text'

    def format_code(self, code: str, language: str) -> str:
        """Format the code based on the detected language."""
        import textwrap
        
        # Remove common indentation
        code = textwrap.dedent(code)
        
        # Remove extra blank lines at start and end
        code = code.strip()
        
        # Ensure consistent line endings
        code = code.replace('\r\n', '\n')
        
        return code

    async def process_text(self, text: str, action: str) -> Dict[str, Optional[str]]:
        """Process text with specified action using Gemini."""
        print(f"\n=== Starting text analysis ===")
        print(f"Action: {action}")
        print(f"Text length: {len(text)}")
        print(f"Text preview: {text[:100]}...")

        try:
            if not self.rate_limiter.can_proceed():
                print("Rate limit exceeded")
                return {"response": None, "error": "Rate limit exceeded"}

            model = self.models[self.current_text_model]
            if not model:
                print(f"Model {self.current_text_model} not available")
                return {"response": None, "error": f"Text model {self.current_text_model} is not available"}

            print(f"Using model: {self.current_text_model}")

            # Create prompt based on action
            if action == "explain":
                prompt = f"""Explain the following text in detail, breaking down its key concepts and providing additional context:

                {text}
                """
            elif action == "summarize":
                prompt = f"""Provide a concise summary of the following text, capturing its main points and key ideas:

                {text}
                """
            elif action == "rewrite":
                prompt = f"""Rewrite the following text in a different way while maintaining its original meaning:

                {text}
                """
            else:
                print(f"Invalid action specified: {action}")
                return {"response": None, "error": "Invalid action specified"}

            print("Sending request to Gemini...")
            # Get response from model
            response = model.generate_content(prompt)
            print("Received response from Gemini")
            print(f"Response preview: {response.text[:100]}...")
            
            # Store in chat history
            self.chat_history.append({
                "role": "user",
                "content": text,
                "timestamp": datetime.now().isoformat()
            })
            self.chat_history.append({
                "role": "assistant",
                "content": response.text,
                "timestamp": datetime.now().isoformat()
            })

            print("=== Text analysis completed successfully ===\n")
            return {"response": response.text, "error": None}

        except Exception as e:
            print(f"Error processing text: {str(e)}")
            print(f"Error type: {type(e).__name__}")
            print(f"Error details: {str(e)}")
            return {"response": None, "error": str(e)}
