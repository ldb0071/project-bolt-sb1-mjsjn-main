import os
import logging
import tiktoken
from typing import List, Dict, Optional, Any, Union, Tuple
from dotenv import load_dotenv
from openai import AzureOpenAI
from openai.types.chat import ChatCompletion
from openai.types.embedding import Embedding
from document_processor import DocumentProcessor
from vector_store import ChromaStore
from models import MarkdownDocument, DocumentChunk, SearchResult
from functools import lru_cache
from rank_bm25 import BM25Okapi
import numpy as np
from typing import List, Tuple, Dict, Any
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords, wordnet
from nltk.stem import WordNetLemmatizer
import hashlib
import json
import time
from diskcache import Cache

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Download required NLTK resources
try:
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('wordnet')
    nltk.download('averaged_perceptron_tagger')
except Exception as e:
    logger.warning(f"Error downloading NLTK resources: {e}")

# Constants for token limits
MAX_TOKENS_GPT4 = 16000
MAX_RESPONSE_TOKENS = 8000
MAX_CONTEXT_TOKENS = MAX_TOKENS_GPT4 - MAX_RESPONSE_TOKENS - 500  # Buffer for system message and conversation history

SYSTEM_PROMPT = """You are a knowledgeable AI assistant with access to a specific set of documents and conversation history. Your role is to:
1. Provide accurate, clear, and concise answers based on the provided context and conversation history
2. Maintain conversation continuity by referencing previous exchanges when relevant
3. If the context doesn't contain enough information, clearly state that you cannot answer
4. If the context is partially relevant, explain what you can answer and what information is missing
5. Always maintain a helpful and professional tone

For extracting related works, follow this simplified format:
1. Key Papers and Approaches:
   - List each relevant paper/approach
   - Brief description (1-2 sentences)
   - Main contributions

2. Comparison Points:
   - Strengths
   - Limitations
   - Performance metrics (if available)

3. Research Direction:
   - Current gaps
   - Future opportunities

Context: {context}

Previous conversation history is provided in the messages. Use this history to maintain context and provide more relevant and coherent responses.

Remember: Base your answers on the provided context and conversation history. If you're unsure or the information isn't available, say so."""

INTRODUCTION_PROMPT = """You are a research paper writing assistant specializing in crafting introductions for deep learning papers. Follow these key principles:

1. Structure:
   - Start with a broad context of the field
   - Narrow down to the specific problem
   - Identify the research gap
   - State your contributions clearly
   - Preview the paper structure

2. Citation Guidelines:
   - Use the exact format: "Author1, Author2, and Author3. Title. Conference/Journal, Year."
   - For more than 3 authors: "Author1 et al. Title. Conference/Journal, Year."
   - Place citations at the end of relevant statements
   - Integrate citations naturally into sentences
   - Do not use [Source X] notation

3. Writing Style:
   - Be concise and clear
   - Use active voice when possible
   - Maintain academic tone
   - Avoid unnecessary jargon
   - Build logical flow between paragraphs

4. Content Organization:
   - Problem significance (1-2 paragraphs)
   - Current approaches and limitations (1-2 paragraphs)
   - Your solution and contributions (1 paragraph)
   - Paper structure overview (1 short paragraph)

Context: {context}

Previous conversation history is provided in the messages. Create an introduction that follows academic standards and uses proper academic citations."""

# Add new prompts for multi-query expansion and agentic RAG
MULTI_QUERY_EXPANSION_PROMPT = """You are an AI language model assistant.
Your task is to generate 3 different versions of the given user question to retrieve relevant documents from a vector database.
By generating multiple perspectives on the user question, your goal is to help overcome limitations of distance-based similarity search.
Generate questions that:
1. Rephrase the original question using different terms
2. Break down complex questions into simpler ones
3. Expand acronyms and technical terms
4. Consider different aspects of the same topic

Provide these alternative questions separated by newlines.
Original question: {query}"""

AGENTIC_RAG_PROMPT = """You are an agentic research assistant with the ability to:
1. Decompose complex queries into sub-questions
2. Analyze and synthesize information from multiple sources
3. Identify gaps in retrieved information
4. Request additional context when needed
5. Provide structured, academically-formatted responses

Context: {context}
Previous conversation: {history}

Your task is to:
1. Analyze the query and available context
2. Identify any information gaps
3. Synthesize information using proper academic citations
4. Structure the response logically
5. Maintain academic writing standards"""

# Add new prompts for GraphRAG
GRAPH_RAG_PROMPT = """You are an AI assistant with access to both vector embeddings and a knowledge graph.
Your task is to leverage both semantic search and graph relationships to provide comprehensive answers.

Key Capabilities:
1. Local Search: Use vector embeddings to find relevant text chunks
2. Graph Traversal: Follow relationships between concepts in the knowledge graph
3. Multi-hop Reasoning: Connect information across multiple related nodes
4. Context Integration: Combine information from both vector and graph sources

When answering:
1. Consider both direct matches and related concepts
2. Follow citation paths and relationships
3. Identify connected topics and themes
4. Provide structured, academically-formatted responses

Context from Vector Search: {vector_context}
Graph Context: {graph_context}
Previous Conversation: {history}

Remember to:
1. Use proper academic citations
2. Explain relationship paths when relevant
3. Highlight connections between concepts
4. Maintain academic writing standards"""

# Constants for caching
CACHE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cache")
CACHE_TTL = 24 * 60 * 60  # 24 hours in seconds
EMBEDDINGS_CACHE_SIZE = 10000  # Number of embeddings to cache
QUERY_CACHE_SIZE = 1000  # Number of query results to cache

# Create cache directory
os.makedirs(CACHE_DIR, exist_ok=True)

# Initialize disk cache
document_cache = Cache(os.path.join(CACHE_DIR, "documents"))
embedding_cache = Cache(os.path.join(CACHE_DIR, "embeddings"))
query_cache = Cache(os.path.join(CACHE_DIR, "queries"))
chat_cache = Cache(os.path.join(CACHE_DIR, "chat"))

def cache_key(*args, **kwargs) -> str:
    """Generate a consistent cache key from arguments."""
    key_parts = [str(arg) for arg in args]
    key_parts.extend(f"{k}:{v}" for k, v in sorted(kwargs.items()))
    key_string = "|".join(key_parts)
    return hashlib.sha256(key_string.encode()).hexdigest()

