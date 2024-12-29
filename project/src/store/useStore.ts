import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PDFFile {
  id: string;
  name: string;
  path: string;
  uploadedAt: Date;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  files: PDFFile[];
  createdAt: Date;
}

interface Store {
  projects: Project[];
  currentProjectId: string | null;
  isDarkMode: boolean;
  isScopusSearchModalOpen: boolean;
  pdfCache: Record<string, any>; // Cache for PDF documents
  currentPdfState: {
    fileId: string | null;
    pageNumber: number;
    scale: number;
    scrollPosition: { x: number; y: number };
    selectedText: string;
    searchQuery: string;
    searchResults: { pageNumber: number; position: { x: number; y: number } }[];
  };
  createProject: (name: string, description?: string) => void;
  deleteProject: (id: string) => void;
  getCurrentProject: () => Project | null;
  setCurrentProject: (id: string) => void;
  addFileToProject: (projectId: string, file: PDFFile) => void;
  removeFileFromProject: (projectId: string, fileId: string) => void;
  moveFileBetweenProjects: (sourceProjectId: string, targetProjectId: string, fileId: string) => void;
  copyFileBetweenProjects: (sourceProjectId: string, targetProjectId: string, fileId: string) => void;
  initializeDefaultProject: () => void;
  toggleDarkMode: () => void;
  openScopusSearchModal: () => void;
  closeScopusSearchModal: () => void;
  setPdfCache: (fileId: string, pdfDocument: any) => void;
  getPdfFromCache: (fileId: string) => any;
  setCurrentPdfState: (state: Partial<Store['currentPdfState']>) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  geminiKey: string;
  setGeminiKey: (key: string) => void;
}

const DEFAULT_PROJECT_ID = 'default-project';

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProjectId: null,
      isDarkMode: true,
      isScopusSearchModalOpen: false,
      pdfCache: {},
      currentPdfState: {
        fileId: null,
        pageNumber: 1,
        scale: 1,
        scrollPosition: { x: 0, y: 0 },
        selectedText: '',
        searchQuery: '',
        searchResults: [],
      },

      initializeDefaultProject: () => {
        const { projects } = get();
        if (projects.length === 0) {
          const defaultProject: Project = {
            id: crypto.randomUUID(),
            name: 'My First Project',
            description: 'Upload your PDFs here',
            files: [],
            createdAt: new Date(),
          };
          set((state) => ({
            projects: [defaultProject],
            currentProjectId: defaultProject.id,
          }));
        }
      },

      createProject: (name, description) => {
        const newProject: Project = {
          id: crypto.randomUUID(),
          name,
          description,
          files: [], // Initialize empty files array
          createdAt: new Date(),
        };
        set((state) => ({
          projects: [...state.projects, newProject],
          currentProjectId: newProject.id,
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
        }));
      },

      getCurrentProject: () => {
        const { projects, currentProjectId } = get();
        return projects.find((p) => p.id === currentProjectId) || null;
      },

      setCurrentProject: (id) => {
        set({ currentProjectId: id });
      },

      addFileToProject: (projectId, file) => {
        console.log('Adding file to project:', { projectId, file });
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  files: [...(project.files || []), file],
                }
              : project
          ),
        }));
      },

      removeFileFromProject: (projectId, fileId) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  files: project.files.filter((file) => file.id !== fileId),
                }
              : project
          ),
        }));
      },

      moveFileBetweenProjects: (sourceProjectId, targetProjectId, fileId) => {
        set((state) => {
          // Find the file in the source project
          const sourceProject = state.projects.find(p => p.id === sourceProjectId);
          const fileToMove = sourceProject?.files.find(f => f.id === fileId);

          if (!fileToMove) return state;

          // Remove file from source project
          const updatedProjects = state.projects.map((project) => {
            if (project.id === sourceProjectId) {
              return {
                ...project,
                files: project.files.filter((file) => file.id !== fileId),
              };
            }
            
            // Add file to target project
            if (project.id === targetProjectId) {
              return {
                ...project,
                files: [...project.files, fileToMove],
              };
            }
            
            return project;
          });

          return { projects: updatedProjects };
        });
      },

      copyFileBetweenProjects: (sourceProjectId, targetProjectId, fileId) => {
        set((state) => {
          // Find the file in the source project
          const sourceProject = state.projects.find(p => p.id === sourceProjectId);
          const fileToCopy = sourceProject?.files.find(f => f.id === fileId);

          if (!fileToCopy) return state;

          // Create a new file object with a new unique ID to avoid conflicts
          const copiedFile = {
            ...fileToCopy,
            id: crypto.randomUUID(), // Generate a new unique ID
            uploadedAt: new Date() // Update the upload date
          };

          // Add file to target project
          const updatedProjects = state.projects.map((project) => {
            if (project.id === targetProjectId) {
              return {
                ...project,
                files: [...project.files, copiedFile],
              };
            }
            
            return project;
          });

          return { projects: updatedProjects };
        });
      },

      toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
      },

      openScopusSearchModal: () => {
        set({ isScopusSearchModalOpen: true });
      },

      closeScopusSearchModal: () => {
        set({ isScopusSearchModalOpen: false });
      },

      setPdfCache: (fileId, pdfDocument) => {
        // Implement LRU cache with a size limit
        set((state) => {
          const cache = { ...state.pdfCache };
          const maxCacheSize = 5; // Maximum number of PDFs to cache
          
          if (Object.keys(cache).length >= maxCacheSize) {
            const oldestFileId = Object.keys(cache)[0];
            delete cache[oldestFileId];
          }
          
          return {
            pdfCache: {
              ...cache,
              [fileId]: pdfDocument,
            },
          };
        });
      },

      getPdfFromCache: (fileId) => {
        const { pdfCache } = get();
        return pdfCache[fileId] || null;
      },

      setCurrentPdfState: (newState) => {
        set((state) => ({
          currentPdfState: {
            ...state.currentPdfState,
            ...newState,
          },
        }));
      },

      apiKey: '',
      setApiKey: (key) => set({ apiKey: key }),

      geminiKey: 'AIzaSyB-lBxinyrKi9Jlx2m-AXfPwuDP4uVlYpU',
      setGeminiKey: (key) => set({ geminiKey: key }),
    }),
    {
      name: 'pdf-assistant-storage',
      partialize: (state) => ({
        ...state,
        pdfCache: {}, // Don't persist the PDF cache
      }),
    }
  )
);