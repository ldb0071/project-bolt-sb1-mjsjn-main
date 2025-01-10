/**
 * Search Service Module
 * 
 * This module provides search functionality across the application, including:
 * - Fuzzy text search using Fuse.js
 * - Search filters and sorting
 * - Result caching
 * - Search history tracking
 * - Analytics
 * 
 * @module searchService
 */

import Fuse from 'fuse.js';
import { apiClient } from './apiClient';

/**
 * Interface for search filter options
 */
export interface SearchFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  sources?: string[];
  authors?: string[];
  topics?: string[];
  citationCount?: {
    min?: number;
    max?: number;
  };
  sortBy?: 'relevance' | 'date' | 'citations';
  language?: string[];
}

/**
 * Interface for search result items
 */
export interface SearchResult {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  publishedDate: Date;
  source: string;
  citations: number;
  url: string;
  score: number;
  highlights?: {
    field: string;
    matches: { indices: number[][]; value: string }[];
  }[];
}

/**
 * Search service class providing search functionality
 */
class SearchService {
  private fuseInstance: Fuse<SearchResult> | null = null;
  private recentSearches: string[] = [];
  private searchHistory: { query: string; timestamp: Date }[] = [];
  private cachedResults: Map<string, { results: SearchResult[]; timestamp: Date }> = new Map();

  constructor() {
    this.loadRecentSearches();
  }

  /**
   * Load recent searches from local storage
   */
  private loadRecentSearches() {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      this.recentSearches = JSON.parse(saved);
    }
  }

  private saveRecentSearches() {
    localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
  }

  private addToRecentSearches(query: string) {
    this.recentSearches = [query, ...this.recentSearches.filter(q => q !== query)].slice(0, 10);
    this.saveRecentSearches();
  }

  private getCacheKey(query: string, filters: SearchFilters): string {
    return `${query}:${JSON.stringify(filters)}`;
  }

  private isCacheValid(timestamp: Date): boolean {
    const cacheDuration = 5 * 60 * 1000; // 5 minutes
    return Date.now() - timestamp.getTime() < cacheDirection;
  }

  async search(query: string, filters: SearchFilters = {}): Promise<SearchResult[]> {
    const cacheKey = this.getCacheKey(query, filters);
    const cached = this.cachedResults.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.results;
    }

    try {
      const response = await apiClient.post('/api/v1/search', {
        query,
        filters,
      });

      const results = this.processResults(response.data, query);
      
      this.cachedResults.set(cacheKey, {
        results,
        timestamp: new Date(),
      });

      this.addToRecentSearches(query);
      this.searchHistory.push({ query, timestamp: new Date() });

      return results;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  private processResults(results: SearchResult[], query: string): SearchResult[] {
    // Initialize Fuse for fuzzy searching
    this.fuseInstance = new Fuse(results, {
      keys: ['title', 'abstract', 'authors'],
      includeScore: true,
      includeMatches: true,
      threshold: 0.3,
    });

    return results.map(result => ({
      ...result,
      score: this.calculateRelevanceScore(result, query),
    }));
  }

  private calculateRelevanceScore(result: SearchResult, query: string): number {
    const weights = {
      titleMatch: 0.4,
      abstractMatch: 0.3,
      citationCount: 0.2,
      recency: 0.1,
    };

    const titleScore = this.fuseInstance?.search(query, { keys: ['title'] })[0]?.score ?? 1;
    const abstractScore = this.fuseInstance?.search(query, { keys: ['abstract'] })[0]?.score ?? 1;
    
    const maxCitations = 1000; // Normalize citation count
    const citationScore = Math.min(result.citations / maxCitations, 1);
    
    const daysSincePublication = (Date.now() - new Date(result.publishedDate).getTime()) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.exp(-daysSincePublication / 365); // Exponential decay over a year

    return (
      (1 - titleScore) * weights.titleMatch +
      (1 - abstractScore) * weights.abstractMatch +
      citationScore * weights.citationCount +
      recencyScore * weights.recency
    );
  }

  async getSuggestions(query: string): Promise<string[]> {
    if (!query) {
      return this.recentSearches;
    }

    try {
      const response = await apiClient.get('/api/v1/search/suggestions', {
        params: { query },
      });

      return response.data;
    } catch (error) {
      console.error('Suggestion error:', error);
      return [];
    }
  }

  async getRelatedQueries(query: string): Promise<string[]> {
    try {
      const response = await apiClient.get('/api/v1/search/related', {
        params: { query },
      });

      return response.data;
    } catch (error) {
      console.error('Related queries error:', error);
      return [];
    }
  }

  getSearchAnalytics() {
    const totalSearches = this.searchHistory.length;
    const searchesByDay = new Map<string, number>();
    
    this.searchHistory.forEach(({ timestamp }) => {
      const day = timestamp.toISOString().split('T')[0];
      searchesByDay.set(day, (searchesByDay.get(day) || 0) + 1);
    });

    return {
      totalSearches,
      searchesByDay: Object.fromEntries(searchesByDay),
      popularQueries: this.getPopularQueries(),
    };
  }

  private getPopularQueries(): { query: string; count: number }[] {
    const queryCounts = new Map<string, number>();
    
    this.searchHistory.forEach(({ query }) => {
      queryCounts.set(query, (queryCounts.get(query) || 0) + 1);
    });

    return Array.from(queryCounts.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}

export const searchService = new SearchService();
