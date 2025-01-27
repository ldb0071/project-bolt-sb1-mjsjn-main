import React, { useState } from 'react';
import { TrendingAISection } from '../components/TrendingAISection';
import { Bot, Send, Cpu } from 'lucide-react';
import { sendChatMessage, ModelId, AVAILABLE_MODELS } from '../services/chatService';
import { useStore } from '../store/useStore';
import { toast } from 'react-hot-toast';

interface Domain {
  id: number;
  name: string;
  url: string;
  type: 'dev.to' | 'medium' | 'arxiv' | 'custom';
  tag?: string;
  category?: string;
  maxResults?: number;
}

// Add Medium URL handling functions
const convertMediumUrlToRssFeed = (url: string): string => {
  try {
    const mediumUrl = new URL(url);
    const pathParts = mediumUrl.pathname.split('/').filter(Boolean);
    
    // Handle user-based URLs - if there's an @ in the first path part, use that username
    if (pathParts[0]?.startsWith('@')) {
      const username = pathParts[0];
      // If it's a direct article URL, still use the author's feed
      return `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://medium.com/feed/' + username)}`;
    }
    
    // Handle publication URLs with @username format articles
    if (pathParts.some(part => part.startsWith('@'))) {
      const username = pathParts.find(part => part.startsWith('@'));
      return `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://medium.com/feed/' + username)}`;
    }
    
    // Handle tag-based URLs
    if (pathParts[0] === 'tag' && pathParts[1]) {
      const tag = pathParts[1];
      return `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://medium.com/feed/tag/' + tag)}`;
    }
    
    // Handle publication URLs
    if (pathParts[0] && !pathParts[0].startsWith('@')) {
      const publication = pathParts[0];
      return `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://medium.com/feed/' + publication)}`;
    }
    
    throw new Error('Invalid Medium URL format');
  } catch (error) {
    throw new Error('Could not parse Medium URL');
  }
};

const cleanJsonString = (str: string): string => {
  // Remove any markdown code block markers
  str = str.replace(/```json\n?|\n?```/g, '');
  
  // Remove any leading/trailing whitespace
  str = str.trim();
  
  // Try to find array or object
  const firstChar = str.charAt(0);
  const lastChar = str.charAt(str.length - 1);
  
  if (firstChar === '[' && lastChar === ']') {
    // It's already an array
    return str;
  } else if (firstChar === '{' && lastChar === '}') {
    // It's already an object
    return str;
  } else {
    // Try to find array markers or object markers
    const arrayStart = str.indexOf('[');
    const arrayEnd = str.lastIndexOf(']');
    const objectStart = str.indexOf('{');
    const objectEnd = str.lastIndexOf('}');
    
    if (arrayStart !== -1 && arrayEnd !== -1) {
      return str.slice(arrayStart, arrayEnd + 1);
    } else if (objectStart !== -1 && objectEnd !== -1) {
      return str.slice(objectStart, objectEnd + 1);
    }
    
    // If we find multiple objects but no array, try to wrap them in an array
    const objects = str.match(/{[^}]+}/g);
    if (objects && objects.length > 1) {
      return `[${objects.join(',')}]`;
    }
  }
  
  return str;
};

const DOMAIN_PROMPT = `Create domain configurations for AI content sources. Follow this exact format:

[
  {
    "name": "Medium - Machine Learning",
    "type": "medium",
    "url": "https://medium.com/tag/machine-learning",
    "tag": "machine-learning",
    "category": "Machine Learning",
    "maxResults": 30
  },
  {
    "name": "Dev.to - Machine Learning",
    "type": "dev.to",
    "url": "https://dev.to/api/articles",
    "tag": "machinelearning",
    "category": "Machine Learning",
    "maxResults": 30
  },
  {
    "name": "arXiv - Machine Learning",
    "type": "arxiv",
    "url": "https://export.arxiv.org/api/query",
    "category": "cs.LG",
    "maxResults": 30
  }
]

Notes:
- For Medium: Use tag-based URLs like "https://medium.com/tag/machine-learning"
- For Dev.to: Always use "https://dev.to/api/articles" and tags without hyphens
- For arXiv: Always use "https://export.arxiv.org/api/query" and categories like cs.LG, cs.AI, cs.CV

Respond with only the JSON array.`;

const formatDevToUrl = (url: string, tag: string): string => {
  // Always use the base URL and add the tag as a parameter
  return `https://dev.to/api/articles?tag=${encodeURIComponent(tag)}`;
};

