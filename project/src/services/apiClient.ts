/**
 * API Client Module
 * 
 * This module provides a configured Axios instance for making HTTP requests to the backend.
 * It handles:
 * - Base URL configuration
 * - Request/response interceptors
 * - Error handling
 * - File upload/download
 * - PDF operations
 * - Search functionality
 * 
 * @module apiClient
 */

import axios from 'axios';
import { toast } from 'react-hot-toast';

// Add API base URL configuration
export const API_BASE = 'http://localhost:8080/api';
const GITHUB_TOKEN = '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';

/**
 * Configured Axios instance with default settings and interceptors
 */
export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000, // 5 minutes
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);

    if (error.response) {
      // Server responded with error status
      if (error.response.status === 413) {
        return Promise.reject(new Error('File is too large. Maximum size allowed is 100MB.'));
      }
      const message = error.response.data?.detail || error.response.data?.message || 'Server error occurred';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      return Promise.reject(new Error('Unable to connect to server. Please check if the backend is running.'));
    } else {
      // Error in request configuration
      console.error('Request error:', error.message);
      return Promise.reject(new Error('Error preparing request. Please try again.'));
    }
  }
);

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Interface for ArXiv paper data
 */
export interface ArxivPaper {
  id: string;
  title: string;
  authors: string[];
  summary: string;
  published: string;
  updated: string;
  pdfUrl: string;
  categories: string[];
}

/**
 * Interface for ArXiv search response
 */
export interface ArxivSearchResponse {
  papers: ArxivPaper[];
  total_results: number;
}

/**
 * Interface for file upload response
 */
export interface UploadResponse {
  filename: string;
  path: string;
}

interface DeleteResponse {
  message: string;
}

interface SearchResults {
  results: any[];
}

// Add current directory response type
interface CurrentDirResponse {
  path: string;
}

// Update arxiv search function
export const arxivSearch = async (
  query: string,
  maxResults: number = 10
): Promise<ArxivSearchResponse> => {
  console.log('Making arxiv search request:', { query, maxResults });
  
  try {
    const { data } = await apiClient.get<ArxivSearchResponse>('arxiv/search', {
      params: {
        query,
        max_results: maxResults
      }
    });
    console.log('Arxiv search response:', data);
    return data;
  } catch (error) {
    console.error('Arxiv search error:', error);
    throw error;
  }
};

// Project management functions
export const deleteProject = async (projectName: string): Promise<void> => {
  if (!projectName) {
    throw new Error('Project name is required');
  }
  await apiClient.delete<DeleteResponse>(`project/${encodeURIComponent(projectName)}`);
};

// Add function to get PDF file URL
export const getPDFFileUrl = (projectName: string, fileType: 'uploaded' | 'downloaded', fileName: string): string => {
  if (!projectName || !fileName) {
    throw new Error('Project name and file name are required');
  }
  // Sanitize project name to match backend
  const safeProjectName = projectName.replace(/[\s/\\]/g, '_');
  // Ensure the fileName ends with .pdf and handle spaces correctly
  const pdfFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  // Replace colons with spaces and ensure proper encoding
  const sanitizedFileName = pdfFileName.replace(/:/g, ' ');
  return `/api/projects/${encodeURIComponent(safeProjectName)}/${fileType}/${encodeURIComponent(sanitizedFileName)}`;
};

