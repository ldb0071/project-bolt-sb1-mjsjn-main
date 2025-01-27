import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Hash, Code2, FileText, Terminal, Braces, Sparkles, Bot, Github, Search, FolderIcon, FileIcon } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { sendChatMessage, ModelId, AVAILABLE_MODELS } from '../services/chatService';
import { useStore } from '../store/useStore';

interface CreateSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (snippet: any) => void;
  initialData?: {
    title: string;
    description: string;
    language: string;
    code: string;
    inputExample?: string;
    expectedOutput?: string;
    notes?: string;
    tags?: string[];
  };
}

const languageOptions = [
  { value: 'javascript', label: 'JavaScript', icon: Braces },
  { value: 'typescript', label: 'TypeScript', icon: Code2 },
  { value: 'python', label: 'Python', icon: Terminal },
  { value: 'java', label: 'Java', icon: FileText },
  { value: 'cpp', label: 'C++', icon: Terminal },
  { value: 'csharp', label: 'C#', icon: Hash },
];

// Add GitHub search interface
interface GitHubSearchResult {
  name: string;
  path: string;
  html_url: string;
  type: 'file' | 'dir';
  repository: {
    full_name: string;
    description: string;
    stargazers_count: number;
  };
  content?: string;
}

export function CreateSnippetModal({ isOpen, onClose, onSave, initialData }: CreateSnippetModalProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [language, setLanguage] = useState(initialData?.language || languageOptions[0].value);
  const [code, setCode] = useState(initialData?.code || '');
  const [inputExample, setInputExample] = useState(initialData?.inputExample || '');
  const [expectedOutput, setExpectedOutput] = useState(initialData?.expectedOutput || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [currentTag, setCurrentTag] = useState('');
  const [step, setStep] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState('');
  const geminiKey = useStore((state) => state.geminiKey);
  const [githubResults, setGithubResults] = useState<GitHubSearchResult[]>([]);
  const [isSearchingGithub, setIsSearchingGithub] = useState(false);
  const [selectedGithubFile, setSelectedGithubFile] = useState<GitHubSearchResult | null>(null);
  const [repoUrl, setRepoUrl] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelId>('gemini-1.5-flash');

  // Update modal title based on whether we're editing or creating
  const modalTitle = initialData ? 'Edit Snippet' : 'Create New Snippet';
  const saveButtonText = initialData ? 'Save Changes' : 'Create Snippet';

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    onSave({
      title,
      description,
      language,
      code,
      inputExample,
      expectedOutput,
      notes,
      tags,
      author: 'You',
      createdAt: new Date().toISOString(),
    });

    // Reset all form fields
    setTitle('');
    setDescription('');
    setLanguage(languageOptions[0].value);
    setCode('');
    setInputExample('');
    setExpectedOutput('');
    setNotes('');
    setTags([]);
    setCurrentTag('');
    setStep(1);
    setPreviewMode(false);
    setGenerationPrompt('');
    setGithubResults([]);
    setSelectedGithubFile(null);
    setRepoUrl('');
    setCurrentPath('');
    
    onClose();
  };

  const isStepComplete = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return title.length > 0 && description.length > 0;
      case 2:
        return language && code.length > 0;
      case 3:
        return true; // Optional step
      default:
        return false;
    }
  };

  const handleGenerateSnippet = async () => {
    try {
      setIsGenerating(true);
      
      // Include repository context if a repo URL is provided
      const repoContext = repoUrl ? `
GitHub Repository Context:
Repository URL: ${repoUrl}
Current Path: ${currentPath}
Available Files: ${githubResults.map(r => r.path).join(', ')}
` : '';
      
      const prompt = `You are a code generation assistant. Generate a detailed, production-ready code snippet based on the following request.
${repoContext}
IMPORTANT: Your response must be a JSON object WITHOUT any markdown formatting or code blocks. The JSON must follow this exact structure:
{
  "title": "A clear, descriptive title for the snippet",
  "description": "A comprehensive description explaining the purpose, use cases, and key features of the code",
  "language": "programming language (must be one of: javascript, typescript, python, java, cpp, csharp)",
  "code": "The code snippet should include:
          - Detailed comments explaining complex logic
          - Type definitions and interfaces (if applicable)
          - Error handling
          - Input validation
          - Performance considerations
          - Best practices for the chosen language",
  "inputExample": "Multiple examples showing different use cases, including:
                  - Basic usage
                  - Edge cases
                  - Error handling scenarios
                  - Complex scenarios",
  "expectedOutput": "Expected output for each input example, including:
                    - Success cases
                    - Error cases
                    - Different output formats",
  "notes": "Detailed notes including:
           - Dependencies and requirements
           - Setup instructions
           - Performance characteristics
           - Common pitfalls to avoid
           - Best practices
           - Alternative approaches${repoUrl ? '\n           - Credit to the GitHub repository' : ''}",
  "tags": ["array", "of", "relevant", "tags", "including", "concepts", "and", "use", "cases"]
}

Request: ${generationPrompt}

REMEMBER: Return only the raw JSON object without any additional formatting or text.`;

      const response = await sendChatMessage(
        [{
          id: crypto.randomUUID(),
          role: 'user',
          content: prompt
        }],
        geminiKey,
        'default',
        selectedModel
      );

      // Clean and parse the response
      let cleanedContent = response.content;
      
      // Try to extract JSON if it's wrapped in code blocks
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedContent = jsonMatch[0];
      }

      try {
        const snippetData = JSON.parse(cleanedContent);
        
        // Validate required fields
        if (!snippetData.title || !snippetData.description || !snippetData.code || 
            !languageOptions.some(opt => opt.value === snippetData.language)) {
          throw new Error('Invalid or missing required fields in generated snippet');
        }
        
        setTitle(snippetData.title);
        setDescription(snippetData.description);
        setLanguage(snippetData.language);
        setCode(snippetData.code);
        setInputExample(snippetData.inputExample || '');
        setExpectedOutput(snippetData.expectedOutput || '');
        setNotes(snippetData.notes || '');
        setTags(Array.isArray(snippetData.tags) ? snippetData.tags : []);
        
        // Move to code step after successful generation
        setStep(2);
      } catch (parseError) {
        console.error('Failed to parse generated snippet:', parseError);
        console.error('Raw content:', response.content);
        console.error('Cleaned content:', cleanedContent);
        throw new Error('Failed to parse the generated snippet. Please try again.');
      }
    } catch (error) {
      console.error('Failed to generate snippet:', error);
      // You might want to show this error to the user in a toast or alert
    } finally {
      setIsGenerating(false);
    }
  };

  // Add GitHub search function
  const searchGithub = async (repoUrl: string, path: string = '') => {
    try {
      setIsSearchingGithub(true);
      
      // Extract owner and repo from URL
      const repoMatch = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!repoMatch) {
        throw new Error('Invalid GitHub repository URL');
      }
      
      const [, owner, repo] = repoMatch;
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer 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`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch repository contents');
      
      const data = await response.json();
      const results = Array.isArray(data) ? data : [data];
      
      setGithubResults(results.map(item => ({
        name: item.name,
        path: item.path,
        html_url: item.html_url,
        type: item.type,
        repository: {
          full_name: `${owner}/${repo}`,
          description: '',
          stargazers_count: 0
        },
        content: item.type === 'file' ? item.content : undefined
      })));
      
      setCurrentPath(path);
    } catch (error) {
      console.error('GitHub search error:', error);
    } finally {
      setIsSearchingGithub(false);
    }
  };

  // Add function to handle file/directory navigation
  const handleFileClick = async (result: GitHubSearchResult) => {
    if (result.type === 'dir') {
      // If it's a directory, browse its contents
      await searchGithub(repoUrl, result.path);
    } else {
      // If it's a file, fetch its content and select it
      try {
        const repoMatch = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!repoMatch) return;
        
        const [, owner, repo] = repoMatch;
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${result.path}`,
          {
            headers: {
              'Authorization': `Bearer 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`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        );
        
        if (!response.ok) throw new Error('Failed to fetch file content');
        
        const data = await response.json();
        result.content = atob(data.content);
        setSelectedGithubFile(result);
      } catch (error) {
        console.error('Failed to fetch file content:', error);
      }
    }
  };

  const handleGenerateWithGithub = async () => {
    if (!selectedGithubFile) return;
    
    try {
      setIsGenerating(true);
      
      const prompt = `You are a code generation assistant. Create a detailed, production-ready code snippet based on this GitHub file and my requirements.

GitHub File:
Repository: ${selectedGithubFile.repository.full_name}
Path: ${selectedGithubFile.path}
Code:
\`\`\`
${selectedGithubFile.content}
\`\`\`

My Requirements: ${generationPrompt}

Create a new, improved version that:
1. Incorporates the best practices from the GitHub example
2. Enhances the code with modern patterns and practices
3. Adds comprehensive documentation and examples
4. Includes robust error handling and validation
5. Considers performance and scalability

Return a JSON object WITHOUT any markdown formatting or code blocks. The JSON must follow this exact structure:
{
  "title": "A clear, descriptive title for the snippet",
  "description": "A comprehensive description explaining the purpose, use cases, and key features of the code",
  "language": "programming language (must be one of: javascript, typescript, python, java, cpp, csharp)",
  "code": "The code snippet should include:
          - Detailed comments explaining complex logic
          - Type definitions and interfaces (if applicable)
          - Error handling
          - Input validation
          - Performance considerations
          - Best practices for the chosen language",
  "inputExample": "Multiple examples showing different use cases, including:
                  - Basic usage
                  - Edge cases
                  - Error handling scenarios
                  - Complex scenarios",
  "expectedOutput": "Expected output for each input example, including:
                    - Success cases
                    - Error cases
                    - Different output formats",
  "notes": "Detailed notes including:
           - Dependencies and requirements
           - Setup instructions
           - Performance characteristics
           - Common pitfalls to avoid
           - Best practices
           - Alternative approaches
           - Credit to the original GitHub repository",
  "tags": ["array", "of", "relevant", "tags", "including", "concepts", "and", "use", "cases"]
}`;

      const response = await sendChatMessage(
        [{
          id: crypto.randomUUID(),
          role: 'user',
          content: prompt
        }],
        geminiKey,
        'default',
        selectedModel
      );

      // Clean and parse the response
      let cleanedContent = response.content;
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedContent = jsonMatch[0];
      }

      const snippetData = JSON.parse(cleanedContent);
      
      // Update form with generated data
      setTitle(snippetData.title);
      setDescription(snippetData.description);
      setLanguage(snippetData.language);
      setCode(snippetData.code);
      setInputExample(snippetData.inputExample || '');
      setExpectedOutput(snippetData.expectedOutput || '');
      setNotes(snippetData.notes || '');
      setTags(Array.isArray(snippetData.tags) ? snippetData.tags : []);
      
      // Move to code step
      setStep(2);
    } catch (error) {
      console.error('Failed to generate snippet:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl rounded-xl bg-navy-800 shadow-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-navy-700 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary-500/10 p-2">
                    <Sparkles className="h-6 w-6 text-primary-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">{modalTitle}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-gray-400 hover:bg-navy-700 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Progress Steps */}
                <div className="mb-8 flex items-center justify-center">
                  {[1, 2, 3].map((number) => (
                    <React.Fragment key={number}>
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                          step === number
                            ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                            : step > number
                            ? 'border-green-500 bg-green-500/10 text-green-400'
                            : 'border-navy-600 bg-navy-700/50 text-gray-400'
                        }`}
                      >
                        {step > number ? '✓' : number}
                      </div>
                      {number < 3 && (
                        <div
                          className={`h-1 w-16 ${
                            step > number ? 'bg-green-500/50' : 'bg-navy-600'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Step Content */}
                <div className="space-y-6">
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* AI Generation Section */}
                      <div className="mb-6 space-y-4 rounded-lg border border-navy-600 bg-navy-900/50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-primary-400">
                            <Bot className="h-5 w-5" />
                            <h3 className="text-sm font-medium">AI Snippet Generation</h3>
                          </div>
                          <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value as ModelId)}
                            className="rounded-lg border border-navy-600 bg-navy-900/50 px-3 py-1 text-sm text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                          >
                            {Object.entries(AVAILABLE_MODELS)
                              .filter(([_, config]) => config.type === 'gemini')
                              .map(([id, config]) => (
                                <option key={id} value={id}>
                                  {config.name}
                                </option>
                              ))}
                          </select>
                        </div>
                        <textarea
                          value={generationPrompt}
                          onChange={(e) => setGenerationPrompt(e.target.value)}
                          rows={3}
                          className="w-full rounded-lg border border-navy-600 bg-navy-900/50 px-4 py-2 text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                          placeholder="Describe the code snippet you want to generate..."
                        />
                        
                        {/* GitHub Search Section */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Github className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-400">Browse GitHub Repository</span>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={repoUrl}
                              onChange={(e) => setRepoUrl(e.target.value)}
                              placeholder="Paste GitHub repository URL"
                              className="flex-1 rounded-lg border border-navy-600 bg-navy-900/50 px-4 py-2 text-sm text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                            />
                            <button
                              onClick={() => searchGithub(repoUrl)}
                              disabled={!repoUrl || isSearchingGithub}
                              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
                                !repoUrl || isSearchingGithub
                                  ? 'cursor-not-allowed bg-navy-700 text-gray-400'
                                  : 'bg-navy-700 text-white hover:bg-navy-600'
                              }`}
                            >
                              <Search className="h-4 w-4" />
                              {isSearchingGithub ? 'Browsing...' : 'Browse'}
                            </button>
                          </div>
                          
                          {/* Breadcrumb navigation */}
                          {currentPath && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <button
                                onClick={() => searchGithub(repoUrl)}
                                className="hover:text-white"
                              >
                                root
                              </button>
                              {currentPath.split('/').map((part, index, array) => (
                                <React.Fragment key={index}>
                                  <span>/</span>
                                  <button
                                    onClick={() => searchGithub(repoUrl, array.slice(0, index + 1).join('/'))}
                                    className="hover:text-white"
                                  >
                                    {part}
                                  </button>
                                </React.Fragment>
                              ))}
                            </div>
                          )}
                          
                          {/* GitHub Results */}
                          {githubResults.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-gray-300">Repository Contents</h4>
                              <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border border-navy-600 bg-navy-900/50 p-2">
                                {githubResults.map((result) => (
                                  <button
                                    key={result.html_url}
                                    onClick={() => handleFileClick(result)}
                                    className={`w-full rounded-lg border p-2 text-left transition-colors ${
                                      selectedGithubFile?.html_url === result.html_url
                                        ? 'border-primary-500 bg-primary-500/10'
                                        : 'border-navy-600 hover:border-navy-500'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      {result.type === 'dir' ? (
                                        <FolderIcon className="h-4 w-4 text-gray-400" />
                                      ) : (
                                        <FileIcon className="h-4 w-4 text-gray-400" />
                                      )}
                                      <span className="text-sm text-white">{result.name}</span>
                                    </div>
                                    <div className="mt-1 text-xs text-gray-400">{result.path}</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Generate Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={handleGenerateSnippet}
                            disabled={!generationPrompt || isGenerating}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
                              !generationPrompt || isGenerating
                                ? 'cursor-not-allowed bg-navy-700 text-gray-400'
                                : 'bg-primary-500 text-white hover:bg-primary-600'
                            }`}
                          >
                            {isGenerating ? (
                              <>
                                <span className="animate-spin">⚡</span>
                                Generating...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4" />
                                Generate Snippet
                              </>
                            )}
                          </button>
                          
                          {selectedGithubFile && (
                            <button
                              onClick={handleGenerateWithGithub}
                              disabled={isGenerating}
                              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
                                isGenerating
                                  ? 'cursor-not-allowed bg-navy-700 text-gray-400'
                                  : 'bg-green-500 text-white hover:bg-green-600'
                              }`}
                            >
                              {isGenerating ? (
                                <>
                                  <span className="animate-spin">⚡</span>
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Github className="h-4 w-4" />
                                  Generate from GitHub
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                          Title
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full rounded-lg border border-navy-600 bg-navy-900/50 px-4 py-2 text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                          placeholder="Enter a descriptive title for your snippet"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                          Description
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                          className="w-full rounded-lg border border-navy-600 bg-navy-900/50 px-4 py-2 text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                          placeholder="Describe what your code snippet does"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                          Tags
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="flex items-center gap-1 rounded-full bg-navy-700 px-3 py-1 text-sm text-gray-300"
                            >
                              {tag}
                              <button
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 text-gray-400 hover:text-white"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={currentTag}
                              onChange={(e) => setCurrentTag(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                              className="w-32 rounded-lg border border-navy-600 bg-navy-900/50 px-3 py-1 text-sm text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                              placeholder="Add tag"
                            />
                            <button
                              onClick={handleAddTag}
                              className="rounded-lg bg-navy-700 p-2 text-gray-400 hover:bg-navy-600 hover:text-white"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                          Programming Language
                        </label>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                          {languageOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                              <button
                                key={option.value}
                                onClick={() => setLanguage(option.value)}
                                className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                                  language === option.value
                                    ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                                    : 'border-navy-600 bg-navy-900/50 text-gray-400 hover:border-navy-500 hover:bg-navy-800'
                                }`}
                              >
                                <Icon className="h-5 w-5" />
                                <span>{option.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-300">Code</label>
                          <button
                            onClick={() => setPreviewMode(!previewMode)}
                            className="text-sm text-primary-400 hover:text-primary-300"
                          >
                            {previewMode ? 'Edit' : 'Preview'}
                          </button>
                        </div>
                        {previewMode ? (
                          <div className="rounded-lg border border-navy-600 bg-[#1d1e22]">
                            <SyntaxHighlighter
                              language={language}
                              style={oneDark}
                              customStyle={{
                                margin: 0,
                                padding: '1rem',
                                background: 'transparent',
                                borderRadius: '0.5rem',
                              }}
                            >
                              {code}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            rows={10}
                            className="w-full rounded-lg border border-navy-600 bg-navy-900/50 px-4 py-2 font-mono text-sm text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                            placeholder="Paste or type your code here"
                          />
                        )}
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                          Input Example (Optional)
                        </label>
                        <textarea
                          value={inputExample}
                          onChange={(e) => setInputExample(e.target.value)}
                          rows={4}
                          className="w-full rounded-lg border border-navy-600 bg-navy-900/50 px-4 py-2 font-mono text-sm text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                          placeholder="Example input for your code"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                          Expected Output (Optional)
                        </label>
                        <textarea
                          value={expectedOutput}
                          onChange={(e) => setExpectedOutput(e.target.value)}
                          rows={4}
                          className="w-full rounded-lg border border-navy-600 bg-navy-900/50 px-4 py-2 font-mono text-sm text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                          placeholder="Expected output from your code"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                          Additional Notes (Optional)
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={4}
                          className="w-full rounded-lg border border-navy-600 bg-navy-900/50 px-4 py-2 text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                          placeholder="Add any additional notes, explanations, or usage instructions"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-navy-700 p-6">
                <button
                  onClick={() => step > 1 && setStep(step - 1)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    step > 1
                      ? 'text-gray-400 hover:text-white'
                      : 'cursor-not-allowed text-gray-600'
                  }`}
                  disabled={step === 1}
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    if (step < 3) {
                      setStep(step + 1);
                    } else {
                      handleSave();
                    }
                  }}
                  disabled={!isStepComplete(step)}
                  className={`rounded-lg px-6 py-2 text-sm font-medium ${
                    isStepComplete(step)
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'cursor-not-allowed bg-navy-700 text-gray-400'
                  }`}
                >
                  {step === 3 ? saveButtonText : 'Next'}
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 