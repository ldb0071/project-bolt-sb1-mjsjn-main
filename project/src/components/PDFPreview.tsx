import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Loader, AlertTriangle, X, LayoutGrid, Camera, Image, Trash2, Type } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { toast } from '../services/toast';
import html2canvas from 'html2canvas';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { TextSelectionPopup } from './TextSelectionPopup';

// Set worker source to CDN path for better reliability
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Add loading options
const PDF_LOADING_OPTIONS = {
  cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/standard_fonts/',
  verbosity: pdfjs.VerbosityLevel.ERRORS,
  stopAtErrors: false,
  maxImageSize: 1024 * 1024 * 10,
  isEvalSupported: true,
  useSystemFonts: true
};

const styles = {
  optimizedCanvas: {
    transform: 'translate3d(0,0,0)',
    backfaceVisibility: 'hidden',
    perspective: '1000px',
    willChange: 'transform',
  }
};

interface Screenshot {
  id: string;
  pageNumber: number;
  timestamp: string;
  imageUrl: string;
  title?: string;
}

interface PDFFileProps {
  file: {
    id: string;
    name: string;
    path: string;
  };
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Update text selection styles for better full-screen support
const textSelectionStyles = {
  textLayer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    opacity: 1,
    lineHeight: 1.0,
    mixBlendMode: 'multiply',
    zIndex: 2,
    pointerEvents: 'none',
    transformOrigin: '0 0',
  } as const,
  selection: {
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    mixBlendMode: 'multiply',
  } as const
};

// Add styles for clickable links
const getLinkStyles = (isTextSelectionMode: boolean) => `
  .react-pdf__Page__annotations {
    pointer-events: ${isTextSelectionMode ? 'none' : 'auto'} !important;
    z-index: 3 !important;
  }
  .react-pdf__Page__annotations .annotationLayer {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
  }
  .react-pdf__Page__annotations .annotationLayer a {
    position: absolute !important;
    cursor: pointer !important;
    text-decoration: none !important;
    background: transparent !important;
    box-shadow: none !important;
    outline: none !important;
    border: 2px solid transparent !important;
    transition: all 0.2s ease-in-out !important;
  }
  .react-pdf__Page__annotations .annotationLayer a:hover {
    opacity: 0.8 !important;
    background: rgba(37, 99, 235, 0.1) !important;
    mix-blend-mode: multiply !important;
    border-color: rgba(37, 99, 235, 0.3) !important;
  }
  .react-pdf__Page__annotations .annotationLayer section {
    position: absolute !important;
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
  }
  .react-pdf__Page__annotations .annotationLayer .linkAnnotation > a {
    position: absolute !important;
    font-size: 1em;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .react-pdf__Page__annotations .annotationLayer .linkAnnotation > a:hover {
    background: rgba(37, 99, 235, 0.1) !important;
    box-shadow: 0 2px 10px rgba(37, 99, 235, 0.1) !important;
  }
  .react-pdf__Page__annotations .annotationLayer .linkAnnotation.highlight > a:hover {
    background: rgba(37, 99, 235, 0.2) !important;
  }
  .react-pdf__Page__annotations .annotationLayer .internalLink {
    cursor: pointer !important;
  }
`;

