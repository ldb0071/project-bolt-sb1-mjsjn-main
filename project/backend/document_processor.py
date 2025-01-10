import os
from typing import List
from models import MarkdownDocument, DocumentChunk
from langchain_text_splitters import RecursiveCharacterTextSplitter
import logging

logger = logging.getLogger(__name__)

class DocumentProcessor:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 100):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )

    def process_markdown(self, file_path: str, markdown_dir: str) -> MarkdownDocument:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Clean content
            content = self._clean_markdown(content)
            
            # Extract sections
            sections = self._extract_sections(content)
            
            # Create relative path
            relative_path = os.path.relpath(file_path, markdown_dir)
            
            return MarkdownDocument(
                title=os.path.splitext(os.path.basename(file_path))[0],
                content=content,
                sections=sections,
                source_path=relative_path,
                file_name=os.path.basename(file_path)
            )
        except Exception as e:
            logger.error(f"Error processing markdown file {file_path}: {e}")
            raise

    def create_chunks(self, document: MarkdownDocument) -> List[DocumentChunk]:
        try:
            chunks = []
            text_chunks = self.text_splitter.split_text(document.content)
            
            for i, chunk in enumerate(text_chunks):
                if not chunk.strip():  # Skip empty chunks
                    continue
                    
                chunks.append(DocumentChunk(
                    content=chunk,
                    metadata={
                        "source": document.source_path,
                        "file_name": document.file_name,
                        "title": document.title,
                        "section": self._find_section(chunk, document.sections)
                    },
                    chunk_id=i,
                    total_chunks=len(text_chunks)
                ))
            
            return chunks
        except Exception as e:
            logger.error(f"Error creating chunks for document {document.title}: {e}")
            raise

    def _clean_markdown(self, content: str) -> str:
        """Clean markdown content by removing unnecessary elements."""
        # Remove headers and footers
        lines = content.split('\n')
        content = '\n'.join(line for line in lines if not line.startswith('---'))
        
        # Remove extra newlines
        content = '\n'.join(line for line in content.split('\n') if line.strip())
        
        # Remove escaped characters
        content = content.replace("\\_", "_").replace("\\*", "*")
        
        # Remove images
        content = '\n'.join(line for line in content.split('\n') 
                          if not line.strip().startswith('![') and not line.strip().startswith('<img'))
        
        return content

    def _extract_sections(self, content: str) -> List[str]:
        """Extract section headers from markdown content."""
        sections = []
        for line in content.split('\n'):
            if line.strip().startswith('#'):
                sections.append(line.strip('#').strip())
        return sections

    def _find_section(self, chunk: str, sections: List[str]) -> str:
        """Find the nearest section header for the chunk."""
        for section in sections:
            if section in chunk:
                return section
        return "main" 