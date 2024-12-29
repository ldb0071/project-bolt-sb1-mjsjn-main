import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, X, Filter, Eye, Check, DownloadCloud } from 'lucide-react';
import { searchArxiv, downloadArxivPaper, ArxivPaper } from '../services/arxivService';
import { toast } from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { PDFPreviewModal } from './PDFPreviewModal';
import { DateRangeFilter } from './DateRangeFilter';
import axios from 'axios';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (paperTitle: string) => void;
}

const sourceOptions = ['All', 'CVPR', 'ICCV', 'WACV', 'ECCV'];
const resultCountOptions = [10, 20, 50, 100, 200, 500, 1000];

export function ArxivSearchModal({ isOpen, onClose, onDownload }: Props) {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('All');
  const [maxResults, setMaxResults] = useState<number>(100);
  const [papers, setPapers] = useState<ArxivPaper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [downloadedPapers, setDownloadedPapers] = useState<Set<string>>(new Set());
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [includeCitations, setIncludeCitations] = useState(true);
  const [isLoadingCitations, setIsLoadingCitations] = useState(false);
  const { projects } = useStore();

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    const pollCitations = async () => {
      if (papers.length > 0 && papers.some(p => p.citations === null) && includeCitations) {
        try {
          const response = await axios.get('/api/arxiv/citations', {
            params: { paperIds: papers.filter(p => p.citations === null).map(p => p.id) }
          });

          setPapers(prevPapers =>
            prevPapers.map(paper => ({
              ...paper,
              citations: response.data[paper.id] ?? paper.citations
            }))
          );

          // If all papers have citations, stop polling
          if (!papers.some(p => p.citations === null)) {
            clearInterval(pollInterval);
            setIsLoadingCitations(false);
          }
        } catch (error) {
          console.error('Error polling citations:', error);
        }
      } else {
        clearInterval(pollInterval);
        setIsLoadingCitations(false);
      }
    };

    if (includeCitations && papers.some(p => p.citations === null)) {
      setIsLoadingCitations(true);
      pollInterval = setInterval(pollCitations, 2000); // Poll every 2 seconds
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [papers, includeCitations]);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsLoading(true);
    try {
      const response = await searchArxiv({
        query: query.trim(),
        source,
        maxResults,
        dateRange: {
          startDate,
          endDate,
        },
        includeCitations,
      });

      setPapers(response.papers);

      if (includeCitations) {
        setIsLoadingCitations(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search ArXiv papers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = ({ startDate: start, endDate: end }: { startDate: Date | null; endDate: Date | null }) => {
    setStartDate(start);
    setEndDate(end);
  };

  const clearDateRange = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleDownload = async (paper: ArxivPaper) => {
    if (!selectedProjectId) {
      toast.error('Please select a project first');
      return;
    }

    // Get the selected project name
    const selectedProject = projects.find(p => p.id === selectedProjectId);
    if (!selectedProject) {
      toast.error('Selected project not found');
      return;
    }

    try {
      const result = await downloadArxivPaper(paper.pdfUrl, paper.title, selectedProjectId, selectedProject.name);

      // Add the downloaded file to the project
      const fileData = {
        id: result.filename,
        name: result.filename,
        path: result.path,
        uploadedAt: new Date(),
      };

      useStore.getState().addFileToProject(selectedProjectId, fileData);
      setDownloadedPapers(prev => new Set([...prev, paper.id]));

      toast.success(`Downloaded: ${paper.title}`);
      onDownload(paper.title);
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Failed to download ${paper.title}. Please try again.`);
      return false;
    }
    return true;
  };

  const handleDownloadAll = async () => {
    if (!selectedProjectId) {
      toast.error('Please select a project first');
      return;
    }

    // Get the selected project name
    const selectedProject = projects.find(p => p.id === selectedProjectId);
    if (!selectedProject) {
      toast.error('Selected project not found');
      return;
    }

    setIsDownloadingAll(true);
    const toDownload = papers.filter(paper => !downloadedPapers.has(paper.id));

    if (toDownload.length === 0) {
      toast.success('All papers have already been downloaded!');
      setIsDownloadingAll(false);
      return;
    }

    const toastId = toast.loading(
      `Downloading 0/${toDownload.length} papers...`,
      { duration: Infinity }
    );

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < toDownload.length; i++) {
      const paper = toDownload[i];
      const success = await handleDownload(paper);

      if (success) {
        successCount++;
      } else {
        failCount++;
      }

      toast.loading(
        `Downloading ${i + 1}/${toDownload.length} papers...`,
        { id: toastId }
      );
    }

    toast.dismiss(toastId);
    toast.success(
      `Downloaded ${successCount} papers${failCount > 0 ? `, ${failCount} failed` : ''}`
    );
    setIsDownloadingAll(false);
  };

  const handlePreview = (paper: ArxivPaper) => {
    setPreviewUrl(paper.pdfUrl);
  };

  const handleClosePreview = () => {
    setPreviewUrl(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-navy-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-navy-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Search ArXiv Papers</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Search Controls */}
        <div className="p-6 border-b border-gray-200 dark:border-navy-700 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search papers..."
                className="w-full px-4 py-2 rounded-lg border dark:border-navy-600 dark:bg-navy-900 dark:text-white"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Search className="h-5 w-5" />
              )}
              Search
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-navy-900 border border-gray-300 dark:border-navy-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {sourceOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Max Results</label>
              <select
                value={maxResults}
                onChange={(e) => setMaxResults(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-navy-900 border border-gray-300 dark:border-navy-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {resultCountOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <DateRangeFilter
                startDate={startDate}
                endDate={endDate}
                onChange={handleDateRangeChange}
                onClear={clearDateRange}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeCitations"
                checked={includeCitations}
                onChange={(e) => setIncludeCitations(e.target.checked)}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <label htmlFor="includeCitations" className="text-sm text-gray-700 dark:text-gray-300">
                Include Citations
              </label>
            </div>
          </div>
        </div>

        {/* Project Selection and Download All */}
        <div className="flex gap-4 items-center">
          <label className="text-gray-700 dark:text-gray-300">Select Project:</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-navy-900 dark:border-navy-700 dark:text-white"
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {papers.length > 0 && (
            <button
              onClick={handleDownloadAll}
              disabled={!selectedProjectId || isDownloadingAll}
              className={`btn-secondary flex items-center gap-2 ${
                isDownloadingAll ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title={!selectedProjectId ? 'Please select a project first' : 'Download all papers'}
            >
              <DownloadCloud size={20} />
              {isDownloadingAll ? 'Downloading...' : 'Download All'}
            </button>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : papers.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>{papers.length} papers found</span>
                <span>{downloadedPapers.size} downloaded</span>
              </div>
              {isLoadingCitations && includeCitations && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                  Loading citation counts...
                </div>
              )}
              {papers.map((paper) => (
                <div
                  key={paper.id}
                  className="border border-gray-200 dark:border-navy-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {paper.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {paper.authors.join(', ')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Published: {new Date(paper.published).toLocaleDateString()}
                      </p>
                      {paper.citationCount !== undefined && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Citations: {paper.citationCount}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {paper.categories.map((category) => (
                          <span
                            key={category}
                            className="px-2 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePreview(paper)}
                        className="btn-secondary flex items-center gap-2"
                        title="Preview paper"
                      >
                        <Eye size={20} />
                        Preview
                      </button>
                      <motion.button
                        onClick={() => !downloadedPapers.has(paper.id) && handleDownload(paper)}
                        className={`btn-secondary flex items-center gap-2 ${
                          downloadedPapers.has(paper.id)
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : ''
                        }`}
                        disabled={!selectedProjectId || downloadedPapers.has(paper.id)}
                        title={
                          !selectedProjectId
                            ? 'Please select a project first'
                            : downloadedPapers.has(paper.id)
                            ? 'Already downloaded'
                            : 'Download paper'
                        }
                        whileTap={{ scale: 0.95 }}
                        animate={
                          downloadedPapers.has(paper.id)
                            ? { scale: [1, 1.1, 1], transition: { duration: 0.3 } }
                            : {}
                        }
                      >
                        {downloadedPapers.has(paper.id) ? (
                          <Check size={20} />
                        ) : (
                          <Download size={20} />
                        )}
                        {downloadedPapers.has(paper.id) ? 'Downloaded' : 'Download'}
                      </motion.button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No papers found. Try searching for something!
            </div>
          )}
        </div>
      </motion.div>
      <PDFPreviewModal
        isOpen={!!previewUrl}
        onClose={handleClosePreview}
        pdfUrl={previewUrl || ''}
      />
    </div>
  );
}
