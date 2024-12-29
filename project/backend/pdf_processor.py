import os
from PyPDF2 import PdfReader
from PIL import Image
from pdf2image import convert_from_path
import logging
import asyncio

class PDFProcessor:
    def __init__(self):
        self.documents = []

    async def process_pdf(self, file_path: str) -> bool:
        """Process a PDF file and extract text"""
        try:
            reader = PdfReader(file_path)
            self.documents = []
            
            for page_num, page in enumerate(reader.pages, 1):
                text = page.extract_text()
                if text.strip():
                    self.documents.append((text, page_num))
                    
            return True
        except Exception as e:
            logging.error(f"Error processing PDF: {str(e)}")
            return False

    async def generate_thumbnail(self, pdf_path: str, width: int = 200, output_path: str = None) -> str:
        """Generate a thumbnail from the first page of a PDF"""
        try:
            # Convert first page of PDF to image
            images = convert_from_path(pdf_path, first_page=1, last_page=1)
            if not images:
                raise Exception("Failed to convert PDF to image")

            # Get first page
            image = images[0]
            
            # Calculate height maintaining aspect ratio
            aspect_ratio = image.height / image.width
            height = int(width * aspect_ratio)
            
            # Resize image
            thumbnail = image.resize((width, height), Image.LANCZOS)
            
            # Save thumbnail
            if output_path:
                thumbnail.save(output_path, "JPEG", quality=85)
                return output_path
            
            return thumbnail
            
        except Exception as e:
            logging.error(f"Error generating thumbnail: {str(e)}")
            raise
