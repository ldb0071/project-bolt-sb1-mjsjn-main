import React, { useState } from 'react';
import { searchPyPaperBot, downloadPyPaperBot, PyPaperBotPaper, getPDFFileUrl } from '../services/apiClient';
import { toast } from 'react-hot-toast';
import { Search, Download, Eye, X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { PDFPreviewModal } from './PDFPreviewModal';
import { useStore } from '../store/useStore';

export function PyPaperBotUI() {
  const [searchQuery, setSearchQuery] = useState('');
  const [scholarPages, setScholarPages] = useState(1);
  const [minYear, setMinYear] = useState(2018);
  const [scholarResults, setScholarResults] = useState(10);
  const [citations, setCitations] = useState('');
  const [restrict, setRestrict] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<PyPaperBotPaper[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPapers, setSelectedPapers] = useState<Set<number>>(new Set());
  const [isDownloading, setIsDownloading] = useState<{ [key: number]: boolean }>({});
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const { projects, addFileToProject } = useStore();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsSearching(true);
    try {
      const result = await searchPyPaperBot({
        query: searchQuery,
        scholarPages,
        minDate: minYear,
        scholarResults,
        restrict: restrict ? 1 : 0,
        cites: citations
      });

      if (result.success && result.papers.length > 0) {
        setSearchResults(result.papers);
        toast.success(`Found ${result.papers.length} papers`);
      } else {
        setSearchResults([]);
        toast.error(result.message || 'No papers found');
      }
    } catch (error) {
      toast.error('Search failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSearching(false);
    }
  };

  const handlePreview = (paper: PyPaperBotPaper) => {
    const link = paper.pdf_link || paper.scholar_link;
    if (!link) {
      toast.error('No link available for preview');
      return;
    }
    window.open(link, '_blank');
  };

  const handleDownload = async (papers: PyPaperBotPaper[], index?: number) => {
    console.log('Download clicked for papers:', papers);
    
    if (!selectedProjectId) {
      toast.error('Please select a project first');
      return;
    }

    const project = projects.find(p => p.id === selectedProjectId);
    if (!project) {
      toast.error('Selected project not found');
      return;
    }

    try {
      if (index !== undefined) {
        setIsDownloading(prev => ({ ...prev, [index]: true }));
      }

      // Map papers to include the scholar_link as pdf_link if not present
      const mappedPapers = papers.map(paper => ({
        ...paper,
        pdf_link: paper.pdf_link || paper.scholar_link,
        doi: paper.DOI
      }));
      console.log('Mapped papers:', mappedPapers);

      const result = await downloadPyPaperBot({
        papers: mappedPapers,
        dwnl_dir: project.name,
        SciHub_URL: 'https://sci-hub.do'
      });
      console.log('Download result:', result);
      
      if (result.success) {
        if (result.downloadedPapers.length > 0) {
          // Add downloaded papers to project files
          result.downloadedPapers.forEach(filePath => {
            const filename = filePath.split('/').pop() || filePath;
            const paper = mappedPapers.find(p => filename.includes(p.title.substring(0, 20)));
            if (paper) {
              // Create a safe filename from the title
              const safeTitle = paper.title
                .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
                .replace(/\s+/g, '_') // Replace spaces with underscores
                .substring(0, 100); // Limit length
              
              const fileData = {
                id: filename,
                name: paper.title,
                path: `/projects/${project.name}/downloaded/${safeTitle}.pdf`,
                uploadedAt: new Date()
              };
              console.log('Adding file to project:', fileData);
              addFileToProject(selectedProjectId, fileData);
            }
          });
          toast.success(`Downloaded ${result.downloadedPapers.length} papers successfully`);
        }
        if (result.failedPapers.length > 0) {
          toast.error(`Failed to download ${result.failedPapers.length} papers`);
        }
      } else {
        throw new Error(result.message || 'Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      if (index !== undefined) {
        setIsDownloading(prev => ({ ...prev, [index]: false }));
      }
    }
  };

  const togglePaperSelection = (index: number) => {
    setSelectedPapers(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(index)) {
        newSelection.delete(index);
      } else {
        newSelection.add(index);
      }
      return newSelection;
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search papers..."
              className="w-full px-4 py-2 rounded-lg bg-navy-900 border border-navy-700 text-white placeholder-gray-400"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2"
          >
            {isSearching ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            Search
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-navy-700 text-white rounded-lg hover:bg-navy-600 flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-navy-800 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Scholar Pages</label>
              <input
                type="number"
                value={scholarPages}
                onChange={(e) => setScholarPages(Number(e.target.value))}
                min={1}
                max={10}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-md text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Year</label>
              <input
                type="number"
                value={minYear}
                onChange={(e) => setMinYear(Number(e.target.value))}
                min={1900}
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-md text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Results Per Page</label>
              <input
                type="number"
                value={scholarResults}
                onChange={(e) => setScholarResults(Number(e.target.value))}
                min={1}
                max={10}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-md text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Citations Paper ID</label>
              <input
                type="text"
                value={citations}
                onChange={(e) => setCitations(e.target.value)}
                placeholder="Paper ID for citations"
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-md text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Download Type</label>
              <select
                value={restrict ? "1" : "0"}
                onChange={(e) => setRestrict(e.target.value === "1")}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-md text-white"
              >
                <option value="0">Download only Bibtex</option>
                <option value="1">Download only papers PDF</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Project</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-md text-white"
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Found {searchResults.length} papers
            </div>
            <button
              onClick={() => handleDownload(searchResults.filter((_, i) => selectedPapers.has(i)))}
              disabled={selectedPapers.size === 0 || !selectedProjectId}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                selectedPapers.size > 0 && selectedProjectId
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
            >
              <Download className="w-5 h-5" />
              Download Selected ({selectedPapers.size})
            </button>
          </div>
          <div className="grid gap-4">
            {searchResults.map((paper, index) => (
              <div
                key={index}
                className="bg-navy-800 rounded-lg p-4 hover:bg-navy-700 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={selectedPapers.has(index)}
                        onChange={() => togglePaperSelection(index)}
                        className="mt-1.5"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {paper.title}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">
                          {paper.authors}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>Year: {paper.year}</span>
                          <span>Citations: {paper.cites_num || 'N/A'}</span>
                          {paper.DOI && (
                            <span>DOI: {paper.DOI}</span>
                          )}
                        </div>
                        {paper.journal && (
                          <p className="mt-2 text-sm text-gray-400">
                            Journal: {paper.journal}
                          </p>
                        )}
                        {paper.scholar_link && (
                          <a 
                            href={paper.scholar_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-sm text-blue-400 hover:text-blue-300 break-all"
                          >
                            Scholar Link: {paper.scholar_link}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePreview(paper)}
                      className="p-2 bg-navy-700 text-white rounded-lg hover:bg-navy-600 flex items-center gap-2"
                      title="Preview paper"
                    >
                      <Eye className="w-5 h-5" />
                      Preview
                    </button>
                    <button
                      onClick={() => handleDownload([paper], index)}
                      disabled={!selectedProjectId || isDownloading[index]}
                      className={`p-2 rounded-lg flex items-center gap-2 ${
                        selectedProjectId && !isDownloading[index]
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                      }`}
                      title="Download paper"
                    >
                      {isDownloading[index] ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Download className="w-5 h-5" />
                      )}
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
