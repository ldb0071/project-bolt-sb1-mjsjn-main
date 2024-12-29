import { apiClient, getPDFFileUrl } from './apiClient';
import axios from 'axios';
import { format } from 'date-fns';

export interface ArxivPaper {
  id: string;
  title: string;
  authors: string[];
  summary: string;
  published: string;
  updated: string;
  doi?: string;
  citations?: number | null;
  citationCount?: number;
  pdfUrl: string;
  categories: string[];
}

export interface ArxivSearchResponse {
  papers: ArxivPaper[];
  total_results: number;
}

export interface ArxivSearchParams {
  query: string;
  source?: string;
  maxResults?: number;
  includeCitations?: boolean;
  dateRange?: {
    startDate: Date | null;
    endDate: Date | null;
  };
}

export const searchArxiv = async (params: ArxivSearchParams): Promise<ArxivSearchResponse> => {
  try {
    const { 
      query, 
      source = 'All', 
      maxResults = 100, 
      includeCitations = false,
      dateRange 
    } = params;
    
    let searchQuery = query;

    if (dateRange?.startDate && dateRange?.endDate) {
      const startDateStr = format(dateRange.startDate, 'yyyy-MM-dd');
      const endDateStr = format(dateRange.endDate, 'yyyy-MM-dd');
      searchQuery += ` AND submittedDate:[${startDateStr} TO ${endDateStr}]`;
    }

    console.log('Searching arXiv for:', { 
      query: searchQuery, 
      source,
      maxResults,
      includeCitations 
    });
    
    const { data } = await apiClient.get<ArxivSearchResponse>('arxiv/search', {
      params: {
        query: searchQuery,
        source,
        max_results: maxResults,
        include_citations: includeCitations
      }
    });

    // Ensure we always return an array of papers
    const papers = data.papers || [];
    const total_results = data.total_results || papers.length;

    console.log('ArXiv search completed:', { papers, total_results });
    return { papers, total_results };
  } catch (error) {
    console.error('Error searching arXiv:', error);
    // Return empty results on error
    return { papers: [], total_results: 0 };
  }
};

export const downloadArxivPaper = async (
  pdfUrl: string,
  title: string,
  projectId: string,
  projectName: string
): Promise<{ filename: string; path: string }> => {
  try {
    if (!projectName) {
      throw new Error('Project name is required');
    }
    
    console.log('Downloading arXiv paper:', { pdfUrl, title, projectId, projectName });
    
    // Create a safe filename from the title
    const safeTitle = title
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .substring(0, 100); // Limit length
    
    // Create form data
    const formData = new FormData();
    formData.append('url', pdfUrl);
    formData.append('filename', `${safeTitle}.pdf`);
    formData.append('project_id', projectId);
    formData.append('project_name', projectName);
    
    // Use the download endpoint without duplicate /api prefix
    const { data } = await apiClient.post<{ filename: string; path: string }>(
      'pdf/download',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    // Create a safe project name for the folder
    const safeProjectName = projectName.replace(/[\s/\\]/g, '_');
    
    // Update the path to use the correct format
    const result = {
      ...data,
      path: `/api/projects/${encodeURIComponent(safeProjectName)}/downloaded/${encodeURIComponent(data.filename)}`
    };
    
    console.log('Paper downloaded successfully:', result);
    return result;
  } catch (error) {
    console.error('Error downloading arXiv paper:', error);
    throw error;
  }
};


