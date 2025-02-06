import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Send, Bot, User, Database, RefreshCw, FileText, Maximize2, Minimize2, X, Eye, Plus, Minus, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { Prism } from 'react-syntax-highlighter';
import type { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import { processProjectMarkdown, ragChat, getRagStats } from '../services/apiClient';
import { toast } from 'react-hot-toast';
import EmbeddingVisualization from './EmbeddingVisualization';
import type { CodeComponent } from 'react-markdown/lib/ast-to-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { initMathJax } from '../utils/mathJaxConfig';

// Declare the window interface to include KaTeX's renderMathInElement and MathJax
declare global {
  interface Window {
    renderMathInElement: (element: HTMLElement, options: any) => void;
    MathJax: any;
  }
}

// Set up PDF.js worker
const workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

try {
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
} catch (error) {
  console.error('Error initializing PDF.js worker:', error);
  // Error will be handled by the component's error boundary
}

// PDF loading options
const PDF_LOADING_OPTIONS = {
  cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/standard_fonts/',
  verbosity: pdfjs.VerbosityLevel.ERRORS,
  useSystemFonts: true,
  isEvalSupported: true,
  maxImageSize: 1024 * 1024 * 10,
  disableFontFace: false,
  useWorkerFetch: true,
  disableAutoFetch: false,
  disableStream: false,
  disableExtensionCheck: true // Add this to prevent extension conflicts
};

// Update the preprocessEquations function
const preprocessEquations = (content: string): string => {
  // Handle block equations
  content = content.replace(/\$\$(.*?)\$\$/gs, (match, equation) => {
    try {
      const cleanEquation = equation.trim()
        // Handle fractions
        .replace(/\\frac{([^}]+)}{([^}]+)}/g, (_: string, num: string, den: string) => {
          return `\\frac{${num.trim()}}{${den.trim()}}`;
        })
        // Handle square roots with proper spacing
        .replace(/\\sqrt{([^}]+)}/g, (_: string, content: string) => {
          return `\\sqrt{${content.trim()}}`;
        })
        // Handle exponentials with proper spacing
        .replace(/\\exp\\left/g, '\\exp\\!\\left')
        // Handle parentheses spacing
        .replace(/\\left\(/g, '\\left( ')
        .replace(/\\right\)/g, ' \\right)')
        // Handle proper spacing around operators
        .replace(/([=+\-*/])/g, ' $1 ')
        // Handle Greek letters
        .replace(/\\(sigma|mu|pi|alpha|beta|gamma|delta|epsilon|theta|lambda)/g, '\\$1');

      return `$$${cleanEquation}$$`;
    } catch (error) {
      console.error('Error processing block equation:', error);
      return match;
    }
  });

  // Handle inline equations
  content = content.replace(/\$(.*?)\$/g, (match, equation) => {
    if (match.startsWith('$$')) return match;
    try {
      const cleanEquation = equation.trim()
        // Handle text in equations
        .replace(/\\text{([^}]+)}/g, '\\text{$1}')
        // Handle subscripts with text
        .replace(/_([a-zA-Z0-9]+)/g, '_{$1}')
        // Handle variable names with subscripts
        .replace(/([a-zA-Z]+)_([a-zA-Z]+)/g, '$1_{$2}')
        // Handle special functions
        .replace(/\\(sin|cos|tan|log|ln|exp|lim|sup|inf|max|min)/g, '\\$1')
        // Add spacing around operators
        .replace(/([=+\-*/])/g, ' $1 ');

      return `$${cleanEquation}$`;
    } catch (error) {
      console.error('Error processing inline equation:', error);
      return match;
    }
  });

  return content;
};

interface EquationRendererProps {
  children: React.ReactNode;
  isBlock?: boolean;
}

