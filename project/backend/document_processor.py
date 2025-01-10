import os
from typing import List
from models import MarkdownDocument, DocumentChunk
import logging
import re
import unicodedata

logger = logging.getLogger(__name__)

class DocumentProcessor:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 100):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def process_markdown(self, file_path: str, base_dir: str) -> MarkdownDocument:
        """Process a markdown file into a document."""
        try:
            # Try different encodings
            encodings = ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252']
            content = None
            used_encoding = None
            
            for encoding in encodings:
                try:
                    with open(file_path, 'r', encoding=encoding) as f:
                        content = f.read()
                        used_encoding = encoding
                        break
                except UnicodeDecodeError:
                    continue
            
            if content is None:
                raise ValueError(f"Could not decode file {file_path} with any of the attempted encodings")
            
            logger.info(f"Successfully read file {file_path} with encoding {used_encoding}")
            
            # Clean up the content
            content = self._clean_text(content)
            
            # Get relative path for source tracking
            rel_path = os.path.relpath(file_path, base_dir)
            
            return MarkdownDocument(
                content=content,
                source=rel_path,
                metadata={
                    "source": rel_path,
                    "encoding": used_encoding
                }
            )
            
        except Exception as e:
            logger.error(f"Error processing markdown file {file_path}: {e}")
            raise

    def _clean_text(self, text: str) -> str:
        """Clean up text content."""
        # Replace problematic characters
        text = text.replace('\u0000', '')  # Remove null bytes
        text = text.replace('\r\n', '\n')  # Normalize line endings
        
        # Remove control characters except newlines and tabs
        text = ''.join(char for char in text if char == '\n' or char == '\t' or not unicodedata.category(char).startswith('C'))
        
        # Normalize whitespace
        text = ' '.join(text.split())
        
        return text

    def create_chunks(self, document: MarkdownDocument) -> List[DocumentChunk]:
        """Create chunks from a document with proper overlap."""
        try:
            chunks = []
            content = document.content
            
            # Skip empty documents
            if not content.strip():
                logger.warning(f"Empty document content from source: {document.source}")
                return chunks
            
            # Split into sentences first for better chunking
            sentences = self._split_into_sentences(content)
            current_chunk = []
            current_length = 0
            chunk_id = 0
            
            for sentence in sentences:
                sentence_length = len(sentence)
                
                # If adding this sentence would exceed chunk size, save current chunk
                if current_length + sentence_length > self.chunk_size and current_chunk:
                    chunk_text = ' '.join(current_chunk)
                    chunks.append(DocumentChunk(
                        content=chunk_text,
                        chunk_id=chunk_id,
                        metadata={
                            "source": document.source,
                            "chunk_id": chunk_id,
                            **document.metadata
                        }
                    ))
                    chunk_id += 1
                    
                    # Keep overlap for next chunk
                    overlap_tokens = current_chunk[-2:] if len(current_chunk) > 2 else current_chunk
                    current_chunk = overlap_tokens
                    current_length = sum(len(t) for t in overlap_tokens)
                
                current_chunk.append(sentence)
                current_length += sentence_length
            
            # Add the last chunk if there's anything left
            if current_chunk:
                chunk_text = ' '.join(current_chunk)
                chunks.append(DocumentChunk(
                    content=chunk_text,
                    chunk_id=chunk_id,
                    metadata={
                        "source": document.source,
                        "chunk_id": chunk_id,
                        **document.metadata
                    }
                ))
            
            return chunks
            
        except Exception as e:
            logger.error(f"Error creating chunks from document {document.source}: {e}")
            raise

    def _split_into_sentences(self, text: str) -> List[str]:
        """Split text into sentences more intelligently."""
        # Basic sentence splitting on punctuation while preserving abbreviations
        sentences = []
        current = []
        
        for line in text.split('\n'):
            line = line.strip()
            if not line:
                if current:
                    sentences.append(' '.join(current))
                    current = []
                continue
                
            # Split on sentence endings but preserve common abbreviations
            parts = re.split(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|\!)\s', line)
            
            for part in parts:
                part = part.strip()
                if part:
                    current.append(part)
                    
                    # Check if this looks like a sentence end
                    if re.search(r'[.!?]$', part) and not re.search(r'\b[A-Z][a-z]\.$', part):
                        sentences.append(' '.join(current))
                        current = []
        
        # Add any remaining text
        if current:
            sentences.append(' '.join(current))
        
        return sentences 