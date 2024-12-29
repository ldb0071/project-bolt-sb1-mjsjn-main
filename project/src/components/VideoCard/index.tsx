import React from 'react';
import { BookmarkPlus, BookmarkCheck, ExternalLink } from 'lucide-react';

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

interface VideoCardProps {
  video: Video;
  isFavorite: boolean;
  onToggleFavorite: (video: Video) => void;
  onClick: (video: Video) => void;
  onChannelClick?: (channelId: string) => void;
}

export function VideoCard({ video, isFavorite, onToggleFavorite, onClick, onChannelClick }: VideoCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleChannelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChannelClick && video.channelId) {
      onChannelClick(video.channelId);
    }
  };

  return (
    <div className="bg-navy-800 rounded-lg overflow-hidden hover:bg-navy-700 transition-colors">
      <div 
        className="relative cursor-pointer group"
        onClick={() => onClick(video)}
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary-500/80 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span 
            className="text-xs text-primary-400 font-medium px-2 py-1 bg-primary-400/10 rounded cursor-pointer hover:bg-primary-400/20"
            onClick={handleChannelClick}
          >
            {video.channelTitle}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(video);
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
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg hover:bg-navy-600 transition-colors"
              title="Open in YouTube"
            >
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {video.title}
        </h3>
        <p className="text-gray-400 mb-4 line-clamp-3">
          {video.description}
        </p>
        <div className="text-sm text-gray-500">
          <p>{formatDate(video.publishedAt)}</p>
        </div>
      </div>
    </div>
  );
}
