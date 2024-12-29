import React, { useState, useRef } from 'react';
import { animated } from '@react-spring/web';
import { useGestures } from '../hooks/useGestures';
import { useAnimations } from '../hooks/useAnimations';

interface PDFViewerProps {
  url: string;
  onPageChange?: (page: number) => void;
  onZoomChange?: (scale: number) => void;
}

export const EnhancedPDFViewer: React.FC<PDFViewerProps> = ({
  url,
  onPageChange,
  onZoomChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const { fadeIn, scaleIn } = useAnimations();
  
  const { bind, style } = useGestures({
    enablePinch: true,
    enableSwipe: true,
    onSwipe: (direction) => {
      if (direction === 'left') {
        setCurrentPage((prev) => prev + 1);
        onPageChange?.(currentPage + 1);
      } else if (direction === 'right') {
        setCurrentPage((prev) => Math.max(1, prev - 1));
        onPageChange?.(Math.max(1, currentPage - 1));
      }
    },
    onPinch: (scale) => {
      onZoomChange?.(scale);
    },
  });

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <animated.div
      ref={containerRef}
      style={{
        ...fadeIn,
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {isLoading && (
        <animated.div
          style={{
            ...scaleIn,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="loading-spinner" />
        </animated.div>
      )}
      
      <animated.div
        {...bind()}
        style={{
          ...style,
          width: '100%',
          height: '100%',
          touchAction: 'none',
        }}
      >
        <iframe
          src={`${url}#page=${currentPage}`}
          title="PDF Viewer"
          width="100%"
          height="100%"
          onLoad={handleLoad}
          style={{
            border: 'none',
            backgroundColor: '#f5f5f5',
          }}
        />
      </animated.div>

      <animated.div
        style={{
          ...fadeIn,
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '8px 16px',
          borderRadius: '20px',
          color: 'white',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => {
            setCurrentPage((prev) => Math.max(1, prev - 1));
            onPageChange?.(Math.max(1, currentPage - 1));
          }}
          className="control-button"
        >
          ←
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
            onPageChange?.(currentPage + 1);
          }}
          className="control-button"
        >
          →
        </button>
      </animated.div>
    </animated.div>
  );
};