@lru_cache(maxsize=1000)
def get_cached_embedding(text: str) -> List[float]:
    """Get cached embedding for text."""
    return embedding_cache.get(cache_key(text))

def count_tokens(text: str, model: str = "gpt-4") -> int:
    """Count the number of tokens in a text string."""
    try:
        encoding = tiktoken.encoding_for_model(model)
        return len(encoding.encode(text))
    except Exception as e:
        logger.warning(f"Error counting tokens: {e}. Using approximate count.")
        return len(text.split()) * 1.3  # Rough approximation

def truncate_context(context: str, max_tokens: int, model: str = "gpt-4") -> str:
    """Truncate context to fit within token limit while preserving document boundaries."""
    if count_tokens(context, model) <= max_tokens:
        return context
    
    # Split into documents and preserve document boundaries
    documents = context.split("\n\n")
    truncated_docs = []
    current_tokens = 0
    
    for doc in documents:
        doc_tokens = count_tokens(doc, model)
        if current_tokens + doc_tokens <= max_tokens:
            truncated_docs.append(doc)
            current_tokens += doc_tokens
        else:
            break
    
    return "\n\n".join(truncated_docs)

class AzureOpenAIEmbedder:
    def __init__(self, client: AzureOpenAI, model: str = "text-embedding-3-small"):
        self.client = client
        self.model = model
        self.dimensions = None
        self.max_tokens = 64000  # Maximum tokens limit for text-embedding-3-large
        # Initialize dimensions
        test_response = self.get_embeddings(["test"])
        self.dimensions = len(test_response[0])

    def get_embedding(self, text: str) -> List[float]:
        return self.get_embeddings([text])[0]

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        try:
            # Process texts in batches to stay within token limits
            all_embeddings = []
            batch_texts = []
            current_batch_tokens = 0
            
            for text in texts:
                text_tokens = count_tokens(text)
                
                # If single text is too large, truncate it
                if text_tokens > self.max_tokens:
                    logger.warning(f"Text with {text_tokens} tokens exceeds limit. Truncating...")
                    encoding = tiktoken.encoding_for_model("gpt-4")
                    truncated_text = encoding.decode(encoding.encode(text)[:self.max_tokens])
                    text = truncated_text
                    text_tokens = count_tokens(text)
                
                # If adding this text would exceed batch limit, process current batch
                if current_batch_tokens + text_tokens > self.max_tokens:
                    if batch_texts:
                        response = self.client.embeddings.create(
                            input=batch_texts,
                            model=self.model
                        )
                        all_embeddings.extend([item.embedding for item in response.data])
                        batch_texts = []
                        current_batch_tokens = 0
                
                batch_texts.append(text)
                current_batch_tokens += text_tokens
            
            # Process any remaining texts
            if batch_texts:
                response = self.client.embeddings.create(
                    input=batch_texts,
                    model=self.model
                )
                all_embeddings.extend([item.embedding for item in response.data])
            
            return all_embeddings
        except Exception as e:
            logger.error(f"Error getting embeddings: {e}")
            raise

class KnowledgeGraph:
    def __init__(self):
        try:
            import networkx as nx
            self.graph = nx.DiGraph()
            self.relationships = {}
        except ImportError:
            logger.error("NetworkX not installed. Please install it for graph functionality.")
            raise

    def add_node(self, node_id: str, properties: Dict[str, Any]):
        """Add a node to the knowledge graph."""
        self.graph.add_node(node_id, **properties)

    def add_edge(self, source: str, target: str, relationship: str, properties: Dict[str, Any] = None):
        """Add an edge (relationship) between nodes."""
        if properties is None:
            properties = {}
        self.graph.add_edge(source, target, relationship=relationship, **properties)
        
    def get_related_nodes(self, node_id: str, max_depth: int = 2) -> List[Dict[str, Any]]:
        """Get related nodes up to a certain depth."""
        try:
            import networkx as nx
            related = []
            for depth in range(1, max_depth + 1):
                paths = nx.single_source_shortest_path(self.graph, node_id, cutoff=depth)
                for target, path in paths.items():
                    if target != node_id:
                        edges = list(zip(path[:-1], path[1:]))
                        relationships = [self.graph[u][v]['relationship'] for u, v in edges]
                        related.append({
                            'node': target,
                            'properties': dict(self.graph.nodes[target]),
                            'path': path,
                            'relationships': relationships,
                            'depth': len(path) - 1
                        })
            return related
        except Exception as e:
            logger.error(f"Error getting related nodes: {e}")
            return []

