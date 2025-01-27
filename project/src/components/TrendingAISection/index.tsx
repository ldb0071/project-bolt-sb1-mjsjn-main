import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Trash2, Plus, Settings, BookmarkIcon, Layout, Newspaper } from 'lucide-react';
import { ArticleCard } from '../ArticleCard';
import { ArticleViewer } from '../ArticleViewer';
import { VideoCard } from '../VideoCard';
import { VideoPlayer } from '../VideoPlayer';
import './styles.css';

interface Article {
  id: number;
  title: string;
  description: string;
  url: string;
  cover_image?: string;
  published_at: string;
  user?: {
    name: string;
  };
  domain: string;
  author?: string;
  name: string;
}

interface Domain {
  id: number;
  name: string;
  url: string;
  type: 'dev.to' | 'medium' | 'arxiv' | 'custom';
  tag?: string;
  category?: string;
  maxResults?: number;
}

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
  url: string;
}

interface Channel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

interface TrendingAISectionProps {
  initialDomains?: Domain[];
  onRemoveDomain?: (domainId: number) => void;
  onUpdateMaxResults?: (domainId: number, value: number) => void;
}

const API_BASE_URL = 'http://localhost:8080';

export function TrendingAISection({ 
  initialDomains,
  onRemoveDomain,
  onUpdateMaxResults 
}: TrendingAISectionProps) {
  const defaultMaxResults = 30;
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [favorites, setFavorites] = useState<Video[]>([]);
  const [favoriteChannels, setFavoriteChannels] = useState<Channel[]>([]);
  const [showArticleFavorites, setShowArticleFavorites] = useState(false);
  const [showDomainSettings, setShowDomainSettings] = useState(false);
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [videoSearchTerm, setVideoSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<Domain>({
    id: 1,
    name: 'AI Trends',
    url: 'https://dev.to/api/articles',
    type: 'dev.to',
    tag: 'ai',
    maxResults: 10
  });
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [favoriteArticles, setFavoriteArticles] = useState<Article[]>(() => {
    const savedFavorites = localStorage.getItem('aiTrendingFavoriteArticles');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [favoriteVideos, setFavoriteVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showFavoriteChannels, setShowFavoriteChannels] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isSearchingChannels, setIsSearchingChannels] = useState(false);
  const [page, setPage] = useState(1);
  const videosPerPage = 12;
  const [videoDomains, setVideoDomains] = useState<Domain[]>(() => {
    const savedDomains = localStorage.getItem('aiTrendingVideoDomains');
    return savedDomains ? JSON.parse(savedDomains) : [];
  });
  const [domains, setDomains] = useState<Domain[]>(() => {
    return initialDomains || [
      { id: 1, name: 'Dev.to - AI', url: 'https://dev.to/api/articles', type: 'dev.to', tag: 'ai', maxResults: defaultMaxResults },
      { id: 2, name: 'Dev.to - Computer Vision', url: 'https://dev.to/api/articles', type: 'dev.to', tag: 'computer-vision', maxResults: defaultMaxResults },
      { id: 3, name: 'Dev.to - LLMs', url: 'https://dev.to/api/articles', type: 'dev.to', tag: 'llm', maxResults: defaultMaxResults },
      { 
        id: 4, 
        name: 'Medium - AI', 
        url: 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/tag/artificial-intelligence', 
        type: 'medium',
        maxResults: defaultMaxResults
      },
      { 
        id: 5, 
        name: 'Medium - Computer Vision', 
        url: 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/tag/computer-vision', 
        type: 'medium',
        maxResults: defaultMaxResults
      },
      { 
        id: 6, 
        name: 'Medium - LLMs', 
        url: 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/tag/large-language-models', 
        type: 'medium',
        maxResults: defaultMaxResults
      },
      {
        id: 7,
        name: 'arXiv - Computer Vision',
        url: 'https://export.arxiv.org/api/query?search_query=cat:cs.CV&sortBy=lastUpdatedDate&sortOrder=descending',
        type: 'arxiv',
        category: 'cs.CV',
        maxResults: defaultMaxResults
      },
      {
        id: 8,
        name: 'arXiv - LLMs',
        url: 'https://export.arxiv.org/api/query?search_query=all:large+language+models&sortBy=lastUpdatedDate&sortOrder=descending',
        type: 'arxiv',
        maxResults: defaultMaxResults
      }
    ];
  });
  
  const [newDomainName, setNewDomainName] = useState('');
  const [newDomainType, setNewDomainType] = useState<Domain['type']>('dev.to');
  const [newDomainTag, setNewDomainTag] = useState('');
  const [showVideos, setShowVideos] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [channelSearchTerm, setChannelSearchTerm] = useState('');
  const [videoFavorites, setVideoFavorites] = useState<Video[]>(() => {
    const savedFavorites = localStorage.getItem('aiTrendingVideoFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    if (initialDomains) {
      setDomains(initialDomains);
      if (!initialDomains.find(d => d.id === selectedDomain.id) && initialDomains.length > 0) {
        setSelectedDomain(initialDomains[0]);
      }
    }
  }, [initialDomains]);

  useEffect(() => {
    localStorage.setItem('aiTrendingDomains', JSON.stringify(domains));
  }, [domains]);

  useEffect(() => {
    localStorage.setItem('aiTrendingVideoFavorites', JSON.stringify(videoFavorites));
  }, [videoFavorites]);

  useEffect(() => {
    localStorage.setItem('aiTrendingFavoriteArticles', JSON.stringify(favoriteArticles));
  }, [favoriteArticles]);

  const getUrlForNewDomain = (type: Domain['type'], tag: string): string => {
    switch(type) {
      case 'dev.to':
        return 'https://dev.to/api/articles';
      case 'medium':
        return `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/tag/${tag}`;
      case 'arxiv':
        return `https://export.arxiv.org/api/query?search_query=${tag}&sortBy=lastUpdatedDate&sortOrder=descending`;
      default:
        return '';
    }
  };

  const handleAddDomain = () => {
    if (!newDomainName || !newDomainType) {
      setError('Please provide domain name and type');
      return;
    }

    const url = getUrlForNewDomain(newDomainType, newDomainTag);
    
    const newDomain: Domain = {
      id: Math.max(...domains.map(d => d.id)) + 1,
      name: newDomainName,
      url,
      type: newDomainType,
      tag: newDomainTag,
      maxResults: defaultMaxResults
    };

    setDomains([...domains, newDomain]);
    setNewDomainName('');
    setNewDomainType('dev.to');
    setNewDomainTag('');
    setShowAddDomain(false);
  };

  const handleRemoveDomain = (domainId: number) => {
    if (onRemoveDomain) {
      onRemoveDomain(domainId);
    } else {
      setDomains(domains.filter(d => d.id !== domainId));
    }
    if (selectedDomain.id === domainId && domains.length > 1) {
      setSelectedDomain(domains[0]);
    }
  };

  const handleUpdateMaxResults = (domainId: number, value: number) => {
    if (onUpdateMaxResults) {
      onUpdateMaxResults(domainId, value);
    } else {
      setDomains(domains.map(d => 
        d.id === domainId ? { ...d, maxResults: value } : d
      ));
    }
  };

  const parseMediumArticle = (item: any): Article => {
    const description = item.description.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
    
    return {
      id: item.guid || Math.random(),
      title: item.title,
      description: description,
      url: item.link,
      cover_image: item.thumbnail,
      published_at: item.pubDate,
      author: item.author,
      domain: 'Medium',
      name: item.author || 'Unknown'
    };
  };

  const parseArxivArticle = (item: any): Article => {
    return {
      id: item.id || Math.random(),
      title: item.title[0],
      description: item.summary[0].substring(0, 200) + '...',
      url: item.link[0].$.href,
      published_at: item.published[0],
      author: item.author[0].name[0],
      domain: 'arXiv',
      name: item.author[0].name[0]
    };
  };

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      let response;
      let processedArticles: Article[] = [];
      const maxResults = selectedDomain.maxResults || defaultMaxResults;
      
      switch(selectedDomain.type) {
        case 'dev.to':
          response = await axios.get(selectedDomain.url, {
            params: {
              tag: selectedDomain.tag || 'ai',
              per_page: maxResults,
              state: 'rising'
            }
          });
          processedArticles = response.data.map((article: any) => ({
            id: article.id,
            title: article.title,
            description: article.description,
            url: article.url,
            cover_image: article.cover_image,
            published_at: article.published_at,
            user: article.user,
            domain: 'Dev.to'
          }));
          break;
          
        case 'medium':
          response = await axios.get(selectedDomain.url);
          if (response.data.status === 'ok') {
            processedArticles = response.data.items
              .filter((item: any) => item.title && item.link)
              .map(parseMediumArticle)
              .slice(0, maxResults);
          }
          break;

        case 'arxiv':
          const arxivUrl = `${selectedDomain.url}&max_results=${maxResults}`;
          response = await axios.get(arxivUrl);
          // Parse XML response
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(response.data, "text/xml");
          const entries = xmlDoc.getElementsByTagName('entry');
          
          processedArticles = Array.from(entries).map((entry: any) => ({
            id: entry.querySelector('id').textContent,
            title: entry.querySelector('title').textContent,
            description: entry.querySelector('summary').textContent.substring(0, 200) + '...',
            url: entry.querySelector('link').getAttribute('href'),
            published_at: entry.querySelector('published').textContent,
            author: entry.querySelector('author name').textContent,
            domain: 'arXiv'
          }));
          break;
          
        case 'custom':
          response = await axios.get(selectedDomain.url);
          processedArticles = response.data.slice(0, maxResults);
          break;
      }
      
      setArticles(processedArticles);
      setError(null);
    } catch (err) {
      setError('Failed to fetch AI trends. Please try again later.');
      console.error('Error fetching articles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVideos = useCallback(async (searchQuery: string = '', selectedDomains: Domain[] = []) => {
    try {
      setIsLoadingVideos(true);
      setError(null);

      const category = 'AI';
      const response = await axios.get(`${API_BASE_URL}/api/youtube/search`, {
        params: {
          query: searchQuery,
          category,
          max_results: 10
        }
      });

      const videos = response.data.videos.map((video: any) => ({
        ...video,
        url: `https://www.youtube.com/watch?v=${video.id}`
      }));

      setVideos(videos);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to fetch videos. Please try again later.');
    } finally {
      setIsLoadingVideos(false);
    }
  }, []);

  const searchChannels = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    try {
      setIsLoadingChannels(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/api/youtube/channels/search`, {
        params: {
          query,
          max_results: 5,
          category: 'AI'
        }
      });

      setChannels(response.data.channels);
    } catch (err) {
      console.error('Error searching channels:', err);
      setError('Failed to search channels. Please try again later.');
    } finally {
      setIsLoadingChannels(false);
    }
  }, []);

  const handleToggleVideoFavorite = useCallback((video: Video) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(fav => fav.id === video.id);
      if (isFavorite) {
        return prevFavorites.filter(fav => fav.id !== video.id);
      } else {
        return [...prevFavorites, video];
      }
    });
  }, []);

  const handleToggleChannelFavorite = useCallback((channel: Channel) => {
    setFavoriteChannels(prevFavorites => {
      const isFavorite = prevFavorites.some(fav => fav.id === channel.id);
      if (isFavorite) {
        return prevFavorites.filter(fav => fav.id !== channel.id);
      } else {
        return [...prevFavorites, channel];
      }
    });
  }, []);

  const handleVideoClick = useCallback((video: Video) => {
    setSelectedVideo(video);
  }, []);

  const handleChannelClick = useCallback(async (channelId: string) => {
    try {
      setIsLoadingVideos(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/api/youtube/channels/${channelId}/videos`, {
        params: { max_results: 10 }
      });

      const channelVideos = response.data.videos.map((video: any) => ({
        ...video,
        url: `https://www.youtube.com/watch?v=${video.id}`
      }));

      setVideos(channelVideos);
    } catch (err) {
      console.error('Error fetching channel videos:', err);
      setError('Failed to fetch channel videos. Please try again later.');
    } finally {
      setIsLoadingVideos(false);
    }
  }, []);

  // Handle toggling article favorites
  const handleToggleArticleFavorite = useCallback((article: Article) => {
    setFavoriteArticles(prevFavorites => {
      const isFavorite = prevFavorites.some(fav => fav.id === article.id);
      if (isFavorite) {
        return prevFavorites.filter(fav => fav.id !== article.id);
      } else {
        return [...prevFavorites, article];
      }
    });
  }, []);

  // Handle article click
  const handleArticleClick = useCallback((article: Article) => {
    setSelectedArticle(article);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const delayDebounce = setTimeout(() => {
        fetchVideos(searchTerm);
      }, 500);

      return () => clearTimeout(delayDebounce);
    } else {
      fetchVideos();
    }
  }, [searchTerm, fetchVideos]);

  useEffect(() => {
    if (channelSearchTerm) {
      const delayDebounce = setTimeout(() => {
        searchChannels(channelSearchTerm);
      }, 500);

      return () => clearTimeout(delayDebounce);
    }
  }, [channelSearchTerm, searchChannels]);

  useEffect(() => {
    fetchArticles();
  }, [selectedDomain]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredArticles = articles.filter((article: Article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedArticles = showArticleFavorites ? favoriteArticles : filteredArticles;

  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      const matchesSearch = videoSearchTerm === '' || 
        video.title.toLowerCase().includes(videoSearchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(videoSearchTerm.toLowerCase()) ||
        video.channelTitle.toLowerCase().includes(videoSearchTerm.toLowerCase());
      
      const selectedDomains = videoDomains.filter(d => d.selected).map(d => d.name);
      const matchesDomain = selectedDomains.length === 0 || 
        selectedDomains.some(domain => video.channelTitle.includes(domain));
      
      return matchesSearch && matchesDomain;
    });
  }, [videos, videoSearchTerm, videoDomains]);

  const paginatedVideos = useMemo(() => {
    const startIndex = (page - 1) * videosPerPage;
    const endIndex = startIndex + videosPerPage;
    return filteredVideos.slice(startIndex, endIndex);
  }, [filteredVideos, page]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredVideos.length / videosPerPage);
  }, [filteredVideos]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [videoSearchTerm, selectedChannel]);

  // Initial video fetch
  useEffect(() => {
    if (showVideos) {
      fetchVideos();
    }
  }, [showVideos, fetchVideos]);

  // Debounce video search
  useEffect(() => {
    if (!showVideos || !videoSearchTerm.trim()) return;

    const timer = setTimeout(() => {
      fetchVideos(videoSearchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [videoSearchTerm, showVideos, fetchVideos]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowVideos(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                !showVideos ? 'bg-primary-500 text-white' : 'bg-navy-700 text-gray-300 hover:bg-navy-600'
              }`}
            >
              <Newspaper className="w-5 h-5" />
              <span>Articles</span>
            </button>
            <button
              onClick={() => setShowVideos(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showVideos ? 'bg-primary-500 text-white' : 'bg-navy-700 text-gray-300 hover:bg-navy-600'
              }`}
            >
              <Layout className="w-5 h-5" />
              <span>Videos</span>
            </button>
          </div>
        </div>

        {!showVideos ? (
          // Articles Section
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">AI Article Trends</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowArticleFavorites(!showArticleFavorites)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    showArticleFavorites ? 'bg-primary-500 text-white' : 'bg-navy-700 text-gray-300 hover:bg-navy-600'
                  }`}
                >
                  <BookmarkIcon className="w-5 h-5" />
                  <span>Favorites</span>
                </button>
                <button
                  onClick={() => setShowDomainSettings(!showDomainSettings)}
                  className="p-2 rounded-lg bg-navy-700 text-gray-300 hover:bg-navy-600 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowAddDomain(!showAddDomain)}
                  className="p-2 rounded-lg bg-navy-700 text-gray-300 hover:bg-navy-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mb-6">
              {!showArticleFavorites && (
                <>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {domains.map((domain) => (
                      <button
                        key={domain.id}
                        onClick={() => setSelectedDomain(domain)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          selectedDomain.id === domain.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-navy-700 text-gray-300 hover:bg-navy-600'
                        }`}
                      >
                        {domain.name}
                      </button>
                    ))}
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-navy-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </>
              )}
            </div>

            {showDomainSettings && (
              <div className="mb-6 p-4 bg-navy-800 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Domain Settings</h3>
                {domains.map((domain) => (
                  <div key={domain.id} className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">{domain.name}</span>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        value={domain.maxResults || defaultMaxResults}
                        onChange={(e) => handleUpdateMaxResults(domain.id, parseInt(e.target.value))}
                        className="w-20 px-2 py-1 bg-navy-700 text-white rounded"
                      />
                      <button
                        onClick={() => handleRemoveDomain(domain.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showAddDomain && (
              <div className="mb-6 p-4 bg-navy-800 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Add New Domain</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Domain Name"
                    value={newDomainName}
                    onChange={(e) => setNewDomainName(e.target.value)}
                    className="w-full px-4 py-2 bg-navy-700 text-white rounded-lg"
                  />
                  <select
                    value={newDomainType}
                    onChange={(e) => setNewDomainType(e.target.value as Domain['type'])}
                    className="w-full px-4 py-2 bg-navy-700 text-white rounded-lg"
                  >
                    <option value="dev.to">Dev.to</option>
                    <option value="medium">Medium</option>
                    <option value="arxiv">arXiv</option>
                    <option value="custom">Custom</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Tag (e.g., 'ai', 'machine-learning')"
                    value={newDomainTag}
                    onChange={(e) => setNewDomainTag(e.target.value)}
                    className="w-full px-4 py-2 bg-navy-700 text-white rounded-lg"
                  />
                  <button
                    onClick={handleAddDomain}
                    className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
                    Add Domain
                  </button>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {showArticleFavorites ? (
                  favoriteArticles.length === 0 ? (
                    <div className="col-span-full text-center text-gray-400">
                      No favorite articles yet
                    </div>
                  ) : (
                    favoriteArticles.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        isFavorite={true}
                        onToggleFavorite={handleToggleArticleFavorite}
                        onClick={handleArticleClick}
                      />
                    ))
                  )
                ) : filteredArticles.length === 0 ? (
                  <div className="col-span-full text-center text-gray-400">
                    No articles found
                  </div>
                ) : (
                  filteredArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      isFavorite={favoriteArticles.some(fav => fav.id === article.id)}
                      onToggleFavorite={handleToggleArticleFavorite}
                      onClick={handleArticleClick}
                    />
                  ))
                )}
              </div>
            )}
          </>
        ) : (
          // Videos Section
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">AI Video Trends</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    showFavorites ? 'bg-primary-500 text-white' : 'bg-navy-700 text-gray-300 hover:bg-navy-600'
                  }`}
                >
                  {showFavorites ? 'Show All Videos' : 'Show Favorites'}
                </button>
                <button
                  onClick={() => setShowFavoriteChannels(!showFavoriteChannels)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    showFavoriteChannels ? 'bg-primary-500 text-white' : 'bg-navy-700 text-gray-300 hover:bg-navy-600'
                  }`}
                >
                  {showFavoriteChannels ? 'Show All Channels' : 'Show Favorite Channels'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-navy-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search channels..."
                  value={channelSearchTerm}
                  onChange={(e) => setChannelSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-navy-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Channel List */}
            {(channelSearchTerm || showFavoriteChannels) && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {showFavoriteChannels ? 'Favorite Channels' : 'Search Results: Channels'}
                </h3>
                {isLoadingChannels ? (
                  <div className="flex justify-center">
                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(showFavoriteChannels ? favoriteChannels : channels).map((channel) => (
                      <div
                        key={channel.id}
                        className="bg-navy-800 rounded-lg p-4 hover:bg-navy-700 transition-colors cursor-pointer"
                        onClick={() => handleChannelClick(channel.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={channel.thumbnail}
                            alt={channel.title}
                            className="w-16 h-16 rounded-full"
                          />
                          <div className="flex-1">
                            <h4 className="text-white font-semibold">{channel.title}</h4>
                            <p className="text-gray-400 text-sm line-clamp-2">{channel.description}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleChannelFavorite(channel);
                            }}
                            className="p-2 rounded-lg hover:bg-navy-600 transition-colors"
                          >
                            {favoriteChannels.some(fav => fav.id === channel.id) ? (
                              <BookmarkIcon className="w-5 h-5 text-primary-400" />
                            ) : (
                              <BookmarkIcon className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingVideos ? (
                <div className="col-span-full flex justify-center">
                  <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="col-span-full text-center text-red-500">{error}</div>
              ) : (showFavorites ? favorites : videos).length === 0 ? (
                <div className="col-span-full text-center text-gray-400">
                  {showFavorites ? 'No favorite videos yet' : 'No videos found'}
                </div>
              ) : (
                (showFavorites ? favorites : videos).map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    isFavorite={favorites.some(fav => fav.id === video.id)}
                    onToggleFavorite={handleToggleVideoFavorite}
                    onClick={handleVideoClick}
                    onChannelClick={handleChannelClick}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {selectedArticle && (
        <ArticleViewer
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onToggleFavorite={handleToggleArticleFavorite}
          isFavorite={favoriteArticles.some(fav => fav.id === selectedArticle.id)}
        />
      )}

      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}
