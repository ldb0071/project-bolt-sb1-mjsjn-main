import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Folder, Search, Trash2, Download, Calendar, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ArxivSearchModal } from '../components/ArxivSearchModal';
import { toast } from 'react-hot-toast';
import { ChatButton } from '../components/ChatButton';
import { convertAllProjectPDFs } from '../services/apiClient';

export function ProjectsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showArxivModal, setShowArxivModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const { projects, createProject, deleteProject, setCurrentProject } = useStore();

  // Memoize filtered projects
  const filteredProjects = useMemo(() => 
    projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [projects, searchTerm]
  );

  const handleCreateProject = useCallback(() => {
    if (newProjectName.trim()) {
      createProject(newProjectName.trim(), newProjectDescription.trim());
      setNewProjectName('');
      setNewProjectDescription('');
      setShowCreateModal(false);
    }
  }, [newProjectName, newProjectDescription, createProject]);

  const handleProjectClick = useCallback((projectId: string) => {
    setCurrentProject(projectId);
    navigate(`/projects/${projectId}`);
  }, [navigate, setCurrentProject]);

  const handleConvertAllPDFs = async (projectId: string, projectName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const loadingToast = toast.loading('Converting all PDFs to Markdown...');
      const result = await convertAllProjectPDFs(projectName);
      toast.dismiss(loadingToast);
      toast.success(`${result.converted} out of ${result.total} PDFs converted successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to convert PDFs');
    }
  };

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-navy-800/80 backdrop-blur-lg border-b border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                My Projects
              </h1>
              <span className="text-sm text-gray-400">({filteredProjects.length} projects)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-navy-900/50 border border-navy-600 rounded-lg 
                    text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    transition-colors"
                />
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-lg"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">New Project</span>
                <span className="sm:hidden">New</span>
              </button>
              <button
                onClick={() => {
                  if (projects.length === 0) {
                    toast.error('Create a project first to download ArXiv papers');
                    return;
                  }
                  setSelectedProjectId(projects[0].id);
                  setShowArxivModal(true);
                }}
                className="btn-secondary flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-lg"
              >
                <Download size={20} />
                <span className="hidden sm:inline">ArXiv Papers</span>
                <span className="sm:hidden">ArXiv</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mb-4">
              <Folder className="w-8 h-8 text-primary-400" />
            </div>
            {searchTerm ? (
              <>
                <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
                <p className="text-gray-400">Try adjusting your search terms</p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-white mb-2">Create your first project</h3>
                <p className="text-gray-400 mb-4">Get started by creating a new project to organize your PDFs</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg"
                >
                  <Plus size={20} />
                  New Project
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="group bg-navy-800 rounded-xl border border-navy-700 hover:border-primary-500/50 
                  hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-200"
              >
                <div
                  onClick={() => handleProjectClick(project.id)}
                  className="p-6 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary-500/10 rounded-lg group-hover:bg-primary-500/20 transition-colors">
                      <Folder className="text-primary-400 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white group-hover:text-primary-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {project.files?.length || 0} PDFs
                      </p>
                    </div>
                  </div>
                  {project.description && (
                    <p className="text-gray-400 mb-4 line-clamp-2 text-sm">{project.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-4 h-4" />
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="border-t border-navy-700 px-6 py-3 bg-navy-800/50 flex justify-between rounded-b-xl">
                  <button
                    onClick={(e) => handleConvertAllPDFs(project.id, project.name, e)}
                    className="text-gray-400 hover:text-primary-400 p-2 rounded-full hover:bg-navy-700 transition-colors flex items-center gap-2"
                    title="Convert all PDFs to Markdown"
                  >
                    <FileText size={18} />
                    <span className="text-sm">Convert All</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(project.id);
                    }}
                    className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-navy-700 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-navy-800 rounded-lg p-6 w-full max-w-md border border-navy-700 shadow-xl"
          >
            <h2 className="text-xl font-bold text-white mb-4">Create New Project</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-4 py-2 bg-navy-900 border border-navy-600 rounded-lg 
                    text-white placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-navy-900 border border-navy-600 rounded-lg 
                    text-white placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="btn-primary"
                disabled={!newProjectName.trim()}
              >
                Create Project
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ArXiv Modal */}
      {showArxivModal && (
        <ArxivSearchModal
          isOpen={showArxivModal}
          onClose={() => setShowArxivModal(false)}
          onDownload={(title) => {
            // Handle download completion
          }}
        />
      )}

      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatButton />
      </div>
    </div>
  );
}
