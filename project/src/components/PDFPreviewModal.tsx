import React from 'react';
import { X } from 'lucide-react';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
}

export function PDFPreviewModal({ isOpen, onClose, pdfUrl }: PDFPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] m-4 bg-navy-900 rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-navy-700">
          <h3 className="text-lg font-semibold text-white">Paper Preview</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-navy-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="h-[calc(100%-4rem)] p-4">
          <iframe
            src={`${pdfUrl}#toolbar=0`}
            className="w-full h-full rounded-lg bg-white"
            title="PDF Preview"
          />
        </div>
      </div>
    </div>
  );
}
