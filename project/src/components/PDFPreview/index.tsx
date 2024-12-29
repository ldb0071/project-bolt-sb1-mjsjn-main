import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useStore } from '../../store/useStore';
import debounce from 'lodash/debounce';
import { useVirtualizer } from 'react-virtual';
import toast from 'react-hot-toast';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sidebar,
  Search,
  Download,
  Loader
} from 'lucide-react';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Constants
const MAX_SCALE = 5;
const MIN_SCALE = 0.1;
const SCALE_STEP = 0.1;
const PAGE_HEIGHT_ESTIMATE = 800;
const THUMBNAIL_SCALE = 0.2;

interface PDFPreviewProps {
  files: Array<{
    id: string;
    path: string;
  }>;
}

interface PDFState {
  fileId: string;
  scale: number;
  totalPages: number;
  currentPage: number;
  rotation: number;
}

// PDF Cache implementation with thumbnail support
class PDFCache {
  private static instance: PDFCache;
  private cache: Map<string, any>;
  private thumbnailCache: Map<string, string>;
  private maxSize: number;

  private constructor(maxSize: number = 50) {
    this.cache = new Map();
    this.thumbnailCache = new Map();
    this.maxSize = maxSize;
  }

  static getInstance(): PDFCache {
    if (!PDFCache.instance) {
      PDFCache.instance = new PDFCache();
    }
    return PDFCache.instance;
  }

  set(id: string, pdf: any): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
      this.thumbnailCache.delete(firstKey);
    }
    this.cache.set(id, pdf);
  }

  get(id: string): any {
    return this.cache.get(id);
  }

  setThumbnail(id: string, pageNumber: number, thumbnail: string): void {
    this.thumbnailCache.set(`${id}_${pageNumber}`, thumbnail);
  }

  getThumbnail(id: string, pageNumber: number): string | undefined {
    return this.thumbnailCache.get(`${id}_${pageNumber}`);
  }

  clear(): void {
    this.cache.clear();
    this.thumbnailCache.clear();
  }
}

const validatePdfState = (state: PDFState): PDFState => {
  if (!state.fileId) throw new Error('Invalid PDF state: Missing fileId');
  if (state.scale < MIN_SCALE || state.scale > MAX_SCALE) {
    throw new Error(`Invalid scale: Must be between ${MIN_SCALE} and ${MAX_SCALE}`);
  }
  if (state.totalPages < 0) throw new Error('Invalid total pages');
  if (state.currentPage < 0 || state.currentPage > state.totalPages) {
    throw new Error('Invalid current page');
  }
  return state;
};

