/**
 * Global State Management Store
 * 
 * This module implements the application's global state management using Zustand.
 * It handles:
 * - Project management
 * - File organization
 * - PDF state
 * - Tool and role configurations
 * - Theme preferences
 * - API keys and authentication
 * 
 * @module useStore
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomRole, RoleConfig, AssistantRole, ROLE_CONFIGS } from '../services/chatService';
import { Tool, CustomTool, BUILT_IN_TOOLS } from '../services/toolService';

/**
 * Represents a PDF file in the system
 */
interface PDFFile {
  id: string;
  name: string;
  path: string;
  uploadedAt: Date;
}

/**
 * Represents a project containing PDF files
 */
interface Project {
  id: string;
  name: string;
  description?: string;
  files: PDFFile[];
  createdAt: Date;
}

type ModifiedBuiltInRoleType = {
  originalRole: AssistantRole;
  config: RoleConfig;
}

/**
 * Main store interface defining all state and actions
 */
interface Store {
  // State properties
  projects: Project[];
  currentProjectId: string | null;
  isDarkMode: boolean;
  isScopusSearchModalOpen: boolean;
  pdfCache: Record<string, any>;
  currentPdfState: {
    fileId: string | null;
    pageNumber: number;
    scale: number;
    scrollPosition: { x: number; y: number };
    selectedText: string;
    searchQuery: string;
    searchResults: { pageNumber: number; position: { x: number; y: number } }[];
  };

  // Project management actions
  createProject: (name: string, description?: string) => void;
  deleteProject: (id: string) => void;
  getCurrentProject: () => Project | null;
  setCurrentProject: (id: string) => void;
  initializeDefaultProject: () => void;
  
  // File management actions
  addFileToProject: (projectId: string, file: PDFFile) => void;
  removeFileFromProject: (projectId: string, fileId: string) => void;
  moveFileBetweenProjects: (sourceProjectId: string, targetProjectId: string, fileId: string) => void;
  copyFileBetweenProjects: (sourceProjectId: string, targetProjectId: string, fileId: string) => void;

  // Role management
  customRoles: CustomRole[];
  modifiedBuiltInRoles: ModifiedBuiltInRoleType[];
  addCustomRole: (role: CustomRole) => void;
  updateCustomRole: (id: string, role: Partial<CustomRole>) => void;
  deleteCustomRole: (id: string) => void;
  updateBuiltInRole: (role: AssistantRole, config: Partial<RoleConfig>) => void;
  resetBuiltInRole: (role: AssistantRole) => void;
  getBuiltInRoleConfig: (role: AssistantRole) => RoleConfig;

  // Tool management
  customTools: CustomTool[];
  modifiedBuiltInTools: Record<string, Tool>;
  toolApiKeys: Record<string, string>;
  addCustomTool: (tool: CustomTool) => void;
  updateCustomTool: (id: string, tool: Partial<CustomTool>) => void;
  deleteCustomTool: (id: string) => void;
  updateBuiltInTool: (id: string, config: Partial<Tool>) => void;
  resetBuiltInTool: (id: string) => void;
  setToolApiKey: (toolId: string, apiKey: string) => void;
  getToolApiKey: (toolId: string) => string;
  isToolEnabled: (toolId: string) => boolean;
  toggleTool: (toolId: string) => void;

  // API Keys
  apiKey: string;
  setApiKey: (key: string) => void;
  geminiKey: string;
  setGeminiKey: (key: string) => void;
  githubToken: string;
  setGithubToken: (token: string) => void;

  // Snippets management
  snippets: any[];
  setSnippets: (snippets: any[]) => void;

  // API Keys
  youtubeApiKey: string;
  setYoutubeApiKey: (key: string) => void;
  
  chatApiKey: string;
  setChatApiKey: (key: string) => void;
  
  azureOpenAIKey: string;
  setAzureOpenAIKey: (key: string) => void;
  
  azureOpenAIEndpoint: string;
  setAzureOpenAIEndpoint: (endpoint: string) => void;
  
  // Other state
  selectedRole: AssistantRole;
  setSelectedRole: (role: AssistantRole) => void;
  
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
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

