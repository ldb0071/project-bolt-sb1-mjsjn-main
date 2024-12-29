import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { 
  FileText, 
  MessageSquare, 
  Settings, 
  Sun, 
  Moon, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  LineChart,
  FileSearch
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { projectId } = useParams();
  const { getCurrentProject, isDarkMode, toggleDarkMode } = useStore();
  const currentProject = getCurrentProject();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navItems = [
    { 
      icon: HelpCircle,
      label: 'Getting Started',
      path: '/getting-started',
      isActive: location.pathname === '/getting-started',
    },
    { 
      icon: FileText, 
      label: 'Projects', 
      path: '/projects',
      isActive: location.pathname === '/projects' || location.pathname.startsWith('/projects/'),
    },
    { 
      icon: LineChart, 
      label: 'AI Trending', 
      path: '/trending',
      isActive: location.pathname === '/trending',
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/settings',
      isActive: location.pathname === '/settings',
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex bg-navy-950">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          width: isSidebarCollapsed ? '4rem' : '16rem',
          transition: { duration: 0.3, ease: 'easeInOut' }
        }}
        className="relative bg-navy-900 border-r border-navy-800"
      >
        {/* Sidebar header */}
        <div className={`p-6 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          <AnimatePresence mode="wait">
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/projects">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                    PDF Assistant
                  </h1>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation items with new animation */}
        <nav className={`px-4 space-y-1 ${isSidebarCollapsed ? 'px-2' : 'px-4'}`}>
          {navItems.map(({ icon: Icon, label, path, isActive }) => (
            <Link
              key={path}
              to={path}
              className={`relative flex items-center overflow-hidden ${
                isSidebarCollapsed ? 'justify-center' : 'space-x-3'
              } px-4 py-3 rounded-lg transition-all duration-300 group ${
                isActive
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              title={isSidebarCollapsed ? label : undefined}
            >
              {/* Animated background */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20 transition-opacity duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                initial={false}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 0%'],
                  transition: {
                    duration: 3,
                    ease: 'linear',
                    repeat: Infinity,
                  },
                }}
                style={{
                  backgroundSize: '200% 100%',
                }}
              />
              
              {/* Border animation */}
              <motion.div
                className={`absolute inset-0 border border-primary-500/20 rounded-lg transition-opacity duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isActive || false ? {
                  scale: 1,
                  opacity: 1,
                  transition: { duration: 0.3 }
                } : {}}
              />

              <Icon className={`relative h-5 w-5 transition-colors duration-200 ${
                isActive ? 'text-primary-400' : 'group-hover:text-primary-400'
              }`} />
              
              <AnimatePresence mode="wait">
                {!isSidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="relative font-medium"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              
              {isActive && !isSidebarCollapsed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Theme toggle with animation */}
        <motion.div
          animate={{ 
            width: isSidebarCollapsed ? '4rem' : '16rem',
            transition: { duration: 0.3, ease: 'easeInOut' }
          }}
          className="absolute bottom-0 left-0 p-4 border-t border-navy-800"
        >
          <button
            onClick={toggleDarkMode}
            className={`relative w-full flex items-center overflow-hidden ${
              isSidebarCollapsed ? 'justify-center' : 'justify-between'
            } px-4 py-2 rounded-lg
              text-gray-400 hover:text-white transition-colors duration-200`}
            title={isSidebarCollapsed ? 'Toggle Theme' : undefined}
          >
            {/* Theme toggle background animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
              animate={{
                backgroundPosition: ['0% 0%', '100% 0%'],
                transition: {
                  duration: 3,
                  ease: 'linear',
                  repeat: Infinity,
                },
              }}
              style={{
                backgroundSize: '200% 100%',
              }}
            />
            
            <AnimatePresence mode="wait">
              {!isSidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="relative font-medium"
                >
                  Theme
                </motion.span>
              )}
            </AnimatePresence>
            {isDarkMode ? (
              <Sun className="relative h-5 w-5 text-accent-400" />
            ) : (
              <Moon className="relative h-5 w-5 text-primary-400" />
            )}
          </button>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-navy-900 text-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}