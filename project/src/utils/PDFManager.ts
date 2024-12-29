import { pdfjs } from 'react-pdf';

interface PDFError extends Error {
  name: string;
  code?: string;
  stack?: string;
  details?: any;
}

export class PDFManager {
  private static instance: PDFManager;
  private worker: Worker | null = null;
  private documents = new Map<string, any>();
  private textContent = new Map<string, any>();

  private constructor() {
    this.initializeWorker();
  }

  static getInstance() {
    if (!PDFManager.instance) {
      PDFManager.instance = new PDFManager();
    }
    return PDFManager.instance;
  }

  private initializeWorker() {
    if (this.worker) {
      this.worker.terminate();
    }

    const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    this.worker = new Worker(workerSrc);
    pdfjs.GlobalWorkerOptions.workerPort = this.worker;
  }

  private logError(error: PDFError, context: string) {
    console.error(`[PDFManager] ${context}:`, {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
      details: error.details
    });
  }

  async loadDocument(url: string, fileId: string) {
    try {
      console.debug(`[PDFManager] Loading document: ${fileId}`);
      const loadingTask = pdfjs.getDocument({
        url,
        cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
        cMapPacked: true,
        standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/standard_fonts/',
        enableXfa: true,
        useSystemFonts: true,
        verbosity: pdfjs.VerbosityLevel.ERRORS,
        stopAtErrors: false,
        disableRange: false,
        disableStream: false,
        disableAutoFetch: false
      });

      loadingTask.onProgress = (progress) => {
        console.debug(`[PDFManager] Loading progress: ${progress.loaded}/${progress.total}`);
      };

      const doc = await loadingTask.promise;
      console.debug(`[PDFManager] Document loaded: ${fileId}, pages: ${doc.numPages}`);
      this.documents.set(fileId, doc);
      return doc;
    } catch (error) {
      this.logError(error as PDFError, 'Error loading document');
      throw error;
    }
  }

  async getTextContent(fileId: string, pageNumber: number) {
    try {
      console.debug(`[PDFManager] Getting text content for page ${pageNumber}`);
      const key = `${fileId}-${pageNumber}`;
      
      if (this.textContent.has(key)) {
        return this.textContent.get(key);
      }

      const doc = this.documents.get(fileId);
      if (!doc) {
        throw new Error(`Document not found: ${fileId}`);
      }

      const page = await doc.getPage(pageNumber);
      const content = await page.getTextContent({
        normalizeWhitespace: true,
        disableCombineTextItems: false
      });

      if (!content || !content.items || content.items.length === 0) {
        console.warn(`[PDFManager] No text content found for page ${pageNumber}`);
      }

      this.textContent.set(key, content);
      return content;
    } catch (error) {
      this.logError(error as PDFError, `Error getting text content for page ${pageNumber}`);
      return null;
    }
  }

  cleanup(fileId?: string) {
    if (fileId) {
      this.documents.delete(fileId);
      // Clean up text content for this file
      [...this.textContent.keys()]
        .filter(key => key.startsWith(fileId))
        .forEach(key => this.textContent.delete(key));
    } else {
      this.documents.clear();
      this.textContent.clear();
    }
  }

  destroy() {
    this.cleanup();
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }

  // Add diagnostic methods
  async diagnoseDocument(fileId: string) {
    try {
      const doc = this.documents.get(fileId);
      if (!doc) return { error: 'Document not found' };

      const info = await doc.getMetadata();
      return {
        pageCount: doc.numPages,
        fingerprint: doc.fingerprints,
        metadata: info,
        version: pdfjs.version,
        workerActive: !!this.worker,
        cached: {
          documents: this.documents.size,
          textContent: this.textContent.size
        }
      };
    } catch (error) {
      this.logError(error as PDFError, 'Error diagnosing document');
      return { error: error.message };
    }
  }
}