const formatArxivUrl = (url: string, category?: string, keywords?: string): string => {
  const baseUrl = 'https://export.arxiv.org/api/query';
  const params = new URLSearchParams();
  
  if (category) {
    params.append('search_query', `cat:${category}`);
  } else if (keywords) {
    params.append('search_query', `all:${keywords}`);
  }
  
  params.append('sortBy', 'lastUpdatedDate');
  params.append('sortOrder', 'descending');
  
  return `${baseUrl}?${params.toString()}`;
};

export function TrendingAIPage() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [currentModel, setCurrentModel] = useState<ModelId>('gemini-1.5-flash');
  const [domains, setDomains] = useState<Domain[]>(() => {
    const savedDomains = localStorage.getItem('aiTrendingDomains');
    return savedDomains ? JSON.parse(savedDomains) : [];
  });
  const geminiKey = useStore((state) => state.geminiKey);
  const githubToken = useStore((state) => state.githubToken);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const modelConfig = AVAILABLE_MODELS[currentModel];
    if (!modelConfig) {
      toast.error('Invalid model selected');
      return;
    }

    if (modelConfig.type === 'gpt4' && !githubToken) {
      toast.error('Please add your GitHub token in settings first');
      return;
    } else if (modelConfig.type === 'gemini' && !geminiKey) {
      toast.error('Please add your Gemini API key in settings first');
      return;
    }

    setIsLoading(true);
    try {
      const response = await sendChatMessage(
        [
          { 
            id: '1', 
            role: 'user', 
            content: `${DOMAIN_PROMPT}\n\nUser request: ${input}\n\nRemember to respond ONLY with the JSON object(s), no additional text or formatting.` 
          }
        ],
        geminiKey,
        'default',
        currentModel,
        githubToken
      );

      // Clean and parse the response
      try {
        const cleanedResponse = cleanJsonString(response.content);
        console.log('Cleaned response:', cleanedResponse);
        
        // Try parsing as array first, then fall back to single object
        let domainConfigs: any;
        try {
          domainConfigs = JSON.parse(cleanedResponse);
          if (!Array.isArray(domainConfigs)) {
            domainConfigs = [domainConfigs];
          }
        } catch (error) {
          throw new Error('Invalid JSON format');
        }

        const newDomains: Domain[] = [];
        const maxId = Math.max(...domains.map(d => d.id), 0);

        for (let i = 0; i < domainConfigs.length; i++) {
          const domainConfig = domainConfigs[i];
          
          // Validate the domain config
          if (!domainConfig.name || !domainConfig.type || !domainConfig.url) {
            throw new Error(`Domain ${i + 1}: Missing required fields: name, type, or url`);
          }

          if (!['dev.to', 'medium', 'arxiv', 'custom'].includes(domainConfig.type)) {
            throw new Error(`Domain ${i + 1}: Invalid domain type`);
          }

          if (domainConfig.maxResults && (domainConfig.maxResults < 5 || domainConfig.maxResults > 50)) {
            throw new Error(`Domain ${i + 1}: MaxResults must be between 5 and 50`);
          }

          // Format URLs based on domain type
          try {
            switch (domainConfig.type) {
              case 'medium':
                domainConfig.url = convertMediumUrlToRssFeed(domainConfig.url);
                break;
              case 'dev.to':
                if (!domainConfig.tag) {
                  throw new Error(`Domain ${i + 1}: Tag is required for Dev.to domains`);
                }
                domainConfig.url = formatDevToUrl(domainConfig.url, domainConfig.tag);
                break;
              case 'arxiv':
                if (!domainConfig.category && !domainConfig.tag) {
                  throw new Error(`Domain ${i + 1}: Category or keywords are required for arXiv domains`);
                }
                domainConfig.url = formatArxivUrl(domainConfig.url, domainConfig.category, domainConfig.tag);
                break;
            }
          } catch (error) {
            throw new Error(`Domain ${i + 1}: Invalid URL format for ${domainConfig.type}. ${error.message}`);
          }

          // Add the new domain with a unique ID
          newDomains.push({
            ...domainConfig,
            id: maxId + i + 1,
            maxResults: domainConfig.maxResults || 30
          });
        }
        
        const updatedDomains = [...domains, ...newDomains];
        setDomains(updatedDomains);
        localStorage.setItem('aiTrendingDomains', JSON.stringify(updatedDomains));
        
        toast.success(`Added ${newDomains.length} domain${newDomains.length > 1 ? 's' : ''} successfully`);
      } catch (error) {
        console.error('Error parsing domain config:', error);
        toast.error(error instanceof Error ? error.message : 'Could not parse domain configuration');
      }
    } catch (error) {
      console.error('Error generating domain config:', error);
      toast.error('Failed to generate domain configuration');
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleRemoveDomain = (domainId: number) => {
    const updatedDomains = domains.filter(d => d.id !== domainId);
    setDomains(updatedDomains);
    localStorage.setItem('aiTrendingDomains', JSON.stringify(updatedDomains));
    toast.success('Domain removed successfully');
  };

  const handleUpdateMaxResults = (domainId: number, value: number) => {
    if (value >= 5 && value <= 50) {
      const updatedDomains = domains.map(d => 
        d.id === domainId ? { ...d, maxResults: value } : d
      );
      setDomains(updatedDomains);
      localStorage.setItem('aiTrendingDomains', JSON.stringify(updatedDomains));
    } else {
      toast.error('Max results must be between 5 and 50');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">AI Trending</h1>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e1b4b]/40 hover:bg-[#312e81]/40
            text-white border border-[#312e81]/40 transition-all duration-200"
        >
          <Bot className="h-5 w-5 text-white" />
          <span className="text-sm">Add Domain Source</span>
        </button>
      </div>

      {/* Expandable Search Panel */}
      <div className={`mb-6 transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
        <div className="bg-[#1e1b4b]/40 backdrop-blur-sm rounded-lg border border-[#312e81]/40 p-4">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-white" />
                <span className="text-sm text-white">Domain Assistant</span>
              </div>
              
              {/* Model Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowModelSelector(!showModelSelector)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg 
                    bg-[#1e1b4b]/40 hover:bg-[#312e81]/40 text-white
                    transition-all duration-200 border border-[#312e81]/40"
                >
                  <Cpu className="h-4 w-4" />
                  <span className="text-sm">{AVAILABLE_MODELS[currentModel].name}</span>
                </button>

                {showModelSelector && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#1e1b4b]/95 backdrop-blur-sm rounded-lg 
                    shadow-lg border border-[#312e81]/40 z-50">
                    {Object.entries(AVAILABLE_MODELS).map(([modelId, config]) => (
                      <button
                        key={modelId}
                        type="button"
                        onClick={() => {
                          setCurrentModel(modelId as ModelId);
                          setShowModelSelector(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-[#312e81]/40 transition-colors
                          ${currentModel === modelId ? 'bg-[#312e81]/40' : ''}`}
                      >
                        <div className="text-white">{config.name}</div>
                        <div className="text-xs text-gray-400">
                          {config.type === 'gpt4' ? 'Azure OpenAI' : 'Google Gemini'}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe a new domain or source to add..."
                disabled={isLoading || (!geminiKey && !githubToken)}
                className="w-full px-4 py-3 rounded-lg bg-[#0f172a]/60 border border-[#312e81]/40 
                  text-white placeholder-gray-400
                  focus:outline-none focus:ring-1 focus:ring-[#312e81]
                  disabled:bg-[#0f172a]/40 disabled:text-gray-500 disabled:placeholder-gray-600
                  transition-all duration-200"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading || (!geminiKey && !githubToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5
                  text-gray-400 hover:text-white
                  disabled:text-gray-600 disabled:hover:text-gray-600
                  transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Examples */}
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-2">Examples:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInput("Add a Medium source for AI research papers with tag 'artificial-intelligence'")}
                  className="text-left text-xs px-3 py-2 rounded-lg bg-[#1e1b4b]/40 hover:bg-[#312e81]/40 
                    text-white border border-[#312e81]/40 transition-colors"
                >
                  Add a Medium source for AI research papers
                </button>
                <button
                  type="button"
                  onClick={() => setInput("Create an arXiv source for computer vision papers in category cs.CV")}
                  className="text-left text-xs px-3 py-2 rounded-lg bg-[#1e1b4b]/40 hover:bg-[#312e81]/40 
                    text-white border border-[#312e81]/40 transition-colors"
                >
                  Create an arXiv source for computer vision papers
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <TrendingAISection
        initialDomains={domains}
        onRemoveDomain={handleRemoveDomain}
        onUpdateMaxResults={handleUpdateMaxResults}
      />
    </div>
  );
}
