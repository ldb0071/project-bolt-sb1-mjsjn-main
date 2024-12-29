import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { animated, useSpring } from '@react-spring/web';
import { searchService, SearchResult, SearchFilters } from '../services/searchService';
import { useAnimations } from '../hooks/useAnimations';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface AdvancedSearchProps {
  onResultSelect: (result: SearchResult) => void;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onResultSelect }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    dateRange: undefined,
    sources: [],
    authors: [],
    topics: [],
    sortBy: 'relevance',
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const { fadeIn, createListTransition } = useAnimations();
  const resultsTransition = createListTransition(results);

  const filterAnimation = useSpring({
    height: showFilters ? 'auto' : 0,
    opacity: showFilters ? 1 : 0,
    config: { tension: 280, friction: 60 },
  });

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await searchService.search(debouncedQuery, filters);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, filters]);

  useEffect(() => {
    const getSuggestions = async () => {
      const suggestions = await searchService.getSuggestions(query);
      setSuggestions(suggestions);
    };

    if (query.trim()) {
      getSuggestions();
    }
  }, [query]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search papers, articles, and more..."
          className="search-input"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="filter-toggle"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {suggestions.length > 0 && query && (
        <animated.div style={fadeIn} className="suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => setQuery(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </animated.div>
      )}

      <animated.div style={filterAnimation} className="filters-panel">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Date Range</label>
            <div className="date-range">
              <DatePicker
                selected={filters.dateRange?.start}
                onChange={(date) =>
                  handleFilterChange('dateRange', {
                    ...filters.dateRange,
                    start: date,
                  })
                }
                placeholderText="Start Date"
              />
              <DatePicker
                selected={filters.dateRange?.end}
                onChange={(date) =>
                  handleFilterChange('dateRange', {
                    ...filters.dateRange,
                    end: date,
                  })
                }
                placeholderText="End Date"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="sort-select"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date</option>
              <option value="citations">Citations</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sources</label>
            <div className="tags-input">
              <input
                type="text"
                placeholder="Add source..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    if (input.value.trim()) {
                      handleFilterChange('sources', [
                        ...(filters.sources || []),
                        input.value.trim(),
                      ]);
                      input.value = '';
                    }
                  }
                }}
              />
              <div className="tags">
                {filters.sources?.map((source, index) => (
                  <span key={index} className="tag">
                    {source}
                    <button
                      onClick={() =>
                        handleFilterChange(
                          'sources',
                          filters.sources?.filter((_, i) => i !== index)
                        )
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </animated.div>

      {isLoading ? (
        <div className="loading-indicator">
          <div className="spinner" />
          <span>Searching...</span>
        </div>
      ) : (
        results.length > 0 && (
          <animated.div style={fadeIn} className="results-container">
            {resultsTransition((style, result) => (
              <animated.div
                style={style}
                className="result-card"
                onClick={() => onResultSelect(result)}
              >
                <h3>{result.title}</h3>
                <p className="authors">
                  {result.authors.join(', ')}
                </p>
                <p className="abstract">{result.abstract}</p>
                <div className="result-meta">
                  <span className="source">{result.source}</span>
                  <span className="citations">
                    Citations: {result.citations}
                  </span>
                  <span className="date">
                    {new Date(result.publishedDate).toLocaleDateString()}
                  </span>
                  <span className="score">
                    Relevance: {Math.round(result.score * 100)}%
                  </span>
                </div>
                {result.highlights && (
                  <div className="highlights">
                    {result.highlights.map((highlight, index) => (
                      <div key={index} className="highlight">
                        <span className="field">{highlight.field}:</span>
                        {highlight.matches.map((match, i) => (
                          <span key={i} className="match">
                            {match.value}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </animated.div>
            ))}
          </animated.div>
        )
      )}
    </div>
  );
};
