import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Database, RefreshCw, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { processProjectMarkdown, ragChat, getRagStats } from '../services/apiClient';
import { toast } from 'react-hot-toast';
import EmbeddingVisualization from './EmbeddingVisualization';

interface RAGChatProps {
  projectName: string;
  onClose?: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: { source: string; chunk_id: number }[];
}

interface RAGStats {
  total_documents: number;
  sources: string[];
}

export function RAGChat({ projectName, onClose }: RAGChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<RAGStats | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadStats();
  }, [projectName]);

  const loadStats = async () => {
    try {
      const stats = await getRagStats(projectName);
      setStats(stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const processMarkdown = async () => {
    setIsProcessing(true);
    try {
      const result = await processProjectMarkdown(projectName);
      setStats(result.stats);
      toast.success('Successfully processed markdown files');
    } catch (error) {
      console.error('Error processing markdown:', error);
      toast.error('Failed to process markdown files');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await ragChat(projectName, input);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-navy-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-navy-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="h-5 w-5 text-primary-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">Project Knowledge Base</h2>
              {stats && (
                <p className="text-sm text-gray-400">
                  {stats.total_documents} documents indexed
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={processMarkdown}
              disabled={isProcessing}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>Reindex</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex space-x-3 ${
              message.role === 'assistant' ? 'bg-navy-800 rounded-lg p-4' : ''
            }`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'assistant' 
                ? 'bg-primary-500/20 text-primary-400'
                : 'bg-accent-500/20 text-accent-400'
            }`}>
              {message.role === 'assistant' ? (
                <Bot className="h-5 w-5" />
              ) : (
                <User className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-300">
                  {message.role === 'assistant' ? 'AI Assistant' : 'You'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-gray-200 prose prose-invert max-w-none">
                {message.content}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-2 text-sm">
                    <p className="font-semibold">Sources:</p>
                    <ul className="list-disc list-inside">
                      {message.sources.map((source, idx) => (
                        <li key={idx} className="truncate">
                          {source.source} (Chunk {source.chunk_id})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <div className="bg-primary-500/10 text-primary-400 px-4 py-2 rounded-lg">
              Thinking...
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-navy-700 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your project's content..."
            className="flex-1 bg-navy-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow">
        <EmbeddingVisualization projectName={projectName} />
      </div>
    </div>
  );
} 