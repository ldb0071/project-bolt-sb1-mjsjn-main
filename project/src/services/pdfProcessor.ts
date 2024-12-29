import * as pdfjs from 'pdfjs-dist';
import { createCanvas } from 'canvas';

export class PDFProcessor {
  private thumbnailCache: Map<string, string>;
  private failedAttempts: Set<string>;
  private worker: Worker | null;
  private maxRetries: number;
  
  constructor() {
    this.thumbnailCache = new Map();
    this.failedAttempts = new Set();
    this.worker = null;
    this.maxRetries = 3;
    this.initWorker();
  }

  private initWorker() {
    if (this.worker) {
      this.worker.terminate();
    }

    const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    this.worker = new Worker(workerSrc);
    
    this.worker.onerror = (event) => {
      console.error('PDF Worker error:', event);
      this.initWorker(); // Reinitialize worker on error
    };

    pdfjs.GlobalWorkerOptions.workerPort = this.worker;
  }

  async generateThumbnail(pdfPath: string, options = { width: 200 }): Promise<string> {
    try {
      // Check if we already failed to generate this thumbnail
      if (this.failedAttempts.has(pdfPath)) {
        return this.getPlaceholderThumbnail();
      }

      // Check cache first
      const cacheKey = `${pdfPath}_${options.width}`;
      if (this.thumbnailCache.has(cacheKey)) {
        return this.thumbnailCache.get(cacheKey)!;
      }

      // Load the PDF document with timeout and recovery options
      const loadingTask = pdfjs.getDocument({
        url: pdfPath,
        timeout: 5000, // 5 second timeout
        verbosity: pdfjs.VerbosityLevel.ERRORS,
        stopAtErrors: false,
        maxImageSize: 1024 * 1024 * 10,
        isEvalSupported: true,
        useSystemFonts: true
      });
      
      // Add error handling for worker
      loadingTask.onUnsupportedFeature = (featureId) => {
        console.warn('Unsupported PDF feature:', featureId);
      };

      const doc = await loadingTask.promise;
      const page = await doc.getPage(1);

      // Calculate dimensions
      const viewport = page.getViewport({ scale: 1.0 });
      const scale = options.width / viewport.width;
      const scaledViewport = page.getViewport({ scale });

      // Create canvas
      const canvas = createCanvas(scaledViewport.width, scaledViewport.height);
      const context = canvas.getContext('2d');

      // Render PDF page to canvas
      await page.render({
        canvasContext: context,
        viewport: scaledViewport,
      }).promise;

      // Convert to data URL
      const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      // Cache the result
      this.thumbnailCache.set(cacheKey, thumbnailUrl);

      return thumbnailUrl;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      if (error instanceof Error && error.message.includes('Worker')) {
        this.initWorker(); // Reinitialize worker on error
      }
      // Add to failed attempts to avoid retrying
      this.failedAttempts.add(pdfPath);
      return this.getPlaceholderThumbnail();
    }
  }

  private getPlaceholderThumbnail(): string {
    // Return a base64 encoded placeholder image
    return 'data:image/svg+xml;base64,...'; // Add your placeholder SVG/image here
  }

  clearCache() {
    this.thumbnailCache.clear();
    this.failedAttempts.clear();
  }
}

export const pdfProcessor = new PDFProcessor();
