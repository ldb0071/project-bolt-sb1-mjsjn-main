import axios, { AxiosResponse, AxiosError } from "axios";
import { apiClient } from './apiClient';

export { apiClient };

const API_BASE_URL = "http://localhost:8080";

export interface UploadResponse {
  filename: string;
  path: string;
  project_id: string;
}

export interface PDFFile {
  id: string;
  name: string;
  path: string;
  uploadedAt: Date;
  project_id: string;
}

function handleApiError(error: AxiosError) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Error Response:', error.response.data);
    throw new Error(error.response.data.detail || 'An error occurred during the request');
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API Request Error:', error.request);
    throw new Error('No response received from server');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('API Setup Error:', error.message);
    throw new Error('Failed to make request');
  }
}

export const uploadPDF = async (file: File, projectId: string): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('project_id', projectId);

  try {
    const response = await axios.post<UploadResponse>(`${API_BASE_URL}/api/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Ensure the path is correctly formatted
    if (response.data.path && !response.data.path.startsWith('/')) {
      response.data.path = `/${response.data.path}`;
    }

    return response.data;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw new Error('Failed to upload PDF');
  }
};

export const deletePDF = async (projectId: string, filename: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/api/delete/${projectId}/${encodeURIComponent(filename)}`);
  } catch (error) {
    console.error('Error deleting PDF:', error);
    throw new Error('Failed to delete PDF');
  }
};

export const getPDF = async (projectId: string, filename: string): Promise<Blob> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/pdf/${projectId}/${encodeURIComponent(filename)}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error getting PDF:', error);
    throw new Error('Failed to get PDF');
  }
};

export const getProject = async (projectId: string) => {
  try {
    const response: AxiosResponse<any> = await axios.get(`${API_BASE_URL}/api/projects/${projectId}`);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
    throw error;
  }
};

export const createProject = async (name: string) => {
  try {
    const response: AxiosResponse<any> = await axios.post(`${API_BASE_URL}/api/projects`, { name });
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
    throw error;
  }
};

export const getProjects = async () => {
  try {
    const response: AxiosResponse<any> = await axios.get(`${API_BASE_URL}/api/projects`);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
    throw error;
  }
};

export const searchVideos = async (query: string, category: string = 'AI', maxResults: number = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/youtube/search`, {
      params: {
        query,
        category,
        max_results: maxResults
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching videos:', error);
    throw error;
  }
};

export const getTrendingVideos = async (category: string = 'AI') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/youtube/trending`, {
      params: { category }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    throw error;
  }
};

export const getChannelVideos = async (channelId: string, maxResults: number = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/youtube/channels/${channelId}/videos`, {
      params: { max_results: maxResults }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    throw error;
  }
};
