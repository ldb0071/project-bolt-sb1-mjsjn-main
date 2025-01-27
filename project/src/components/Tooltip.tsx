import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  delay?: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  delay = 0.2,
  position = 'top'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginBottom: '0.5rem',
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginTop: '0.5rem',
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginRight: '0.5rem',
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginLeft: '0.5rem',
    },
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, delay }}
            className="absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md whitespace-nowrap pointer-events-none"
            style={positionStyles[position]}
          >
            {content}
            <div
              className="absolute w-2 h-2 bg-gray-900 transform rotate-45"
              style={{
                ...(position === 'top' && {
                  bottom: '-0.25rem',
                  left: '50%',
                  marginLeft: '-0.25rem',
                }),
                ...(position === 'bottom' && {
                  top: '-0.25rem',
                  left: '50%',
                  marginLeft: '-0.25rem',
                }),
                ...(position === 'left' && {
                  right: '-0.25rem',
                  top: '50%',
                  marginTop: '-0.25rem',
                }),
                ...(position === 'right' && {
                  left: '-0.25rem',
                  top: '50%',
                  marginTop: '-0.25rem',
                }),
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 