import React from 'react';
import { ArxivPaper } from '../services/chatService';

interface PaperDownloadCardsProps {
  papers: ArxivPaper[];
}

export function PaperDownloadCards({ papers }: PaperDownloadCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      {papers.map((paper, index) => (
        <div 
          key={paper.id} 
          className="bg-white dark:bg-navy-800 rounded-lg border border-gray-200 dark:border-navy-700 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200 dark:border-navy-700 bg-gray-50 dark:bg-navy-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Paper {index + 1}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">ID: {paper.id}</span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {paper.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {paper.authors.join(', ')}
            </p>
            <div className="space-y-2">
              <a
                href={`https://arxiv.org/abs/${paper.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-md transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View on ArXiv
              </a>
              <a
                href={paper.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-100 dark:bg-navy-700 hover:bg-gray-200 dark:hover:bg-navy-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </a>
              <a
                href={`https://arxiv.org/bibtex/${paper.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-100 dark:bg-navy-700 hover:bg-gray-200 dark:hover:bg-navy-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Cite (BibTeX)
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 