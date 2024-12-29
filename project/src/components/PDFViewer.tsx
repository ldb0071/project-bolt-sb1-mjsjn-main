import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useStore } from '../store/useStore';
import useResizeObserver from 'use-resize-observer';

// Configure PDF.js worker with strict settings
const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
let pdfWorker: Worker | null = null;

const initializeWorker = () => {
  if (pdfWorker) {
    pdfWorker.terminate();
  }

  // Create worker with error handling
  pdfWorker = new Worker(workerSrc);
  pdfWorker.onerror = (error) => {
    console.error('PDF Worker error:', error);
  };
  
  // Configure worker
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  pdfjs.GlobalWorkerOptions.workerPort = pdfWorker;

  return pdfWorker;
};

interface PDFViewerProps {
  fileUrl: string;
  fileId: string;
}

function customDebounce<T extends (...args: any[]) => void>(callback: T, delay: number) {
  let timer: number | undefined;
  return (...args: Parameters<T>) => {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export function PDFViewer({ fileUrl, fileId }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageHeights, setPageHeights] = useState<number[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<{ [key: number]: HTMLDivElement }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [thumbnails, setThumbnails] = useState<{ [key: number]: string }>({});
  
  const {
    currentPdfState,
    setCurrentPdfState,
    setPdfCache,
    getPdfFromCache
  } = useStore();

  const { ref: resizeRef, width = 1, height = 1 } = useResizeObserver<HTMLDivElement>();

  const [scale, setScale] = useState(currentPdfState.scale);
  // const [selectedText, setSelectedText] = useState('');

  // Add text content loading state
  const [textContentLoading, setTextContentLoading] = useState(true);
  const [textContentError, setTextContentError] = useState<string | null>(null);
  const workerBusy = useRef(false);

  const [workerError, setWorkerError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  // Initialize worker on mount
  useEffect(() => {
    // Initialize worker
    const worker = initializeWorker();

    // Configure PDF loading options
    const loadingOptions = {
      cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/standard_fonts/',
      disableAutoFetch: false,
      disableStream: false,
      disableFontFace: false,
      useSystemFonts: true,
      maxImageSize: 1024 * 1024 * 10,
      isEvalSupported: true,
      isOffscreenCanvasSupported: true,
      verbosity: pdfjs.VerbosityLevel.ERRORS
    };

    // Cleanup worker on unmount
    return () => {
      if (worker) {
        worker.terminate();
      }
      pdfWorker = null;
    };
  }, []);

  // Memoize the PDF document loading
  const documentLoadSuccess = async ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    const heights = new Array(numPages).fill(800); // Default height
    setPageHeights(heights);
  };

  // Debounced scroll position save
  const saveScrollPosition = useMemo(
    () =>
      customDebounce((scrollOffset: number) => {
        setCurrentPdfState({
          scrollPosition: { x: 0, y: scrollOffset },
          fileId,
          scale
        });
      }, 100),
    [fileId, scale]
  );

  // Optimized page heights state management
  const getPageHeight = useCallback((index: number) => pageHeights[index] || 800, [pageHeights]);

  // Memoized page render callback
  const onPageRenderSuccess = useCallback((pageNumber: number) => {
    const pageElement = pageRefs.current[pageNumber];
    if (pageElement) {
      const height = pageElement.offsetHeight;
      setPageHeights(prev => {
        if (prev[pageNumber - 1] !== height) {
          const newHeights = [...prev];
          newHeights[pageNumber - 1] = height;
          listRef.current?.resetAfterIndex(pageNumber - 1);
          return newHeights;
        }
        return prev;
      });
    }
  }, []);

  const generateThumbnail = async (pageNumber: number) => {
    if (thumbnails[pageNumber]) return;

    try {
      const loadingTask = pdfjs.getDocument({
        url: fileUrl,
        verbosity: pdfjs.VerbosityLevel.ERRORS,
        cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
        cMapPacked: true,
        standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/standard_fonts/',
        useSystemFonts: true,
        maxImageSize: 1024 * 1024 * 10,
        disableAutoFetch: true,
        disableStream: false,
        disableFontFace: true,
        enableXfa: false,
        stopAtErrors: false
      });

      // Add timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Thumbnail generation timeout')), 5000);
      });

      const doc = await Promise.race([loadingTask.promise, timeoutPromise]);
      const page = await (doc as any).getPage(pageNumber);

      const scale = 0.3;
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', {
        alpha: false,
        desynchronized: true
      });

      if (!ctx) throw new Error('Could not get canvas context');

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      try {
        await page.render({
          canvasContext: ctx,
          viewport,
          intent: 'print',
          enableWebGL: true,
          renderInteractiveForms: false
        }).promise;

        const thumbnail = canvas.toDataURL('image/jpeg', 0.5);
        setThumbnails(prev => ({ ...prev, [pageNumber]: thumbnail }));

      } catch (renderError) {
        console.error(`Error rendering page ${pageNumber}:`, renderError);
        setThumbnails(prev => ({ ...prev, [pageNumber]: getPlaceholderThumbnail() }));
      }

    } catch (error) {
      console.error(`Error generating thumbnail for page ${pageNumber}:`, error);
      
      // Reinitialize worker on error
      if (error instanceof Error && error.message.includes('Worker')) {
        initializeWorker();
      }

      setThumbnails(prev => ({ ...prev, [pageNumber]: getPlaceholderThumbnail() }));
    }
  };

  const getPlaceholderThumbnail = () => {
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="200" height="280" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#666"
          text-anchor="middle" dy=".3em">Preview unavailable</text>
      </svg>
    `)}`;
  };

  // Add page fitting calculation
  const calculatePageDimensions = useCallback((pageWidth: number, pageHeight: number) => {
    if (!containerRef.current) return { scale: 1, width: pageWidth };
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth - 40; // Account for padding
    const containerHeight = container.clientHeight - 40;
    
    const widthRatio = containerWidth / pageWidth;
    const heightRatio = containerHeight / pageHeight;
    
    // Use the smaller ratio to ensure page fits both width and height
    const fitScale = Math.min(widthRatio, heightRatio, 1); // Don't zoom in past 100%
    
    return {
      scale: fitScale,
      width: pageWidth * fitScale
    };
  }, []);

  // Add page fitting logic
  const getFitScale = useCallback((pageWidth: number, pageHeight: number) => {
    if (!containerRef.current) return 1;
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth - 40; // Account for padding
    const containerHeight = container.clientHeight - 40;
    
    // Calculate scale needed to fit both width and height
    const widthScale = containerWidth / pageWidth;
    const heightScale = containerHeight / pageHeight;
    
    // Use the smaller scale to ensure page fits in both dimensions
    return Math.min(widthScale, heightScale);
  }, []);

  // Modified page render callback
  const renderPage = useCallback(({ index, style }) => {
    const pageNumber = index + 1;
    const [pageDimensions, setPageDimensions] = useState({ scale: 1, width: 0 });

    return (
      <div 
        ref={el => el && (pageRefs.current[pageNumber] = el)}
        style={{
          ...style,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100%'
        }}
        className="pdf-page"
      >
        <Page
          pageNumber={pageNumber}
          width={pageDimensions.width || width - 40}
          scale={pageDimensions.scale * scale}
          onLoadSuccess={(page) => {
            const { scale: fitScale, width } = calculatePageDimensions(
              page.originalWidth,
              page.originalHeight
            );
            setPageDimensions({ scale: fitScale, width });
            onPageRenderSuccess(pageNumber);
          }}
          loading={null}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </div>
    );
  }, [width, scale, calculatePageDimensions, onPageRenderSuccess]);

  // Handle text selection
  // useEffect(() => {
  //   const handleSelection = () => {
  //     const selection = window.getSelection();
  //     if (selection) {
  //       setSelectedText(selection.toString());
  //     }
  //   };

  //   document.addEventListener('selectionchange', handleSelection);
  //   return () => document.removeEventListener('selectionchange', handleSelection);
  // }, []);

  // Restore scroll position
  useEffect(() => {
    if (currentPdfState.fileId === fileId && listRef.current) {
      listRef.current.scrollTo(currentPdfState.scrollPosition.y);
    }
  }, [currentPdfState.fileId, fileId]);

  // Add error recovery for text content
  useEffect(() => {
    const handleTextContentError = () => {
      if (textContentError && !workerBusy.current) {
        workerBusy.current = true;
        // Attempt to recover by reloading the worker
        const reloadWorker = async () => {
          try {
            await pdfjsWorker.terminate();
            const newWorker = new Worker(workerSrc);
            pdfjs.GlobalWorkerOptions.workerPort = newWorker;
            setTextContentError(null);
          } catch (error) {
            console.error('Failed to reload worker:', error);
          } finally {
            workerBusy.current = false;
          }
        };
        reloadWorker();
      }
    };

    if (textContentError) {
      handleTextContentError();
    }
  }, [textContentError]);

  return (
    <div
      ref={containerRef}
      className="pdf-viewer-container no-scrollbar"
      style={{ height: '100%', width: '100%', overflow: 'hidden', userSelect: 'none' }}
    >
      <div ref={resizeRef} className="h-full w-full">
        <Document
          file={fileUrl}
          onLoadSuccess={documentLoadSuccess}
          onLoadError={(error) => {
            console.error('Error loading document:', error);
            setTextContentError('Failed to load document');
          }}
          options={loadingOptions}
          loading={<div>Loading PDF...</div>}
        >
          {Array.from(new Array(numPages), (_, index) => (
            <div key={index} className="pdf-page">
              <Page
                pageNumber={index + 1}
                width={width}
                scale={scale}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                onLoadSuccess={(page) => {
                  const { scale: fitScale, width } = calculatePageDimensions(
                    page.originalWidth,
                    page.originalHeight
                  );
                  setPageDimensions({ scale: fitScale, width });
                  onPageRenderSuccess(pageNumber);
                }}
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}