export const PDFPreview: React.FC<PDFPreviewProps> = React.memo(({ files }) => {
  const { getPdfFromCache, setPdfCache, currentPdfState, setCurrentPdfState } = useStore();
  const abortControllerRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const pdfCache = PDFCache.getInstance();

  // Memoize the current file to prevent unnecessary re-renders
  const currentFile = useMemo(() => files[0], [files]);
  const cachedPdf = pdfCache.get(currentFile.id);

  // Virtual scrolling implementation
  const virtualizer = useVirtualizer({
    count: currentPdfState.totalPages,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => PAGE_HEIGHT_ESTIMATE * currentPdfState.scale,
    overscan: 2,
  });

  // Thumbnail virtualizer
  const thumbnailVirtualizer = useVirtualizer({
    count: currentPdfState.totalPages,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 150,
    overscan: 1,
  });

  const handleZoom = useCallback((delta: number) => {
    setCurrentPdfState(prev => validatePdfState({
      ...prev,
      scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale + delta))
    }));
  }, [setCurrentPdfState]);

  const handleRotate = useCallback(() => {
    setCurrentPdfState(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360
    }));
  }, [setCurrentPdfState]);

  const handlePageChange = useCallback((delta: number) => {
    setCurrentPdfState(prev => validatePdfState({
      ...prev,
      currentPage: Math.min(Math.max(1, prev.currentPage + delta), prev.totalPages)
    }));
  }, [setCurrentPdfState]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Optimized document load handler
  const handleDocumentLoadSuccess = useCallback((pdf: any) => {
    try {
      const newState = validatePdfState({
        ...currentPdfState,
        totalPages: pdf.numPages,
        currentPage: 1,
        rotation: 0
      });
      
      setCurrentPdfState(newState);
      if (!cachedPdf) {
        pdfCache.set(currentFile.id, pdf);
        setPdfCache(currentFile.id, pdf);
      }
      setLoadError(null);
    } catch (error) {
      console.error('Load error:', error);
      handleRenderError(error as Error);
    }
  }, [cachedPdf, currentFile.id, currentPdfState, setPdfCache, setCurrentPdfState]);

  const handleRenderError = useCallback((error: Error) => {
    console.error('PDF render error:', error);
    setLoadError(error.message);
    toast.error('Error loading PDF. Please try again.');
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handlePageChange(1);
      } else if (e.key === 'ArrowLeft') {
        handlePageChange(-1);
      } else if (e.key === '+') {
        handleZoom(SCALE_STEP);
      } else if (e.key === '-') {
        handleZoom(-SCALE_STEP);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handlePageChange, handleZoom]);

  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="flex h-full bg-navy-950">
      {/* Sidebar with thumbnails */}
      {showSidebar && (
        <div className="w-64 border-r border-navy-800 overflow-y-auto">
          <div className="p-4 border-b border-navy-800">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in PDF..."
              className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg 
                text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="p-2">
            {thumbnailVirtualizer.getVirtualItems().map(virtualRow => (
              <div
                key={`thumb_${virtualRow.index}`}
                className={`p-2 cursor-pointer rounded-lg transition-colors ${
                  currentPdfState.currentPage === virtualRow.index + 1
                    ? 'bg-primary-500/20'
                    : 'hover:bg-navy-800/50'
                }`}
                onClick={() => setCurrentPdfState(prev => ({
                  ...prev,
                  currentPage: virtualRow.index + 1
                }))}
              >
                <Page
                  pageNumber={virtualRow.index + 1}
                  scale={THUMBNAIL_SCALE}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="border border-navy-700 rounded-lg overflow-hidden"
                />
                <div className="mt-1 text-center text-sm text-gray-400">
                  Page {virtualRow.index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-2 border-b border-navy-800 bg-navy-900/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSidebar(prev => !prev)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800/70 
                backdrop-blur-sm transition-all duration-200"
              title="Toggle sidebar"
            >
              <Sidebar className="h-5 w-5" />
            </button>
            <div className="h-6 border-r border-navy-700" />
            <button
              onClick={() => handleZoom(-SCALE_STEP)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800/70 
                backdrop-blur-sm transition-all duration-200"
              title="Zoom out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <span className="text-gray-400">
              {Math.round(currentPdfState.scale * 100)}%
            </span>
            <button
              onClick={() => handleZoom(SCALE_STEP)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800/70 
                backdrop-blur-sm transition-all duration-200"
              title="Zoom in"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <div className="h-6 border-r border-navy-700" />
            <button
              onClick={handleRotate}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800/70 
                backdrop-blur-sm transition-all duration-200"
              title="Rotate"
            >
              <RotateCw className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-400">
              Page {currentPdfState.currentPage} of {currentPdfState.totalPages}
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(-1)}
                disabled={currentPdfState.currentPage <= 1}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800/70 
                  backdrop-blur-sm transition-all duration-200 disabled:opacity-50 
                  disabled:cursor-not-allowed"
                title="Previous page"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPdfState.currentPage >= currentPdfState.totalPages}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800/70 
                  backdrop-blur-sm transition-all duration-200 disabled:opacity-50 
                  disabled:cursor-not-allowed"
                title="Next page"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="h-6 border-r border-navy-700" />
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800/70 
                backdrop-blur-sm transition-all duration-200"
              title="Toggle fullscreen"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {loadError ? (
            <div className="flex flex-col items-center justify-center p-4 text-red-500">
              <p>Error loading PDF: {loadError}</p>
              <button
                onClick={() => {
                  setLoadError(null);
                  setCurrentPdfState({ ...currentPdfState });
                }}
                className="mt-2 px-4 py-2 bg-primary-500 text-white rounded-lg 
                  hover:bg-primary-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <Document
              file={currentFile.path}
              onLoadSuccess={onDocumentLoadSuccess}
              style={{ width: '100%', height: '100%' }}
            >
              <Page pageNumber={pageNumber} />
            </Document>
          )}
          <div style={{ position: 'absolute', top: '50%', left: '10px', zIndex: 10 }}>
            <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 1}>Previous</button>
            <button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber >= numPages}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
});

PDFPreview.displayName = 'PDFPreview';
