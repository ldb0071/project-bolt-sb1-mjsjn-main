import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PDFDropzone } from '../components/PDFDropzone';
import { PDFPreview } from '../components/PDFPreview';
import * as pdfjs from 'pdfjs-dist';
import { 
  FileText, 
  ArrowLeft, 
  Loader, 
  AlertTriangle, 
  TrashIcon, 
  ChevronUp, 
  ChevronDown,
  LayoutGrid,
  LayoutList,
  X,
  Image,
  ZoomIn,
  ZoomOut,
  Move,
  Copy,
  Search
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadPDF, deletePDF } from '../services/apiClient';
import ErrorBoundary from '../components/ErrorBoundary';
import toast from 'react-hot-toast';
import { ChatTemplate } from '../components/ChatTemplate';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Add PDF loading options
const PDF_LOADING_OPTIONS = {
  cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/standard_fonts/',
  verbosity: pdfjs.VerbosityLevel.ERRORS,
  maxImageSize: 1024 * 1024 * 50,
  isEvalSupported: true,
  useSystemFonts: true,
  disableFontFace: false,
  useWorkerFetch: true
};

interface ChatTemplateProps {
  messages?: Array<{ role: 'user' | 'assistant'; content: string }>;
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  onFullScreenChange?: (isFullScreen: boolean) => void;
  selectedText?: string;
  pdfContent?: string;
  isAnalyzing?: boolean;
  onTemplateSelect?: (template: string) => void;
}

