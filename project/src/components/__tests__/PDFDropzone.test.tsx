import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PDFDropzone } from '../PDFDropzone';
import '@testing-library/jest-dom';

describe('PDFDropzone', () => {
  const mockOnFilesDrop = jest.fn();

  beforeEach(() => {
    mockOnFilesDrop.mockClear();
  });

  describe('Drag-drop mode', () => {
    it('renders drag-drop interface correctly', () => {
      render(<PDFDropzone onFilesDrop={mockOnFilesDrop} mode="drag-drop" />);
      
      expect(screen.getByText(/Upload your PDF/i)).toBeInTheDocument();
      expect(screen.getByText(/PDF files only/i)).toBeInTheDocument();
      expect(screen.getByText(/Up to 10MB/i)).toBeInTheDocument();
    });

    it('shows active state when dragging', () => {
      render(<PDFDropzone onFilesDrop={mockOnFilesDrop} mode="drag-drop" />);
      
      const dropzone = screen.getByText(/Upload your PDF/i).parentElement;
      fireEvent.dragEnter(dropzone);
      
      expect(screen.getByText(/Drop your PDF here/i)).toBeInTheDocument();
    });
  });

  describe('Button mode', () => {
    it('renders button interface correctly', () => {
      render(<PDFDropzone onFilesDrop={mockOnFilesDrop} mode="button" />);
      
      expect(screen.getByText(/PDF Documents/i)).toBeInTheDocument();
      expect(screen.getByText(/Add PDF/i)).toBeInTheDocument();
    });

    it('maintains accessibility features', () => {
      render(<PDFDropzone onFilesDrop={mockOnFilesDrop} mode="button" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
      expect(button).toHaveFocus();
    });
  });

  describe('File handling', () => {
    it('handles valid PDF file upload', () => {
      render(<PDFDropzone onFilesDrop={mockOnFilesDrop} />);
      
      const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
      const dropzone = screen.getByText(/Upload your PDF/i).parentElement;
      
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [file],
        },
      });
      
      expect(mockOnFilesDrop).toHaveBeenCalledWith([file]);
    });

    it('shows error for invalid file type', () => {
      render(<PDFDropzone onFilesDrop={mockOnFilesDrop} />);
      
      const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
      const dropzone = screen.getByText(/Upload your PDF/i).parentElement;
      
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [file],
        },
      });
      
      expect(screen.getByText(/file type must be/i)).toBeInTheDocument();
    });

    it('shows error for file size exceeding limit', () => {
      render(<PDFDropzone onFilesDrop={mockOnFilesDrop} />);
      
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
      const dropzone = screen.getByText(/Upload your PDF/i).parentElement;
      
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [largeFile],
        },
      });
      
      expect(screen.getByText(/file is larger than 10MB/i)).toBeInTheDocument();
    });
  });

  describe('Visual feedback', () => {
    it('applies hover styles correctly', () => {
      render(<PDFDropzone onFilesDrop={mockOnFilesDrop} />);
      
      const dropzone = screen.getByText(/Upload your PDF/i).closest('div');
      fireEvent.mouseEnter(dropzone);
      
      expect(dropzone).toHaveClass('hover:border-primary-300');
    });

    it('maintains consistent spacing in both modes', () => {
      const { rerender } = render(<PDFDropzone onFilesDrop={mockOnFilesDrop} mode="drag-drop" />);
      const dragDropElement = screen.getByText(/Upload your PDF/i).parentElement;
      expect(dragDropElement).toHaveClass('p-8');

      rerender(<PDFDropzone onFilesDrop={mockOnFilesDrop} mode="button" />);
      const buttonElement = screen.getByText(/Add PDF/i).parentElement;
      expect(buttonElement).toHaveClass('px-3', 'py-1.5');
    });
  });
});