// Update upload function to use the new URL format
export const uploadPDF = async (file: File, projectId: string, projectName: string): Promise<UploadResponse> => {
  if (!projectName) {
    throw new Error('Project name is required');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('project_id', projectId);
  formData.append('project_name', projectName);

  try {
    const { data } = await apiClient.post<UploadResponse>(
      'pdf/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    // Update the path to use the correct format
    return {
      ...data,
      path: `/api/projects/${projectName}/uploaded/${data.filename}`
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// PDF management functions
export const deletePDF = async (projectName: string, fileType: 'uploaded' | 'downloaded', fileName: string): Promise<void> => {
  if (!projectName) {
    throw new Error('Project name is required');
  }
  await apiClient.delete<DeleteResponse>(`pdf/${encodeURIComponent(projectName)}/${fileType}/${encodeURIComponent(fileName)}`);
};

// PDF search function
export const searchPDFContent = async (projectName: string, fileType: 'uploaded' | 'downloaded', query: string, maxResults: number = 10): Promise<any[]> => {
  if (!projectName) {
    throw new Error('Project name is required');
  }
  const { data } = await apiClient.get<SearchResults>(`pdf/${encodeURIComponent(projectName)}/${fileType}/search`, {
    params: {
      query,
      n_results: maxResults
    }
  });
  return data.results;
};

// Note management functions
export const deleteNote = async (noteId: string): Promise<void> => {
  try {
    await apiClient.delete(`notes/${noteId}`);
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

// Text explanation function
export const explainText = async (text: string): Promise<string> => {
  try {
    const { data } = await apiClient.post<{ explanation: string }>('explain', { text });
    return data.explanation;
  } catch (error) {
    console.error('Error getting explanation:', error);
    throw error;
  }
};

export interface SearchParams {
  query: string;
  scholarPages?: number;
  minYear?: number;
  dwnDir?: string;
  scihubMirror?: string;
  maxDwnYear?: number;
  maxDwnCites?: number;
  skipWords?: string;
  cites?: string;
  doi?: string;
  doiFile?: string;
  journalFilter?: string;
  restrict?: number;
  annasArchiveMirror?: string;
  scholarResults?: number;
  proxy?: string;
  singleProxy?: string;
  seleniumChromeVersion?: number;
  useDoiAsFilename?: boolean;
}

export interface SearchResponse {
  success: boolean;
  output: string;
  downloadPath: string;
}

export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get<{status: string}>('health');
    return response.data.status === 'healthy';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}

export interface PaperBotSearchParams {
  query: string;
  scholarPages: number;
  minYear: number;
  maxDwnYear?: number;
  maxDwnCites?: number;
  minCites?: number;
  skipWords?: string;
  journalFilter?: string;
  scihubMirror?: string;
  restrict?: number;
  scholarResults?: number;
  useDoiAsFilename?: boolean;
  proxy?: string;
  singleProxy?: string;
  seleniumChromeVersion?: number;
}

export interface SearchResult {
  success: boolean;
  output: string;
  downloadPath: string;
  papers?: Paper[];
}

export interface Paper {
  title: string;
  authors: string[];
  url: string;
  year: number;
  citations: number;
}

export const searchPapers = async (params: PaperBotSearchParams): Promise<SearchResult> => {
  try {
    const response = await apiClient.post<SearchResult>('search', {
      query: params.query,
      scholar_pages: params.scholarPages,
      min_year: params.minYear,
      max_dwn_year: params.maxDwnYear,
      max_dwn_cites: params.maxDwnCites,
      skip_words: params.skipWords,
      journal_filter: params.journalFilter,
      scihub_mirror: params.scihubMirror || 'https://sci-hub.do',
      restrict: params.restrict,
      scholar_results: params.scholarResults,
      use_doi_as_filename: params.useDoiAsFilename,
      proxy: params.proxy,
      single_proxy: params.singleProxy,
      selenium_chrome_version: params.seleniumChromeVersion
    });
    
    return response.data;
  } catch (error) {
    console.error('Paper search failed:', error);
    throw error;
  }
};

export interface DownloadPaperParams {
  url: string;
  title: string;
  projectPath: string;
}

export interface DownloadResult {
  success: boolean;
  filePath: string;
  message?: string;
}

export const downloadPaper = async (params: DownloadPaperParams): Promise<DownloadResult> => {
  try {
    const response = await apiClient.post<DownloadResult>('download', {
      url: params.url,
      title: params.title,
      project_path: params.projectPath
    });
    
    return response.data;
  } catch (error) {
    console.error('Paper download failed:', error);
    throw error;
  }
};

export interface PyPaperBotSearchParams {
  query: string;
  scholarPages?: number;
  minDate?: number;
  scholarResults?: number;
  restrict?: number;
  seleniumChromeVersion?: number;
  cites?: string;
  skipWords?: string;
}

export interface PyPaperBotPaper {
  title: string;
  authors: string;
  year: number;
  cites_num: number;
  journal?: string;
  pdf_link?: string;
  scholar_link?: string;
  doi?: string;
  DOI?: string;
}

export interface PyPaperBotSearchResult {
  success: boolean;
  papers: PyPaperBotPaper[];
  message?: string;
}

export interface PyPaperBotDownloadParams {
  papers: PyPaperBotPaper[];
  dwnl_dir: string;
  num_limit?: number;
  SciHub_URL?: string;
  SciDB_URL?: string;
}

export interface PyPaperBotDownloadResult {
  success: boolean;
  downloadedPapers: string[];
  failedPapers: string[];
  message?: string;
}

export const searchPyPaperBot = async (params: PyPaperBotSearchParams): Promise<PyPaperBotSearchResult> => {
  try {
    const response = await apiClient.post<PyPaperBotSearchResult>('pypaperbot/search', {
      query: params.query,
      scholarPages: params.scholarPages || 1,
      minDate: params.minDate || new Date().getFullYear() - 5,
      scholarResults: params.scholarResults || 10,
      restrict: params.restrict,
      seleniumChromeVersion: params.seleniumChromeVersion,
      cites: params.cites,
      skipWords: params.skipWords
    });
    
    return response.data;
  } catch (error) {
    console.error('PyPaperBot search failed:', error);
    throw error;
  }
};

export const PROJECT_ROOT = 'C:/Users/Octane/Desktop/project-bolt-sb1-mjsjn-main/project/projects';

export const downloadPyPaperBot = async (params: PyPaperBotDownloadParams): Promise<PyPaperBotDownloadResult> => {
  try {
    console.log('Making download request with params:', params);
    // Construct the full download path
    const fullPath = `${PROJECT_ROOT}/${params.dwnl_dir}/downloaded`;
    console.log('Using download path:', fullPath);

    const { data } = await apiClient.post<PyPaperBotDownloadResult>('pypaperbot/download', {
      papers: params.papers,
      dwnl_dir: fullPath.replace(/\\/g, '/'),  // Ensure forward slashes
      SciHub_URL: params.SciHub_URL
    });

    console.log('Download response:', data);

    // Update file paths in the response to use the correct format for the project interface
    if (data.success && data.downloadedPapers) {
      data.downloadedPapers = data.downloadedPapers.map(filename => {
        // Create a safe filename from the paper title
        const paper = params.papers.find(p => filename.includes(p.title.substring(0, 20)));
        if (paper) {
          const safeTitle = paper.title
            .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
            .replace(/\s+/g, '_') // Replace spaces with underscores
            .substring(0, 100); // Limit length
          // Return the path in the format that matches the project interface
          return `/api/projects/${params.dwnl_dir}/downloaded/${safeTitle}.pdf`;
        }
        return filename;
      });
    }

    return data;
  } catch (error) {
    console.error('PyPaperBot download error:', error);
    throw error;
  }
};

// Update current directory function
export const getCurrentDir = async (): Promise<CurrentDirResponse> => {
  const response = await apiClient.get<CurrentDirResponse>('current-dir');
  return response.data;
};

interface MarkdownConversionResponse {
  content: string[];
  total_pages: number;
  base_path: string;
}

export const convertPDFToMarkdown = async (
  projectName: string,
  fileType: 'uploaded' | 'downloaded',
  fileName: string
): Promise<{ content: string[], totalPages: number, basePath: string }> => {
  try {
    const response = await apiClient.post<MarkdownConversionResponse>(
      `/pdf/convert-to-markdown/${projectName}/${fileType}/${fileName}`,
      {},
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );
    return {
      content: response.data.content,
      totalPages: response.data.total_pages,
      basePath: response.data.base_path,
    };
  } catch (error) {
    console.error('Error converting PDF to Markdown:', error);
    throw error;
  }
};

export interface ConvertAllPDFsResponse {
  message: string;
  converted: number;
  total: number;
}

export const convertAllProjectPDFs = async (projectName: string): Promise<ConvertAllPDFsResponse> => {
  try {
    const response = await apiClient.post<ConvertAllPDFsResponse>(
      `/project/${projectName}/convert-all-pdfs`
    );
    return response.data;
  } catch (error) {
    console.error('Error converting all PDFs:', error);
    throw error;
  }
};

// RAG Chat types and functions
interface RAGStats {
  total_documents: number;
  sources: string[];
}

interface RAGChatResponse {
  response: string;
}

export const processProjectMarkdown = async (projectName: string): Promise<{ message: string; stats: RAGStats }> => {
  try {
    const response = await apiClient.post<{ message: string; stats: RAGStats }>(
      `/rag/${encodeURIComponent(projectName)}/process`
    );
    return response.data;
  } catch (error) {
    console.error('Error processing markdown:', error);
    throw error;
  }
};

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  model: string;
}

interface Source {
  source: string;
  section: string;
  preview: string;
  page?: number;
}

interface ChatResponse {
  answer: string;
  sources: Array<{
    source: string;
    section: string;
    preview: string;
    page?: number;
  }>;
}

interface VisualizationData {
  points: Array<{ x: number; y: number; id: number }>;
  labels: Array<{
    id: number;
    source: string;
    preview: string;
    metadata: Record<string, any>;
  }>;
  error?: string;
}

interface GraphData {
  nodes: Array<{
    id: string;
    label: string;
    type: string;
    color?: string;
  }>;
  links: Array<{
    source: string;
    target: string;
    relationship: string;
  }>;
}

export const getKnowledgeGraphVisualization = async (projectName: string): Promise<GraphData> => {
  try {
    const response = await apiClient.get<GraphData>(
      `/rag/${projectName}/graph`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const ragChat = async (
  projectName: string,
  query: string,
  history: { role: string; content: string }[] | null = null,
  model: string = "gpt-4o"
): Promise<{
  answer: string;
  sources?: Array<{
    source: string;
    section: string;
    preview: string;
    page?: number;
  }>;
  graph_info?: {
    concepts: number;
    related_nodes: number;
  };
}> => {
  const maxRetries = 3;
  let retryCount = 0;
  let lastError: Error | null = null;

  while (retryCount < maxRetries) {
    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GITHUB_TOKEN}`
        },
        body: JSON.stringify({
          project_name: projectName,
          query,
          history,
          model: retryCount === 0 ? model : 'gpt-4o',
          use_graph: model === 'graph-rag' && retryCount === 0,
          format: 'latex' // Request LaTeX formatted response
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
        throw new Error(`HTTP error! status: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.answer) {
        throw new Error('Invalid response format from server');
      }

      // Convert any plain text equations to LaTeX format
      data.answer = convertToLatex(data.answer);

      return data;
    } catch (error) {
      console.error(`Attempt ${retryCount + 1} failed:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (!(lastError.message.includes('500') || lastError.message.includes('Internal Server Error'))) {
        throw lastError;
      }
      
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, retryCount), 5000)));
    }
  }

  throw lastError || new Error('Failed to get response after multiple retries');
};

// Helper function to convert text to LaTeX format
const convertToLatex = (text: string): string => {
  // Convert inline math expressions
  text = text.replace(/\$([^$]+)\$/g, (_, math) => {
    return `\\(${math.trim()}\\)`;
  });

  // Convert block math expressions
  text = text.replace(/\$\$([^$]+)\$\$/g, (_, math) => {
    return `\\[${math.trim()}\\]`;
  });

  // Convert common mathematical expressions to LaTeX
  const mathReplacements: [RegExp, string][] = [
    [/(\d+)\^(\d+)/g, '$1^{$2}'],  // Convert powers
    [/sqrt\(([^)]+)\)/g, '\\sqrt{$1}'],  // Convert square roots
    [/->|→/g, '\\rightarrow'],  // Convert arrows
    [/>=|≥/g, '\\geq'],  // Convert greater than or equal
    [/<=|≤/g, '\\leq'],  // Convert less than or equal
    [/!=|≠/g, '\\neq'],  // Convert not equal
    [/inf|∞/g, '\\infty'],  // Convert infinity
    [/pi|π/g, '\\pi'],  // Convert pi
    [/theta|θ/g, '\\theta'],  // Convert theta
    [/alpha|α/g, '\\alpha'],  // Convert alpha
    [/beta|β/g, '\\beta'],  // Convert beta
    [/gamma|γ/g, '\\gamma'],  // Convert gamma
    [/delta|δ/g, '\\delta'],  // Convert delta
    [/epsilon|ε/g, '\\epsilon'],  // Convert epsilon
    [/sum/g, '\\sum'],  // Convert sum
    [/prod/g, '\\prod'],  // Convert product
    [/int/g, '\\int'],  // Convert integral
  ];

  mathReplacements.forEach(([pattern, replacement]) => {
    text = text.replace(pattern, replacement);
  });

  return text;
};

export const getRagStats = async (projectName: string): Promise<RAGStats> => {
  try {
    const response = await apiClient.get<RAGStats>(
      `/rag/${encodeURIComponent(projectName)}/stats`
    );
    return response.data;
  } catch (error) {
    console.error('Error getting RAG stats:', error);
    throw error;
  }
};

export const getEmbeddingsVisualization = async (projectName: string): Promise<VisualizationData> => {
  try {
    const response = await apiClient.get<VisualizationData>(
      `/rag/${projectName}/visualize`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const handleApiError = (error: unknown) => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = error.response as { status: number; data: unknown };
    throw new Error(
      `API Error: ${response.status} - ${JSON.stringify(response.data)}`
    );
  }
  throw error;
};

export const downloadProjectAsZip = async (projectName: string): Promise<void> => {
  try {
    const response = await apiClient.get(`projects/${encodeURIComponent(projectName)}/download-zip`, {
      responseType: 'blob'
    });
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${projectName}_files.zip`);
    
    // Append to body, click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading project files:', error);
    throw error;
  }
};

