import React, { useState } from 'react';
import { Search, Download, X } from 'lucide-react';
import { searchPapers } from '../services/apiClient';
import { toast } from 'react-hot-toast';

interface Paper {
  title: string;
  authors: string[];
  url: string;
  year: number;
  citations: number;
}

export const PaperBotSearch: React.FC = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Paper[]>([]);
  const [selectedPapers, setSelectedPapers] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    query: '',
    scholarPages: 1,
    minYear: 2000,
    maxDwnYear: undefined as number | undefined,
    maxDwnCites: undefined as number | undefined,
    skipWords: '',
    journalFilter: '',
    scihubMirror: 'https://sci-hub.do',
    restrict: 0,
    scholarResults: 10,
    useDoiAsFilename: false,
    proxy: '',
    singleProxy: '',
    seleniumChromeVersion: undefined as number | undefined,
  });

  const handleSearch = async () => {
    if (!formData.query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsSearching(true);
    setSearchResults([]);

    try {
      const result = await searchPapers(formData);
      const papers = parsePapersFromOutput(result.output);
      setSearchResults(papers);
      toast.success(`Found ${papers.length} papers`);
    } catch (error) {
      toast.error('Search failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSearching(false);
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedPapers.size === 0) {
      toast.error('Please select papers to download');
      return;
    }

    // Implement download logic here
    toast.success(`Downloading ${selectedPapers.size} papers...`);
  };

  const togglePaperSelection = (title: string) => {
    const newSelected = new Set(selectedPapers);
    if (newSelected.has(title)) {
      newSelected.delete(title);
    } else {
      newSelected.add(title);
    }
    setSelectedPapers(newSelected);
  };

  return (
    <div className="space-y-6 p-6 bg-navy-900 rounded-lg">
      {/* Advanced Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Basic Search */}
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-300">Search Query</label>
          <input
            type="text"
            value={formData.query}
            onChange={(e) => setFormData(prev => ({ ...prev, query: e.target.value }))}
            className="w-full px-3 py-2 bg-navy-700 rounded-lg border border-navy-600 
              text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter search query"
          />
        </div>

        {/* Search Parameters */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Scholar Pages</label>
          <input
            type="number"
            value={formData.scholarPages}
            onChange={(e) => setFormData(prev => ({ ...prev, scholarPages: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 bg-navy-700 rounded-lg border border-navy-600 
              text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            min={1}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Minimum Year</label>
          <input
            type="number"
            value={formData.minYear}
            onChange={(e) => setFormData(prev => ({ ...prev, minYear: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 bg-navy-700 rounded-lg border border-navy-600 
              text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Add more form fields for other parameters... */}
        
        {/* Actions */}
        <div className="col-span-full flex justify-between items-center">
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 
              disabled:opacity-50 flex items-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>{isSearching ? 'Searching...' : 'Search Papers'}</span>
          </button>

          {searchResults.length > 0 && (
            <button
              onClick={handleDownloadSelected}
              disabled={selectedPapers.size === 0}
              className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 
                disabled:opacity-50 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Selected ({selectedPapers.size})</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Search Results</h3>
          <div className="space-y-4">
            {searchResults.map((paper, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 bg-navy-800 rounded-lg hover:bg-navy-700 
                  transition-colors border border-navy-600"
              >
                <input
                  type="checkbox"
                  checked={selectedPapers.has(paper.title)}
                  onChange={() => togglePaperSelection(paper.title)}
                  className="mt-1 rounded border-navy-600 text-primary-500 
                    focus:ring-primary-500"
                />
                <div className="flex-1">
                  <h4 className="text-gray-200 font-medium">{paper.title}</h4>
                  <p className="text-gray-400 text-sm">{paper.authors.join(', ')}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span>Year: {paper.year}</span>
                    <span>Citations: {paper.citations}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to parse papers from PyPaperBot output
function parsePapersFromOutput(output: string): Paper[] {
  // Implement parsing logic based on PyPaperBot output format
  // This is a placeholder implementation
  return [];
}