// Update the EquationRenderer component
const EquationRenderer: React.FC<EquationRendererProps> = ({ children, isBlock = false }) => {
  const equationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (equationRef.current && window.MathJax?.typesetPromise) {
      try {
        window.MathJax.typesetPromise([equationRef.current])
          .catch((err: any) => {
            console.error('MathJax typesetting error:', err);
          });
      } catch (error) {
        console.error('Error rendering equation:', error);
      }
    }
  }, [children]);

  return (
    <div 
      ref={equationRef}
      className={`${isBlock ? 'my-6 text-center w-full max-w-[90vw] overflow-x-auto' : 'inline'} 
        font-serif tracking-normal antialiased
        [&_.MathJax]:text-gray-100
        [&_.MathJax]:text-[1.2em]
        [&_.MathJax]:leading-relaxed
        [&_.MathJax-Display]:my-8
        [&_.MathJax-Display]:bg-[#1e1e1e]
        [&_.MathJax-Display]:p-6
        [&_.MathJax-Display]:rounded-lg
        [&_.MathJax-Display]:shadow-lg
        [&_.MathJax-Display]:border
        [&_.MathJax-Display]:border-[#2a2a2a]
        [&_.MathJax-Display]:flex
        [&_.MathJax-Display]:justify-center
        [&_.MathJax-Display]:items-center
        [&_.MathJax-Display]:min-h-[100px]
        ${isBlock ? '[&_.MathJax-Display]:shadow-lg [&_.MathJax-Display]:p-6 [&_.MathJax-Display]:rounded-lg' : ''}`}
    >
      {children}
    </div>
  );
};

interface RAGChatProps {
  projectName: string;
  onClose?: () => void;
  initialMessages?: Message[];
  onMessagesUpdate?: (messages: Message[]) => void;
  initialModel?: string;
}

interface Source {
  source: string;
  section: string;
  preview: string;
  page?: number;
  score?: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Source[];
}

interface RAGStats {
  total_documents: number;
  sources: string[];
}

interface MessageContentProps {
  content: string;
  isLatestMessage: boolean;
  onFileSelect: (filePath: string, content: string) => void;
}

