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

ModelType = Literal['gemini-pro', 'gemini-pro-vision', 'embedding-001']

class RateLimiter:
    def __init__(self, max_requests: int = 10, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = []

    def can_proceed(self) -> bool:
        current_time = time.time()
        self.requests = [req_time for req_time in self.requests 
                        if current_time - req_time < self.window_seconds]
        
        if len(self.requests) < self.max_requests:
            self.requests.append(current_time)
            return True
        return False

class ChatService:
    AVAILABLE_MODELS = {
        'gemini-pro': 'gemini-pro',  # For text
        'gemini-pro-vision': 'gemini-pro-vision',  # For images
        'embedding-001': 'embedding-001'  # For embeddings
    }

    def __init__(self, api_key: str = "AIzaSyB-lBxinyrKi9Jlx2m-AXfPwuDP4uVlYpU"):
        genai.configure(api_key=api_key)
        self.models: Dict[str, genai.GenerativeModel] = {}
        self.current_text_model: str = 'gemini-pro'
        self.current_vision_model: str = 'gemini-pro-vision'
        self.chat_history: List[Dict[str, str]] = []
        self.rate_limiter = RateLimiter()
        self._initialize_models()
        self.pdf_context = None

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
                    model = self.models[self.current_vision_model]
                    if not model:
                        if websocket and websocket.client_state != WebSocketState.DISCONNECTED:
                            await websocket.send_json({
                                "error": f"Vision model {self.current_vision_model} is not available"
                            })
                        return

                    # Process base64 image
                    try:
                        image_data = base64.b64decode(image.split(',')[1])
                        image_obj = Image.open(io.BytesIO(image_data))
                    except Exception as e:
                        if websocket and websocket.client_state != WebSocketState.DISCONNECTED:
                            await websocket.send_json({"error": "Invalid image data"})
                        return

                    # Get streaming response from vision model
                    response = model.generate_content([message, image_obj], stream=True)
                except Exception as e:
                    if websocket and websocket.client_state != WebSocketState.DISCONNECTED:
                        await websocket.send_json({"error": str(e)})
                    return
            else:
                try:
                    model = self.models[self.current_text_model]
                    if not model:
                        if websocket and websocket.client_state != WebSocketState.DISCONNECTED:
                            await websocket.send_json({
                                "error": f"Text model {self.current_text_model} is not available"
                            })
                        return
                    
                    # If we have PDF context, include it in the prompt
                    if self.pdf_context:
                        prompt = f"""Based on the following context from a PDF document:

                        {self.pdf_context}

                        Question: {message}

                        Please provide a clear and concise answer based only on the information in the context."""
                    else:
                        prompt = message
                    
                    # Get streaming response
                    response = model.generate_content(prompt, stream=True)
                
                except Exception as e:
                    if websocket and websocket.client_state != WebSocketState.DISCONNECTED:
                        await websocket.send_json({"error": str(e)})
                    return

            # Stream chunks with small delay and typing sound
            full_response = ""
            async for chunk in response:
                if not chunk.text:
                    continue
                    
                full_response += chunk.text
                if websocket and websocket.client_state != WebSocketState.DISCONNECTED:
                    await websocket.send_json({
                        "chunk": chunk.text,
                        "done": False
                    })
                await asyncio.sleep(0.05)  # Small delay for typing effect

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
