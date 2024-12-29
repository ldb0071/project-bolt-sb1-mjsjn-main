import React, { useState, useEffect, useRef } from 'react';
import { animated } from '@react-spring/web';
import { useAnimations } from '../hooks/useAnimations';
import debounce from 'lodash/debounce';

interface SearchResult {
  id: string;
  title: string;
  abstract: string;
  score: number;
}

interface SearchProps {
  onSearch: (query: string, filters: any) => Promise<SearchResult[]>;
  onResultSelect: (result: SearchResult) => void;
}

export const EnhancedSearch: React.FC<SearchProps> = ({
  onSearch,
  onResultSelect,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({
    title: true,
    abstract: true,
    semantic: false,
  });

  const { fadeIn, createListTransition } = useAnimations();
  const resultsTransition = createListTransition(results);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (searchQuery: string, filters: any) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await onSearch(searchQuery, filters);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        // Handle error appropriately
      } finally {
        setIsLoading(false);
      }
    }, 300)
  ).current;

  useEffect(() => {
    debouncedSearch(query, selectedFilters);
  }, [query, selectedFilters]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <animated.div
      ref={searchRef}
      style={{
        ...fadeIn,
        width: '100%',
        maxWidth: '600px',
        position: 'relative',
      }}
      className="search-container"
    >
      <div className="search-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search papers, articles, and more..."
          className="search-input"
        />
        {isLoading && (
          <div className="search-spinner">
            <div className="spinner" />
          </div>
        )}
      </div>

      <div className="search-filters">
        {Object.entries(selectedFilters).map(([filter, enabled]) => (
          <label key={filter} className="filter-checkbox">
            <input
              type="checkbox"
              checked={enabled}
              onChange={() =>
                setSelectedFilters((prev) => ({
                  ...prev,
                  [filter]: !prev[filter],
                }))
              }
            />
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </label>
        ))}
      </div>

      {results.length > 0 && (
        <animated.div
          style={fadeIn}
          className="search-results"
        >
          {resultsTransition((style, result) => (
            <animated.div
              style={style}
              className="search-result-item"
              onClick={() => onResultSelect(result)}
            >
              <h3>{result.title}</h3>
              <p>{result.abstract.substring(0, 150)}...</p>
              <div className="result-score">
                Relevance: {Math.round(result.score * 100)}%
              </div>
            </animated.div>
          ))}
        </animated.div>
      )}
    </animated.div>
  );
};
