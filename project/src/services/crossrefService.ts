import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';
const CROSSREF_PROXY_URL = `${API_BASE_URL}/crossref/works`;
const EMAIL = 'your-email@domain.com'; // Replace with your email for better API service

interface CrossrefResponse {
  status: string;
  'message-type': string;
  'message-version': string;
  message: {
    'is-referenced-by-count'?: number;
    items?: Array<{
      'is-referenced-by-count': number;
      DOI: string;
      title: string[];
    }>;
  };
}

interface BatchSearchResult {
  doi: string | null;
  citationCount: number;
}

export const getCitationCount = async (doi: string): Promise<number> => {
  try {
    // Remove any URL encoding from the DOI
    const cleanDoi = decodeURIComponent(doi);
    const response = await axios.get<CrossrefResponse>(`${CROSSREF_PROXY_URL}/doi/${cleanDoi}`);
    return response.data.message['is-referenced-by-count'] || 0;
  } catch (error) {
    console.error('Error fetching citation count:', error);
    return 0;
  }
};

export const searchByTitle = async (title: string): Promise<string | null> => {
  try {
    const response = await axios.get<CrossrefResponse>(`${CROSSREF_PROXY_URL}/search`, {
      params: {
        query: title,
        rows: 1,
        select: 'DOI,title'
      }
    });

    const items = response.data.message.items;
    if (items && items.length > 0) {
      return items[0].DOI;
    }
    return null;
  } catch (error) {
    console.error('Error searching by title:', error);
    return null;
  }
};

export const searchByTitleBatch = async (titles: string[]): Promise<BatchSearchResult[]> => {
  try {
    const response = await axios.post<BatchSearchResult[]>(`${CROSSREF_PROXY_URL}/batch`, {
      titles,
      select: 'DOI,title,is-referenced-by-count'
    });
    return response.data;
  } catch (error) {
    console.error('Error in batch search:', error);
    return titles.map(() => ({ doi: null, citationCount: 0 }));
  }
};
