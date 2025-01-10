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

import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { RAGChat } from '../components/RAGChat';
import { Database, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

export function RAGChatPage() {
  // Access global project state
  const { projects } = useStore();
  
  // Local state for UI management
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Filter projects based on search term
   * Case-insensitive search on project names
   */
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Database className="h-6 w-6 text-primary-400" />
              <h1 className="text-2xl font-bold text-white">RAG Chat</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Selection Panel */}
            <div className="lg:col-span-1 bg-navy-900 rounded-lg border border-navy-700 p-4">
              {/* Search Input with Clear Button */}
              <div className="mb-4">
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
              <div className="space-y-2">
                {filteredProjects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project.name)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedProject === project.name
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'hover:bg-navy-800 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{project.name}</span>
                      <span className="text-sm text-gray-400">
                        {project.files?.length || 0} PDFs
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Interface Container */}
            <div className="lg:col-span-2 bg-navy-900 rounded-lg border border-navy-700 overflow-hidden h-[calc(100vh-12rem)]">
              {selectedProject ? (
                // Render RAG Chat when project is selected
                <RAGChat projectName={selectedProject} />
              ) : (
                // Placeholder when no project is selected
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Database className="h-12 w-12 mx-auto mb-4" />
                    <p>Select a project to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 