import React from 'react';
import { X, BookmarkPlus, BookmarkCheck, ExternalLink } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  url: string;
}

interface VideoViewerProps {
  video: Video;
  onClose: () => void;
  onToggleFavorite: (video: Video) => void;
  isFavorite: boolean;
}

export function VideoViewer({ video, onClose, onToggleFavorite, isFavorite }: VideoViewerProps) {
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
              {video.channelTitle}
            </span>
            <button
              onClick={() => onToggleFavorite(video)}
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
              className="p-1.5 rounded-lg hover:bg-navy-600 transition-colors"
              title="Open in YouTube"
            >
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-navy-600 transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        <div className="p-4">
          <div className="aspect-video w-full mb-4">
            <iframe
              src={`https://www.youtube.com/embed/${video.id}`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{video.title}</h2>
          <p className="text-gray-400 mb-4">{video.description}</p>
          <div className="text-sm text-gray-500">
            <p>Published on {formatDate(video.publishedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