class RAGService:
    def __init__(self, github_token: str = None, azure_endpoint: str = None):
        try:
            self.github_token = github_token or os.getenv('GITHUB_TOKEN')
            self.azure_endpoint = azure_endpoint or os.getenv('AZURE_ENDPOINT', "https://models.inference.ai.azure.com")
            
            if not self.github_token:
                raise ValueError("GitHub token not found in environment variables or constructor")
            
            # Initialize Azure OpenAI clients with different API versions
            self.azure_client = AzureOpenAI(
                api_key=self.github_token,
                azure_endpoint=self.azure_endpoint,
                api_version="2023-05-15"
            )
            
            # Initialize O1 client with newer API version
            self.o1_client = AzureOpenAI(
                api_key=self.github_token,
                azure_endpoint=self.azure_endpoint,
                api_version="2024-12-01-preview"
            )
            
            # Initialize embeddings with larger model and smaller chunk size
            self.embeddings = AzureOpenAIEmbedder(
                client=self.azure_client,
                model="text-embedding-3-large"
            )
            logger.info("Embeddings model initialized successfully")
            
            # Initialize chat models
            self.llm = self.azure_client.chat.completions
            self.o1_llm = self.o1_client.chat.completions
            logger.info("Chat models initialized successfully")
            
            # Initialize document processor with smaller chunks for better token management
            self.document_processor = DocumentProcessor(
                chunk_size=4000,  # Reduced chunk size
                chunk_overlap=400  # Maintained 10% overlap
            )
            logger.info("Document processor initialized successfully")
            
            # Base directory for storage
            self.persist_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), "chroma_db")
            os.makedirs(self.persist_directory, exist_ok=True)
            
            # Initialize vector store
            self.vector_store = ChromaStore(
                persist_directory=self.persist_directory,
                embedding_function=self.embeddings
            )
            logger.info("Vector store initialized successfully")
            
            # Initialize caches with TTL
            self.document_cache = document_cache
            self.embedding_cache = embedding_cache
            self.query_cache = query_cache
            self.chat_cache = chat_cache
            
            logger.info("Caches initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing RAG service: {e}")
            raise

    async def process_markdown_files(self, project_name: str, markdown_dir: str = None) -> Dict[str, Any]:
        """Process markdown files with caching."""
        cache_key_val = cache_key(project_name, markdown_dir)
        cached_result = self.document_cache.get(cache_key_val)
        
        if cached_result:
            logger.info(f"Using cached document processing for {project_name}")
            return cached_result
            
        try:
            # Normalize project name for directory lookup
            safe_project_name = project_name.replace("-", "_").replace(" ", "_").lower()
            
            # Construct the full path to the markdown directory
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            project_dir = os.path.join(base_dir, "projects", safe_project_name)
            markdown_dir = markdown_dir or os.path.join(project_dir, "markdown")
            
            if not os.path.exists(markdown_dir):
                logger.error(f"Directory not found: {markdown_dir}")
                raise ValueError(f"Directory not found: {markdown_dir}")
            
            logger.info(f"Looking for markdown files in: {markdown_dir}")
            
            # Get markdown files
            markdown_files = []
            for root, _, files in os.walk(markdown_dir):
                for file in files:
                    if file.endswith('.md'):
                        full_path = os.path.join(root, file)
                        markdown_files.append(full_path)
                        logger.info(f"Found markdown file: {full_path}")
            
            if not markdown_files:
                logger.warning(f"No markdown files found in {markdown_dir}")
                return {
                    "message": "No markdown files found",
                    "files_processed": 0,
                    "chunks_created": 0,
                    "stats": {
                        "total_documents": 0,
                        "sources": []
                    }
                }
            
            logger.info(f"Found {len(markdown_files)} markdown files")
            
            # Process all files and collect chunks
            all_chunks = []
            processed_files = 0
            
            for file_path in markdown_files:
                try:
                    # Process markdown file
                    document = self.document_processor.process_markdown(file_path, markdown_dir)
                    if not document:
                        logger.warning(f"Failed to process document: {file_path}")
                        continue
                    
                    # Create chunks
                    document_chunks = self.document_processor.create_chunks(document)
                    if document_chunks:
                        all_chunks.extend(document_chunks)
                        processed_files += 1
                    else:
                        logger.warning(f"No chunks created for document: {file_path}")
                    
                except Exception as e:
                    logger.error(f"Error processing {file_path}: {e}")
                    continue
            
            if not all_chunks:
                logger.warning("No valid chunks were created from the markdown files")
                return {
                    "message": "No valid chunks created",
                    "files_processed": processed_files,
                    "chunks_created": 0,
                    "stats": {
                        "total_documents": 0,
                        "sources": []
                    }
                }
            
            # Add all chunks in a single operation
            try:
                self.vector_store.add_chunks(project_name, all_chunks)
                stats = self.get_project_stats(project_name)
                result = {
                    "message": "Successfully processed files",
                    "files_processed": processed_files,
                    "chunks_created": len(all_chunks),
                    "stats": stats
                }
                self.document_cache.set(cache_key_val, result, expire=CACHE_TTL)
                return result
            except Exception as e:
                logger.error(f"Error adding chunks to vector store: {e}")
                raise
            
        except Exception as e:
            logger.error(f"Error processing markdown files: {e}")
            raise

    @lru_cache(maxsize=QUERY_CACHE_SIZE)
    async def expand_query(self, query: str, model: str = "gpt-4o") -> List[str]:
        """Expand query with caching."""
        cache_key_val = cache_key(query, model)
        cached_result = self.query_cache.get(cache_key_val)
        
        if cached_result:
            logger.info(f"Using cached query expansion for: {query}")
            return cached_result
            
        try:
            model_config = self.model_configs.get(model, self.model_configs["gpt-4o"])
            
            response = model_config["client"].create(
                model=model,
                messages=[
                    {"role": "system", "content": MULTI_QUERY_EXPANSION_PROMPT.format(query=query)},
                    {"role": "user", "content": "Generate 3 alternative versions of this question."}
                ],
                **model_config["config"]
            )
            
            expanded_queries = response.choices[0].message.content.strip().split('\n')
            expanded_queries = [q.strip() for q in expanded_queries if q.strip()]
            expanded_queries.append(query)  # Add original query
            
            self.query_cache.set(cache_key_val, expanded_queries, expire=CACHE_TTL)
            return expanded_queries
        except Exception as e:
            logger.error(f"Error in query expansion: {e}")
            return [query]  # Fallback to original query

    async def chat(self, project_name: str, query: str, history: List[Dict[str, str]] = None, model: str = "gpt-4o") -> Dict[str, Any]:
        """Enhanced chat with caching."""
        # Generate cache key from inputs
        history_key = "" if not history else "|".join(f"{m['role']}:{m['content']}" for m in history[-3:])
        cache_key_val = cache_key(project_name, query, history_key, model)
        
        # Check cache for exact match
        cached_result = self.chat_cache.get(cache_key_val)
        if cached_result:
            logger.info(f"Using cached chat response for query: {query}")
            return cached_result
            
        try:
            # Get expanded queries with caching
            expanded_queries = await self.expand_query(query, model)
            logger.info(f"Expanded queries: {expanded_queries}")
            
            # Search with all query variations and combine results
            all_results = []
            table_results = []
            
            for expanded_query in expanded_queries:
                # Check cache for search results
                search_key = cache_key(project_name, expanded_query)
                search_results = self.query_cache.get(search_key)
                
                if not search_results:
                    search_results = self.vector_store.search(project_name, expanded_query, limit=5)
                    if search_results:
                        self.query_cache.set(search_key, search_results, expire=CACHE_TTL)
                
                if search_results and search_results.get("documents"):
                    for doc, metadata in zip(search_results["documents"], search_results.get("metadatas", [])):
                        if metadata.get("is_table") == "true":
                            table_results.append((doc, metadata))
                        else:
                            all_results.append((doc, metadata))
            
            # Deduplicate results while preserving order
            seen = set()
            unique_results = []
            
            # Add tables first to ensure they're included
            for doc, metadata in table_results:
                if doc not in seen:
                    seen.add(doc)
                    unique_results.append((doc, metadata))
            
            # Add other content
            for doc, metadata in all_results:
                if doc not in seen:
                    seen.add(doc)
                    unique_results.append((doc, metadata))
            
            # Take top results, ensuring at least one table if available
            documents = []
            metadatas = []
            table_included = False
            
            for doc, metadata in unique_results[:8]:  # Increased limit for better context
                if metadata.get("is_table") == "true" and not table_included:
                    # Always include at least one relevant table
                    documents.insert(0, doc)  # Put table at the beginning
                    metadatas.insert(0, metadata)
                    table_included = True
                else:
                    documents.append(doc)
                    metadatas.append(metadata)
            
            # Trim to final limit while preserving table
            if len(documents) > 5:
                documents = documents[:5]
                metadatas = metadatas[:5]
            
            logger.info(f"Combined search results: {len(documents)} documents (including {len(table_results)} tables)")
            
            if not documents:
                return {
                    "answer": "I don't have enough relevant information to answer this question.",
                    "sources": [],
                    "context": ""
                }
            
            # Prepare context from retrieved documents
            processed_docs = []
            sources = []
            
            for i, (doc, metadata) in enumerate(zip(documents, metadatas)):
                doc_str = str(doc) if not isinstance(doc, str) else doc
                
                # Special handling for table formatting
                if metadata.get("is_table") == "true":
                    # Ensure table is properly formatted
                    doc_str = f"\nHere's a relevant table from the document:\n\n{doc_str}\n"
                
                processed_docs.append(doc_str)
                
                if metadata and isinstance(metadata, dict):
                    source_info = {
                        "id": i + 1,
                        "source": metadata.get("source", "unknown"),
                        "section": metadata.get("section", "unknown"),
                        "preview": doc_str[:200] + "..." if len(doc_str) > 200 else doc_str,
                        "is_table": metadata.get("is_table") == "true"
                    }
                    sources.append(source_info)
            
            # Join documents with clear separation
            context = "\n\n".join(processed_docs)
            
            # Update system prompt to handle tables better
            if any(metadata.get("is_table") == "true" for metadata in metadatas):
                system_prompt = SYSTEM_PROMPT + "\n\nNote: The context includes markdown tables. When referencing tables in your response:\n1. Maintain the table format if including portions in your answer\n2. Cite specific cells or columns when discussing table content\n3. Explain any trends or patterns you observe in the table data"
            else:
                system_prompt = SYSTEM_PROMPT
            
            # Format conversation history
            formatted_history = []
            if history:
                total_history_tokens = 0
                for msg in reversed(history[-5:]):
                    role = msg.get("role", "user")
                    content = msg.get("content", "")
                    msg_tokens = count_tokens(content)
                    
                    if total_history_tokens + msg_tokens > 1000:
                        break
                    
                    formatted_history.insert(0, {
                        "role": role,
                        "content": content
                    })
                    total_history_tokens += msg_tokens
            
            # Initialize messages with appropriate prompt
            is_related_works_query = "related works" in query.lower() or "related work" in query.lower()
            is_introduction_query = "write introduction" in query.lower() or "paper introduction" in query.lower()
            
            if is_introduction_query:
                system_prompt = INTRODUCTION_PROMPT
            elif is_related_works_query:
                system_prompt = SYSTEM_PROMPT
            else:
                system_prompt = AGENTIC_RAG_PROMPT
            
            messages = [
                {
                    "role": "system", 
                    "content": system_prompt.format(
                        context=context,
                        history=str(formatted_history) if formatted_history else "No previous conversation"
                    )
                }
            ]
            
            # Add conversation history
            messages.extend(formatted_history)
            
            # Add the current query with appropriate formatting
            if is_introduction_query:
                query_prompt = (
                    "Please write an introduction section for a research paper based on the provided context.\n"
                    "Follow the academic style guidelines and use proper citations.\n\n"
                    f"Original query: {query}\n\n"
                    "Requirements:\n"
                    "1. Use proper academic citations in the format: Author1, Author2, and Author3. Title. Conference/Journal, Year.\n"
                    "2. For papers with more than 3 authors, use: Author1 et al. Title. Conference/Journal, Year.\n"
                    "3. Structure the introduction with clear progression\n"
                    "4. Include all key components (context, problem, gap, solution)\n"
                    "5. End with a paper structure preview\n"
                    "6. Do not use [Source X] notation\n\n"
                    "Please maintain academic tone and ensure proper citation integration."
                )
            elif is_related_works_query:
                query_prompt = (
                    "Please analyze the provided context and extract information about related works.\n"
                    "Focus on:\n"
                    "1. Identifying key papers and their main contributions\n"
                    "2. Summarizing the approaches and methodologies\n"
                    "3. Highlighting important findings and results\n\n"
                    f"Original query: {query}\n\n"
                    "Format your response using proper academic citations:\n"
                    "1. Paper/Work:\n"
                    "   - Full Citation: Author1, Author2, and Author3. Title. Conference/Journal, Year.\n"
                    "   - Key contributions\n"
                    "   - Main findings\n\n"
                    "When referencing papers in text, use natural citation integration.\n"
                    "Do not use [Source X] notation."
                )
            else:
                query_prompt = (
                    f"Based on the provided context and conversation history, please address: {query}\n\n"
                    "Requirements:\n"
                    "1. Analyze the available information thoroughly\n"
                    "2. Use proper academic citations\n"
                    "3. Identify any information gaps\n"
                    "4. Structure your response logically\n"
                    "5. Maintain academic writing standards\n\n"
                    "Use proper academic citation format:\n"
                    "- For up to 3 authors: Author1, Author2, and Author3. Title. Conference/Journal, Year.\n"
                    "- For more than 3 authors: Author1 et al. Title. Conference/Journal, Year.\n"
                    "Do not use [Source X] notation."
                )

            # Add user query
            messages.append({
                "role": "user", 
                "content": query_prompt
            })

            # Verify total tokens before making the API call
            total_tokens = sum(count_tokens(msg["content"]) for msg in messages)
            logger.info(f"Total tokens before API call: {total_tokens}")
            
            if total_tokens > MAX_TOKENS_GPT4:
                return {
                    "answer": "I apologize, but the context and history for this query is too large. Please try breaking down your question into smaller parts.",
                    "sources": sources,
                    "context": context
                }
            
            # Model-specific configurations with adjusted parameters
            model_configs = {
                "gpt-4o": {
                    "client": self.llm,
                    "model": "gpt-4o",  # Use actual deployment name
                    "config": {
                        "temperature": 0.3,
                        "max_tokens": MAX_RESPONSE_TOKENS,
                        "presence_penalty": 0.6,
                        "frequency_penalty": 0.3
                    }
                },
                "o1": {
                    "client": self.o1_llm,
                    "model": "o1",  # Use actual deployment name
                    "config": {
                        "temperature": 0.4,
                        "max_tokens": int(MAX_RESPONSE_TOKENS * 0.7),
                        "presence_penalty": 0.2,
                        "frequency_penalty": 0.3,
                        "response_format": { "type": "text" }
                    }
                },
                "gpt-4o-mini": {
                    "client": self.llm,
                    "model": "gpt-4o",  # Fallback to gpt-4o deployment
                    "config": {
                        "temperature": 0.3,
                        "max_tokens": int(MAX_RESPONSE_TOKENS * 0.6),
                        "presence_penalty": 0.4,
                        "frequency_penalty": 0.3
                    }
                },
                "Cohere-command-r": {
                    "client": self.llm,
                    "config": {
                        "temperature": 0.3,
                        "max_tokens": int(MAX_RESPONSE_TOKENS * 0.8),
                        "presence_penalty": 0.3,
                        "frequency_penalty": 0.3
                    }
                },
                "Llama-3.2-90B-Vision-Instruct": {
                    "client": self.llm,
                    "config": {
                        "temperature": 0.3,
                        "max_tokens": int(MAX_RESPONSE_TOKENS * 0.7),
                        "presence_penalty": 0.3,
                        "frequency_penalty": 0.3,
                        "response_format": { "type": "text" }
                    }
                }
            }

            # Get model-specific configuration or use default
            model_config = model_configs.get(model, model_configs["gpt-4o"])
            
            try:
                # Process response based on context length
                if total_tokens > MAX_TOKENS_GPT4 * 0.8:
                    # Split and process large context
                    context_parts = []
                    current_part = []
                    current_tokens = 0
                    
                    for line in context.split('\n'):
                        line_tokens = count_tokens(line)
                        if current_tokens + line_tokens > MAX_TOKENS_GPT4 * 0.4:
                            if current_part:
                                context_parts.append('\n'.join(current_part))
                            current_part = [line]
                            current_tokens = line_tokens
                        else:
                            current_part.append(line)
                            current_tokens += line_tokens
                    
                    if current_part:
                        context_parts.append('\n'.join(current_part))
                    
                    # Process each part
                    all_responses = []
                    for part in context_parts:
                        part_messages = [
                            {"role": "system", "content": system_prompt.format(context=part, history=str(formatted_history))},
                            {"role": "user", "content": query_prompt}
                        ]
                        
                        response = model_config["client"].create(
                            model=model_config["model"],  # Use correct model deployment name
                            messages=part_messages,
                            **model_config["config"]
                        )
                        all_responses.append(response.choices[0].message.content)
                    
                    # Combine responses
                    answer = "\n\n".join(all_responses)
                else:
                    # Normal processing for shorter context
                    response = model_config["client"].create(
                        model=model_config["model"],  # Use correct model deployment name
                        messages=messages,
                        **model_config["config"]
                    )
                    answer = response.choices[0].message.content
                
                # Clean up the response format
                answer = answer.replace("[Source", "\n[Source")
                answer = answer.replace("\n\n\n", "\n\n")
                
            except Exception as e:
                logger.error(f"Error calling Azure OpenAI: {e}")
                if model != "gpt-4o":
                    logger.info(f"Falling back to GPT-4 for failed {model} request")
                    fallback_config = model_configs["gpt-4o"]
                    try:
                        response = fallback_config["client"].create(
                            model=fallback_config["model"],  # Use correct fallback model name
                            messages=messages,
                            **fallback_config["config"]
                        )
                        answer = response.choices[0].message.content
                    except Exception as fallback_error:
                        logger.error(f"Fallback to GPT-4 also failed: {fallback_error}")
                        return {
                            "answer": "I encountered an error processing your request. Please try again with a shorter query or different model.",
                            "sources": sources,
                            "context": context
                        }
                else:
                    return {
                        "answer": "I encountered an error generating a response. Please try again with a more focused question.",
                        "sources": sources,
                        "context": context
                    }
            
            # Cache the final result
            self.chat_cache.set(cache_key_val, {
                "answer": answer,
                "sources": sources,
                "context": context
            }, expire=CACHE_TTL)
            return {
                "answer": answer,
                "sources": sources,
                "context": context
            }
            
        except Exception as e:
            logger.error(f"Error in chat: {e}")
            raise

    def get_project_stats(self, project_name: str) -> Dict[str, Any]:
        try:
            return self.vector_store.get_collection_stats(project_name)
        except Exception as e:
            logger.error(f"Error getting project stats: {e}")
            raise

    def get_embeddings_visualization(self, project_name: str) -> Dict[str, Any]:
        """Get 2D visualization data for document embeddings using t-SNE."""
        try:
            # Get embeddings and metadata from vector store
            logger.info(f"Retrieving collection data for project: {project_name}")
            collection_data = self.vector_store.get_collection_data(project_name)
            
            if not collection_data:
                logger.warning(f"No collection data found for project: {project_name}")
                return {"error": "No embeddings found for this project"}

            embeddings = collection_data.get("embeddings")
            if not embeddings:
                logger.warning(f"No embeddings found in collection data for project: {project_name}")
                return {"error": "No embeddings found in collection data"}

            documents = collection_data.get("documents", [])
            metadatas = collection_data.get("metadatas", [])
            
            logger.info(f"Found {len(embeddings)} embeddings, {len(documents)} documents, and {len(metadatas)} metadata entries")

            # Verify data consistency
            if not (len(embeddings) == len(documents) == len(metadatas)):
                logger.error(f"Data length mismatch: embeddings={len(embeddings)}, documents={len(documents)}, metadatas={len(metadatas)}")
                return {"error": "Inconsistent data lengths in collection"}

            # Convert embeddings to numpy array and check shape
            try:
                import numpy as np
                embeddings_array = np.array(embeddings)
                logger.info(f"Embeddings array shape: {embeddings_array.shape}")
                
                if len(embeddings_array.shape) != 2:
                    logger.error(f"Invalid embeddings shape: {embeddings_array.shape}")
                    return {"error": "Invalid embeddings format"}
            except Exception as e:
                logger.error(f"Error converting embeddings to numpy array: {e}")
                return {"error": "Failed to process embeddings data"}

            # Import and use t-SNE for dimensionality reduction
            try:
                from sklearn.manifold import TSNE
                
                # Reduce dimensions to 2D
                logger.info("Starting t-SNE dimensionality reduction")
                tsne = TSNE(n_components=2, random_state=42, verbose=1)
                embeddings_2d = tsne.fit_transform(embeddings_array)
                logger.info(f"Completed t-SNE dimensionality reduction, output shape: {embeddings_2d.shape}")
            except Exception as e:
                logger.error(f"Error during t-SNE reduction: {e}")
                return {"error": "Failed to reduce embeddings dimensions"}

            # Prepare visualization data
            try:
                points = []
                labels = []
                for i, (point, doc, metadata) in enumerate(zip(embeddings_2d, documents, metadatas)):
                    points.append({
                        "x": float(point[0]),
                        "y": float(point[1]),
                        "id": i
                    })
                    labels.append({
                        "id": i,
                        "source": metadata.get("source", "unknown"),
                        "preview": doc[:200] + "..." if len(doc) > 200 else doc,
                        "metadata": metadata
                    })

                logger.info(f"Prepared visualization data with {len(points)} points")
                return {
                    "points": points,
                    "labels": labels
                }
            except Exception as e:
                logger.error(f"Error preparing visualization data: {e}")
                return {"error": "Failed to prepare visualization data"}

        except Exception as e:
            logger.error(f"Error generating visualization: {e}")
            return {"error": str(e)} 

    def get_graph_visualization(self, project_name: str) -> Dict[str, Any]:
        """Get visualization data for the knowledge graph."""
        try:
            # Verify knowledge graph exists
            if not hasattr(self, 'knowledge_graph') or not self.knowledge_graph:
                logger.warning("No knowledge graph available for visualization")
                return {
                    "nodes": [],
                    "links": [],
                    "error": "Knowledge graph not initialized"
                }

            # Verify graph has content
            if len(self.knowledge_graph.graph.nodes()) == 0:
                logger.warning("Knowledge graph is empty")
                return {
                    "nodes": [],
                    "links": [],
                    "error": "Knowledge graph is empty"
                }

            # Convert NetworkX graph to visualization format
            nodes = []
            links = []
            
            # Add nodes with enhanced properties
            for node_id in self.knowledge_graph.graph.nodes():
                node_data = self.knowledge_graph.graph.nodes[node_id]
                node_type = node_data.get("type", "unknown")
                
                # Create node with visualization properties
                node = {
                    "id": str(node_id),  # Ensure ID is string
                    "label": node_data.get("title", "") or node_data.get("name", "") or str(node_id),
                    "type": node_type,
                    "group": node_type,  # For visual grouping
                    "properties": {
                        k: v for k, v in node_data.items()
                        if k not in ["type", "title", "name"] and isinstance(v, (str, int, float, bool))
                    }
                }
                
                # Add type-specific properties
                if node_type == "document":
                    node["preview"] = node_data.get("content", "")[:200] + "..." if node_data.get("content") else ""
                elif node_type == "citation":
                    node["authors"] = node_data.get("authors", [])
                    node["year"] = node_data.get("year", "")
                elif node_type == "concept":
                    node["category"] = node_data.get("category", "")
                
                nodes.append(node)
            
            # Add links with relationship information
            for source, target, data in self.knowledge_graph.graph.edges(data=True):
                link = {
                    "source": str(source),  # Ensure IDs are strings
                    "target": str(target),
                    "relationship": data.get("relationship", "related"),
                    "weight": data.get("weight", 1.0),
                    "properties": {
                        k: v for k, v in data.items()
                        if k not in ["relationship", "weight"] and isinstance(v, (str, int, float, bool))
                    }
                }
                links.append(link)
            
            logger.info(f"Prepared graph visualization with {len(nodes)} nodes and {len(links)} links")
            
            # Add graph statistics
            stats = {
                "total_nodes": len(nodes),
                "total_links": len(links),
                "node_types": {},
                "relationship_types": {}
            }
            
            # Count node types
            for node in nodes:
                node_type = node["type"]
                stats["node_types"][node_type] = stats["node_types"].get(node_type, 0) + 1
            
            # Count relationship types
            for link in links:
                rel_type = link["relationship"]
                stats["relationship_types"][rel_type] = stats["relationship_types"].get(rel_type, 0) + 1
            
            return {
                "nodes": nodes,
                "links": links,
                "stats": stats
            }
            
        except Exception as e:
            logger.error(f"Error generating graph visualization: {e}")
            return {
                "nodes": [],
                "links": [],
                "error": str(e),
                "details": "Error occurred while generating graph visualization"
            } 

    def _get_cached_embedding(self, text: str) -> Optional[List[float]]:
        """Get cached embedding for text."""
        return get_cached_embedding(text)

    def _cache_embedding(self, text: str, embedding: List[float]):
        """Cache embedding for text."""
        key = cache_key(text)
        self.embedding_cache.set(key, embedding, expire=CACHE_TTL)
        
    def clear_caches(self):
        """Clear all caches."""
        self.document_cache.clear()
        self.embedding_cache.clear()
        self.query_cache.clear()
        self.chat_cache.clear()
        get_cached_embedding.cache_clear()
        self.expand_query.cache_clear()
        logger.info("All caches cleared")