const PDFFile: React.FC<PDFFileProps> = ({ file }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [scale, setScale] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [previousScale, setPreviousScale] = useState(1);
  const [isGridMode, setIsGridMode] = useState(false);
  const [preGridScale, setPreGridScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const pdfWrapperRef = useRef<HTMLDivElement>(null);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [showScreenshots, setShowScreenshots] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [tempScreenshot, setTempScreenshot] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25
  });
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [screenshotTitle, setScreenshotTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState<string | null>(null);
  const [isTextSelectionMode, setIsTextSelectionMode] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);

  // Construct the full URL for the PDF file
  const fileUrl = file.path.startsWith('http') 
    ? file.path 
    : `${window.location.protocol}//${window.location.hostname}:8080${file.path}`;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => {
      const newPage = Math.min(Math.max(1, prevPageNumber + offset), numPages);
      return newPage;
    });
  }

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    const pos = 'touches' in e ? e.touches[0] : e;
    setDragPosition({ x: pos.clientX, y: pos.clientY });
  }, [scale]);

  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || scale <= 1) return;
    const pos = 'touches' in e ? e.touches[0] : e;
    const deltaX = pos.clientX - dragPosition.x;
    const deltaY = pos.clientY - dragPosition.y;

    if (pdfWrapperRef.current) {
      const wrapper = pdfWrapperRef.current;
      wrapper.scrollLeft -= deltaX;
      wrapper.scrollTop -= deltaY;
    }

    setDragPosition({ x: pos.clientX, y: pos.clientY });
  }, [isDragging, scale, dragPosition]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const toggleFullScreen = useCallback(async () => {
    try {
      if (!isFullScreen) {
        setPreviousScale(scale);
        const element = document.documentElement;
        if (element.requestFullscreen) {
          await element.requestFullscreen();
          setIsFullScreen(true);
          setScale(1.5);
        }
      } else {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        setIsFullScreen(false);
        setScale(previousScale);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, [isFullScreen, scale, previousScale]);

  // Prevent default behavior for text selection in fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullScreen) {
        setIsFullScreen(false);
        setScale(previousScale);
      }
    };

    const preventDefault = (e: Event) => {
      if (isTextSelectionMode && isFullScreen) {
        e.stopPropagation();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mousedown', preventDefault, true);
    document.addEventListener('mouseup', preventDefault, true);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mousedown', preventDefault, true);
      document.removeEventListener('mouseup', preventDefault, true);
    };
  }, [isFullScreen, isTextSelectionMode, previousScale]);

  const debouncedScale = useDebounce(scale, 150);

  // Screenshot functionality
  const startScreenshotCapture = async () => {
    const pageElement = document.querySelector('.react-pdf__Page');
    if (!pageElement) return;

    try {
      const canvas = await html2canvas(pageElement as HTMLElement, {
        scale: window.devicePixelRatio * 2,
        useCORS: true,
        logging: false,
      });

      setTempScreenshot(canvas.toDataURL('image/png'));
      setIsCropping(true);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      toast.error('Failed to capture screenshot');
    }
  };

  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: Crop,
    fileName: string
  ): Promise<string> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas.toDataURL('image/png');
  };

  const saveCroppedScreenshot = async () => {
    if (!completedCrop || !imageRef.current || !tempScreenshot) return;

    try {
      const croppedImageUrl = await getCroppedImg(
        imageRef.current,
        completedCrop,
        'screenshot.png'
      );

      const screenshot: Screenshot = {
      id: Date.now().toString(),
      pageNumber,
      timestamp: new Date().toLocaleString(),
        imageUrl: croppedImageUrl,
        title: screenshotTitle || `Screenshot ${screenshots.length + 1}`
      };

      const updatedScreenshots = [...screenshots, screenshot];
      setScreenshots(updatedScreenshots);
      localStorage.setItem(`pdf-screenshots-${file.id}`, JSON.stringify(updatedScreenshots));
      
      setIsCropping(false);
      setTempScreenshot(null);
      setScreenshotTitle('');
      toast.success('Screenshot saved successfully');
      } catch (error) {
      console.error('Error saving screenshot:', error);
      toast.error('Failed to save screenshot');
    }
  };

  const updateScreenshotTitle = (screenshotId: string, newTitle: string) => {
    const updatedScreenshots = screenshots.map(s => 
      s.id === screenshotId ? { ...s, title: newTitle } : s
    );
    setScreenshots(updatedScreenshots);
    localStorage.setItem(`pdf-screenshots-${file.id}`, JSON.stringify(updatedScreenshots));
    setIsEditingTitle(null);
  };

  const deleteScreenshot = (screenshotId: string) => {
    const updatedScreenshots = screenshots.filter(s => s.id !== screenshotId);
    setScreenshots(updatedScreenshots);
    localStorage.setItem(`pdf-screenshots-${file.id}`, JSON.stringify(updatedScreenshots));
    toast.success('Screenshot deleted');
  };

  // Load screenshots from localStorage
  useEffect(() => {
    const savedScreenshots = localStorage.getItem(`pdf-screenshots-${file.id}`);
    if (savedScreenshots) {
      setScreenshots(JSON.parse(savedScreenshots));
    }
  }, [file.id]);

  // Optimize text selection toggle
  const toggleTextSelectionMode = useCallback(() => {
    setIsTextSelectionMode(prev => {
      if (prev) {
        // Clear selection when disabling
        window.getSelection()?.removeAllRanges();
      }
      return !prev;
    });
  }, []);

  // Add text selection styles dynamically
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .pdf-page-content {
        position: relative !important;
      }
      
      .pdf-page-content .react-pdf__Page__textContent {
        user-select: ${isTextSelectionMode ? 'text' : 'none'} !important;
        -webkit-user-select: ${isTextSelectionMode ? 'text' : 'none'} !important;
        -moz-user-select: ${isTextSelectionMode ? 'text' : 'none'} !important;
        -ms-user-select: ${isTextSelectionMode ? 'text' : 'none'} !important;
        cursor: ${isTextSelectionMode ? 'text' : 'default'} !important;
        color: transparent !important;
        z-index: 2;
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        overflow: hidden !important;
        line-height: 1.0;
        transform-origin: 0 0 !important;
        pointer-events: ${isTextSelectionMode ? 'auto' : 'none'} !important;
        width: 100% !important;
        height: 100% !important;
        transform: scale(1) !important;
      }
      
      .pdf-page-content .react-pdf__Page__textContent span {
        cursor: ${isTextSelectionMode ? 'text' : 'default'} !important;
        color: transparent !important;
        position: absolute !important;
        white-space: pre !important;
        transform-origin: 0% 0% !important;
        line-height: 1.0;
        pointer-events: ${isTextSelectionMode ? 'auto' : 'none'} !important;
      }
      
      .pdf-page-content .react-pdf__Page__textContent span::selection {
        background: rgba(37, 99, 235, 0.2) !important;
        mix-blend-mode: multiply !important;
      }
      
      .pdf-page-content .react-pdf__Page__textContent span::-moz-selection {
        background: rgba(37, 99, 235, 0.2) !important;
        mix-blend-mode: multiply !important;
      }
      
      .text-selection-active .react-pdf__Page__textContent {
        pointer-events: auto !important;
      }
      
      .fullscreen .pdf-page-content {
        transform-origin: center center !important;
      }
      
      .fullscreen .pdf-page-content .react-pdf__Page__textContent {
        transform-origin: 0 0 !important;
        transform: scale(${scale}) !important;
        width: ${100 / scale}% !important;
        height: ${100 / scale}% !important;
      }
      
      .fullscreen .pdf-page-content .react-pdf__Page__textContent span {
        transform-origin: 0 0 !important;
      }

      .pdf-page-content canvas {
        position: relative !important;
        z-index: 1;
      }

      ${getLinkStyles(isTextSelectionMode)}
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [isTextSelectionMode, isFullScreen, scale]);

  // Add keyboard shortcut for text selection mode
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Toggle text selection mode with Alt + T
      if (e.altKey && e.key.toLowerCase() === 't') {
        toggleTextSelectionMode();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleTextSelectionMode]);

  // Modify OptimizedPage component
  const OptimizedPage = React.memo(({ pageNumber }: { pageNumber: number }) => {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [pageError, setPageError] = useState<Error | null>(null);
    const pageRef = useRef<HTMLDivElement>(null);

    const handlePageLoadSuccess = () => {
      setIsPageLoading(false);
      setPageError(null);
    };

    const handlePageLoadError = (error: Error) => {
      console.error(`Error loading page ${pageNumber}:`, error);
      setPageError(error);
      setIsPageLoading(false);
    };

    // Handle link clicks
    const handleLinkClick = useCallback((e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        if (isTextSelectionMode) {
          e.preventDefault(); // Prevent link click when text selection is active
        } else {
          const href = target.getAttribute('href');
          if (href) {
            // Let PDF.js handle internal links
            if (href.startsWith('#page=')) {
              return; // Let the default handler work
            }
            // Handle external links
            e.preventDefault();
            window.open(href, '_blank', 'noopener,noreferrer');
          }
        }
      }
    }, [isTextSelectionMode]);

    // Add link click handler
    useEffect(() => {
      const page = pageRef.current;
      if (page) {
        page.addEventListener('click', handleLinkClick);
        return () => page.removeEventListener('click', handleLinkClick);
      }
    }, [handleLinkClick]);

    return (
      <div className="relative overflow-hidden" ref={pageRef}>
        {isPageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-navy-900/50 backdrop-blur-sm">
            <Loader className="w-8 h-8 animate-spin text-navy-400" />
          </div>
        )}
        {pageError ? (
          <div className="flex items-center justify-center p-4 text-red-400">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <span>Error loading page {pageNumber}</span>
          </div>
        ) : (
          <div 
            className={`relative ${isFullScreen ? 'fullscreen' : ''}`}
            style={{ 
              pointerEvents: 'auto',
              transformOrigin: 'center center',
            }}
          >
            <Page 
              key={`page_${pageNumber}_${debouncedScale}`}
              pageNumber={pageNumber}
              scale={debouncedScale}
              loading={null}
              error={null}
              className={`shadow-lg bg-navy-900 rounded-lg transition-opacity duration-200 pdf-page-content ${
                isPageLoading ? 'opacity-0' : 'opacity-100'
              } ${isTextSelectionMode ? 'text-selection-active' : ''}`}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              onLoadSuccess={handlePageLoadSuccess}
              onLoadError={handlePageLoadError}
              canvasRef={(canvas: HTMLCanvasElement) => {
                if (canvas) {
                  const ctx = canvas.getContext('2d', {
                    alpha: false,
                    willReadFrequently: false,
                    desynchronized: true
                  });
                  if (ctx) {
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    Object.assign(canvas.style, {
                      ...styles.optimizedCanvas,
                      position: 'relative',
                      zIndex: 1,
                      transformOrigin: 'center center',
                    });
                  }
                }
              }}
            />
          </div>
        )}
      </div>
    );
  });

  const Controls = () => {
    return (
      <div className="flex items-center justify-between w-full px-4 py-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
              className="p-1 hover:bg-navy-800 rounded disabled:opacity-50 text-white"
              title="Previous Page"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-white">
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={() => changePage(1)}
              disabled={pageNumber >= numPages}
              className="p-1 hover:bg-navy-800 rounded disabled:opacity-50 text-white"
              title="Next Page"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="h-6 w-px bg-navy-700" />

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
              disabled={scale <= 0.5}
              className="p-1 hover:bg-navy-800 rounded disabled:opacity-50 text-white"
              title="Zoom Out"
            >
              -
            </button>
            <span className="text-sm text-white">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(prev => Math.min(prev + 0.1, 3))}
              disabled={scale >= 3}
              className="p-1 hover:bg-navy-800 rounded disabled:opacity-50 text-white"
              title="Zoom In"
            >
              +
            </button>
          </div>

          <div className="h-6 w-px bg-navy-700" />

          <button
            onClick={() => setIsGridMode(!isGridMode)}
            className={`p-1 rounded text-white ${isGridMode ? 'bg-navy-700' : 'hover:bg-navy-800'}`}
            title={isGridMode ? "Exit Grid View" : "Grid View"}
          >
            <LayoutGrid size={20} />
          </button>

          <button
            onClick={toggleFullScreen}
            className="p-1 hover:bg-navy-800 rounded text-white"
            title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>

          <div className="h-6 w-px bg-navy-700" />

          <button
            onClick={toggleTextSelectionMode}
            className={`p-2 rounded transition-colors ${
              isTextSelectionMode 
                ? 'bg-primary-500 text-white hover:bg-primary-600' 
                : 'text-gray-400 hover:bg-navy-700 hover:text-white'
            }`}
            title={isTextSelectionMode ? "Disable text selection" : "Enable text selection"}
          >
            <Type size={18} />
          </button>
        </div>
      </div>
    );
  };

  const toggleGridMode = useCallback(() => {
    if (!isGridMode) {
      setPreGridScale(scale);
      setScale(1);
    } else {
      setScale(preGridScale);
    }
    setIsGridMode(!isGridMode);
  }, [isGridMode, scale, preGridScale]);

  const PDFContent = React.memo(() => {
    if (isGridMode) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 max-h-[80vh] overflow-y-auto">
          {Array.from(new Array(numPages), (_, index) => index + 1).map((page) => (
            <motion.button
              key={`${file.id}_page_${page}`}
              onClick={() => {
                setPageNumber(page);
                setIsGridMode(false);
                setScale(preGridScale);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative aspect-[3/4] rounded-lg border-2 transition-all duration-200 
                ${pageNumber === page 
                  ? 'border-primary-500 ring-2 ring-primary-500' 
                  : 'border-navy-700 hover:border-primary-500'
                }`}
            >
              <Document
                file={fileUrl}
                loading={
                  <div className="flex items-center justify-center h-full">
                    <Loader className="animate-spin text-primary-400" />
                  </div>
                }
              >
                <Page
                  pageNumber={page}
                  width={200}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="h-full w-full object-contain"
                />
              </Document>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-navy-900/90 rounded text-xs text-gray-300">
                Page {page}
              </div>
            </motion.button>
          ))}
        </div>
      );
    }

    return (
      <div 
        ref={pdfWrapperRef}
        className={`relative overflow-auto transition-transform duration-200 ease-out
          ${isDragging ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : 'cursor-default'}
          ${isFullScreen ? 'w-full h-full' : 'max-h-[80vh]'} no-scrollbar`}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <div 
          className="transform-gpu transition-transform duration-200 ease-out flex justify-center"
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'center top',
          }}
        >
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error: Error) => {
              console.error('Error loading document:', error);
              setError(error);
              setIsLoading(false);
              toast.error('Error loading PDF. Please try again.');
            }}
            loading={
              <div className="flex items-center justify-center p-4">
                <Loader className="animate-spin text-primary-400 mr-2" />
                <span className="text-gray-400">Loading PDF...</span>
              </div>
            }
            error={
              <div className="flex items-center justify-center p-4 text-red-400">
                <AlertTriangle className="h-6 w-6 mr-2" />
                <span>{error?.message || 'Error loading PDF'}</span>
              </div>
            }
            onItemClick={(e: { pageNumber: number }) => {
              if (e.pageNumber && e.pageNumber >= 1 && e.pageNumber <= numPages) {
                setPageNumber(e.pageNumber);
              }
            }}
            externalLinkTarget="_blank"
            options={PDF_LOADING_OPTIONS}
          >
            <OptimizedPage pageNumber={pageNumber} />
          </Document>
        </div>
      </div>
    );
  });

  // Update text selection handler
  const handleTextSelection = useCallback((e: MouseEvent) => {
    if (!isTextSelectionMode) return;

    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    console.log('Text selection event:', {
      type: e.type,
      selectedText,
      isTextSelectionMode,
      target: e.target
    });

    if (selectedText) {
      e.preventDefault(); // Prevent default context menu
      console.log('Setting selected text:', selectedText);
      setSelectedText(selectedText);
      
      // Calculate position relative to the viewport
      const x = e.clientX;
      const y = e.clientY;
      
      console.log('Setting context menu position:', { x, y });
      setContextMenuPosition({ x, y });
    } else {
      // Only clear if clicking outside of the popup
      const target = e.target as HTMLElement;
      if (!target.closest('.selection-popup') && !target.closest('.chat-window')) {
        console.log('Clearing selection');
        setSelectedText('');
        setContextMenuPosition(null);
      }
    }
  }, [isTextSelectionMode]);

  // Update useEffect for text selection
  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      if (isTextSelectionMode) {
        handleTextSelection(e);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (isTextSelectionMode) {
        e.preventDefault();
        handleTextSelection(e);
      }
    };

    if (isTextSelectionMode) {
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('contextmenu', handleContextMenu);
    }

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [handleTextSelection, isTextSelectionMode]);

  return (
    <div className={`relative w-full h-full flex ${isFullScreen ? 'fullscreen' : ''}`} ref={pdfContainerRef}>
      <div className="flex-1 relative">
        <AnimatePresence>
          {isFullScreen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-navy-950/95 flex flex-col"
            >
              <div className="bg-navy-900 border-b border-navy-700">
                <Controls />
              </div>
              <div className="flex-1 overflow-hidden p-4 flex items-center justify-center">
                <PDFContent />
              </div>
            </motion.div>
          ) : (
            <div className="bg-navy-900 rounded-xl border border-navy-700 overflow-hidden">
              <Controls />
              <div className="relative bg-navy-950 p-4 flex justify-center">
                <Document
                  file={fileUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={(error: Error) => {
                    console.error('Error loading document:', error);
                    setError(error);
                    setIsLoading(false);
                    toast.error('Error loading PDF. Please try again.');
                  }}
                  loading={
                    <div className="flex items-center justify-center p-4">
                      <Loader className="animate-spin text-primary-400 mr-2" />
                      <span className="text-gray-400">Loading PDF...</span>
                    </div>
                  }
                  options={PDF_LOADING_OPTIONS}
                >
                  <PDFContent />
                </Document>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Page Navigation Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center bg-navy-900/80 backdrop-blur-md rounded-2xl shadow-lg border border-navy-700/50 overflow-hidden transition-all duration-300 hover:bg-navy-900/90 hover:border-navy-600/50 group">
        <button
          onClick={() => changePage(-1)}
          disabled={pageNumber <= 1}
          className="p-2.5 hover:bg-navy-800/80 text-gray-400 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent transition-all duration-200"
          title="Previous page"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="px-4 py-2.5 flex items-center space-x-3 border-x border-navy-700/50">
          <span className="text-sm text-gray-300 font-medium">
            Page {pageNumber} of {numPages}
          </span>
        </div>

        <button
          onClick={() => changePage(1)}
          disabled={pageNumber >= numPages}
          className="p-2.5 hover:bg-navy-800/80 text-gray-400 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent transition-all duration-200"
          title="Next page"
        >
          <ChevronRight size={20} />
        </button>

        <div className="border-l border-navy-700/50 flex items-center space-x-1 px-2">
          <button
            onClick={startScreenshotCapture}
            className="p-2 hover:bg-navy-800/80 rounded-xl text-gray-400 hover:text-white transition-all duration-200"
            title="Take Screenshot"
          >
            <Camera size={20} />
          </button>

          <button
            onClick={() => setShowScreenshots(!showScreenshots)}
            className={`p-2 hover:bg-navy-800/80 rounded-xl transition-all duration-200 ${
              showScreenshots ? 'text-white bg-navy-800/80' : 'text-gray-400'
            }`}
            title="View Screenshots"
          >
            <Image size={20} />
            {!showScreenshots && screenshots.length > 0 && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            )}
          </button>

          <button
            onClick={toggleGridMode}
            className={`p-2 hover:bg-navy-800/80 rounded-xl transition-all duration-200 ${
              isGridMode ? 'text-white bg-navy-800/80' : 'text-gray-400'
            }`}
            title="Grid View"
          >
            <LayoutGrid size={20} />
          </button>

          <button
            onClick={toggleTextSelectionMode}
            className={`p-2 hover:bg-navy-800/80 rounded-xl transition-all duration-200 ${
              isTextSelectionMode ? 'text-white bg-navy-800/80' : 'text-gray-400'
            }`}
            title={isTextSelectionMode ? "Disable text selection" : "Enable text selection"}
          >
            <Type size={20} />
          </button>
        </div>
      </div>

      {/* Screenshots Panel */}
      <div className={`fixed left-4 top-4 bottom-4 w-80 bg-navy-800 rounded-lg shadow-lg border border-navy-700 transition-transform duration-300 ${showScreenshots ? 'translate-x-0' : '-translate-x-full'} z-40`}>
        <div className="p-4 border-b border-navy-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Screenshots Gallery</h3>
            <button
              onClick={() => setShowScreenshots(false)}
              className="p-1 hover:bg-navy-700 rounded text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-4 h-[calc(100%-5rem)] overflow-y-auto">
          {screenshots.length === 0 ? (
            <p className="text-center text-gray-400 py-4">No screenshots yet</p>
          ) : (
            <div className="space-y-4">
              {screenshots.map((screenshot) => (
                <div key={screenshot.id} className="relative group bg-navy-900 rounded-lg p-2">
                  <div className="relative">
                    <img
                      src={screenshot.imageUrl}
                      alt={screenshot.title || `Screenshot from page ${screenshot.pageNumber}`}
                      className="w-full rounded-lg border border-navy-700 cursor-pointer"
                      onClick={() => window.open(screenshot.imageUrl, '_blank')}
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                      <button
                        onClick={() => deleteScreenshot(screenshot.id)}
                        className="p-1.5 bg-red-500/90 hover:bg-red-600 rounded-full text-white"
                        title="Delete screenshot"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    {isEditingTitle === screenshot.id ? (
                      <input
                        type="text"
                        value={screenshot.title || ''}
                        onChange={(e) => updateScreenshotTitle(screenshot.id, e.target.value)}
                        onBlur={() => setIsEditingTitle(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setIsEditingTitle(null);
                          }
                        }}
                        className="w-full px-2 py-1 bg-navy-800 border border-navy-700 rounded text-white text-sm"
                        autoFocus
                      />
                    ) : (
                      <div
                        className="text-sm text-white font-medium cursor-pointer hover:text-blue-400"
                        onClick={() => setIsEditingTitle(screenshot.id)}
                      >
                        {screenshot.title || `Screenshot ${screenshot.pageNumber}`}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      Page {screenshot.pageNumber} • {screenshot.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cropping Modal */}
      {isCropping && tempScreenshot && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-navy-800 p-6 rounded-lg shadow-xl max-w-4xl w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-white">Crop Screenshot</h3>
              <button
                onClick={() => {
                  setIsCropping(false);
                  setTempScreenshot(null);
                }}
                className="p-1 hover:bg-navy-700 rounded text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Screenshot title (optional)"
                value={screenshotTitle}
                onChange={(e) => setScreenshotTitle(e.target.value)}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded text-white"
              />
            </div>
            <div className="relative overflow-auto max-h-[60vh]">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={undefined}
              >
                <img
                  ref={imageRef}
                  src={tempScreenshot}
                  alt="Screenshot preview"
                  className="max-w-full"
                />
              </ReactCrop>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsCropping(false);
                  setTempScreenshot(null);
                }}
                className="px-4 py-2 bg-navy-700 hover:bg-navy-600 rounded text-white"
              >
                Cancel
              </button>
              <button
                onClick={saveCroppedScreenshot}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white"
              >
                Save Screenshot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Text Selection Popup */}
      <AnimatePresence>
        {selectedText && contextMenuPosition && (
          <TextSelectionPopup
            selectedText={selectedText}
            position={contextMenuPosition}
            onClose={() => {
              console.log('Closing text selection popup');
              setSelectedText('');
              setContextMenuPosition(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

interface PDFPreviewProps {
  files: Array<{
    id: string;
    name: string;
    path: string;
  }>;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ files }) => {
  return (
    <div className="space-y-4">
      {files.map((file, index) => (
        <PDFFile 
          key={`${file.id}_${index}`} 
          file={file} 
        />
      ))}
    </div>
  );
};

export { PDFPreview };