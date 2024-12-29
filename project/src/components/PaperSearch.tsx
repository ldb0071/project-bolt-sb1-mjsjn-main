import React, { useState, useCallback } from 'react';
import { checkHealth, searchPapers } from '../services/apiClient';
import { toast } from '../services/toast';

export const PaperSearch: React.FC = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [scholarPages, setScholarPages] = useState(1);
  const [minYear, setMinYear] = useState(2000);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsSearching(true);

    try {
      // Check API health first
      const isHealthy = await checkHealth();
      if (!isHealthy) {
        toast.error('Backend service is not available');
        return;
      }

      // Perform search
      const result = await searchPapers({
        query,
        scholarPages,
        minYear
      });

      toast.success('Search completed successfully');
      console.log('Download path:', result.downloadPath);

    } catch (error) {
      toast.error('Search failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSearching(false);
    }
  }, [query, scholarPages, minYear]);

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Search Query
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="Enter your search query"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm font-medium text-gray-700">
          Scholar Pages
          <input
            type="number"
            value={scholarPages}
            onChange={(e) => setScholarPages(Math.max(1, parseInt(e.target.value)))}
            min={1}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Minimum Year
          <input
            type="number"
            value={minYear}
            onChange={(e) => setMinYear(Math.max(1900, parseInt(e.target.value)))}
            min={1900}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </label>
      </div>

      <button
        onClick={handleSearch}
        disabled={isSearching}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isSearching ? 'Searching...' : 'Search Papers'}
      </button>
    </div>
  );
};
