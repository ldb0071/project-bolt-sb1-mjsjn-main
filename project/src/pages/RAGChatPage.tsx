/**
 * RAG Chat Page Component
 * 
 * This component implements the Retrieval-Augmented Generation (RAG) chat interface.
 * It provides:
 * - Project selection for context
 * - Project search functionality
 * - Integration with RAG Chat component
 * 
 * Related Components:
 * - RAGChat: Main chat interface component
 * - EmbeddingVisualization: Shows document embeddings
 * 
 * State Management:
 * - Uses useStore for project data
 * - Local state for project selection and search
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { RAGChat } from '../components/RAGChat';
import { Database, Search, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatWindow {
  id: string;
  projectName: string;
  messages: ChatMessage[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Array<{
    source: string;
    section: string;
    preview: string;
    page?: number;
  }>;
}

const STORAGE_KEY = 'rag_chat_windows';

export function RAGChatPage() {
  // Access global project state
  const { projects } = useStore();
  
  // Local state for UI management
  const [searchTerm, setSearchTerm] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [chatWindows, setChatWindows] = useState<ChatWindow[]>(() => {
    // Initialize from localStorage
    const savedWindows = localStorage.getItem(STORAGE_KEY);
    return savedWindows ? JSON.parse(savedWindows) : [];
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Save chat windows to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatWindows));
  }, [chatWindows]);

  /**
   * Filter projects based on search term
   * Case-insensitive search on project names
   */
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add a new chat window for a project
  const addChatWindow = (projectName: string) => {
    const newWindow: ChatWindow = {
      id: `${projectName}-${Date.now()}`,
      projectName,
      messages: []
    };
    setChatWindows(prev => [...prev, newWindow]);
  };

  // Remove a chat window
  const removeChatWindow = (windowId: string) => {
    setChatWindows(prev => prev.filter(window => window.id !== windowId));
  };

  // Update messages for a specific chat window
  const updateChatMessages = (windowId: string, messages: ChatMessage[]) => {
    setChatWindows(prev => prev.map(window => 
      window.id === windowId 
        ? { ...window, messages } 
        : window
    ));
  };

  return (
    <div className="h-screen flex flex-col bg-navy-950 overflow-hidden">
      {/* Header Section */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-navy-700 bg-navy-900">
        <div className="flex items-center space-x-3">
          <Database className="h-6 w-6 text-primary-400" />
          <h1 className="text-2xl font-bold text-white">RAG Chat</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Project Selection Panel */}
        <motion.div
          initial={false}
          animate={{
            width: isSidebarOpen ? 320 : 24,
            transition: { duration: 0.2 }
          }}
          className="relative border-r border-navy-700 bg-navy-900 flex flex-col h-full"
        >
          {/* Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 bg-navy-900 border border-navy-700 rounded-full p-1 text-gray-400 hover:text-primary-400 z-10"
          >
            {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-full"
              >
                {/* Search Input with Clear Button */}
                <div className="p-4 border-b border-navy-700">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search projects..."
                      className="w-full pl-10 pr-4 py-2 bg-navy-800 border border-navy-600 rounded-lg 
                        text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                          hover:text-gray-300 focus:outline-none"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Project List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {filteredProjects.map(project => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-navy-800 group transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">{project.name}</span>
                          <span className="text-sm text-gray-400">
                            {project.files?.length || 0} PDFs
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => addChatWindow(project.name)}
                        className="ml-2 p-1 text-primary-400 hover:bg-primary-500/20 rounded opacity-0 group-hover:opacity-100 transition-all"
                        title="Add chat window"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Chat Windows Container */}
        <div className="flex-1 bg-navy-950 p-4 overflow-hidden">
          <AnimatePresence>
            {chatWindows.length === 0 ? (
              // Placeholder when no chat windows are open
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full bg-navy-900 rounded-lg border border-navy-700 flex items-center justify-center text-gray-400"
              >
                <div className="text-center">
                  <Database className="h-12 w-12 mx-auto mb-4" />
                  <p>Click the + button on a project to start chatting</p>
                </div>
              </motion.div>
            ) : (
              // Render all chat windows in a dynamic grid
              <div 
                className={`grid gap-4 h-full ${
                  chatWindows.length === 1 ? 'grid-cols-1' : 
                  chatWindows.length === 2 ? 'grid-cols-2' :
                  chatWindows.length === 3 ? 'grid-cols-3' :
                  chatWindows.length === 4 ? 'grid-cols-2 grid-rows-2' :
                  'grid-cols-3 auto-rows-fr'
                }`}
              >
                {chatWindows.map((window) => (
                  <motion.div
                    key={window.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="h-full"
                  >
                    <RAGChat
                      projectName={window.projectName}
                      onClose={() => removeChatWindow(window.id)}
                      initialMessages={window.messages}
                      onMessagesUpdate={(messages) => updateChatMessages(window.id, messages)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 