export function PDFViewerPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { 
    getCurrentProject, 
    addFileToProject, 
    removeFileFromProject, 
    setCurrentProject,
    moveFileBetweenProjects,
    copyFileBetweenProjects,
    projects
  } = useStore();
  
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<'drag-drop' | 'button'>('drag-drop');
  const [hasPDFUploaded, setHasPDFUploaded] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [gridSize, setGridSize] = useState(200);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [fileToMove, setFileToMove] = useState<string | null>(null);
  const [moveType, setMoveType] = useState<'move' | 'copy'>('move');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [thumbnailLoadingStates, setThumbnailLoadingStates] = useState<Record<string, boolean>>({});
  const [selectedText, setSelectedText] = useState('');
  const [pdfContent, setPdfContent] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showChatTemplate, setShowChatTemplate] = useState(false);

  const currentProject = getCurrentProject();

  const generateThumbnail = async (fileId: string) => {
    if (thumbnails[fileId] || !currentProject) return;

    try {
      setThumbnailLoadingStates(prev => ({ ...prev, [fileId]: true }));

      const file = currentProject.files.find(f => f.id === fileId);
      if (!file) {
        throw new Error('File not found');
      }

      // Create the full URL for the PDF file
      const fileUrl = file.path.startsWith('http') 
        ? file.path 
        : `${window.location.protocol}//${window.location.hostname}:8080${file.path}`;

      // Load the PDF with options
      const loadingTask = pdfjs.getDocument({
        url: fileUrl,
        ...PDF_LOADING_OPTIONS
      });

      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', {
        alpha: false,
        willReadFrequently: false,
        desynchronized: true
      });

      if (!context) {
        throw new Error('Could not get canvas context');
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Set canvas context properties for better rendering
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';

      try {
        await page.render({
          canvasContext: context,
          viewport: viewport,
          intent: 'display',
          background: 'rgb(255, 255, 255)'
        }).promise;

        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
        setThumbnails(prev => ({ ...prev, [fileId]: thumbnailUrl }));
      } catch (renderError) {
        console.error('Error rendering PDF page:', renderError);
        setThumbnails(prev => ({ ...prev, [fileId]: '' }));
      }
    } catch (err) {
      console.error('Error generating thumbnail:', err);
      setThumbnails(prev => ({ ...prev, [fileId]: '' }));
    } finally {
      setThumbnailLoadingStates(prev => ({ ...prev, [fileId]: false }));
    }
  };

  useEffect(() => {
    if (currentProject?.files) {
      currentProject.files.forEach(file => {
        generateThumbnail(file.id);
      });
    }
  }, [currentProject?.files]);

  useEffect(() => {
    // Set the current project when the page loads
    if (projectId) {
      setCurrentProject(projectId);
    }

    const project = getCurrentProject();
    if (!project && projectId) {
      navigate('/projects');
      return;
    }
    
    // Initialize hasPDFUploaded based on whether project has files
    if (project?.files && project.files.length > 0) {
      setHasPDFUploaded(true);
    }
    
    setIsLoading(false);
  }, [projectId, navigate, getCurrentProject, setCurrentProject]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedFileId) {
        setSelectedFileId(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedFileId]);

  const handleLocalSearch = useCallback((term: string) => {
    setSearchTerm(term);
    if (!currentProject) return;
    
    const results = currentProject.files.filter(file => 
      file.name.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(results);
  }, [currentProject, setSearchTerm]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleLocalSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, handleLocalSearch]);

  // Handle text selection
  const handleTextSelection = useCallback(async () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setShowChatTemplate(false);
      return;
    }

    const text = selection.toString().trim();
    if (!text) {
      setShowChatTemplate(false);
      return;
    }

    setSelectedText(text);
    setShowChatTemplate(true);
    
    // Get PDF content context around selection
    if (currentProject && selectedFileId) {
      const file = currentProject.files.find(f => f.id === selectedFileId);
      if (!file) return;

      setIsAnalyzing(true);
      try {
        const fileUrl = file.path.startsWith('http')
          ? file.path
          : `${window.location.protocol}//${window.location.hostname}:8080${file.path}`;

        const loadingTask = pdfjs.getDocument({
          url: fileUrl,
          ...PDF_LOADING_OPTIONS
        });

        const pdf = await loadingTask.promise;
        let fullText = '';

        // Get text from current page and surrounding pages
        const pageNum = await findPageWithText(pdf, text);
        if (pageNum > 0) {
          // Get text from current page and adjacent pages for context
          const startPage = Math.max(1, pageNum - 1);
          const endPage = Math.min(pdf.numPages, pageNum + 1);
          
          for (let i = startPage; i <= endPage; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items
              .map((item: any) => item.str)
              .join(' ');
            fullText += pageText + '\n';
          }
        }

        setPdfContent(fullText);
        
        // Clean up
        await pdf.cleanup();
        await loadingTask.destroy();

      } catch (error) {
        console.error('Error analyzing PDF content:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  }, [currentProject, selectedFileId]);

  // Find page containing selected text
  const findPageWithText = async (pdf: any, searchText: string): Promise<number> => {
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str)
        .join(' ');
      
      if (pageText.includes(searchText)) {
        return i;
      }
    }
    return -1;
  };

  // Add event listener for text selection
  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('keyup', handleTextSelection);
    
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('keyup', handleTextSelection);
    };
  }, [handleTextSelection]);

  // Handle template selection
  const handleTemplateSelect = useCallback((template: string) => {
    // Here you would integrate with your chat system
    console.log('Selected template:', template);
    setShowChatTemplate(false);
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="animate-spin text-primary-500" size={32} />
      </div>
    );
  }

  if (!currentProject) {
    return null;
  }

  const handleFilesDrop = async (newFiles: File[]) => {
    setIsUploading(true);
    setError(null);
    setBackendError(null);
    
    try {
      for (const file of newFiles) {
        const result = await uploadPDF(file, currentProject.id, currentProject.name);
        console.log('Upload result:', result);  // Debug log
        
        // Set thumbnail URL directly
        setThumbnails(prev => ({
          ...prev,
          [result.filename]: ''
        }));

        addFileToProject(currentProject.id, {
          id: result.filename,
          name: file.name,
          path: result.path,
          uploadedAt: new Date(),
        });

        // Generate thumbnail for the new file
        generateThumbnail(result.filename);
      }
      setHasPDFUploaded(true);
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload PDF';
      setError(errorMessage);
      setBackendError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      if (!currentProject) {
        throw new Error('Current project not found');
      }
      const file = currentProject.files.find(f => f.id === fileId);
      if (!file) {
        throw new Error('File not found');
      }
      const fileType = file.path.includes('/uploaded/') ? 'uploaded' : 'downloaded';
      await deletePDF(currentProject.name, fileType, fileId);
      removeFileFromProject(currentProject.id, fileId);
      
      // Ensure we update hasPDFUploaded state correctly
      const remainingFiles = currentProject.files.filter(file => file.id !== fileId);
      setHasPDFUploaded(remainingFiles.length > 0);
      
      // Optional: Show a success toast or notification
      toast.success('PDF deleted successfully', {
        position: 'bottom-right',
        duration: 3000
      });
    } catch (err) {
      console.error('Delete error:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to delete PDF. The file may have already been removed.';
      
      // Show error toast
      toast.error(errorMessage, {
        position: 'bottom-right',
        duration: 5000
      });
      
      // Attempt to remove file from project even if deletion fails
      removeFileFromProject(currentProject.id, fileId);
      
      setError(errorMessage);
      setBackendError(errorMessage);
    }
  };

  const handleMoveFile = (fileId: string, type: 'move' | 'copy' = 'move') => {
    setFileToMove(fileId);
    setMoveType(type);
    setShowMoveModal(true);
  };

  const confirmMoveFile = (targetProjectId: string) => {
    if (fileToMove && projectId) {
      if (moveType === 'move') {
        moveFileBetweenProjects(projectId, targetProjectId, fileToMove);
      } else {
        copyFileBetweenProjects(projectId, targetProjectId, fileToMove);
      }
      setShowMoveModal(false);
      setFileToMove(null);
    }
  };

  const togglePreview = (fileId: string) => {
    setSelectedFileId(selectedFileId === fileId ? null : fileId);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/projects')}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800/70 backdrop-blur-sm transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-white">
                {currentProject.name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 min-w-[260px]">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search PDFs..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-navy-800 border border-navy-600 
                      text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-primary-500 focus:border-transparent"
                    autoComplete="off"
                    spellCheck="false"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                        hover:text-gray-200 focus:outline-none"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {searchResults.length > 0 && searchTerm && (
                  <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto 
                    bg-navy-800 border border-navy-600 rounded-lg shadow-lg z-50">
                    <div className="p-2 text-xs text-gray-400">
                      Found {searchResults.length} results
                    </div>
                  </div>
                )}
              </div>

              {/* Existing view mode and grid controls */}
              {viewMode === 'grid' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setGridSize(size => Math.max(150, size - 50))}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800/70 backdrop-blur-sm transition-all duration-200"
                    title="Decrease size"
                    disabled={gridSize <= 150}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <input
                    type="range"
                    min="150"
                    max="400"
                    step="10"
                    value={gridSize}
                    onChange={(e) => setGridSize(Number(e.target.value))}
                    className="w-24 accent-primary-500"
                  />
                  <button
                    onClick={() => setGridSize(size => Math.min(400, size + 50))}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800/70 backdrop-blur-sm transition-all duration-200"
                    title="Increase size"
                    disabled={gridSize >= 400}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                </div>
              )}
              <button
                onClick={() => setViewMode(mode => mode === 'list' ? 'grid' : 'list')}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800/70 backdrop-blur-sm transition-all duration-200"
                title={viewMode === 'list' ? 'Switch to Grid View' : 'Switch to List View'}
              >
                {viewMode === 'list' ? (
                  <LayoutGrid className="h-5 w-5" />
                ) : (
                  <LayoutList className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <PDFDropzone 
            onFilesDrop={handleFilesDrop} 
            mode={hasPDFUploaded ? 'button' : 'drag-drop'}
            className="w-full"
          />

          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-3 rounded-lg bg-primary-500/10 border border-primary-500/20"
              >
                <div className="flex items-center space-x-3 text-primary-300">
                  <Loader className="animate-spin h-5 w-5" />
                  <span className="text-sm">Uploading PDF...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {currentProject.files && currentProject.files.length > 0 && (
            <motion.div 
              layout
              className={`mt-8 ${
                viewMode === 'grid' 
                  ? 'grid gap-6' 
                  : 'space-y-4'
              }`}
              style={viewMode === 'grid' ? {
                gridTemplateColumns: `repeat(auto-fill, minmax(${gridSize}px, 1fr))`
              } : undefined}
            >
              {(searchTerm ? searchResults : currentProject.files).map((file, index) => (
                <motion.div
                  key={`${file.id}_${index}_${currentProject.id}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-hidden"
                >
                  <div className={`flex ${
                    viewMode === 'grid' ? 'flex-col h-full' : ''
                  } items-center justify-between p-3 rounded-lg border border-navy-600 
                    bg-navy-700/50 hover:bg-navy-700 group transition-colors`}
                  >
                    <div className={`flex items-center ${
                      viewMode === 'grid' ? 'flex-col space-y-2 w-full' : 'space-x-3'
                    } min-w-0`}
                    >
                      {viewMode === 'grid' ? (
                        <div 
                          className="relative w-full rounded-lg overflow-hidden bg-navy-800"
                          style={{ aspectRatio: '3/4' }}
                        >
                          {thumbnailLoadingStates[file.id] ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Loader className="h-8 w-8 animate-spin text-primary-400" />
                            </div>
                          ) : thumbnails[file.id] ? (
                            <img 
                              src={thumbnails[file.id]} 
                              alt={`Thumbnail for ${file.name}`}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Image className="h-12 w-12 text-primary-400" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <FileText className="h-5 w-5 text-primary-400 group-hover:text-primary-300 transition-colors" />
                      )}
                      <span className={`text-sm text-gray-300 truncate group-hover:text-gray-200 ${
                        viewMode === 'grid' ? 'text-center w-full' : ''
                      }`}>
                        {file.name}
                      </span>
                    </div>
                    <div className={`flex ${
                      viewMode === 'grid' ? 'mt-4 w-full justify-center' : ''
                    } items-center space-x-2`}
                    >
                      <button
                        onClick={() => togglePreview(file.id)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-primary-400 
                          hover:bg-primary-500/20 backdrop-blur-sm transition-all duration-200"
                      >
                        <span className="sr-only">Preview</span>
                        {selectedFileId === file.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleMoveFile(file.id, 'move')}
                        className="p-1.5 rounded-md text-gray-400 hover:text-accent-400 
                          hover:bg-accent-500/20 backdrop-blur-sm transition-all duration-200"
                        title="Move to another project"
                      >
                        <span className="sr-only">Move</span>
                        <Move className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMoveFile(file.id, 'copy')}
                        className="p-1.5 rounded-md text-gray-400 hover:text-accent-300 
                          hover:bg-accent-500/20 backdrop-blur-sm transition-all duration-200"
                        title="Copy to another project"
                      >
                        <span className="sr-only">Copy</span>
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-red-400 
                          hover:bg-red-500/20 backdrop-blur-sm transition-all duration-200"
                      >
                        <span className="sr-only">Delete</span>
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <AnimatePresence>
                    {selectedFileId === file.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className={`mt-2 rounded-lg overflow-hidden ${
                          viewMode === 'grid' 
                            ? 'fixed inset-0 z-50 m-4 bg-navy-950 shadow-2xl border border-navy-700' 
                            : ''
                        }`}
                        style={viewMode === 'grid' ? {
                          maxHeight: 'calc(100vh - 2rem)',
                          overflowY: 'auto'
                        } : undefined}
                      >
                        <div className={viewMode === 'grid' ? 'p-4' : ''}>
                          {viewMode === 'grid' && (
                            <div className="flex justify-end mb-4">
                              <button
                                onClick={() => setSelectedFileId(null)}
                                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800/70 backdrop-blur-sm transition-all duration-200"
                                title="Close preview (Esc)"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          )}
                          <ErrorBoundary>
                            <PDFPreview files={[file]} />
                          </ErrorBoundary>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {showMoveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-navy-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {moveType === 'move' ? 'Move' : 'Copy'} PDF to Another Project
            </h2>
            <div className="space-y-2">
              {projects
                .filter(p => p.id !== projectId)
                .map(project => (
                  <button
                    key={project.id}
                    onClick={() => confirmMoveFile(project.id)}
                    className="w-full text-left p-3 rounded-lg hover:bg-navy-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span>{project.name}</span>
                      <span className="text-sm text-gray-400">
                        {project.files.length} PDFs
                      </span>
                    </div>
                  </button>
                ))}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowMoveModal(false);
                  setFileToMove(null);
                }}
                className="px-4 py-2 rounded-lg text-gray-400 hover:bg-navy-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat template */}
      <AnimatePresence>
        {showChatTemplate && selectedText && (
          <ChatTemplate
            selectedText={selectedText}
            pdfContent={pdfContent}
            isAnalyzing={isAnalyzing}
            onTemplateSelect={handleTemplateSelect}
          />
        )}
      </AnimatePresence>
    </div>
  );
}