class GraphRAGService(RAGService):
    def __init__(self, github_token: str = None, azure_endpoint: str = None):
        super().__init__(github_token, azure_endpoint)
        self.knowledge_graph = KnowledgeGraph()
        
    async def process_markdown_files(self, project_name: str, markdown_dir: str = None) -> Dict[str, Any]:
        """Override to build both vector store and knowledge graph."""
        result = await super().process_markdown_files(project_name, markdown_dir)
        
        # Build knowledge graph from processed documents
        try:
            logger.info("Building knowledge graph from processed documents")
            documents = self.vector_store.get_collection(project_name)
            
            if not documents or not documents.get("documents"):
                logger.warning("No documents found for knowledge graph construction")
                return result
            
            # Clear existing graph for fresh build
            self.knowledge_graph = KnowledgeGraph()
            
            # Build graph from documents
            self._build_knowledge_graph(documents["documents"], documents.get("metadatas", []))
            
            # Add graph statistics to result
            graph_stats = self.get_graph_visualization(project_name).get("stats", {})
            result["graph_stats"] = graph_stats
            
            logger.info(f"Knowledge graph built successfully: {graph_stats}")
            
        except Exception as e:
            logger.error(f"Error building knowledge graph: {e}")
            result["graph_error"] = str(e)
        
        return result
    
    def _build_knowledge_graph(self, documents: List[str], metadatas: List[Dict[str, Any]]):
        """Build knowledge graph from documents and metadata."""
        try:
            # Track relationships for deduplication
            seen_relationships = set()
            
            for doc, metadata in zip(documents, metadatas):
                # Create document node with enhanced metadata
                doc_id = metadata.get("source", "unknown")
                doc_metadata = {
                    "type": "document",
                    "content": doc,
                    "title": metadata.get("title", ""),
                    "source": metadata.get("source", ""),
                    "section": metadata.get("section", ""),
                    "timestamp": metadata.get("timestamp", "")
                }
                
                self.knowledge_graph.add_node(doc_id, doc_metadata)
                
                # Extract and link citations
                citations = self._extract_citations(doc)
                for citation in citations:
                    citation_id = citation["id"]
                    rel_key = f"{doc_id}-cites-{citation_id}"
                    
                    if rel_key not in seen_relationships:
                        self.knowledge_graph.add_node(citation_id, {
                            "type": "citation",
                            "title": citation.get("title", ""),
                            "authors": citation.get("authors", []),
                            "year": citation.get("year", ""),
                            "venue": citation.get("venue", "")
                        })
                        self.knowledge_graph.add_edge(doc_id, citation_id, "cites", {"weight": 1.0})
                        seen_relationships.add(rel_key)
                
                # Extract and link concepts
                concepts = self._extract_concepts(doc)
                for concept in concepts:
                    concept_id = concept["id"]
                    rel_key = f"{doc_id}-contains-{concept_id}"
                    
                    if rel_key not in seen_relationships:
                        self.knowledge_graph.add_node(concept_id, {
                            "type": "concept",
                            "name": concept["name"],
                            "category": concept.get("category", ""),
                            "importance": concept.get("importance", 1.0)
                        })
                        self.knowledge_graph.add_edge(doc_id, concept_id, "contains", {"weight": concept.get("importance", 1.0)})
                        seen_relationships.add(rel_key)
                
                # Link related concepts
                for i, concept1 in enumerate(concepts):
                    for concept2 in concepts[i+1:]:
                        rel_key = f"{concept1['id']}-related-{concept2['id']}"
                        if rel_key not in seen_relationships:
                            self.knowledge_graph.add_edge(
                                concept1["id"], 
                                concept2["id"], 
                                "related",
                                {"weight": 0.5, "co_occurrence": True}
                            )
                            seen_relationships.add(rel_key)
            
            logger.info(f"Knowledge graph built with {len(self.knowledge_graph.graph.nodes())} nodes and {len(self.knowledge_graph.graph.edges())} edges")
            
        except Exception as e:
            logger.error(f"Error in _build_knowledge_graph: {e}")
            raise

    def _extract_citations(self, text: str) -> List[Dict[str, Any]]:
        """Extract citations from text using regex patterns."""
        import re
        citations = []
        
        # Pattern for standard citation format
        patterns = [
            r'([A-Za-z\s,]+)(?:et al\.?)?\s*\((\d{4})\)',  # Author(s) (Year)
            r'([A-Za-z\s,]+)(?:et al\.?)?\.\s*([^\.]+)\.\s*(?:In\s+)?([^\.]+)\.\s*(\d{4})',  # Full citation
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, text)
            for match in matches:
                citation_id = f"citation_{len(citations)}"
                citations.append({
                    "id": citation_id,
                    "authors": match.group(1).strip(),
                    "year": match.group(2) if len(match.groups()) >= 2 else None,
                    "title": match.group(3) if len(match.groups()) >= 3 else None
                })
        
        return citations
    
    def _extract_concepts(self, text: str) -> List[Dict[str, Any]]:
        """Extract key concepts from text using NLP."""
        try:
            import spacy
            nlp = spacy.load("en_core_web_sm")
            doc = nlp(text)
            
            concepts = []
            seen = set()
            
            # Extract named entities
            for ent in doc.ents:
                if ent.text not in seen:
                    concept_id = f"concept_{len(concepts)}"
                    concepts.append({
                        "id": concept_id,
                        "name": ent.text,
                        "category": ent.label_
                    })
                    seen.add(ent.text)
            
            # Extract noun phrases
            for chunk in doc.noun_chunks:
                if chunk.text not in seen:
                    concept_id = f"concept_{len(concepts)}"
                    concepts.append({
                        "id": concept_id,
                        "name": chunk.text,
                        "category": "NOUN_PHRASE"
                    })
                    seen.add(chunk.text)
            
            return concepts
        except Exception as e:
            logger.error(f"Error in _extract_concepts: {e}")
            return []
    
    async def chat(self, project_name: str, query: str, history: List[Dict[str, str]] = None, model: str = "gpt-4o", use_graph: bool = True) -> Dict[str, Any]:
        """Enhanced chat method that combines vector search and graph traversal."""
        try:
            # Get vector search results
            vector_results = await super().chat(project_name, query, history, model)
            
            if not use_graph:
                return vector_results
            
            # Extract concepts from query for graph traversal
            query_concepts = self._extract_concepts(query)
            graph_context = []
            
            # Find related information in knowledge graph
            for concept in query_concepts:
                related_nodes = self.knowledge_graph.get_related_nodes(concept["id"])
                for node in related_nodes:
                    if node["properties"]["type"] == "document":
                        graph_context.append(node["properties"]["content"])
                    elif node["properties"]["type"] == "citation":
                        authors = node["properties"].get("authors", "")
                        year = node["properties"].get("year", "")
                        title = node["properties"].get("title", "")
                        graph_context.append(f"{authors}. {title}. {year}")
            
            # Combine contexts and generate response
            combined_context = {
                "vector_context": vector_results.get("context", ""),
                "graph_context": "\n\n".join(graph_context),
                "history": str(history) if history else "No previous conversation"
            }
            
            messages = [
                {
                    "role": "system",
                    "content": GRAPH_RAG_PROMPT.format(**combined_context)
                }
            ]
            
            if history:
                messages.extend([{"role": msg["role"], "content": msg["content"]} for msg in history])
            
            messages.append({
                "role": "user",
                "content": query
            })
            
            # Get model configuration and generate response
            model_config = self.model_configs.get(model, self.model_configs["gpt-4o"])
            response = model_config["client"].create(
                model=model,
                messages=messages,
                **model_config["config"]
            )
            
            return {
                "answer": response.choices[0].message.content,
                "sources": vector_results.get("sources", []),
                "context": combined_context,
                "graph_info": {
                    "concepts": len(query_concepts),
                    "related_nodes": sum(len(self.knowledge_graph.get_related_nodes(c["id"])) for c in query_concepts)
                }
            }
            
        except Exception as e:
            logger.error(f"Error in GraphRAG chat: {e}")
            # Fallback to standard RAG if graph processing fails
            return await super().chat(project_name, query, history, model) 

