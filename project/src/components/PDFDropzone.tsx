import React from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, AlertCircle, Plus, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PDFDropzoneProps {
  onFilesDrop: (files: File[]) => void;
  mode?: 'drag-drop' | 'button';
  className?: string;
}

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 10MB

export function PDFDropzone({ onFilesDrop, mode = 'drag-drop', className = '' }: PDFDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive, fileRejections, isFocused } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: MAX_FILE_SIZE,
    onDrop: onFilesDrop,
  });

  if (mode === 'button') {
    return (
      <div className={`w-full ${className}`} role="region" aria-label="PDF upload section">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-navy-600">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-indigo-400" />
            <h2 className="text-sm font-medium text-gray-200">PDF Documents</h2>
          </div>
          <div {...getRootProps()}>
            <input {...getInputProps()} aria-label="Upload PDF file" />
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg
                bg-gradient-to-r from-indigo-500 to-purple-500 text-white
                hover:from-indigo-600 hover:to-purple-600
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                focus:ring-offset-navy-800 transition-all duration-200 ease-in-out group
                ${isFocused ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-navy-800' : ''}`}
            >
              <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
              Add PDF
            </motion.button>
          </div>
        </div>
        
        <AnimatePresence>
          {fileRejections.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 rounded-lg bg-red-900/20 border border-red-500/20 p-4"
            >
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-300">
                    Unable to upload file
                  </p>
                  <p className="text-sm text-red-400 mt-1">
                    {fileRejections[0].errors[0].message}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`} role="region" aria-label="PDF upload area">
      <motion.div
        {...getRootProps()}
        whileHover={{ scale: 1.01 }}
        className={`w-full flex flex-col items-center justify-center p-20 
          border-2 border-dashed rounded-xl transition-all duration-200
          ${isDragActive 
            ? 'border-primary-500 bg-primary-500/10' 
            : 'border-navy-700 hover:bg-navy-700/50'
          }
          ${className}`}
      >
        <input {...getInputProps()} aria-label="Drag and drop PDF file or click to select" />
        
        <div className="flex flex-col items-center space-y-4">
          <UploadCloud 
            className={`h-12 w-12 ${isDragActive ? 'text-primary-400' : 'text-gray-400'}`}
          />
          <div className="text-center">
            <h3 className="text-lg font-medium text-white mb-1">
              Upload your PDF
            </h3>
            <p className="text-sm text-gray-400">
              Drag and drop your file here, or click to browse
            </p>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="px-3 py-1 rounded-full text-xs bg-navy-800 text-gray-400">
                PDF files only
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-navy-800 text-gray-400">
                Up to 10MB
              </span>
            </div>
          </div>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {fileRejections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 rounded-lg bg-red-900/20 border border-red-500/20 p-4"
          >
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-300">
                  Unable to upload file
                </p>
                <p className="text-sm text-red-400 mt-1">
                  {fileRejections[0].errors[0].message}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
