import React from 'react';
import { X, BookmarkPlus, BookmarkCheck, ExternalLink } from 'lucide-react';

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
}

interface ArticleViewerProps {
  article: Article;
  onClose: () => void;
  onToggleFavorite: (article: Article) => void;
  isFavorite: boolean;
}

export function ArticleViewer({ article, onClose, onToggleFavorite, isFavorite }: ArticleViewerProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-navy-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-navy-800 p-4 border-b border-navy-700 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-xs text-primary-400 font-medium px-2 py-1 bg-primary-400/10 rounded">
              {article.domain}
            </span>
            <button
              onClick={() => onToggleFavorite(article)}
              className="p-1.5 rounded-lg hover:bg-navy-600 transition-colors"
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? (
                <BookmarkCheck className="w-4 h-4 text-primary-400" />
              ) : (
                <BookmarkPlus className="w-4 h-4 text-gray-400" />
              )}
            </button>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-navy-600 transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-navy-600 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="p-6">
          {article.cover_image && (
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}
          <h2 className="text-2xl font-bold text-white mb-4">{article.title}</h2>
          <div className="text-sm text-gray-400 mb-6">
            <p>By {article.author || article.user?.name || 'Unknown'}</p>
            <p>{formatDate(article.published_at)}</p>
          </div>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {article.description}
          </p>
        </div>
      </div>
    </div>
  );
}