# Add caching for embeddings
@lru_cache(maxsize=1000)
def get_cached_embedding(text: str) -> List[float]:
    return self.embedding_function.get_embedding(text)

def _combine_search_scores(semantic_scores: List[float], lexical_scores: List[float], alpha: float = 0.7) -> List[float]:
    """Combine semantic and lexical scores using weighted interpolation."""
    # Normalize scores to [0,1] range
    if semantic_scores:
        semantic_scores = np.array(semantic_scores)
        semantic_scores = (semantic_scores - semantic_scores.min()) / (semantic_scores.max() - semantic_scores.min() + 1e-6)
    
    if lexical_scores:
        lexical_scores = np.array(lexical_scores)
        lexical_scores = (lexical_scores - lexical_scores.min()) / (lexical_scores.max() - lexical_scores.min() + 1e-6)
    
    # Combine scores
    combined_scores = alpha * semantic_scores + (1 - alpha) * lexical_scores
    return combined_scores.tolist()

def _preprocess_text(self, text: str) -> List[str]:
    """Preprocess text for BM25 scoring."""
    # Tokenize and normalize
    tokens = word_tokenize(text.lower())
    # Remove stopwords and punctuation
    stop_words = set(stopwords.words('english'))
    tokens = [token for token in tokens if token not in stop_words and token.isalnum()]
    # Lemmatize
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(token) for token in tokens]
    return tokens

