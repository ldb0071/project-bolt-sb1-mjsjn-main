import React, { useState, useEffect } from 'react';
import { CodeSnippetExample } from '../components/CodeSnippetExample';
import { CreateSnippetModal } from '../components/CreateSnippetModal';
import { Search, Filter, Code, Sparkles, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { RepoVisualizer } from '../components/RepoVisualizer';

const categories = [
  { id: 'all', label: 'All Snippets' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'react', label: 'React' },
  { id: 'utils', label: 'Utilities' },
];

interface CodeSnippet {
  title: string;
  description: string;
  code: string;
  language: string;
  inputExample?: string;
  expectedOutput?: string;
  notes?: string;
  tags?: string[];
  author?: string;
  createdAt?: string;
}

const defaultSnippets: CodeSnippet[] = [
  {
    title: "React Custom Hook: useLocalStorage",
    description: "A React hook that provides a convenient way to persist state in localStorage with automatic JSON serialization and type safety.",
    language: "typescript",
    tags: ['React', 'TypeScript', 'Hooks', 'Storage'],
    author: "Alex Johnson",
    createdAt: "2024-01-17",
    code: `import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      const result = item ? JSON.parse(item) : initialValue;
      console.log(\`Read value from localStorage[\${key}]:\`, result);
      return result;
    } catch (error) {
      console.warn(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  };

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        console.log(\`Saved value to localStorage[\${key}]:\`, valueToStore);
      }
    } catch (error) {
      console.warn(\`Error setting localStorage key "\${key}":\`, error);
    }
  };

  console.log(\`Current value for \${key}:\`, storedValue);
  return [storedValue, setValue] as const;
}`,
    inputExample: `interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: number;
}

function App() {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    'userPreferences',
    { theme: 'light', fontSize: 16 }
  );

  // Log current preferences
  console.log('Current preferences:', preferences);

  return (
    <button onClick={() => setPreferences(prev => {
      const newPrefs = {
        ...prev,
        theme: prev.theme === 'light' ? 'dark' : 'light'
      };
      console.log('Updating preferences to:', newPrefs);
      return newPrefs;
    })}>
      Toggle Theme
    </button>
  );
}`,
    expectedOutput: `// Initial load
Read value from localStorage["userPreferences"]: null
Current value for userPreferences: { theme: "light", fontSize: 16 }
Current preferences: { theme: "light", fontSize: 16 }

// After clicking button
Updating preferences to: { theme: "dark", fontSize: 16 }
Saved value to localStorage["userPreferences"]: { theme: "dark", fontSize: 16 }
Current value for userPreferences: { theme: "dark", fontSize: 16 }
Current preferences: { theme: "dark", fontSize: 16 }`,
    notes: "This hook provides a type-safe way to persist state in localStorage. It handles JSON serialization/deserialization automatically and provides the same API as useState. The hook also includes error handling for cases where localStorage is not available or throws errors. Added console logs for better visibility of the hook's behavior."
  },
  {
    title: "Python Decorator for API Rate Limiting",
    description: "A decorator that implements rate limiting for API endpoints using Redis as a backend store.",
    language: "python",
    tags: ['Python', 'API', 'Redis', 'Decorators'],
    author: "Sarah Chen",
    createdAt: "2024-01-18",
    code: `import time
import functools
from redis import Redis
from typing import Callable, Optional

def rate_limit(
    limit: int,
    period: int = 3600,
    redis_client: Optional[Redis] = None
) -> Callable:
    """
    Rate limit decorator that uses Redis for tracking requests.
    
    Args:
        limit (int): Maximum number of requests allowed within the period
        period (int): Time period in seconds (default: 1 hour)
        redis_client (Redis, optional): Redis client instance
    """
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            if not redis_client:
                print(f"Warning: Redis client not provided, skipping rate limiting")
                return func(*args, **kwargs)
            
            # Generate a unique key for the function and caller
            key = f"rate_limit:{func.__name__}:{_get_caller_id()}"
            print(f"Checking rate limit for key: {key}")
            
            # Get the current request count
            current = redis_client.get(key)
            if not current:
                print(f"First request for {key}, initializing counter")
                redis_client.setex(key, period, 1)
                result = func(*args, **kwargs)
                print(f"Request processed successfully")
                return result
            
            current = int(current)
            print(f"Current request count: {current}/{limit}")
            
            if current >= limit:
                remaining_time = redis_client.ttl(key)
                error_msg = f"Rate limit exceeded. Maximum {limit} requests per {period} seconds. Reset in {remaining_time} seconds."
                print(f"Error: {error_msg}")
                raise Exception(error_msg)
            
            # Increment the counter
            redis_client.incr(key)
            print(f"Incremented request count to {current + 1}")
            
            result = func(*args, **kwargs)
            print(f"Request processed successfully")
            return result
        return wrapper
    return decorator

def _get_caller_id() -> str:
    """Get a unique identifier for the API caller (e.g., IP address)"""
    # Implementation depends on your web framework
    return "user_ip_or_api_key"`,
    inputExample: `# Example usage with FastAPI
from fastapi import FastAPI
from redis import Redis

app = FastAPI()
redis_client = Redis(host='localhost', port=6379)

@app.get("/api/data")
@rate_limit(limit=100, period=3600, redis_client=redis_client)
async def get_data():
    print("Processing request to /api/data")
    result = {"message": "Success"}
    print(f"Returning response: {result}")
    return result`,
    expectedOutput: `# First request:
Checking rate limit for key: rate_limit:get_data:user_ip_or_api_key
First request for rate_limit:get_data:user_ip_or_api_key, initializing counter
Processing request to /api/data
Returning response: {"message": "Success"}
Request processed successfully

# Second request:
Checking rate limit for key: rate_limit:get_data:user_ip_or_api_key
Current request count: 1/100
Incremented request count to 2
Processing request to /api/data
Returning response: {"message": "Success"}
Request processed successfully

# After exceeding limit:
Checking rate limit for key: rate_limit:get_data:user_ip_or_api_key
Current request count: 100/100
Error: Rate limit exceeded. Maximum 100 requests per 3600 seconds. Reset in 2458 seconds.`,
    notes: "This decorator is useful for protecting API endpoints from abuse. It uses Redis to track request counts across multiple server instances. Added detailed logging to track rate limit checks, request counts, and execution flow."
  },
  {
    title: "JavaScript Debounce Function",
    description: "A utility function that prevents a function from being called too frequently by delaying its execution until after a period of inactivity.",
    language: "javascript",
    tags: ['JavaScript', 'Performance', 'Utility'],
    author: "Michael Brown",
    createdAt: "2024-01-19",
    code: `function debounce(func, wait = 300, immediate = false) {
  let timeout;
  console.log(\`Creating debounced function with wait: \${wait}ms, immediate: \${immediate}\`);
  
  return function executedFunction(...args) {
    const context = this;
    console.log(\`Debounced function called with args:\`, args);
    
    const later = function() {
      timeout = null;
      if (!immediate) {
        console.log('Executing debounced function after delay');
        func.apply(context, args);
      }
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) {
      console.log('Clearing existing timeout');
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
    console.log(\`Set new timeout for \${wait}ms\`);
    
    if (callNow) {
      console.log('Executing immediately due to immediate flag');
      func.apply(context, args);
    }
  };
}`,
    inputExample: `// Example: Debouncing a search input
const searchInput = document.querySelector('#search');

const searchAPI = async (query) => {
  console.log(\`Calling search API with query: "\${query}"\`);
  const response = await fetch(\`/api/search?q=\${query}\`);
  const results = await response.json();
  console.log('Search results:', results);
  updateResults(results);
};

// Create debounced version of the search
const debouncedSearch = debounce(searchAPI, 500);
console.log('Created debounced search function');

// Add event listener
searchInput.addEventListener('input', (e) => {
  console.log(\`Input changed: "\${e.target.value}"\`);
  debouncedSearch(e.target.value);
});`,
    expectedOutput: `// Creating the debounced function
Creating debounced function with wait: 500ms, immediate: false
Created debounced search function

// User types "hello" quickly
Input changed: "h"
Debounced function called with args: ["h"]
Set new timeout for 500ms

Input changed: "he"
Debounced function called with args: ["he"]
Clearing existing timeout
Set new timeout for 500ms

Input changed: "hel"
Debounced function called with args: ["hel"]
Clearing existing timeout
Set new timeout for 500ms

Input changed: "hell"
Debounced function called with args: ["hell"]
Clearing existing timeout
Set new timeout for 500ms

Input changed: "hello"
Debounced function called with args: ["hello"]
Clearing existing timeout
Set new timeout for 500ms

// After 500ms of inactivity
Executing debounced function after delay
Calling search API with query: "hello"
Search results: [...]`,
    notes: "Debouncing is particularly useful for optimizing performance in scenarios like search inputs, window resize handlers, or any event that can fire rapidly. Added console logs to demonstrate the debouncing behavior, showing how multiple rapid calls are collapsed into a single execution."
  },
  {
    title: "Go Concurrent Web Scraper",
    description: "A concurrent web scraper in Go that uses goroutines and channels to efficiently scrape multiple URLs in parallel.",
    language: "go",
    tags: ['Go', 'Concurrency', 'Web Scraping'],
    author: "David Kim",
    createdAt: "2024-01-20",
    code: `package main

import (
	"fmt"
	"io"
	"net/http"
	"sync"
	"time"
)

type ScrapedData struct {
	URL      string
	Content  string
	Error    error
	Duration time.Duration
}

func scrapeURL(url string) ScrapedData {
	fmt.Printf("Starting to scrape URL: %s\\n", url)
	start := time.Now()
	
	resp, err := http.Get(url)
	if err != nil {
		fmt.Printf("Error fetching %s: %v\\n", url, err)
		return ScrapedData{URL: url, Error: err, Duration: time.Since(start)}
	}
	defer resp.Body.Close()
	
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response from %s: %v\\n", url, err)
		return ScrapedData{URL: url, Error: err, Duration: time.Since(start)}
	}
	
	duration := time.Since(start)
	fmt.Printf("Successfully scraped %s in %v\\n", url, duration)
	
	return ScrapedData{
		URL:      url,
		Content:  string(body),
		Duration: duration,
	}
}

func scrapeURLsConcurrently(urls []string, maxConcurrent int) []ScrapedData {
	fmt.Printf("Starting concurrent scraping of %d URLs with max %d concurrent requests\\n", 
		len(urls), maxConcurrent)
	
	results := make([]ScrapedData, 0, len(urls))
	resultsChan := make(chan ScrapedData, len(urls))
	
	// Use a semaphore to limit concurrent goroutines
	sem := make(chan struct{}, maxConcurrent)
	var wg sync.WaitGroup
	
	for _, url := range urls {
		wg.Add(1)
		go func(url string) {
			defer wg.Done()
			
			// Acquire semaphore
			fmt.Printf("Waiting for available slot to scrape %s\\n", url)
			sem <- struct{}{}
			defer func() { 
				<-sem
				fmt.Printf("Released slot for %s\\n", url)
			}()
			
			fmt.Printf("Starting goroutine for %s\\n", url)
			result := scrapeURL(url)
			resultsChan <- result
		}(url)
	}
	
	// Close results channel when all goroutines complete
	go func() {
		fmt.Println("Waiting for all goroutines to complete...")
		wg.Wait()
		close(resultsChan)
		fmt.Println("All goroutines completed")
	}()
	
	// Collect results
	fmt.Println("Collecting results...")
	for result := range resultsChan {
		results = append(results, result)
	}
	
	fmt.Printf("Scraping completed. Processed %d URLs\\n", len(results))
	return results
}`,
    inputExample: `func main() {
	urls := []string{
		"https://example.com",
		"https://example.org",
		"https://example.net",
	}
	
	fmt.Printf("Starting scraper with URLs: %v\\n", urls)
	results := scrapeURLsConcurrently(urls, 2)
	
	for _, result := range results {
		if result.Error != nil {
			fmt.Printf("Error scraping %s: %v\\n", result.URL, result.Error)
			continue
		}
		fmt.Printf("Successfully scraped %s:\\n- Duration: %v\\n- Content length: %d bytes\\n", 
			result.URL, result.Duration, len(result.Content))
	}
}`,
    expectedOutput: `Starting scraper with URLs: [https://example.com https://example.org https://example.net]
Starting concurrent scraping of 3 URLs with max 2 concurrent requests
Waiting for available slot to scrape https://example.com
Starting goroutine for https://example.com
Waiting for available slot to scrape https://example.org
Starting goroutine for https://example.org
Waiting for available slot to scrape https://example.net
Starting to scrape URL: https://example.com
Starting to scrape URL: https://example.org
Successfully scraped https://example.com in 234.567ms
Released slot for https://example.com
Starting goroutine for https://example.net
Starting to scrape URL: https://example.net
Successfully scraped https://example.org in 345.678ms
Released slot for https://example.org
Successfully scraped https://example.net in 456.789ms
Released slot for https://example.net
Waiting for all goroutines to complete...
All goroutines completed
Collecting results...
Scraping completed. Processed 3 URLs

Successfully scraped https://example.com:
- Duration: 234.567ms
- Content length: 1234 bytes
Successfully scraped https://example.org:
- Duration: 345.678ms
- Content length: 2345 bytes
Successfully scraped https://example.net:
- Duration: 456.789ms
- Content length: 3456 bytes`,
    notes: "This implementation uses Go's concurrency primitives (goroutines and channels) to scrape multiple URLs in parallel. Added detailed logging to show the concurrent execution flow, including goroutine management, semaphore usage, and timing information."
  }
];

export function CodeSnippetsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [showRepoVisualizer, setShowRepoVisualizer] = useState(false);
  const [snippets, setSnippets] = useState<CodeSnippet[]>(() => {
    const savedSnippets = localStorage.getItem('codeSnippets');
    return savedSnippets ? JSON.parse(savedSnippets) : defaultSnippets;
  });

  useEffect(() => {
    localStorage.setItem('codeSnippets', JSON.stringify(snippets));
  }, [snippets]);

  const handleCreateSnippet = (newSnippet: CodeSnippet) => {
    setSnippets([newSnippet, ...snippets]);
    setIsCreateModalOpen(false);
  };

  const handleDeleteSnippet = (index: number) => {
    setSnippets(snippets.filter((_, i) => i !== index));
  };

  const handleUpdateSnippet = (index: number, updatedSnippet: CodeSnippet) => {
    setSnippets(snippets.map((snippet, i) => i === index ? updatedSnippet : snippet));
  };

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = searchTerm.toLowerCase().split(' ').every(term =>
      snippet.title.toLowerCase().includes(term) ||
      snippet.description.toLowerCase().includes(term) ||
      snippet.tags?.some(tag => tag.toLowerCase().includes(term))
    );

    const matchesCategory = selectedCategory === 'all' || 
      snippet.tags?.includes(selectedCategory) ||
      snippet.language.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Header Section */}
      <div className="bg-navy-800/50 border-b border-navy-700 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-6">
            {/* Title and Description */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-500/10 rounded-lg">
                    <Code className="w-6 h-6 text-primary-400" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                    Code Snippets
                  </h1>
                </div>
                <p className="text-gray-400 mt-2 max-w-2xl">
                  A curated collection of reusable code snippets with examples and explanations. 
                  Each snippet is designed to solve common programming challenges.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRepoVisualizer(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-navy-800/50 text-gray-400 rounded-lg cursor-pointer hover:bg-navy-700/50 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>View Repo</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500/10 text-primary-400 rounded-lg cursor-pointer hover:bg-primary-500/20 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>New Snippet</span>
                </motion.button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search snippets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-navy-900/50 border border-navy-600 rounded-lg 
                    text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    transition-colors"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-navy-900/50 border border-navy-600 rounded-lg">
                  <Filter className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-navy-600 scrollbar-track-transparent">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                        selectedCategory === category.id
                          ? 'bg-primary-500 text-white'
                          : 'bg-navy-900/50 border border-navy-600 text-gray-400 hover:text-white hover:border-navy-500'
                      }`}
                    >
                      {category.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredSnippets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No snippets found. Create a new one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr gap-6">
            {filteredSnippets.map((snippet, index) => (
              <CodeSnippetExample
                key={index}
                snippet={snippet}
                onDelete={() => handleDeleteSnippet(index)}
                onUpdate={(updatedSnippet: CodeSnippet) => handleUpdateSnippet(index, updatedSnippet)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Snippet Modal */}
      <CreateSnippetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateSnippet}
      />

      {/* Repository Visualizer Modal */}
      {showRepoVisualizer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-navy-800 rounded-xl border border-navy-700 w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-navy-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Github className="w-5 h-5 text-primary-400" />
                <h2 className="text-lg font-semibold text-white">Repository Visualization</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowRepoVisualizer(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-navy-700/50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
            <div className="p-4">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="Enter GitHub repository URL (e.g., https://github.com/githubocto/repo-visualizer)"
                  className="flex-1 px-4 py-2 bg-navy-900/50 border border-navy-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              {repoUrl && <RepoVisualizer repoUrl={repoUrl} width={800} height={600} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 