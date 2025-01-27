import os
from typing import List, Dict
from models import MarkdownDocument, DocumentChunk
import logging
import re
import unicodedata

logger = logging.getLogger(__name__)

class DocumentProcessor:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 100):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.table_pattern = re.compile(r'(\|[^\n]+\|\n\|[-:| ]+\|\n(?:\|[^\n]+\|\n)+)')

    def process_markdown(self, file_path: str, base_dir: str = None) -> MarkdownDocument:
        """Process a markdown file and return a MarkdownDocument."""
        try:
            if not os.path.exists(file_path):
                logger.error(f"File not found: {file_path}")
                raise ValueError(f"File not found: {file_path}")

            # Try different encodings
            content = None
            encodings = ['utf-8', 'latin-1', 'cp1252']
            for encoding in encodings:
                try:
                    with open(file_path, 'r', encoding=encoding) as f:
                        content = f.read()
                        logger.info(f"Successfully read file {file_path} with encoding {encoding}")
                        break
                except UnicodeDecodeError:
                    continue

            if content is None:
                logger.error(f"Failed to read file {file_path} with any encoding")
                raise ValueError(f"Failed to read file {file_path}")

            # Clean the text
            content = self._clean_text(content)
            if not content.strip():
                logger.warning(f"File {file_path} is empty after cleaning")
                raise ValueError(f"File {file_path} is empty after cleaning")

            # Get relative path for source
            if base_dir:
                source = os.path.relpath(file_path, base_dir)
            else:
                source = os.path.basename(file_path)

            # Create metadata
            metadata = {
                "source": source,
                "file_path": file_path,
                "file_type": "markdown"
            }

            return MarkdownDocument(content=content, source=source, metadata=metadata)

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

    def _extract_tables(self, text: str) -> List[Dict[str, str]]:
        """Extract tables from markdown text."""
        tables = []
        for match in self.table_pattern.finditer(text):
            table_text = match.group(1)
            tables.append({
                'content': table_text,
                'start': match.start(),
                'end': match.end()
            })
        return tables

    def _is_table_chunk(self, text: str) -> bool:
        """Check if a chunk of text contains a complete table."""
        return bool(self.table_pattern.search(text))

    def create_chunks(self, document: MarkdownDocument) -> List[DocumentChunk]:
        """Create chunks from a document with special handling for tables."""
        try:
            if not document or not document.content:
                logger.error("Invalid document: document or content is None")
                raise ValueError("Invalid document: document or content is None")

            text = document.content
            chunks = []
            chunk_id = 0

            # Create a unique prefix for this document's chunks
            doc_prefix = document.source.replace('/', '_').replace('.', '_').replace('\\', '_')
            
            # Extract tables first
            tables = self._extract_tables(text)
            
            # If there are no tables, proceed with normal chunking
            if not tables:
                return self._create_normal_chunks(document)
            
            # Process text with tables
            last_end = 0
            for table in tables:
                # Process text before table
                if table['start'] > last_end:
                    pre_table_text = text[last_end:table['start']].strip()
                    if pre_table_text:
                        normal_chunks = self._create_normal_chunks_from_text(
                            pre_table_text,
                            doc_prefix,
                            chunk_id,
                            document.metadata
                        )
                        chunks.extend(normal_chunks)
                        chunk_id += len(normal_chunks)

                # Add table as a single chunk
                table_chunk = DocumentChunk(
                    content=table['content'],
                    chunk_id=f"{doc_prefix}_table_{chunk_id}",
                    metadata={
                        "source": document.source,
                        "chunk_id": f"{doc_prefix}_table_{chunk_id}",
                        "is_table": "true",
                        **document.metadata
                    }
                )
                chunks.append(table_chunk)
                chunk_id += 1
                last_end = table['end']

            # Process remaining text after last table
            if last_end < len(text):
                remaining_text = text[last_end:].strip()
                if remaining_text:
                    normal_chunks = self._create_normal_chunks_from_text(
                        remaining_text,
                        doc_prefix,
                        chunk_id,
                        document.metadata
                    )
                    chunks.extend(normal_chunks)

            if not chunks:
                logger.warning("No chunks created from document")
                return []

            logger.info(f"Created {len(chunks)} chunks from document {document.source}")
            return chunks

        except Exception as e:
            logger.error(f"Error creating chunks: {e}")
            raise

    def _create_normal_chunks_from_text(self, text: str, doc_prefix: str, start_chunk_id: int, metadata: dict) -> List[DocumentChunk]:
        """Create normal chunks from text without tables."""
        chunks = []
        current_chunk = []
        current_length = 0
        chunk_id = start_chunk_id

        # Split into paragraphs
        paragraphs = text.split('\n\n')
        
        for paragraph in paragraphs:
            paragraph = paragraph.strip()
            if not paragraph:
                continue

            # If paragraph is too long, split it into sentences
            if len(paragraph) > self.chunk_size:
                sentences = paragraph.split('. ')
                for sentence in sentences:
                    sentence = sentence.strip()
                    if not sentence:
                        continue

                    sentence_length = len(sentence)

                    # If adding this sentence would exceed chunk size, create new chunk
                    if current_length + sentence_length > self.chunk_size and current_chunk:
                        chunk_text = ' '.join(current_chunk)
                        unique_chunk_id = f"{doc_prefix}_chunk_{chunk_id}"
                        chunks.append(DocumentChunk(
                            content=chunk_text,
                            chunk_id=unique_chunk_id,
                            metadata={
                                "source": metadata.get("source", "unknown"),
                                "chunk_id": unique_chunk_id,
                                "is_table": "false",
                                **metadata
                            }
                        ))
                        chunk_id += 1
                        current_chunk = []
                        current_length = 0

                    current_chunk.append(sentence)
                    current_length += sentence_length
            else:
                # If adding this paragraph would exceed chunk size, create new chunk
                if current_length + len(paragraph) > self.chunk_size and current_chunk:
                    chunk_text = ' '.join(current_chunk)
                    unique_chunk_id = f"{doc_prefix}_chunk_{chunk_id}"
                    chunks.append(DocumentChunk(
                        content=chunk_text,
                        chunk_id=unique_chunk_id,
                        metadata={
                            "source": metadata.get("source", "unknown"),
                            "chunk_id": unique_chunk_id,
                            "is_table": "false",
                            **metadata
                        }
                    ))
                    chunk_id += 1
                    current_chunk = []
                    current_length = 0

                current_chunk.append(paragraph)
                current_length += len(paragraph)

        # Add any remaining text as a chunk
        if current_chunk:
            chunk_text = ' '.join(current_chunk)
            unique_chunk_id = f"{doc_prefix}_chunk_{chunk_id}"
            chunks.append(DocumentChunk(
                content=chunk_text,
                chunk_id=unique_chunk_id,
                metadata={
                    "source": metadata.get("source", "unknown"),
                    "chunk_id": unique_chunk_id,
                    "is_table": "false",
                    **metadata
                }
            ))

        return chunks

    def _create_normal_chunks(self, document: MarkdownDocument) -> List[DocumentChunk]:
        """Create normal chunks for a document without tables."""
        return self._create_normal_chunks_from_text(
            document.content,
            document.source.replace('/', '_').replace('.', '_').replace('\\', '_'),
            0,
            document.metadata
        ) 