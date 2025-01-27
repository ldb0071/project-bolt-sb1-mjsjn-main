import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, ChevronDown, ChevronUp, Tag, Clock, User, ExternalLink, Heart, Maximize2, Minimize2, X, Trash2, Edit3, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeSnippetShowcaseProps {
  title: string;
  description: string;
  code: string;
  language: string;
  inputExample?: string;
  expectedOutput?: string;
  notes?: string;
  tags?: string[];
  author?: string;
  createdAt?: string;
  onDelete?: () => void;
  onUpdate?: (snippet: CodeSnippetShowcaseProps) => void;
  onEdit?: () => void;
}

export function CodeSnippetShowcase({
  title,
  description,
  code,
  language,
  inputExample,
  expectedOutput,
  notes,
  tags = [],
  author = 'Anonymous',
  createdAt = new Date().toISOString(),
  onDelete,
  onUpdate,
  onEdit,
}: CodeSnippetShowcaseProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullView, setIsFullView] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [codeOutput, setCodeOutput] = useState<{ output?: string; error?: string } | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const executeCode = async () => {
    setIsExecuting(true);
    setCodeOutput(null);
    
    try {
      // Ensure code has consistent line endings and preserve indentation
      const formattedCode = code
        .replace(/\r\n/g, '\n')  // Normalize line endings
        .split('\n')
        .map(line => line.trimRight())  // Remove trailing whitespace but preserve indentation
        .join('\n');

      const response = await fetch('http://localhost:8080/api/execute-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: formattedCode }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setCodeOutput(result);
    } catch (error: any) {
      setCodeOutput({ error: `Code execution error: ${error?.message || 'Unknown error'}` });
    } finally {
      setIsExecuting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleFullView = () => {
    setIsFullView(!isFullView);
    if (!isFullView) {
      setIsExpanded(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && window.confirm('Are you sure you want to delete this snippet?')) {
      onDelete();
    }
  };

  const handleUpdate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdate) {
      onUpdate({
        title,
        description,
        code,
        language,
        inputExample,
        expectedOutput,
        notes,
        tags,
        author,
        createdAt,
      });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group bg-navy-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-navy-700 hover:border-primary-500/50 transition-all duration-300 shadow-lg hover:shadow-primary-500/10 cursor-pointer
        ${isFullView ? 'fixed inset-4 z-50 overflow-y-auto' : ''}`}
      onClick={() => !isFullView && toggleFullView()}
    >
      {/* Overlay for full view */}
      {isFullView && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10" onClick={(e) => e.stopPropagation()} />
      )}

      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-navy-700 bg-navy-800/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs font-mono rounded-md bg-primary-500/10 text-primary-400 border border-primary-500/20">
                {language}
              </span>
              {isFullView && tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-md bg-navy-700/50 text-gray-400 border border-navy-600/50"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors line-clamp-1">
              {title}
            </h2>
            <p className={`text-gray-400 text-sm ${isFullView ? '' : 'line-clamp-1'} transition-all duration-200`}>
              {description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onEdit}
                className="rounded-lg p-2 text-gray-400 hover:bg-navy-700 hover:text-white"
              >
                <Edit3 className="h-4 w-4" />
              </motion.button>
            )}
            {onDelete && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onDelete}
                className="rounded-lg p-2 text-gray-400 hover:bg-navy-700 hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="rounded-lg p-2 text-gray-400 hover:bg-navy-700 hover:text-white"
            >
              <Copy className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFullView(!isFullView)}
              className="rounded-lg p-2 text-gray-400 hover:bg-navy-700 hover:text-white"
            >
              {isFullView ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </motion.button>
          </div>
        </div>

        {/* Meta Information - Only show in full view */}
        {isFullView && (
          <div className="flex flex-wrap items-center gap-4 text-sm mt-4">
            <div className="flex items-center gap-2 text-gray-400">
              <User className="w-4 h-4" />
              <span className="hover:text-white transition-colors cursor-pointer">{author}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Code Editor Section */}
      <div className="code-editor">
        <div className="flex items-center justify-between px-4 py-2 bg-[#1d1e22] border-y border-navy-700">
          <span className="font-mono text-sm text-gray-400">{language.toUpperCase()}</span>
          <div className="flex items-center gap-2">
            {language === 'python' && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  executeCode();
                }}
                className="p-1.5 rounded-lg hover:bg-navy-700/50 transition-colors group/run"
                title="Run code"
                disabled={isExecuting}
              >
                <Play className={`w-4 h-4 ${isExecuting ? 'text-gray-500' : 'text-green-400 group-hover/run:text-green-300'}`} />
              </motion.button>
            )}
            {!isFullView && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy();
                }}
                className="p-1.5 rounded-lg hover:bg-navy-700/50 transition-colors group/copy"
                title={isCopied ? "Copied!" : "Copy code"}
              >
                {isCopied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400 group-hover/copy:text-white" />
                )}
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                toggleFullView();
              }}
              className="p-1.5 rounded-lg hover:bg-navy-700/50 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-white" />
            </motion.button>
          </div>
        </div>
        <div className="relative group/code bg-[#1d1e22]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy-900/50 pointer-events-none opacity-0 group-hover/code:opacity-100 transition-opacity duration-300" />
          <SyntaxHighlighter
            language={language.toLowerCase()}
            style={oneDark}
            customStyle={{
              margin: 0,
              padding: isFullView ? '2rem' : '1rem',
              background: 'transparent',
              fontSize: '0.9rem',
              maxHeight: isFullView ? 'none' : '150px',
              borderRadius: '0 0 0.75rem 0.75rem',
            }}
            showLineNumbers={isFullView}
            wrapLines={true}
            className="scrollbar-thin scrollbar-thumb-navy-600 scrollbar-track-transparent"
          >
            {code}
          </SyntaxHighlighter>
        </div>

        {/* Code Execution Output */}
        {codeOutput && (
          <div className="border-t border-navy-700 bg-navy-800/50 p-4">
            <h3 className="text-sm font-medium text-primary-400 mb-2">Execution Result</h3>
            {codeOutput.error ? (
              <div className="text-red-400 font-mono text-sm whitespace-pre-wrap">{codeOutput.error}</div>
            ) : (
              <div className="text-green-400 font-mono text-sm whitespace-pre-wrap">{codeOutput.output}</div>
            )}
          </div>
        )}
      </div>

      {/* Examples and Notes Section - Only show in full view */}
      {isFullView && (inputExample || expectedOutput || notes) && (
        <div className="border-t border-navy-700 bg-navy-800/50">
          <motion.button
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="w-full p-4 flex items-center justify-between text-gray-400 hover:text-white transition-colors"
          >
            <span className="font-medium flex items-center gap-2">
              <span>Examples & Notes</span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">
                {[inputExample, expectedOutput, notes].filter(Boolean).length}
              </span>
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.button>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden bg-navy-800/30"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 pb-6 space-y-6">
                  {inputExample && (
                    <div>
                      <h3 className="text-sm font-medium text-primary-400 mb-2">Input Example</h3>
                      <div className="relative group/example">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy-900/50 pointer-events-none opacity-0 group-hover/example:opacity-100 transition-opacity duration-300" />
                        <SyntaxHighlighter
                          language={language}
                          style={oneDark}
                          customStyle={{
                            margin: 0,
                            padding: '1rem',
                            background: '#1d1e22',
                            borderRadius: '0.5rem',
                            fontSize: '0.9rem',
                          }}
                          className="scrollbar-thin scrollbar-thumb-navy-600 scrollbar-track-transparent"
                        >
                          {inputExample}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  )}
                  {expectedOutput && (
                    <div>
                      <h3 className="text-sm font-medium text-primary-400 mb-2">Expected Output</h3>
                      <div className="relative group/output">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy-900/50 pointer-events-none opacity-0 group-hover/output:opacity-100 transition-opacity duration-300" />
                        <SyntaxHighlighter
                          language={language}
                          style={oneDark}
                          customStyle={{
                            margin: 0,
                            padding: '1rem',
                            background: '#1d1e22',
                            borderRadius: '0.5rem',
                            fontSize: '0.9rem',
                          }}
                          className="scrollbar-thin scrollbar-thumb-navy-600 scrollbar-track-transparent"
                        >
                          {expectedOutput}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  )}
                  {notes && (
                    <div className="bg-navy-900/30 rounded-lg p-4 border border-navy-700/50">
                      <h3 className="text-sm font-medium text-primary-400 mb-2 flex items-center gap-2">
                        Additional Notes
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{notes}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}