// Update PDFPreviewModal to handle object sources
const PDFPreviewModal = React.memo<{
  isOpen: boolean;
  onClose: () => void;
  source: string | { source?: string; path?: string };
  page: number;
}>(({ isOpen, onClose, source, page }) => {
  const [scale, setScale] = useState(1.0);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Safely get the source string
  const sourceString = typeof source === 'string' ? source : 
                      source?.source || source?.path || '';

  const fetchPDF = useCallback(async () => {
    try {
      if (!sourceString) return;
      setIsLoading(true);
      setError(null);
      setPdfData(null);

      console.log('Fetching PDF with source:', sourceString, 'page:', page);

      let apiUrl;
      
      // Remove any leading/trailing whitespace and slashes
      const cleanSource = sourceString.trim().replace(/^\/+|\/+$/g, '');
      
      // Extract the PDF filename, handling both markdown and direct PDF cases
      let pdfFilename;
      if (cleanSource.includes('_page_')) {
        // Case 1: Markdown reference (e.g., "something_page_4.md")
        const match = cleanSource.match(/(.+)_page_\d+\.md$/);
        if (match) {
          pdfFilename = match[1].split('/').pop();
        }
      } else {
        // Case 2: Direct PDF reference
        pdfFilename = cleanSource.split('/').pop()?.replace(/\.pdf$/, '');
      }

      if (!pdfFilename) {
        throw new Error('Could not extract PDF filename from source');
      }

      // Ensure the filename has .pdf extension
      const fullPdfName = pdfFilename.endsWith('.pdf') ? pdfFilename : `${pdfFilename}.pdf`;
      
      // Construct the final URL
      apiUrl = `/api/projects/overleaf transformer/uploaded/${fullPdfName}?page=${page}`;
      
      console.log('Fetching PDF from URL:', apiUrl);
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const text = await response.text();
        console.error('PDF fetch failed:', response.status, text);
        throw new Error(`Failed to fetch PDF: ${response.statusText} (${response.status})`);
      }

      // Check if the response is actually a PDF
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/pdf')) {
        console.error('Invalid content type:', contentType);
        throw new Error('Invalid response: Not a PDF file');
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Empty PDF response');
      }

      const url = URL.createObjectURL(blob);
      setPdfData(url);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError(err instanceof Error ? err : new Error('Failed to load PDF'));
    } finally {
      setIsLoading(false);
    }
  }, [sourceString, page, setError, setPdfData, setIsLoading]);

  useEffect(() => {
    if (isOpen) {
      fetchPDF();
    }

    return () => {
      if (pdfData) {
        URL.revokeObjectURL(pdfData);
      }
    };
  }, [isOpen, fetchPDF, pdfData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-navy-900 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-navy-700">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-white">
              {sourceString.split('/').pop()} - Page {page}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
                className="p-1 rounded bg-navy-700 text-white hover:bg-navy-600 transition-colors"
                title="Zoom out"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-400">
                {(scale * 100).toFixed(0)}%
              </span>
              <button
                onClick={() => setScale(s => Math.min(2, s + 0.1))}
                className="p-1 rounded bg-navy-700 text-white hover:bg-navy-600 transition-colors"
                title="Zoom in"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-navy-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div 
            className="w-full h-full min-h-[600px] bg-white rounded-lg shadow-xl overflow-hidden flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <RefreshCw className="h-6 w-6 text-primary-400 animate-spin mr-2" />
                <span className="text-gray-600">Loading PDF...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-4 text-red-500 space-y-2">
                <AlertTriangle className="h-8 w-8 mb-2" />
                <span className="text-lg font-medium">Error Loading PDF</span>
                <span className="text-sm text-center">{error.message}</span>
                <button
                  onClick={fetchPDF}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors mt-2"
                >
                  Retry
                </button>
              </div>
            ) : pdfData ? (
              <Document
                file={pdfData}
                onLoadSuccess={({ numPages: pages }) => setNumPages(pages)}
                onLoadError={(err) => setError(err)}
                options={PDF_LOADING_OPTIONS}
                loading={
                  <div className="flex items-center justify-center p-4">
                    <RefreshCw className="h-6 w-6 text-primary-400 animate-spin mr-2" />
                    <span className="text-gray-600">Loading page...</span>
                  </div>
                }
              >
                <Page
                  pageNumber={1}
                  scale={scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  loading={
                    <div className="flex items-center justify-center p-4">
                      <RefreshCw className="h-6 w-6 text-primary-400 animate-spin mr-2" />
                      <span className="text-gray-600">Rendering page...</span>
                    </div>
                  }
                />
              </Document>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
});

PDFPreviewModal.displayName = 'PDFPreviewModal';

// Update PDFPageReference to handle object sources
const PDFPageReference = React.memo<{
  page: number;
  title: string;
  score: number;
  preview?: string;
  source: string | { source?: string; path?: string };
  onPreviewClick?: (source: string, page: number) => void;
}>(({ page, title, score, preview, source, onPreviewClick }) => {
  // Extract source string
  const sourceString = typeof source === 'string' ? source : 
                      source?.source || source?.path || '';

  return (
    <div className="bg-navy-800/80 backdrop-blur-sm rounded-lg p-4 border border-navy-700 hover:border-primary-500 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-primary-400" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-300">
              {sourceString.split('/').pop()}
            </span>
            <span className="text-xs text-gray-500">
              Page {page} • {title}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">
            Relevance: {(score * 100).toFixed(1)}%
          </span>
          {onPreviewClick && (
            <button
              onClick={() => onPreviewClick(sourceString, page)}
              className="p-1.5 rounded bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors group"
              title="Preview PDF page"
            >
              <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>
      </div>
      {preview && (
        <div 
          className="text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition-colors mt-2 p-2 rounded bg-navy-700/50"
          onClick={() => onPreviewClick && onPreviewClick(sourceString, page)}
        >
          <div className="line-clamp-3 hover:line-clamp-none transition-all">
            {preview}
          </div>
        </div>
      )}
    </div>
  );
});

PDFPageReference.displayName = 'PDFPageReference';

// Update MessageContent component with enhanced PDF-like styling
const MessageContent: React.FC<MessageContentProps> = ({ content, isLatestMessage, onFileSelect }) => {
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    source: string;
    page: number;
  } | null>(null);
  
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (contentRef.current && isLatestMessage && window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise([contentRef.current])
        .catch((err: any) => {
          console.error('MathJax typesetting error:', err);
        });
    }
  }, [content, isLatestMessage]);

  // Add PDF preview handler
  const handlePreviewClick = (source: string, page: number) => {
    setPreviewModal({
      isOpen: true,
      source,
      page
    });
  };

  // Process content with enhanced PDF references
  const processContent = (content: string) => {
    const pageRefRegex = /\[Page (\d+)\] (.*?)(?=\[Page \d+\]|$)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = pageRefRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }

      const page = parseInt(match[1], 10);
      const text = match[2].trim();
      const scoreMatch = text.match(/\[score: ([\d.]+)\]/);
      const score = scoreMatch ? parseFloat(scoreMatch[1]) : 1.0;
      const title = text.replace(/\[score: [\d.]+\]/, '').trim();
      
      // Extract source and ensure it's a PDF path
      const sourceMatch = text.match(/Source: ([^\]]+)/);
      let source = sourceMatch?.[1] || '';
      
      // If source is a markdown file, extract the PDF name
      if (source.includes('_page_')) {
        const pdfMatch = source.match(/(.+)_page_\d+\.md$/);
        if (pdfMatch) {
          // Get just the base name without path
          const baseName = pdfMatch[1].split('/').pop();
          source = `${baseName}.pdf`;
        }
      } else if (!source.endsWith('.pdf')) {
        // If it's not a markdown file and doesn't end with .pdf, add the extension
        source = `${source}.pdf`;
      }

      console.log('Processing citation:', { page, source, text });

      parts.push(
        <PDFPageReference
          key={`page-${page}-${match.index}`}
          page={page}
          title={title}
          score={score}
          preview={text}
          source={source}
          onPreviewClick={() => handlePreviewClick(source, page)}
        />
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts;
  };

  const processedContent = processContent(content);

  const handleFileClick = useCallback((href: string, content?: string) => {
    if (!onFileSelect) return;
    const filePath = href.replace('file://', '');
    if (content) {
      onFileSelect(filePath, content);
    }
  }, [onFileSelect]);

  const components: Components = {
    table: ({ children }) => (
      <div className="w-full max-w-full overflow-x-auto my-4">
        <table className="w-full border-collapse border-spacing-0">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-navy-800/90 sticky top-0">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-navy-700 bg-navy-900/50">
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr className="hover:bg-navy-800/50 transition-colors">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider whitespace-nowrap">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-sm text-gray-300 font-mono whitespace-nowrap">
        {children}
      </td>
    ),
    p: ({ children }) => (
      <p className="text-gray-300 leading-relaxed my-3">
        {children}
      </p>
    ),
    pre: ({ children }) => (
      <div className="relative group w-full max-w-full overflow-hidden">
        <pre className="overflow-x-auto w-full max-w-full p-4 bg-navy-800/90 rounded-lg border border-navy-700">
          {children}
        </pre>
      </div>
    ),
    code({ className, children }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      return (
        <div className="relative group w-full max-w-full">
          {language ? (
            <Prism
              style={oneDark}
              language={language}
              PreTag="div"
              className="w-full max-w-full overflow-x-auto text-sm font-mono leading-relaxed"
            >
              {String(children).replace(/\n$/, '')}
            </Prism>
          ) : (
            <code className={`${className} text-sm font-mono leading-relaxed`}>{children}</code>
          )}
        </div>
      );
    },
    a: ({ href, children }) => {
      if (!href) return null;
      
      if (href.startsWith('file://') || href.match(/\.(md|py|tsx?|jsx?)$/)) {
        return (
          <div 
            onClick={() => handleFileClick(href, typeof children === 'string' ? children : undefined)}
            className="my-2 p-4 bg-navy-800 rounded-lg border border-navy-700 hover:border-primary-500 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-2 text-primary-400">
              <FileText className="h-4 w-4" />
              <span className="font-medium">{href.replace('file://', '')}</span>
            </div>
            <div className="mt-2 text-sm text-gray-400 overflow-hidden">
              <pre className="whitespace-pre-wrap font-mono text-xs">
                {typeof children === 'string' ? children.slice(0, 200) + '...' : 'Click to discuss this file'}
              </pre>
            </div>
          </div>
        );
      }

      return (
        <a 
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-400 hover:text-primary-300 underline"
        >
          {children}
        </a>
      );
    },
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-white mt-8 mb-6">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold text-white mt-6 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-medium text-white mt-5 mb-3">
        {children}
      </h3>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 my-3 text-gray-300">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 my-3 text-gray-300">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="ml-4">
        {children}
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary-500 pl-4 my-4 text-gray-400 italic">
        {children}
      </blockquote>
    ),
  };

  return (
    <>
      <div 
        ref={contentRef} 
        className="prose prose-invert max-w-none w-full break-words px-4 py-2
          [&_pre]:max-w-full
          [&_pre]:w-full
          [&_pre]:overflow-x-auto
          [&_pre]:p-4
          [&_pre]:bg-[#1e1e1e]
          [&_pre]:border
          [&_pre]:border-[#2a2a2a]
          [&_pre]:rounded-lg
          [&_code]:text-sm
          [&_code]:font-mono
          [&_code]:leading-relaxed
          [&_.MathJax-Display]:my-8
          [&_.MathJax-Display]:bg-[#1e1e1e]
          [&_.MathJax-Display]:p-6
          [&_.MathJax-Display]:rounded-lg
          [&_.MathJax-Display]:shadow-lg
          [&_.MathJax-Display]:border
          [&_.MathJax-Display]:border-[#2a2a2a]
          [&_.MathJax-Display]:max-w-[90vw]
          [&_.MathJax-Display]:overflow-x-auto
          [&_.MathJax]:text-[1.2em]
          [&_.MathJax]:text-gray-100
          [&_.MathJax]:leading-relaxed
          [&_.MathJax-Display]:flex
          [&_.MathJax-Display]:justify-center
          [&_.MathJax-Display]:items-center
          [&_.MathJax-Display]:min-h-[100px]"
      >
        {Array.isArray(processedContent) ? (
          processedContent.map((part, index) => 
            typeof part === 'string' ? (
              <ReactMarkdown
                key={index}
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                components={components}
                className="message-content [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              >
                {part}
              </ReactMarkdown>
            ) : (
              part
            )
          )
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
            components={components}
            className="message-content [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
          >
            {content}
          </ReactMarkdown>
        )}
      </div>

      {previewModal && (
        <PDFPreviewModal
          isOpen={previewModal.isOpen}
          onClose={() => setPreviewModal(null)}
          source={previewModal.source}
          page={previewModal.page}
        />
      )}
    </>
  );
};

// Update the ChatMessage component to pass down the file handler
const ChatMessage = React.memo<{
  message: Message;
  isLatestMessage: boolean;
  onFileSelect: (filePath: string, content: string) => void;
  onPreviewClick: (source: string, page: number) => void;
}>(({ message, isLatestMessage, onFileSelect, onPreviewClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex space-x-3 ${
        message.role === 'assistant' ? 'bg-navy-800/80 backdrop-blur-sm rounded-lg p-4' : ''
      }`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        message.role === 'assistant' 
          ? 'bg-primary-500/20 text-primary-400'
          : 'bg-accent-500/20 text-accent-400'
      }`}>
        {message.role === 'assistant' ? (
          <Bot className="h-5 w-5" />
        ) : (
          <User className="h-5 w-5" />
        )}
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <MessageHeader message={message} />
        <MessageContent 
          content={message.content} 
          isLatestMessage={isLatestMessage} 
          onFileSelect={onFileSelect}
        />
        {message.sources && message.sources.length > 0 && (
          <MessageSources 
            sources={message.sources} 
            onPreviewClick={onPreviewClick}
          />
        )}
      </div>
    </motion.div>
  );
});

const MessageHeader = React.memo<{ message: Message }>(({ message }) => (
  <div className="flex items-center space-x-2">
    <span className="text-sm font-medium text-gray-300">
      {message.role === 'assistant' ? 'AI Assistant' : 'You'}
    </span>
    <span className="text-xs text-gray-500">
      {new Date(message.timestamp).toLocaleTimeString()}
    </span>
  </div>
));

// Update MessageSources component to pass correct document source
const MessageSources = React.memo<{ 
  sources: Message['sources'];
  onPreviewClick: (source: string, page: number) => void;
}>(({ sources, onPreviewClick }) => (
  <div className="mt-2 space-y-2">
    <p className="text-sm font-medium text-gray-400">Sources:</p>
    <div className="space-y-2">
      {sources?.map((source, idx) => (
        <PDFPageReference
          key={`${source.source}-${idx}`}
          page={source.page || 0}
          title={source.source.split('/').pop() || ''}
          score={source.score || 1.0}
          preview={source.preview}
          source={source.source}
          onPreviewClick={onPreviewClick}
        />
      ))}
    </div>
  </div>
));

// Update the messages section in the main component
const MessagesSection = React.memo<{ 
  messages: Message[]; 
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onFileSelect: (filePath: string, content: string) => void;
  onPreviewClick: (source: string, page: number) => void;
}>(({ messages, isLoading, messagesEndRef, onFileSelect, onPreviewClick }) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
    <AnimatePresence initial={false}>
      {messages.map((message, index) => (
        <ChatMessage 
          key={`${message.timestamp}-${index}`}
          message={message}
          isLatestMessage={index === messages.length - 1}
          onFileSelect={onFileSelect}
          onPreviewClick={onPreviewClick}
        />
      ))}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <div className="bg-primary-500/10 backdrop-blur-sm text-primary-400 px-4 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Processing response...</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    <div ref={messagesEndRef} />
  </div>
));

interface ChatState {
  messages: Message[];
  input: string;
  isLoading: boolean;
  isProcessing: boolean;
  stats: RAGStats | null;
  showVisualization: boolean;
  isFullScreen: boolean;
  selectedModel: string;
  selectedContentTypes: string[];
  reasoningMethod: string;
}

export function RAGChat({ projectName, onClose, initialMessages = [], onMessagesUpdate, initialModel = "gpt-4o" }: RAGChatProps) {
  const [state, setState] = useState<ChatState>({
    messages: initialMessages,
    input: '',
    isLoading: false,
    isProcessing: false,
    stats: null,
    showVisualization: false,
    isFullScreen: false,
    selectedModel: initialModel,
    selectedContentTypes: ['text', 'tables', 'figures'],
    reasoningMethod: 'react'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    source: string;
    page: number;
  } | null>(null);

  // Update parent component when messages change
  useEffect(() => {
    // Skip the initial render and only update when messages actually change
    const hasMessages = state.messages.length > 0;
    const isInitialMessage = state.messages.length === initialMessages.length && 
      state.messages.every((msg, idx) => msg === initialMessages[idx]);
    
    if (onMessagesUpdate && hasMessages && !isInitialMessage) {
      // Use a timeout to break the synchronous update cycle
      const timeoutId = setTimeout(() => {
        onMessagesUpdate(state.messages);
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [state.messages, onMessagesUpdate, initialMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && !state.isLoading) {
      scrollToBottom();
    }
  }, [state.messages.length, state.isLoading]); // Only depend on messages.length and loading state

  // Load stats only once on mount and when projectName changes
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getRagStats(projectName);
        setState(prev => ({ ...prev, stats }));
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };
    
    fetchStats();
  }, [projectName]); // Only depend on projectName

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const processMarkdown = async () => {
    setState(prev => ({ ...prev, isProcessing: true }));
    try {
      const result = await processProjectMarkdown(projectName);
      setState(prev => ({ ...prev, stats: result.stats }));
      toast.success('Successfully processed markdown files');
    } catch (error) {
      console.error('Error processing markdown:', error);
      toast.error('Failed to process markdown files');
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  // Optimize message processing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.input.trim() || state.isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: preprocessEquations(state.input.trim()),
      timestamp: new Date().toISOString(),
    };

    // Batch state updates
    setState(prev => ({ ...prev, input: '' }));
    setState(prev => ({ ...prev, isLoading: true }));
    setState(prev => ({ ...prev, messages: [...prev.messages, userMessage] }));

    try {
      const history = state.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await ragChat(projectName, state.input.trim(), history, state.selectedModel);
      
      if (!response || !response.answer) {
        throw new Error('Invalid response from chat service');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: preprocessEquations(response.answer),
        timestamp: new Date().toISOString(),
        sources: response.sources || []
      };

      // Batch state updates
      setState(prev => ({ ...prev, messages: [...prev.messages, assistantMessage] }));
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get response';
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${errorMessage}. Please try again or contact support if the issue persists.`,
        timestamp: new Date().toISOString()
      };
      
      setState(prev => ({ ...prev, messages: [...prev.messages, assistantMessage] }));
      toast.error('Failed to get response');
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const toggleFullScreen = () => {
    setState(prev => ({ ...prev, isFullScreen: !prev.isFullScreen }));
  };

  const handleFileSelect = useCallback((filePath: string, content: string) => {
    const userMessage: Message = {
      role: 'user',
      content: `Let's discuss this file: ${filePath}\n\n${content}`,
      timestamp: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, messages: [...prev.messages, userMessage] }));
    setState(prev => ({ ...prev, input: '' }));
  }, []);

  const handlePreviewClick = useCallback((source: string, page: number) => {
    setPreviewModal({
      isOpen: true,
      source,
      page
    });
  }, []);

  useEffect(() => {
    initMathJax();
  }, []);

  return (
    <div 
      ref={chatContainerRef}
      className={`flex flex-col ${
        state.isFullScreen 
          ? 'fixed inset-0 z-50 bg-navy-900' 
          : 'h-[800px] bg-navy-900 rounded-lg shadow-lg'
      }`}
    >
      {/* Header - Made more compact */}
      <div className="border-b border-navy-700 p-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-primary-400" />
            <div>
              <h2 className="text-base font-semibold text-white flex items-center space-x-2">
                <span>{projectName}</span>
                {state.stats && (
                  <span className="text-xs font-normal text-gray-400">
                    ({state.stats.total_documents} documents)
                  </span>
                )}
              </h2>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {/* Model Selector - Even more compact */}
            <select
              value={state.selectedModel}
              onChange={(e) => setState(prev => ({ ...prev, selectedModel: e.target.value }))}
              className="bg-navy-800 text-white rounded-lg px-1.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 border border-navy-600"
            >
              <option value="gpt-4o">GPT-4 Online</option>
              <option value="o1">O1 Model</option>
              <option value="gpt-4o-mini">GPT-4 Mini</option>
              <option value="graph-rag">GraphRAG</option>
            </select>

            {/* Control Buttons - Horizontal layout */}
            <div className="flex items-center space-x-1">
              <button
                onClick={processMarkdown}
                disabled={state.isProcessing}
                className="p-1 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors disabled:opacity-50"
                title="Reindex documents"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${state.isProcessing ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => setState(prev => ({ ...prev, showVisualization: !prev.showVisualization }))}
                className="p-1 rounded-lg bg-navy-800 text-white hover:bg-navy-700 transition-colors border border-navy-600"
                title={state.showVisualization ? 'Hide visualization' : 'Show visualization'}
              >
                <Eye className="h-3.5 w-3.5" />
              </button>

              {state.isLoading && (
                <button
                  onClick={() => setState(prev => ({ ...prev, isLoading: false }))}
                  className="p-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  title="Cancel generation"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}

              <button
                onClick={toggleFullScreen}
                className="p-1 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors"
                title={state.isFullScreen ? "Exit full screen" : "Enter full screen"}
              >
                {state.isFullScreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </button>

              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Close chat"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Messages - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <MessagesSection 
            messages={state.messages} 
            isLoading={state.isLoading}
            messagesEndRef={messagesEndRef}
            onFileSelect={handleFileSelect}
            onPreviewClick={handlePreviewClick}
          />
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="border-t border-navy-700 p-2 flex-shrink-0 bg-navy-900">
          {/* Template Buttons */}
          <div className="mb-2 flex flex-wrap gap-2">
            <button
              onClick={() => setState(prev => ({ ...prev, input: "Write an introduction section for this research paper." }))}
              className="px-3 py-1 text-xs bg-primary-500/10 text-primary-400 rounded-lg hover:bg-primary-500/20 transition-colors"
            >
              Introduction Template
            </button>
            <button
              onClick={() => setState(prev => ({ ...prev, input: "Analyze and summarize the related works from these papers." }))}
              className="px-3 py-1 text-xs bg-primary-500/10 text-primary-400 rounded-lg hover:bg-primary-500/20 transition-colors"
            >
              Related Works Template
            </button>
            <button
              onClick={() => setState(prev => ({ ...prev, input: "Write a methodology section explaining the approach." }))}
              className="px-3 py-1 text-xs bg-primary-500/10 text-primary-400 rounded-lg hover:bg-primary-500/20 transition-colors"
            >
              Methodology Template
            </button>
            <button
              onClick={() => setState(prev => ({ ...prev, input: "Summarize the key results and findings from these papers." }))}
              className="px-3 py-1 text-xs bg-primary-500/10 text-primary-400 rounded-lg hover:bg-primary-500/20 transition-colors"
            >
              Results Template
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={state.input}
                onChange={(e) => setState(prev => ({ ...prev, input: e.target.value }))}
                placeholder="Ask about your project's content..."
                className="flex-1 bg-navy-800 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-gray-500"
                disabled={state.isLoading}
              />
              {state.isLoading ? (
                <button
                  type="button"
                  onClick={() => setState(prev => ({ ...prev, isLoading: false }))}
                  className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!state.input.trim()}
                  className="p-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Visualization Area - Increased height */}
      {state.showVisualization && (
        <div className={`flex-shrink-0 ${
          state.isFullScreen 
            ? 'fixed inset-0 z-50 bg-navy-900' 
            : 'border-t border-navy-700 p-4'
        }`}>
          <div className={`h-full flex flex-col ${
            state.isFullScreen 
              ? 'p-6' 
              : 'bg-navy-800 rounded-lg overflow-hidden min-h-[500px]'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                {state.selectedModel === 'graph-rag' ? 'Knowledge Graph' : 'Document Embeddings'} Visualization
              </h2>
              <button
                onClick={toggleFullScreen}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors"
              >
                {state.isFullScreen ? (
                  <>
                    <Minimize2 className="h-4 w-4" />
                    <span>Exit Full Screen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-4 w-4" />
                    <span>Full Screen</span>
                  </>
                )}
              </button>
            </div>
            <div className={`${
              state.isFullScreen 
                ? 'flex-1 bg-navy-800 rounded-xl' 
                : 'h-[400px]'
            }`}>
              {state.selectedModel === 'graph-rag' ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">Graph visualization is not available in this version.</p>
                </div>
              ) : (
                <EmbeddingVisualization projectName={projectName} />
              )}
            </div>
          </div>
        </div>
      )}

      {previewModal && (
        <PDFPreviewModal
          isOpen={previewModal.isOpen}
          onClose={() => setPreviewModal(null)}
          source={previewModal.source}
          page={previewModal.page}
        />
      )}
    </div>
  );
} 