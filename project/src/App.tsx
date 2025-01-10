import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectsPage } from './pages/ProjectsPage';
import { PDFViewerPage } from './pages/PDFViewerPage';
import { useStore } from './store/useStore';
import { Layout } from './components/Layout';
import { SettingsPage } from './pages/SettingsPage';
import { GettingStartedPage } from './pages/GettingStartedPage';
import { TrendingAIPage } from './pages/TrendingAIPage';
import { RAGChatPage } from './pages/RAGChatPage';
import Box from '@mui/material/Box';

function App() {
  const { projects, initializeDefaultProject } = useStore();

  useEffect(() => {
    // Initialize default project if no projects exist
    if (projects.length === 0) {
      initializeDefaultProject();
    }
  }, [projects, initializeDefaultProject]);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/getting-started" element={<GettingStartedPage />} />
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/projects/:projectId" element={<PDFViewerPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/trending" element={<TrendingAIPage />} />
                  <Route path="/rag-chat" element={<RAGChatPage />} />
                  <Route path="/" element={<Navigate to="/projects" replace />} />
                </Routes>
              </Layout>
            }
          />
          <Route path="/" element={<Navigate to="/getting-started" replace />} />
        </Routes>
      </Router>

      <Box sx={{ 
        position: 'fixed', 
        bottom: { xs: 80, sm: 40 },  
        right: { xs: 20, sm: 40 },   
        zIndex: 1000               
      }}>
      </Box>
    </div>
  );
}

export default App;