      setPdfCache: (fileId: string, pdfDocument: unknown) => {
        set((state) => {
          const cache = { ...state.pdfCache };
          const maxCacheSize = 5;
          
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

      getPdfFromCache: (fileId: string) => {
        const { pdfCache } = get();
        return pdfCache[fileId] || null;
      },

      setCurrentPdfState: (newState: Partial<Store['currentPdfState']>) => {
        set((state) => ({
          currentPdfState: {
            ...state.currentPdfState,
            ...newState,
          },
        }));
      },

      apiKey: '',
      setApiKey: (key) => set({ apiKey: key }),

      geminiKey: 'AIzaSyBQfQ7sN-ASKnlFe8Zg50xsp6qmDdZoweU',
      setGeminiKey: (key) => set({ geminiKey: key }),

      githubToken: '',
      setGithubToken: (token) => set({ githubToken: token }),

      // Tool management
      customTools: [],
      modifiedBuiltInTools: {},
      toolApiKeys: {},

      // Tool management functions
      addCustomTool: (tool: CustomTool) => set((state) => ({
        customTools: [...state.customTools, tool]
      })),

      updateCustomTool: (id: string, tool: Partial<CustomTool>) => set((state) => ({
        customTools: state.customTools.map((t) => 
          t.id === id ? { ...t, ...tool } : t
        )
      })),

      deleteCustomTool: (id: string) => set((state) => ({
        customTools: state.customTools.filter((t) => t.id !== id)
      })),

      getCustomTool: (id: string) => get().customTools.find((t) => t.id === id),

      updateBuiltInTool: (id: string, config: Partial<Tool>) => set((state) => ({
        modifiedBuiltInTools: {
          ...state.modifiedBuiltInTools,
          [id]: {
            ...BUILT_IN_TOOLS[id],
            ...state.modifiedBuiltInTools[id],
            ...config
          }
        }
      })),

      resetBuiltInTool: (id: string) => set((state) => {
        const { [id]: _, ...rest } = state.modifiedBuiltInTools;
        return { modifiedBuiltInTools: rest };
      }),

      setToolApiKey: (toolId: string, apiKey: string) => set((state) => ({
        toolApiKeys: { ...state.toolApiKeys, [toolId]: apiKey }
      })),

      getToolApiKey: (toolId: string) => get().toolApiKeys[toolId] || '',

      isToolEnabled: (toolId: string) => {
        const state = get();
        const customTool = state.customTools.find(t => t.id === toolId);
        if (customTool) return customTool.isEnabled;
        
        const modifiedTool = state.modifiedBuiltInTools[toolId];
        if (modifiedTool) return modifiedTool.isEnabled;
        
        return BUILT_IN_TOOLS[toolId]?.isEnabled || false;
      },

      toggleTool: (toolId: string) => {
        const state = get();
        const isEnabled = !state.isToolEnabled(toolId);
        
        const customTool = state.customTools.find(t => t.id === toolId);
        if (customTool) {
          state.updateCustomTool(toolId, { isEnabled });
          return;
        }
        
        state.updateBuiltInTool(toolId, { isEnabled });
      },

      // Role management
      customRoles: [],
      modifiedBuiltInRoles: [],

      // Role management functions
      addCustomRole: (role: CustomRole) => set((state) => ({
        customRoles: [...state.customRoles, role]
      })),

      updateCustomRole: (id: string, role: Partial<CustomRole>) => set((state) => ({
        customRoles: state.customRoles.map((r) => 
          r.id === id ? { ...r, ...role } : r
        )
      })),

      deleteCustomRole: (id: string) => set((state) => ({
        customRoles: state.customRoles.filter((r) => r.id !== id)
      })),

      updateBuiltInRole: (role: AssistantRole, config: Partial<RoleConfig>) => set((state) => ({
        modifiedBuiltInRoles: [
          ...state.modifiedBuiltInRoles.filter(r => r.originalRole !== role),
          { originalRole: role, config: { ...ROLE_CONFIGS[role], ...config } }
        ]
      })),

      resetBuiltInRole: (role: AssistantRole) => set((state) => ({
        modifiedBuiltInRoles: state.modifiedBuiltInRoles.filter(r => r.originalRole !== role)
      })),

      getBuiltInRoleConfig: (role: AssistantRole) => {
        const { modifiedBuiltInRoles } = get();
        const modified = modifiedBuiltInRoles.find(r => r.originalRole === role);
        return modified ? modified.config : ROLE_CONFIGS[role];
      },

      // Snippets management
      snippets: [],
      setSnippets: (snippets) => set({ snippets }),

      // API Keys
      youtubeApiKey: '',
      setYoutubeApiKey: (key) => set({ youtubeApiKey: key }),
      
      chatApiKey: '',
      setChatApiKey: (key) => set({ chatApiKey: key }),
      
      azureOpenAIKey: '',
      setAzureOpenAIKey: (key) => set({ azureOpenAIKey: key }),
      
      azureOpenAIEndpoint: '',
      setAzureOpenAIEndpoint: (endpoint) => set({ azureOpenAIEndpoint: endpoint }),
      
      // Other state
      selectedRole: 'default',
      setSelectedRole: (role) => set({ selectedRole: role }),
      
      darkMode: true,
      setDarkMode: (darkMode) => set({ darkMode }),
    }),
    {
      name: 'pdf-assistant-storage',
      partialize: (state) => ({
        ...state,
        pdfCache: {},
        customRoles: state.customRoles,
        modifiedBuiltInRoles: state.modifiedBuiltInRoles,
        customTools: state.customTools,
        modifiedBuiltInTools: state.modifiedBuiltInTools,
        toolApiKeys: state.toolApiKeys,
        selectedRole: state.selectedRole,
        darkMode: state.darkMode,
      }),
    }
  )
);