def hybrid_search(self, query: str, documents: List[str], k: int = 5) -> List[Tuple[str, Dict[str, Any]]]:
    """Perform hybrid search combining BM25 and semantic search."""
    # Preprocess documents for BM25
    preprocessed_docs = [self._preprocess_text(doc) for doc in documents]
    preprocessed_query = self._preprocess_text(query)
    
    # Initialize BM25
    bm25 = BM25Okapi(preprocessed_docs)
    lexical_scores = bm25.get_scores(preprocessed_query)
    
    # Get semantic scores
    query_embedding = get_cached_embedding(query)
    doc_embeddings = [get_cached_embedding(doc) for doc in documents]
    semantic_scores = [np.dot(query_embedding, doc_emb) / (np.linalg.norm(query_embedding) * np.linalg.norm(doc_emb)) 
                      for doc_emb in doc_embeddings]
    
    # Combine scores
    combined_scores = self._combine_search_scores(semantic_scores, lexical_scores)
    
    # Sort and get top k results
    scored_results = list(zip(documents, combined_scores))
    scored_results.sort(key=lambda x: x[1], reverse=True)
    
    return scored_results[:k]

def _expand_query(self, query: str) -> List[str]:
    """Expand query using WordNet synonyms and related terms."""
    expanded_terms = set()
    
    # Add original query terms
    query_tokens = self._preprocess_text(query)
    expanded_terms.update(query_tokens)
    
    # Add WordNet synonyms
    for token in query_tokens:
        for syn in wordnet.synsets(token):
            # Add lemma names
            expanded_terms.update(syn.lemma_names())
            # Add hypernyms
            for hypernym in syn.hypernyms():
                expanded_terms.update(hypernym.lemma_names())
    
    return list(expanded_terms)

def search(self, query: str, collection_name: str, k: int = 5) -> Dict[str, Any]:
    """Enhanced search with query expansion and hybrid retrieval."""
    try:
        # Expand query
        expanded_terms = self._expand_query(query)
        expanded_query = " ".join(expanded_terms)
        
        # Get documents using hybrid search
        collection = self._get_collection(collection_name)
        documents = collection.get_documents()
        
        results = self.hybrid_search(expanded_query, documents, k=k*2)  # Get more results initially
        
        # Deduplicate while preserving order
        seen = set()
        unique_results = []
        for doc, score in results:
            doc_hash = hash(str(doc))
            if doc_hash not in seen:
                seen.add(doc_hash)
                unique_results.append((doc, score))
        
        # Take top k unique results
        final_results = unique_results[:k]
        
        return {
            "documents": [doc for doc, _ in final_results],
            "scores": [score for _, score in final_results]
        }
        
    except Exception as e:
        logger.error(f"Error in enhanced search: {e}")
        raise 