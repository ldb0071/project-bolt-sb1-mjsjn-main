import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, Bot, User, Send, Settings } from 'lucide-react';
import { StreamingText } from './StreamingText';
import ReactMarkdown from 'react-markdown';

interface ChatTemplateProps {
  messages?: Array<{ role: 'user' | 'assistant'; content: string }>;
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  onFullScreenChange?: (isFullScreen: boolean) => void;
}

export function ChatTemplate({ 
  messages = [], 
  onSend, 
  isLoading, 
  placeholder, 
  onFullScreenChange 
}: ChatTemplateProps) {
  const [input, setInput] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  const toggleFullScreen = () => {
    const newFullScreenState = !isFullScreen;
    setIsFullScreen(newFullScreenState);
    onFullScreenChange?.(newFullScreenState);
    document.body.style.overflow = newFullScreenState ? 'hidden' : 'auto';
  };

  return (
    <motion.div
      layout
      className={`flex flex-col bg-white dark:bg-navy-900 rounded-lg shadow-lg overflow-hidden
        ${isFullScreen ? 'fixed inset-0 z-[100]' : 'h-full'}`}
      initial={false}
      animate={isFullScreen ? { scale: 1 } : { scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-lg bg-white/80 dark:bg-navy-900/80 border-b border-gray-200 dark:border-navy-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">AI Research Analyst</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullScreen}
              className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-lg transition-colors"
              title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
            >
              {isFullScreen ? (
                <Minimize2 className="h-5 w-5 text-gray-500" />
              ) : (
                <Maximize2 className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full text-gray-500"
            >
              <div className="text-center max-w-md mx-auto">
                <Bot className="h-16 w-16 mx-auto mb-6 text-primary-500" />
                <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Start a conversation
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ask me anything about AI research, papers, or technical concepts. I can help analyze models, explain architectures, and provide detailed insights.
                </p>
              </div>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex items-start gap-4 ${
                  message.role === 'assistant' 
                    ? 'bg-gray-50 dark:bg-navy-800 rounded-xl p-6' 
                    : 'px-2'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
                <div className="flex-1 prose prose-sm dark:prose-invert max-w-none overflow-x-auto">
                  {message.role === 'assistant' ? (
                    <StreamingText speed={30}>
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </StreamingText>
                  ) : (
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-4 bg-gray-50 dark:bg-navy-800 rounded-xl p-6"
          >
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex gap-2 items-center">
              <motion.span
                className="w-2 h-2 bg-primary-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2 }}
              />
              <motion.span
                className="w-2 h-2 bg-primary-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.4 }}
              />
              <motion.span
                className="w-2 h-2 bg-primary-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.6 }}
              />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 border-t border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder || "Ask the AI Research Analyst..."}
              disabled={isLoading}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-navy-600 
                bg-white dark:bg-navy-800 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400
                disabled:bg-gray-100 dark:disabled:bg-navy-700"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-navy-700
                disabled:text-gray-400 disabled:hover:bg-transparent rounded-lg transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
} 