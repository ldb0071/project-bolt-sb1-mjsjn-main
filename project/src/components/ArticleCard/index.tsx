import React from 'react';
import { BookmarkPlus, BookmarkCheck, ExternalLink } from 'lucide-react';

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

interface ArticleCardProps {
  article: Article;
  isFavorite: boolean;
  onToggleFavorite: (article: Article) => void;
  onClick: (article: Article) => void;
}

export function ArticleCard({ article, isFavorite, onToggleFavorite, onClick }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-navy-800 rounded-lg overflow-hidden hover:bg-navy-700 transition-colors">
      {article.cover_image && (
        <img
          src={article.cover_image}
          alt={article.title}
          className="w-full h-48 object-cover cursor-pointer"
          onClick={() => onClick(article)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-primary-400 font-medium px-2 py-1 bg-primary-400/10 rounded">
            {article.domain}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(article);
              }}
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
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg hover:bg-navy-600 transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          </div>
        </div>
        <div 
          className="cursor-pointer"
          onClick={() => onClick(article)}
        >
          <h3 className="text-lg font-semibold text-white mb-2">
            {article.title}
          </h3>
          <p className="text-gray-400 mb-4 line-clamp-3">
            {article.description}
          </p>
          <div className="text-sm text-gray-500">
            <p>By {article.author || article.user?.name || 'Unknown'}</p>
            <p>{formatDate(article.published_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
