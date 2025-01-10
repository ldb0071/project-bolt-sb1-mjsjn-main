import React, { useState, useEffect, ReactNode, ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface StreamingTextProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

interface MarkdownProps {
  children?: string;
  components?: Record<string, any>;
  [key: string]: any;
}

export function StreamingText({ children, speed = 10, className = '', onComplete }: StreamingTextProps) {
  const [displayedContent, setDisplayedContent] = useState<ReactNode>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!children) return;

    // If children is a ReactMarkdown component, get its content
    let content = '';
    if (React.isValidElement(children) && 'children' in (children.props as MarkdownProps)) {
      content = (children.props as MarkdownProps).children || '';
    } else if (typeof children === 'string') {
      content = children;
    }

    let currentIndex = 0;
    setDisplayedContent(null);
    setIsComplete(false);
    setText('');

    const streamInterval = setInterval(() => {
      if (currentIndex < content.length) {
        setText(prev => prev + content[currentIndex]);
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(streamInterval);
        // Call onComplete callback when streaming is done
        onComplete?.();
        // Set the final content with markdown rendering
        setDisplayedContent(content);
      }
    }, speed);

    return () => clearInterval(streamInterval);
  }, [children, speed, onComplete]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        {!isComplete ? (
          <>
            {React.isValidElement(children) ? (
              React.cloneElement(children as ReactElement<MarkdownProps>, {
                ...((children as ReactElement<MarkdownProps>).props),
                children: text
              })
            ) : (
              text
            )}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block ml-1"
            >
              ▋
            </motion.span>
          </>
        ) : (
          <ReactMarkdown>{displayedContent}</ReactMarkdown>
        )}
      </motion.div>
    </AnimatePresence>
  );
}