import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  Loader2, X, FolderTree, Bot, User, Send, MessageSquare, TreePine, 
  Globe, Lightbulb, Code2, FileText, Image as ImageIcon, Package, File, CircleDot,
  Code, FileJson, FileSpreadsheet, FileArchive, Coffee, Hash, 
  Database, Settings, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ChatMessage, sendChatMessage, AssistantRole, ROLE_CONFIGS, ModelId, AVAILABLE_MODELS } from '../services/chatService';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Dialog, Transition } from '@headlessui/react';
import { Tooltip } from './Tooltip';
import { CreateSnippetModal } from './CreateSnippetModal';
import { Modal } from './Modal';
import mermaid from 'mermaid';

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  logLevel: 'error',
  themeVariables: {
    darkMode: true,
    background: '#0f172a',
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    tertiaryColor: '#1e293b',
    primaryTextColor: '#e2e8f0',
    secondaryTextColor: '#94a3b8',
    lineColor: '#334155'
  }
});

interface RepoNode {
  name: string;
  path: string;
  type: 'tree' | 'blob';
  children?: RepoNode[];
  size?: number;
  sha?: string;
}

interface RepoVisualizerProps {
  repoUrl: string;
  width?: number;
  height?: number;
  onClose?: () => void;
}

// Add function to generate tree structure string
const generateTreeStructure = (node: RepoNode, prefix: string = ''): string => {
  let result = `${prefix}${node.name}${node.type === 'tree' ? '/' : ''}\n`;
  
  if (node.children) {
    const childPrefix = prefix + '  ';
    node.children.forEach((child, index) => {
      const isLast = index === node.children!.length - 1;
      const childLine = generateTreeStructure(child, childPrefix);
      result += childLine;
    });
  }
  
  return result;
};

// Add helper function to get all files
const getAllFiles = (node: RepoNode): RepoNode[] => {
  let files: RepoNode[] = [];
  if (node.type === 'blob') {
    files.push(node);
  }
  if (node.children) {
    node.children.forEach(child => {
      files = files.concat(getAllFiles(child));
    });
  }
  return files;
};

// Add function to find related files
const findRelatedFiles = (node: RepoNode, currentPath: string): string[] => {
  const relatedFiles: string[] = [];
  const currentExt = currentPath.split('.').pop()?.toLowerCase();
  const currentDir = currentPath.split('/').slice(0, -1).join('/');

  const traverse = (n: RepoNode) => {
    if (n.type === 'blob') {
      const fileExt = n.path.split('.').pop()?.toLowerCase();
      const fileDir = n.path.split('/').slice(0, -1).join('/');
      
      // Add files with same extension
      if (fileExt === currentExt) {
        relatedFiles.push(n.path);
      }
      // Add files in same directory
      else if (fileDir === currentDir) {
        relatedFiles.push(n.path);
      }
      // Add files that might be related by common naming
      else {
        const currentName = currentPath.split('/').pop()?.split('.')[0].toLowerCase() || '';
        const fileName = n.path.split('/').pop()?.split('.')[0].toLowerCase() || '';
        if (currentName && fileName.includes(currentName) || currentName.includes(fileName)) {
          relatedFiles.push(n.path);
        }
      }
    }
    n.children?.forEach(traverse);
  };

  traverse(node);
  return [...new Set(relatedFiles)].filter(f => f !== currentPath).slice(0, 5); // Get unique files, exclude current file, limit to 5
};

// Add file type categorization
const getFileType = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  
  const typeMap: Record<string, string> = {
    // Code files
    ts: 'TypeScript',
    tsx: 'React',
    js: 'JavaScript',
    jsx: 'React',
    py: 'Python',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    go: 'Go',
    rs: 'Rust',
    rb: 'Ruby',
    php: 'PHP',
    
    // Config files
    json: 'Config',
    yaml: 'Config',
    yml: 'Config',
    toml: 'Config',
    ini: 'Config',
    env: 'Config',
    
    // Documentation
    md: 'Documentation',
    txt: 'Documentation',
    pdf: 'Documentation',
    doc: 'Documentation',
    docx: 'Documentation',
    
    // Images
    png: 'Image',
    jpg: 'Image',
    jpeg: 'Image',
    gif: 'Image',
    svg: 'Image',
    
    // Package files
    lock: 'Dependencies',
    'package.json': 'Dependencies',
    'requirements.txt': 'Dependencies',
    'cargo.toml': 'Dependencies',
    'gemfile': 'Dependencies',
  };

  return typeMap[ext] || 'Other';
};

// Add smart grouping function
const groupFilesByType = (nodes: RepoNode[]): Record<string, RepoNode[]> => {
  const groups: Record<string, RepoNode[]> = {};
  
  const processNode = (node: RepoNode) => {
    if (node.type === 'blob') {
      const type = getFileType(node.name);
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(node);
    }
    node.children?.forEach(processNode);
  };
  
  nodes.forEach(processNode);
  return groups;
};

// Add file size formatter
const formatFileSize = (size?: number): string => {
  if (!size) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = size;
  let unitIndex = 0;
  
  while (value > 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  
  return `${value.toFixed(1)} ${units[unitIndex]}`;
};

// Add AI-powered file suggestions
const getAISuggestions = async (query: string, files: RepoNode[]): Promise<RepoNode[]> => {
  try {
    const fileContext = files.map(f => `${f.path} (${f.type})`).join('\n');
    const prompt = `Given these files in a repository:\n${fileContext}\n\nQuery: ${query}\n\nReturn the most relevant files for this query, considering file names, types, and paths. Think about code relationships and common development patterns.`;
    
    const response = await sendChatMessage(
      [{
        id: crypto.randomUUID(),
        role: 'user',
        content: prompt,
        timestamp: new Date().toISOString()
      }],
      geminiKey,
      'default',
      currentModel
    );

    // Parse AI response to get suggested files
    const suggestedPaths = response.content
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.split(' ')[0]); // Get first word of each line

    return files.filter(f => suggestedPaths.some(p => f.path.includes(p)));
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    return [];
  }
};

// Add intelligent file grouping
const getAIGrouping = async (files: RepoNode[]): Promise<Record<string, RepoNode[]>> => {
  try {
    const fileContext = files.map(f => `${f.path} (${f.type})`).join('\n');
    const prompt = `Analyze these files and group them intelligently based on their purpose, relationships, and dependencies:\n${fileContext}\n\nProvide logical groupings that would help developers understand the codebase better.`;
    
    const response = await sendChatMessage(
      [{
        id: crypto.randomUUID(),
        role: 'user',
        content: prompt,
        timestamp: new Date().toISOString()
      }],
      geminiKey,
      'default',
      currentModel
    );

    // Parse AI response to get groupings
    const groups: Record<string, RepoNode[]> = {};
    let currentGroup = '';
    
    response.content.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.endsWith(':')) {
        currentGroup = trimmedLine.slice(0, -1);
        groups[currentGroup] = [];
      } else if (trimmedLine && currentGroup) {
        const file = files.find(f => f.path.includes(trimmedLine));
        if (file) {
          groups[currentGroup].push(file);
        }
      }
    });

    return groups;
  } catch (error) {
    console.error('Error getting AI grouping:', error);
    return {};
  }
};

// Add optimized file search with trie data structure
class FileTrie {
  root: { [key: string]: any } = {};
  
  insert(path: string) {
    let node = this.root;
    for (const char of path.toLowerCase()) {
      if (!node[char]) node[char] = {};
      node = node[char];
    }
    node.isEnd = true;
    node.originalPath = path;
  }
  
  search(prefix: string): string[] {
    const results: string[] = [];
    let node = this.root;
    prefix = prefix.toLowerCase();
    
    // Navigate to prefix node
    for (const char of prefix) {
      if (!node[char]) return results;
      node = node[char];
    }
    
    // Collect all paths under this node
    const collect = (node: any, path: string) => {
      if (node.isEnd) results.push(node.originalPath);
      for (const char in node) {
        if (char !== 'isEnd' && char !== 'originalPath') {
          collect(node[char], path + char);
        }
      }
    };
    
    collect(node, prefix);
    return results.slice(0, 50); // Limit results
  }
}

// Add virtualized list component for file rendering
const VirtualizedFileList = React.memo(({ items, renderItem, itemHeight = 40 }: {
  items: RepoNode[];
  renderItem: (item: RepoNode) => React.ReactNode;
  itemHeight?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(start + Math.ceil(clientHeight / itemHeight) + 1, items.length);
    setVisibleRange({ start, end });
  }, [itemHeight, items.length]);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  return (
    <div 
      ref={containerRef} 
      className="overflow-auto h-full"
      style={{ position: 'relative' }}
    >
      <div style={{ height: items.length * itemHeight }}>
        <div style={{
          position: 'absolute',
          top: visibleRange.start * itemHeight,
          left: 0,
          right: 0,
        }}>
          {items.slice(visibleRange.start, visibleRange.end).map(renderItem)}
        </div>
      </div>
    </div>
  );
});

// Optimize file tree traversal
const optimizedTraverseTree = (node: RepoNode, callback: (node: RepoNode) => void) => {
  const queue = [node];
  while (queue.length > 0) {
    const current = queue.shift()!;
    callback(current);
    if (current.children) {
      queue.push(...current.children);
    }
  }
};

// Add memoized web view component
const WebView = React.memo(({ data, searchTerm, handleFileClick }: {
  data: RepoNode | null;
  searchTerm: string;
  handleFileClick: (node: RepoNode) => void;
}) => {
  const filteredFiles = useMemo(() => {
    if (!data) return [];
    const files: RepoNode[] = [];
    const traverse = (node: RepoNode) => {
      if (node.type === 'blob') {
        if (!searchTerm || node.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          files.push(node);
        }
      }
      node.children?.forEach(traverse);
    };
    traverse(data);
    return files;
  }, [data, searchTerm]);

  return (
    <div className="h-[calc(100vh-200px)] overflow-auto p-4 hardware-accelerated">
      <div className="space-y-1">
        {filteredFiles.map((file) => (
          <div
            key={file.path}
            onClick={() => handleFileClick(file)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-navy-700/50 cursor-pointer transition-colors hardware-accelerated"
          >
            <FileIcon className="w-4 h-4 text-gray-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-300 truncate">{file.name}</div>
              <div className="text-xs text-gray-500 truncate">{file.path}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// Define group icons mapping
const groupIcons: Record<string, React.ReactNode> = {
  'JavaScript': <Code className="w-4 h-4 text-yellow-400" />,
  'TypeScript': <Code className="w-4 h-4 text-blue-400" />,
  'JSON': <FileJson className="w-4 h-4 text-green-400" />,
  'Markdown': <FileText className="w-4 h-4 text-purple-400" />,
  'Images': <ImageIcon className="w-4 h-4 text-pink-400" />,
  'Package': <Package className="w-4 h-4 text-orange-400" />,
  'Data': <FileSpreadsheet className="w-4 h-4 text-cyan-400" />,
  'Archive': <FileArchive className="w-4 h-4 text-gray-400" />,
  'Java': <Coffee className="w-4 h-4 text-red-400" />,
  'Python': <Hash className="w-4 h-4 text-green-400" />,
  'SQL': <Database className="w-4 h-4 text-blue-400" />,
  'HTML': <Globe className="w-4 h-4 text-orange-400" />,
  'Config': <Settings className="w-4 h-4 text-gray-400" />,
  'Shell': <Terminal className="w-4 h-4 text-green-400" />,
};

// Add function to fetch repo data
const fetchRepoData = async (repoUrl: string) => {
  try {
    const [owner, repo] = repoUrl
      .replace('https://github.com/', '')
      .split('/');

    const githubToken = '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';
    
    const headers = {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json'
    };

    // First, get the default branch
    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers }
    );

    if (!repoResponse.ok) {
      throw new Error(`GitHub API responded with status ${repoResponse.status}`);
    }

    const repoData = await repoResponse.json();
    const defaultBranch = repoData.default_branch;

    // Then, get the tree
    const treeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
      { headers }
    );

    if (!treeResponse.ok) {
      throw new Error(`GitHub API responded with status ${treeResponse.status}`);
    }

    const treeData = await treeResponse.json();
    
    // Convert the flat tree to a hierarchical structure
    const root: RepoNode = {
      name: repo,
      path: '',
      type: 'tree',
      children: []
    };

    const pathMap = new Map<string, RepoNode>();
    pathMap.set('', root);

    treeData.tree.forEach((item: any) => {
      const pathParts = item.path.split('/');
      const name = pathParts[pathParts.length - 1];
      const parentPath = pathParts.slice(0, -1).join('/');
      const parent = pathMap.get(parentPath) || root;

      const node: RepoNode = {
        name,
        path: item.path,
        type: item.type,
        size: item.size,
        sha: item.sha
      };

      if (item.type === 'tree') {
        node.children = [];
        pathMap.set(item.path, node);
      }

      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(node);
    });

    return root;
  } catch (error) {
    console.error('Error fetching repo data:', error);
    throw error;
  }
};

// Add PreviewModal component
const PreviewModal = ({ isOpen, onClose, content, language }: {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  language: string;
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-navy-900/90 backdrop-blur-sm" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-4xl rounded-lg bg-navy-800 border border-navy-600 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-lg font-semibold text-white">
                  Code Preview
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-navy-700/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-auto max-h-[70vh] rounded-lg">
                <SyntaxHighlighter
                  language={language.toLowerCase()}
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.5rem',
                    background: 'rgb(15 23 42 / 0.5)',
                  }}
                >
                  {content}
                </SyntaxHighlighter>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  treeData: RepoNode;
  repoUrl: string;  // Add repoUrl to props
}

const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ 
  isOpen, 
  onClose,
  treeData,
  repoUrl
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'mermaid' | 'graphviz' | 'drawio'>('mermaid');
  const [selectedModel, setSelectedModel] = useState<ModelId>('gemini-1.5-pro');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagramContent, setDiagramContent] = useState<string>('');
  const [mode, setMode] = useState<'auto' | 'custom'>('auto');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isDiagramDragging, setIsDiagramDragging] = useState(false);
  const [diagramPosition, setDiagramPosition] = useState({ x: 0, y: 0 });
  const currentModel = useStore((state) => state.currentModel);
  const geminiKey = useStore((state) => state.geminiKey);
  const openaiKey = useStore((state) => state.openaiKey);
  const diagramRef = useRef<HTMLDivElement>(null);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle zoom controls
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleZoomReset = () => {
    setZoom(100);
    setDiagramPosition({ x: 0, y: 0 });
  };

  // Handle diagram dragging
  const handleDragStart = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button only
      setIsDiagramDragging(true);
    }
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (isDiagramDragging) {
      setDiagramPosition(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  };

  const handleDragEnd = () => {
    setIsDiagramDragging(false);
  };

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          handleZoomIn();
        } else if (e.key === '-') {
          e.preventDefault();
          handleZoomOut();
        } else if (e.key === '0') {
          e.preventDefault();
          handleZoomReset();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen]);

  // Update the models definition in ArchitectureModal component
  const models = Object.entries(AVAILABLE_MODELS)
    .map(([id, config]) => ({ id, ...config }))
    .filter(model => {
      if (model.provider === 'openai' && !openaiKey) return false;
      if (model.provider === 'google' && !geminiKey) return false;
      return true;
    });

  // Ensure selectedModel is valid
  useEffect(() => {
    if (!models.some(m => m.id === selectedModel)) {
      setSelectedModel(models[0]?.id || 'gemini-1.5-pro');
    }
  }, [models, selectedModel]);

  const analyzeArchitecture = async (modelId: string, apiKey: string, customArchitecturePrompt?: string) => {
    setIsAnalyzing(true);
    try {
      // Debug: Log the custom prompt if provided
      if (customArchitecturePrompt) {
        console.log('Custom prompt provided:', customArchitecturePrompt);
      }

      // Debug: Log the repository URL being analyzed
      console.log('Analyzing repository:', repoUrl);

      // First, find all potential model files with expanded patterns
      const modelFiles = getAllFiles(treeData).filter(file => {
        const path = file.path.toLowerCase();
        
        // Debug: Log each file being checked
        console.log('Checking file:', path);
        
        const mlExtensions = [
          '.py', '.ipynb', '.pt', '.pth', '.h5', '.keras',
          '.onnx', '.pkl', '.joblib', '.tf', '.pb',
          '.safetensors', '.bin', '.model', '.json', '.yaml', '.yml'
        ];
        
        const hasMLExtension = mlExtensions.some(ext => path.endsWith(ext));
        // Debug: Log if file has ML extension
        if (hasMLExtension) {
          console.log('File has ML extension:', path);
        }
        
        const mlKeywords = [
          'diffusion', 'unet', 'vae', 'autoencoder', 'noise', 'denoise',
          'ddpm', 'ddim', 'score', 'sampling', 'latent', 'stable',
          'guidance', 'condition', 'unconditional', 'timestep', 'scheduler',
          'pipeline', 'prior', 'posterior', 'model', 'network', 'net',
          'architecture', 'transformer', 'bert', 'gpt', 'lstm', 'rnn',
          'cnn', 'neural', 'attention', 'encoder', 'decoder', 'torch',
          'tensorflow', 'tf', 'keras', 'sklearn', 'huggingface'
        ];
        
        const hasMLKeyword = mlKeywords.some(keyword => path.includes(keyword.toLowerCase()));
        // Debug: Log if file has ML keyword
        if (hasMLKeyword) {
          console.log('File has ML keyword:', path);
        }

        return hasMLExtension || hasMLKeyword;
      });

      // Debug: Log all found model files
      console.log('Total potential model files found:', modelFiles.length);
      console.log('Model files:', modelFiles.map(f => f.path));

      if (modelFiles.length === 0) {
        console.log('No model files found in repository');
        const noModelDiagram = `graph TD
          subgraph "No Model Found"
            NM["No valid ML model files found<br/>Please select a file containing<br/>model architecture"]
          end`;
        setDiagramContent(noModelDiagram);
        return;
      }

      // Extract owner and repo from the URL
      const [owner, repo] = repoUrl
        .replace('https://github.com/', '')
        .split('/');

      // Debug: Log repository info
      console.log('Repository owner:', owner);
      console.log('Repository name:', repo);

      // Read the contents of the model files using GitHub's raw content URL
      const fileContents = await Promise.all(
        modelFiles.map(async file => {
          try {
            // Debug: Log file being fetched
            console.log('Fetching file:', file.path);
            
            const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${file.path}`;
            let response = await fetch(rawUrl);
            
            // Debug: Log response status
            console.log('Main branch response status:', response.status);
            
            if (!response.ok) {
              const masterUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/${file.path}`;
              response = await fetch(masterUrl);
              // Debug: Log master branch attempt
              console.log('Master branch response status:', response.status);
            }
            
            if (response.ok) {
              const content = await response.text();
              
              // Debug: Log content length
              console.log('File content length:', content.length);
              
              const hasMLContent = content.match(
                /(import\s+|from\s+)(torch|tensorflow|keras|transformers|sklearn|numpy|pandas|huggingface|pytorch|jax|flax|mxnet|paddlepaddle|mindspore|oneflow|cntk|chainer|fastai|allennlp|spacy|gensim|diffusers)/i
              ) || content.match(
                /(class|def)\s+\w*(Model|Network|Transformer|Encoder|Decoder|Layer|Attention|LSTM|GRU|CNN|RNN|Neural|UNet|VAE|Diffusion|DDPM|DDIM|Scheduler|Pipeline)/i
              ) || content.match(
                /(diffusion|unet|vae|autoencoder|noise_pred|denoise|ddpm|ddim|score|sampling|latent|stable|guidance|condition|timestep|scheduler)/i
              );
              
              // Debug: Log ML content detection
              console.log('Has ML content:', !!hasMLContent, file.path);
              
              if (hasMLContent) {
              return {
                path: file.path,
                content: content
              };
            }
            }
            return null;
          } catch (error) {
            console.error(`Error reading file ${file.path}:`, error);
            return null;
          }
        })
      );

      // Debug: Log file content results
      console.log('Files with content:', fileContents.filter(Boolean).length);

      // Filter out failed reads and non-ML files
      const validFiles = fileContents.filter(Boolean);

      // Debug: Log valid files found
      console.log('Valid ML files found:', validFiles.length);
      console.log('Valid file paths:', validFiles.map(f => f.path));

      if (validFiles.length === 0) {
        console.log('No valid ML model files found');
        const noModelDiagram = `graph TD
          subgraph "No Model Found"
            NM["No valid ML model files found<br/>Please select a file containing<br/>model architecture"]
          end`;
        setDiagramContent(noModelDiagram);
        return;
      }

      console.log('Found valid ML files:', validFiles.map(f => f.path));

      // Create the analysis message with actual code content and diffusion-specific focus
      const analysisPrompt = customPrompt || `Analyze these ML model files and create a Mermaid diagram showing the architecture, with special focus on diffusion model components. The files are from the repository ${owner}/${repo}.

File contents:
${validFiles.map(file => `
=== ${file.path} ===
${file.content}
`).join('\n')}

Create a Mermaid diagram that shows:
1. The overall diffusion model architecture
2. Key components (UNet, VAE, etc.) and their relationships
3. Data flow between components
4. Important parameters and dimensions
5. Noise scheduling and sampling process

Focus on:
- Diffusion process and components
- UNet architecture if present
- VAE/Autoencoder structure if present
- Attention mechanisms
- Conditioning mechanisms
- Timestep embeddings
- Noise prediction/denoising process

IMPORTANT - Follow these Mermaid syntax rules:
1. Start with "graph TD"
2. Use proper node syntax: id["label"]
3. Use --> for connections
4. For subgraphs use: subgraph "name" ... end
5. Use <br/> for line breaks
6. Escape special characters in labels
7. No spaces in node IDs
8. Keep connections simple: A --> B
9. Group related components in subgraphs

Example format for a diffusion model:
\`\`\`mermaid
graph TD
    %% Input Processing Section
    subgraph "Input Processing"
        input["Input Image<br/>Shape: (B, C, H, W)"]
        time["Timestep t<br/>Range: [0, 1000]"]
        cond["Conditioning<br/>Text/Image/Class"]
        noise["Noise Schedule<br/>β: 0.0001 → 0.02"]
    end

    %% Encoder Section
    subgraph "Encoder Pipeline"
        vae_enc["VAE Encoder<br/>Channels: 3 → 64 → 128<br/>Resolution: H×W → H/8×W/8"]
        pos_emb["Positional Embedding<br/>Dim: 256"]
        time_emb["Time Embedding<br/>SinCos, Dim: 256"]
        cond_proc["Condition Processor<br/>CLIP/Embedding"]
    end

    %% UNet Architecture
    subgraph "UNet Backbone"
        %% Downsampling Path
        subgraph "Downsampling"
            down1["Down Block 1<br/>Res: H/8 × W/8<br/>Ch: 128 → 256"]
            down2["Down Block 2<br/>Res: H/16 × W/16<br/>Ch: 256 → 512"]
            down3["Down Block 3<br/>Res: H/32 × W/32<br/>Ch: 512 → 1024"]
        end

        %% Middle Section
        subgraph "Middle Blocks"
            mid_attn["Cross Attention<br/>Heads: 8<br/>Head Dim: 64"]
            mid_block["ResNet Block<br/>Groups: 32<br/>Channels: 1024"]
        end

        %% Upsampling Path
        subgraph "Upsampling"
            up3["Up Block 3<br/>Res: H/16 × W/16<br/>Ch: 1024 → 512"]
            up2["Up Block 2<br/>Res: H/8 × W/8<br/>Ch: 512 → 256"]
            up1["Up Block 1<br/>Res: H/4 × W/4<br/>Ch: 256 → 128"]
        end
    end

    %% Output Processing
    subgraph "Output Processing"
        pred["Noise Predictor<br/>1x1 Conv, Ch: 128 → 3"]
        denoise["Denoising Process<br/>DDIM/DDPM Steps: 20-50"]
        vae_dec["VAE Decoder<br/>Channels: 128 → 64 → 3<br/>Resolution: H/8×W/8 → H×W"]
    end

    %% Skip Connections
    subgraph "Skip Connections"
        skip1["Skip 1<br/>Feature Maps: 256"]
        skip2["Skip 2<br/>Feature Maps: 512"]
        skip3["Skip 3<br/>Feature Maps: 1024"]
    end

    %% Connections
    input --> vae_enc
    time --> time_emb
    cond --> cond_proc
    noise --> denoise

    %% Encoder connections
    vae_enc --> down1
    time_emb --> down1
    cond_proc --> mid_attn

    %% Downsampling connections
    down1 --> down2 --> down3
    down1 --> skip1
    down2 --> skip2
    down3 --> skip3

    %% Middle processing
    down3 --> mid_block
    mid_block --> mid_attn
    mid_attn --> up3

    %% Upsampling connections with skip connections
    skip3 --> up3
    up3 --> up2
    skip2 --> up2
    up2 --> up1
    skip1 --> up1

    %% Output processing
    up1 --> pred
    pred --> denoise
    denoise --> vae_dec

    %% Styling
    classDef default fill:#2A4365,stroke:#4A5568,color:#E2E8F0
    classDef attention fill:#553C9A,stroke:#6B46C1,color:#E9D8FD
    classDef process fill:#2C7A7B,stroke:#319795,color:#E6FFFA
    class mid_attn attention
    class denoise,pred process
\`\`\`

Return ONLY the Mermaid diagram code block, nothing else.`;

      const userMessage = {
        role: 'user',
        content: analysisPrompt,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      };

      const response = await sendChatMessage(
        [userMessage],
        apiKey,
        'architect',
        modelId
      );

      if (response?.content) {
        console.log('Raw model response:', response.content);

        // Extract diagram content with standardized patterns
        const patterns = [
          /```(?:mermaid)?\n([\s\S]*?)\n```/,  // Standard markdown code blocks
          /`{3,}mermaid\s*([\s\S]*?)`{3,}/i,   // Mermaid-specific blocks
          /graph\s+[A-Z]+\s*([\s\S]*?)(?:\n\s*$|$)/, // Direct graph content
          /(?:subgraph\s+"[^"]+"[\s\S]*?end\s*\n)+/  // Subgraph content without markers
        ];

        let diagramContent = null;
        for (const pattern of patterns) {
          const match = response.content.match(pattern);
          if (match && match[1]) {
            diagramContent = match[1].trim();
            console.log('Matched pattern:', pattern);
            console.log('Extracted content:', diagramContent);
            break;
          }
        }

        // If no markdown blocks found, try to extract the diagram directly
        if (!diagramContent) {
          if (response.content.includes('subgraph')) {
            diagramContent = response.content.trim();
            console.log('Using direct content with subgraph');
          } else if (response.content.includes('-->')) {
            diagramContent = response.content.trim();
            console.log('Using direct content with connections');
          }
        }

        if (!diagramContent) {
          // If no diagram content found, use the default "No Model Found" diagram
          diagramContent = `graph TD
    subgraph "No Model Found"
        NM["No valid ML model files found<br/>Please select a file containing<br/>model architecture"]
    end`;
          console.log('Using default "No Model Found" diagram');
        }

        // Standardized cleanup for all models
        let cleanedDiagram = diagramContent
          // Remove any markdown code block markers
          .replace(/^```mermaid\s*\n?/gm, '')
          .replace(/```\s*$/g, '')
          .trim();

        // Remove any existing graph directives and ensure it starts with graph TD
        cleanedDiagram = cleanedDiagram
          .replace(/^graph\s+[A-Z]+\s*/gm, '')  // Remove any existing graph directives
          .trim();
        
        if (!cleanedDiagram.startsWith('graph TD')) {
          cleanedDiagram = `graph TD\n${cleanedDiagram}`;
        }

        // Standardized node and connection cleanup
        cleanedDiagram = cleanedDiagram
          // Fix node IDs (remove spaces and special chars)
          .replace(/(\w+)\s*\[/g, (_, id) => 
            `${id.replace(/[^\w]/g, '_')}[`)
          // Fix node labels
          .replace(/\[(.*?)\]/g, (match, content) => {
            const cleaned = content
              .replace(/[<>]/g, '')  // Remove angle brackets
              .replace(/[()]/g, '')  // Remove parentheses
              .replace(/;/g, ',')    // Replace semicolons with commas
              .replace(/"/g, '')     // Remove quotes
              .replace(/<br>/g, '<br/>')  // Fix line break syntax
              .replace(/\s+/g, ' ')  // Normalize whitespace
              .trim();
            return `["${cleaned}"]`;
          })
          // Fix subgraph declarations
          .replace(/subgraph\s+"([^"]+)"\s*\n/g, 'subgraph "$1"\n')
          // Fix connections
          .replace(/\s*-->\s*/g, ' --> ')
          .replace(/(\w+)\s*&\s*(\w+)/g, '$1 & $2')
          // Clean up empty lines and extra whitespace
          .split('\n')
          .map(line => line.trim())
          .filter(line => line)
          .join('\n');

        console.log('Cleaned diagram:', cleanedDiagram);
        setDiagramContent(cleanedDiagram);
      } else {
        console.error('Empty or invalid response from model');
        throw new Error('Model returned an empty or invalid response');
      }
    } catch (error) {
      console.error('Error analyzing ML architecture:', error);
      toast.error(error instanceof Error ? error.message : 'Error analyzing ML model architecture');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Add this useEffect hook to handle diagram rendering
  useEffect(() => {
    if (diagramContent && diagramRef.current) {
      const renderDiagram = async () => {
        try {
          // Clear previous content
          diagramRef.current.innerHTML = '';
          
          // Wait for next tick to ensure DOM is ready
          await new Promise(resolve => setTimeout(resolve, 0));
          
          // Initialize Mermaid with strict error handling
          await mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            securityLevel: 'loose',
            logLevel: 'error',
            themeVariables: {
              darkMode: true,
              background: '#0f172a',
              primaryColor: '#3b82f6',
              secondaryColor: '#64748b',
              tertiaryColor: '#1e293b',
              primaryTextColor: '#e2e8f0',
              secondaryTextColor: '#94a3b8',
              lineColor: '#334155'
            }
          });

          // Clean up the diagram content
          let cleanedDiagram = diagramContent
            .replace(/^```mermaid\s*\n?/gm, '')
            .replace(/```\s*$/g, '')
            .trim();

          // Ensure diagram starts with graph TD and remove any existing graph directives
          cleanedDiagram = cleanedDiagram
            .replace(/^graph\s+[A-Z]+\s*/gm, '')  // Remove any existing graph directives
            .trim();
          
          if (!cleanedDiagram.startsWith('graph TD')) {
            cleanedDiagram = `graph TD\n${cleanedDiagram}`;
          }

          // Fix node labels and connections
          cleanedDiagram = cleanedDiagram
            // Fix node IDs (remove spaces and special chars)
            .replace(/(\w+)\s*\[/g, (_, id) => 
              `${id.replace(/[^\w]/g, '_')}[`)
            // Fix node labels
            .replace(/\[(.*?)\]/g, (match, content) => {
              const cleaned = content
                .replace(/[<>]/g, '')  // Remove angle brackets
                .replace(/[()]/g, '')  // Remove parentheses
                .replace(/;/g, ',')    // Replace semicolons with commas
                .replace(/"/g, '')     // Remove quotes
                .replace(/<br>/g, '<br/>')  // Fix line break syntax
                .replace(/\s+/g, ' ')  // Normalize whitespace
                .trim();
              return `["${cleaned}"]`;
            })
            // Fix subgraph declarations
            .replace(/subgraph\s+"([^"]+)"\s*\n/g, 'subgraph "$1"\n')
            // Fix connections
            .replace(/\s*-->\s*/g, ' --> ')
            .replace(/(\w+)\s*&\s*(\w+)/g, '$1 & $2')
            // Clean up empty lines and extra whitespace
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .join('\n');

          console.log('Cleaned diagram:', cleanedDiagram);

          // Create a unique ID for this render
          const uniqueId = `architecture-diagram-${Date.now()}`;

          // Render the diagram with error handling
          try {
            const { svg } = await mermaid.render(uniqueId, cleanedDiagram);
            
            // Verify ref is still valid before updating
            if (diagramRef.current && document.body.contains(diagramRef.current)) {
              diagramRef.current.innerHTML = svg;

              // Add CSS for "No Model Found" case
              if (cleanedDiagram.includes('"No Model Found"')) {
                const noModelText = diagramRef.current.querySelector('text');
                if (noModelText) {
                  noModelText.style.fill = '#94a3b8';
                  noModelText.style.fontSize = '14px';
                }
              }
            }
          } catch (renderError) {
            console.error('Error rendering Mermaid diagram:', renderError);
            // Show error state in the UI
            if (diagramRef.current) {
              diagramRef.current.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-red-400 p-4">
                  <svg class="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p class="text-center">Failed to render diagram. Please check the diagram syntax.</p>
                  <pre class="mt-4 p-4 bg-navy-900/50 rounded-lg text-xs overflow-auto max-w-full">
                    ${cleanedDiagram}
                  </pre>
                </div>
              `;
            }
          }
        } catch (error) {
          console.error('Error in diagram rendering process:', error);
          toast.error('Failed to render architecture diagram');
        }
      };

      renderDiagram();
    }
  }, [diagramContent]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size={isFullscreen ? 'full' : 'lg'}
      className={isFullscreen ? 'p-0' : ''}
    >
      <div className={`flex flex-col ${isFullscreen ? 'h-screen' : ''}`}>
        {/* Header Section */}
        <div className="shrink-0 p-4 border-b border-navy-700 bg-navy-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/10 rounded-lg">
              <svg className="w-5 h-5 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">ML Architecture Visualization</h2>
              <p className="text-sm text-gray-400">Analyze and visualize machine learning model architectures</p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center bg-navy-700/50 rounded-lg p-1">
              <Tooltip content="Zoom Out (Ctrl+-)">
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-navy-600/50 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 12H4"/>
                  </svg>
                </button>
              </Tooltip>
              <span className="px-2 text-sm text-gray-400 select-none">{zoom}%</span>
              <Tooltip content="Zoom In (Ctrl+=)">
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-navy-600/50 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
              </Tooltip>
              <Tooltip content="Reset View (Ctrl+0)">
                <button
                  onClick={handleZoomReset}
                  className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-navy-600/50 transition-colors ml-1"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12h18M12 3v18"/>
                    <circle cx="12" cy="12" r="9"/>
                  </svg>
                </button>
              </Tooltip>
            </div>

            {/* Fullscreen Toggle */}
            <Tooltip content={isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen"}>
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-400 hover:text-white hover:bg-navy-700/50 rounded-lg transition-colors"
              >
                {isFullscreen ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                )}
              </button>
            </Tooltip>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-navy-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="p-4 space-y-4">
            {/* Controls Section */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-400 mb-1">Visualization Format</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as typeof selectedFormat)}
                  className="w-full bg-navy-700 text-white border border-navy-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="mermaid">Mermaid.js</option>
                  <option value="graphviz">Graphviz</option>
                  <option value="drawio">Draw.io</option>
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-400 mb-1">AI Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as ModelId)}
                  className="w-full bg-navy-700 text-white border border-navy-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {Object.entries(AVAILABLE_MODELS)
                    .filter(([_, config]) => {
                      if (config.provider === 'openai' && !openaiKey) return false;
                      if (config.provider === 'google' && !geminiKey) return false;
                      return true;
                    })
                    .map(([id, config]) => (
                      <option key={id} value={id}>
                        {config.name}
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-400 mb-1">Analysis Mode</label>
                <div className="flex items-center bg-navy-700/50 rounded-lg p-1">
                  <button
                    onClick={() => setMode('auto')}
                    className={`flex-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                      mode === 'auto' 
                        ? 'bg-primary-500/20 text-primary-400' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Auto Detect
                  </button>
                  <button
                    onClick={() => setMode('custom')}
                    className={`flex-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                      mode === 'custom'
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Prompt Section */}
            {mode === 'custom' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">Custom Analysis Prompt</label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Enter your custom architecture analysis prompt..."
                  className="w-full h-32 bg-navy-700/50 border border-navy-600 rounded-lg p-4 text-white placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 resize-none"
                />
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Example: "Analyze the transformer architecture, focusing on attention mechanisms and embedding layers."
                </p>
              </div>
            )}

            {/* Diagram Container */}
            <div className="relative">
              <div 
                ref={diagramRef}
                className={`w-full ${isFullscreen ? 'h-[calc(100vh-300px)]' : 'h-[500px]'} bg-navy-800 rounded-lg overflow-hidden border border-navy-700 cursor-grab ${isDiagramDragging ? 'cursor-grabbing' : ''}`}
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
              >
                <div 
                  style={{
                    transform: `translate(${diagramPosition.x}px, ${diagramPosition.y}px) scale(${zoom / 100})`,
                    transformOrigin: 'center',
                    transition: isDiagramDragging ? 'none' : 'transform 0.2s'
                  }}
                >
                  {!diagramContent && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                      <svg className="w-12 h-12 text-navy-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                      <p>No architecture diagram generated yet</p>
                      <p className="text-sm text-gray-500">Click "Analyze ML Architecture" to begin</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                {diagramContent && (
                  <button
                    onClick={() => setDiagramContent('')}
                    className="px-3 py-1.5 bg-navy-700 text-white rounded-lg hover:bg-navy-600 transition-colors text-sm flex items-center gap-2"
                  >
                    Reset
                  </button>
                )}
                <button
                  onClick={() => {
                    const apiKey = selectedModel.includes('gpt') ? openaiKey : geminiKey;
                    if (!apiKey) {
                      toast.error(`Please set your ${selectedModel.includes('gpt') ? 'OpenAI' : 'Google'} API key first`);
                      return;
                    }
                    analyzeArchitecture(selectedModel, apiKey, mode === 'custom' ? customPrompt : undefined);
                  }}
                  disabled={isAnalyzing || (mode === 'custom' && !customPrompt.trim())}
                  className={`px-4 py-1.5 rounded-lg transition-colors text-sm flex items-center gap-2 ${
                    isAnalyzing || (mode === 'custom' && !customPrompt.trim())
                      ? 'bg-navy-600 text-gray-400 cursor-not-allowed'
                      : 'bg-primary-500 text-white hover:bg-primary-600'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4" />
                      <span>Analyze ML Architecture</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export const RepoVisualizer: React.FC<RepoVisualizerProps> = ({ 
  repoUrl, 
  width = 800, 
  height = 600,
  onClose 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RepoNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const geminiKey = useStore((state) => state.geminiKey);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentModel, setCurrentModel] = useState<ModelId>('gemini-1.5-pro');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isCreateSnippetModalOpen, setIsCreateSnippetModalOpen] = useState(false);
  const [snippetCode, setSnippetCode] = useState('');
  const [snippetLanguage, setSnippetLanguage] = useState('');
  const [viewMode, setViewMode] = useState<'tree' | 'smart' | 'circle'>('tree');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customAnalysisPrompt, setCustomAnalysisPrompt] = useState('');
  const [analysisType, setAnalysisType] = useState<'general' | 'custom'>('general');
  const [snippets, setSnippets] = useState<Array<{
    code: string;
    language: string;
    title: string;
    description: string;
    author: string;
    createdAt: string;
  }>>(() => {
    const savedSnippets = localStorage.getItem('codeSnippets');
    return savedSnippets ? JSON.parse(savedSnippets) : [];
  });
  const fileContentCache = useMemo(() => new Map<string, string>(), []);
  const [groups, setGroups] = useState<Record<string, RepoNode[]>>({});
  const [totalFiles, setTotalFiles] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showArchitectureModal, setShowArchitectureModal] = useState(false);

  // Define typeMap inside the component
  const typeMap = useMemo(() => ({
    // Code files
    ts: 'TypeScript',
    tsx: 'React',
    js: 'JavaScript',
    jsx: 'React',
    py: 'Python',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    go: 'Go',
    rs: 'Rust',
    rb: 'Ruby',
    php: 'PHP',
    
    // Config files
    json: 'Config',
    yaml: 'Config',
    yml: 'Config',
    toml: 'Config',
    ini: 'Config',
    env: 'Config',
    
    // Documentation
    md: 'Documentation',
    txt: 'Documentation',
    pdf: 'Documentation',
    doc: 'Documentation',
    docx: 'Documentation',
    
    // Images
    png: 'Image',
    jpg: 'Image',
    jpeg: 'Image',
    gif: 'Image',
    svg: 'Image',
    
    // Package files
    lock: 'Dependencies',
    'package.json': 'Dependencies',
    'requirements.txt': 'Dependencies',
    'cargo.toml': 'Dependencies',
    'gemfile': 'Dependencies',
  }), []);

  // Move memoized helper functions inside component
  const memoizedGetFileType = useMemo(() => {
    const cache = new Map<string, string>();
    return (filename: string): string => {
      if (cache.has(filename)) {
        return cache.get(filename)!;
      }
      const ext = filename.split('.').pop()?.toLowerCase() || '';
      const type = typeMap[ext] || 'Other';
      cache.set(filename, type);
      return type;
    };
  }, [typeMap]);

  // Add debounced search inside component
  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (value: string, callback: (value: string) => void) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(value), 300);
    };
  }, []);

  // Add memoized search function inside component
  const getFilteredNodes = useCallback((nodes: RepoNode[], term: string): RepoNode[] => {
    if (!term) return nodes;
    const searchLower = term.toLowerCase();
    return nodes.filter(node => 
      node.name.toLowerCase().includes(searchLower) ||
      (node.children && getFilteredNodes(node.children, term).length > 0)
    );
  }, []);

  // Add handleSaveSnippet function
  const handleSaveSnippet = (snippet: {
    code: string;
    language: string;
    title: string;
    description: string;
    author: string;
    createdAt: string;
  }) => {
    // Add new snippet to the beginning of the array
    const updatedSnippets = [snippet, ...snippets];
    
    // Update state
    setSnippets(updatedSnippets);
    
    // Save to localStorage
    localStorage.setItem('codeSnippets', JSON.stringify(updatedSnippets));
    
    // Close modal and show success message
    setIsCreateSnippetModalOpen(false);
    toast.success('Snippet created successfully!');
  };

  // Add Analysis Modal Component
  const AnalysisModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;

    // Local state for input to prevent re-renders
    const [localPrompt, setLocalPrompt] = useState(customAnalysisPrompt);

    // Update parent state when modal closes
    useEffect(() => {
      if (!isOpen) {
        setCustomAnalysisPrompt(localPrompt);
      }
    }, [isOpen, localPrompt]);

    // Reset local state when modal opens
    useEffect(() => {
      if (isOpen) {
        setLocalPrompt(customAnalysisPrompt);
      }
    }, [isOpen, customAnalysisPrompt]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setLocalPrompt(e.target.value);
    };

    const handleSubmit = () => {
      if (analysisType === 'custom' && !localPrompt.trim()) {
        toast.error('Please enter a custom analysis prompt');
        return;
      }
      setCustomAnalysisPrompt(localPrompt);
      onClose();
      analyzeWithAI(analysisType === 'custom' ? localPrompt : undefined);
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-navy-800 rounded-lg w-[600px] border border-navy-700 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="p-4 border-b border-navy-700">
            <h3 className="text-lg font-medium text-white">Repository Analysis</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Analysis Type</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setAnalysisType('general')}
                  className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                    analysisType === 'general'
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'bg-navy-700/50 text-gray-400 border border-navy-600 hover:text-white'
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  General Analysis
                </button>
                <button
                  type="button"
                  onClick={() => setAnalysisType('custom')}
                  className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                    analysisType === 'custom'
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'bg-navy-700/50 text-gray-400 border border-navy-600 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Custom Analysis
                </button>
              </div>
            </div>

            {analysisType === 'custom' && (
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Custom Analysis Prompt</label>
                <textarea
                  value={localPrompt}
                  onChange={handleInputChange}
                  placeholder="Enter your analysis prompt here..."
                  className="w-full h-32 px-4 py-2 bg-navy-700/50 border border-navy-600 rounded-lg text-white 
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                />
              </div>
            )}
          </div>
          <div className="p-4 border-t border-navy-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={analysisType === 'custom' && !localPrompt.trim()}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Start Analysis
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add analyzeWithAI function
  const analyzeWithAI = async (customPrompt?: string) => {
    if (!geminiKey) {
      toast.error('Please add your Gemini API key in settings to use the analysis feature');
      return;
    }

    setIsAnalyzing(true);
    try {
      const treeStructure = generateTreeStructure(data!);
      const allFiles = getAllFiles(data!);
      const fileContext = allFiles.map(f => `${f.path} (${getFileType(f.name)})`).join('\n');

      // Create a focused analysis prompt that combines specific request with general context
      const analysisPrompt = customPrompt 
        ? `${customPrompt}

To help with this specific analysis, here's the repository context:

Repository Structure:
${treeStructure}

Files:
${fileContext}

Please provide:
1. A detailed analysis of the specific functionality/aspect you asked about
2. Code examples and explanations where relevant
3. How this functionality fits into the broader system
4. Any potential improvements or considerations

Additionally, provide a brief overview of:
- Main technologies used
- Key components involved
- Code quality observations
- Potential improvements`
        : `Please analyze this repository with focus on:
1. Project organization and architecture
2. Main technologies and frameworks used
3. Key components and their purposes
4. Code quality and patterns
5. Potential improvements

Repository structure:
${treeStructure}

Files:
${fileContext}`;

      const userMessage = {
        role: 'user',
        content: analysisPrompt,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      };

      const response = await sendChatMessage(
        [userMessage],
        geminiKey,
        'default',
        currentModel
      );

      if (!response?.content) {
        throw new Error('Failed to generate analysis');
      }

      const formattedContent = `# Repository Analysis\n\n${response.content}`;
      
      setMessages(prev => [...prev, 
        {
          role: 'user',
          content: customPrompt || 'Please analyze this repository.',
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString()
        },
        {
          role: 'assistant',
          content: formattedContent,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString()
        }
      ]);

      handleSaveSnippet({
        code: formattedContent,
        language: 'markdown',
        title: `Analysis: ${repoUrl.split('/').slice(-2).join('/')}`,
        description: customPrompt || 'Repository analysis',
        author: 'AI Assistant',
        createdAt: new Date().toISOString()
      });

      toast.success('Analysis completed successfully!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error instanceof Error ? error.message : 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setIsAnalysisModalOpen(false);
      setCustomAnalysisPrompt('');
      setAnalysisType('general');
    }
  };

  // Add scroll handler
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setAutoScroll(isNearBottom);
    setShowScrollButton(!isNearBottom);
  };

  // Scroll to bottom if autoScroll is enabled
  useEffect(() => {
    if (autoScroll && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const githubToken = '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';

        const headers = {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        };

        const [owner, repo] = repoUrl.split('/').slice(-2);
        
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`, {
          headers
        });

        if (response.status === 401) {
          throw new Error('GitHub token is invalid or expired. Please check your token.');
        }

        if (!response.ok) {
          throw new Error(`GitHub API responded with status ${response.status}`);
        }

        const repoData = await response.json();
        
        const root: RepoNode = {
          name: repo,
          path: '',
          type: 'tree',
          children: []
        };

        repoData.tree.forEach((item: any) => {
          const parts = item.path.split('/');
          let current = root;
          
          parts.forEach((part: string, index: number) => {
            if (index === parts.length - 1) {
              current.children = current.children || [];
              current.children.push({
                name: part,
                path: item.path,
                type: item.type
              });
            } else {
              current.children = current.children || [];
              let child = current.children.find(c => c.name === part);
              if (!child) {
                child = {
                  name: part,
                  path: parts.slice(0, index + 1).join('/'),
                  type: 'tree',
                  children: []
                };
                current.children.push(child);
              }
              current = child;
            }
          });
        });

        setData(root);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching repo data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch repository data');
      } finally {
        setLoading(false);
      }
    };

    if (repoUrl && repoUrl.includes('github.com/')) {
      fetchRepoData();
    } else if (repoUrl) {
      setError('Please enter a valid GitHub repository URL');
    }
  }, [repoUrl]);

  // Update handleFileClick function
  const handleFileClick = async (node: RepoNode) => {
    if (node.type === 'blob') {
      try {
        if (selectedFile === node.path) {
          // If file is already selected, show preview
          if (fileContent) {
            setShowPreview(true);
          }
          return;
        }
        setSelectedFile(node.path);
        setFileContent(null);

        if (fileContentCache.has(node.path)) {
          setFileContent(fileContentCache.get(node.path)!);
          return;
        }

        const [owner, repo] = repoUrl
          .replace('https://github.com/', '')
          .split('/');

        const githubToken = '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';

        // Try to get the raw content first using the download_url if available
        try {
          const rawResponse = await fetch(
            `https://raw.githubusercontent.com/${owner}/${repo}/main/${node.path}`,
            { 
              headers: {
                'Authorization': `Bearer ${githubToken}`
              }
            }
          );

          if (rawResponse.ok) {
            const content = await rawResponse.text();
            fileContentCache.set(node.path, content);
            setFileContent(content);
            return;
          }
        } catch (error) {
          console.warn('Failed to fetch raw content, falling back to API');
        }

        // Fall back to GitHub API
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${node.path}`,
          { 
            headers: {
              'Authorization': `Bearer ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch file content. Status: ${response.status}`);
        }

        const data = await response.json();
        
        // Clean up and decode base64 content
        const base64Content = data.content.replace(/\\n/g, '').replace(/\n/g, '');
        const content = atob(base64Content);
        fileContentCache.set(node.path, content);
        
        if (selectedFile === node.path) {
          setFileContent(content);
          // Show preview after content is loaded
          setShowPreview(true);
        }
      } catch (err) {
        console.error('Error fetching file:', err);
        setError(err instanceof Error ? err.message : 'Failed to load file content');
        setSelectedFile(null);
        setFileContent(null);
        toast.error('Failed to load file content');
      }
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedFile || !fileContent || !data) return;

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Generate repository tree structure
      const treeStructure = generateTreeStructure(data);
      
      // Find related files
      const relatedFiles = findRelatedFiles(data, selectedFile);
      
      // Create enhanced context about the file
      const fileContext = `Repository Structure:
${treeStructure}

Current File: ${selectedFile}

Related Files:
${relatedFiles.map(file => `- ${file}`).join('\n')}

File Content:
${fileContent}

Question: ${input}`;
      
      // Filter out any system messages before sending
      const chatHistory = messages.filter(msg => msg.role !== 'system');
      
      const response = await sendChatMessage(
        [...chatHistory, { ...newMessage, content: fileContext }],
        geminiKey,
        'default',
        currentModel
      );

      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get response from AI');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add function to handle code snippet creation
  const handleCreateSnippet = (code: string, language: string) => {
    setSnippetCode(code);
    setSnippetLanguage(language);
    setIsCreateSnippetModalOpen(true);
  };

  const renderMessage = (message: ChatMessage) => {
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`flex items-start gap-3 ${
          message.role === 'assistant'
            ? 'bg-navy-800/50 backdrop-blur-sm rounded-xl p-4'
            : message.role === 'system'
            ? 'bg-navy-800/30 backdrop-blur-sm rounded-xl p-4'
            : 'px-2 py-2'
        }`}
      >
        {message.role === 'assistant' ? (
          <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0 mt-1">
            <Bot className="h-5 w-5 text-primary-400" />
          </div>
        ) : message.role === 'system' ? (
          <div className="w-8 h-8 rounded-full bg-navy-700/50 flex items-center justify-center flex-shrink-0 mt-1">
            <MessageSquare className="h-5 w-5 text-gray-400" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 mt-1">
            <User className="h-5 w-5 text-white" />
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="relative group">
                      <div className="absolute -top-3 right-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        <span>{match[1]}</span>
                        <button
                          onClick={() => handleCreateSnippet(String(children), match[1])}
                          className="px-2 py-1 bg-primary-500 text-white rounded-md text-xs hover:bg-primary-600 transition-colors"
                        >
                          Create Snippet
                        </button>
                      </div>
                      <SyntaxHighlighter
                        language={match[1]}
                        style={oneDark}
                        customStyle={{
                          margin: 0,
                          borderRadius: '0.5rem',
                          padding: '1rem',
                          backgroundColor: 'rgba(17, 24, 39, 0.5)',
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code 
                      className={`${className} bg-navy-900/50 px-1.5 py-0.5 rounded text-sm font-mono text-primary-400`} 
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                p({ children }) {
                  return <p className="mb-3 last:mb-0 text-gray-300 leading-relaxed">{children}</p>;
                },
                ul({ children }) {
                  return <ul className="mb-3 last:mb-0 list-disc list-inside space-y-1">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="mb-3 last:mb-0 list-decimal list-inside space-y-1">{children}</ol>;
                },
                li({ children }) {
                  return <li className="text-gray-300">{children}</li>;
                },
                h1({ children }) {
                  return <h1 className="text-lg font-semibold text-white mb-2">{children}</h1>;
                },
                h2({ children }) {
                  return <h2 className="text-base font-semibold text-white mb-2">{children}</h2>;
                },
                h3({ children }) {
                  return <h3 className="text-sm font-semibold text-white mb-2">{children}</h3>;
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="border-l-2 border-primary-500 pl-4 italic text-gray-400 mb-3">
                      {children}
                    </blockquote>
                  );
                },
                a({ children, href }) {
                  return (
                    <a 
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 underline transition-colors"
                    >
                      {children}
                    </a>
                  );
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto mb-3">
                      <table className="min-w-full divide-y divide-navy-700">
                        {children}
                      </table>
                    </div>
                  );
                },
                thead({ children }) {
                  return <thead className="bg-navy-800/50">{children}</thead>;
                },
                tbody({ children }) {
                  return <tbody className="divide-y divide-navy-700">{children}</tbody>;
                },
                tr({ children }) {
                  return <tr>{children}</tr>;
                },
                th({ children }) {
                  return (
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {children}
                    </th>
                  );
                },
                td({ children }) {
                  return <td className="px-3 py-2 text-sm text-gray-300">{children}</td>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </motion.div>
    );
  };

  useEffect(() => {
    if (!data || !svgRef.current) return;

    d3.select(svgRef.current).selectAll('*').remove();

    if (viewMode === 'circle') {
      renderCirclePack();
    } else if (viewMode === 'tree') {
      const svg = d3.select(svgRef.current);
      const g = svg.append('g');

      const treeLayout = d3.tree<RepoNode>()
        .size([height - 60, width - 200])
        .separation((a, b) => (a.parent === b.parent ? 1.5 : 2));

      const root = d3.hierarchy(data);
      const treeData = treeLayout(root);

      const filteredNodes = treeData.descendants().filter(d => 
        !searchTerm || d.data.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      g.selectAll('.link')
        .data(treeData.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke', '#64748b')
        .attr('stroke-width', 1.5)
        .attr('d', d3.linkHorizontal()
          .x(d => d.y)
          .y(d => d.x)
        )
        .style('opacity', d => 
          !searchTerm || 
          filteredNodes.includes(d.source) && filteredNodes.includes(d.target) 
            ? 1 
            : 0.2
        );

      const nodes = g.selectAll('.node')
        .data(treeData.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`)
        .style('cursor', 'pointer')
        .style('opacity', d => filteredNodes.includes(d) ? 1 : 0.2)
        .on('click', (event, d) => handleFileClick(d.data))
        .on('mouseover', function() {
          d3.select(this).select('circle')
            .transition()
            .duration(200)
            .attr('r', 6);
          d3.select(this).select('text')
            .transition()
            .duration(200)
            .style('font-weight', 'bold');
        })
        .on('mouseout', function() {
          d3.select(this).select('circle')
            .transition()
            .duration(200)
            .attr('r', 4);
          d3.select(this).select('text')
            .transition()
            .duration(200)
            .style('font-weight', 'normal');
        });

      nodes.append('circle')
        .attr('r', 4)
        .attr('fill', d => d.data.type === 'tree' ? '#0ea5e9' : '#64748b')
        .attr('stroke', '#1e293b')
        .attr('stroke-width', 1.5);

      nodes.append('text')
        .attr('dy', '0.31em')
        .attr('x', d => d.children ? -8 : 8)
        .attr('text-anchor', d => d.children ? 'end' : 'start')
        .text(d => d.data.name)
        .attr('fill', 'currentColor')
        .attr('font-size', '12px')
        .attr('class', 'select-none');

      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.3, 3])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });

      svg.call(zoom);
      
      const bounds = g.node()?.getBBox();
      if (bounds) {
        const scale = 0.9 / Math.max(bounds.width / width, bounds.height / height);
        const transform = d3.zoomIdentity
          .translate(
            width / 2 - (bounds.x + bounds.width / 2) * scale,
            height / 2 - (bounds.y + bounds.height / 2) * scale
          )
          .scale(scale);
        
        svg.transition()
          .duration(750)
          .call(zoom.transform, transform);
      }
    }
  }, [data, width, height, searchTerm, viewMode]);

  // Add model selector component
  const ModelSelector = () => (
    <AnimatePresence>
      {showModelSelector && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-16 right-4 w-72 bg-navy-800 rounded-lg shadow-lg z-50 border border-navy-700 overflow-hidden"
        >
          <div className="p-2">
            <div className="text-sm font-medium text-gray-300 px-2 py-1 mb-1">
              Select Model
            </div>
            {Object.entries(AVAILABLE_MODELS).map(([modelId, config]) => (
              <button
                key={modelId}
                onClick={() => {
                  setCurrentModel(modelId as ModelId);
                  setShowModelSelector(false);
                  toast.success(`Switched to ${config.name}`);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  currentModel === modelId 
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'hover:bg-navy-700 text-gray-300'
                }`}
              >
                <div className="font-medium">{config.name}</div>
                <div className="text-xs text-gray-400">
                  {config.type === 'gemini' ? 'Google Gemini' : 'GPT-4'}
                  {config.supportsImages && ' • Supports Images'}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Add circle pack rendering function
  const renderCirclePack = () => {
    if (!data || !svgRef.current) return null;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const g = svg.append('g');

    // Create hierarchy and sum up sizes
    const root = d3.hierarchy(data)
      .sum(d => (d as RepoNode).type === 'blob' ? ((d as RepoNode).size || 1) : 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Create circle pack layout
    const pack = d3.pack<RepoNode>()
      .size([width - 20, height - 20])
      .padding(3);

    pack(root);

    // Create a color scale based on file types
    const fileTypes = Array.from(new Set(
      root.leaves().map(leaf => memoizedGetFileType((leaf.data as RepoNode).name))
    ));
    const colorScale = d3.scaleOrdinal<string>()
      .domain(fileTypes)
      .range([
        '#60A5FA', // TypeScript
        '#2DD4BF', // React
        '#FBBF24', // JavaScript
        '#34D399', // Python
        '#A78BFA', // Config
        '#F472B6', // Documentation
        '#FB7185', // Image
        '#FB923C', // Dependencies
        '#94A3B8', // Other
      ]);

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create SVG tooltip group
    const tooltip = svg.append('g')
      .attr('class', 'tooltip')
      .style('display', 'none');

    tooltip.append('rect')
      .attr('class', 'tooltip-bg')
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('fill', '#1e293b')
      .attr('stroke', '#334155')
      .attr('stroke-width', 1)
      .attr('opacity', 0.95);

    const tooltipText = tooltip.append('text')
      .attr('fill', '#e2e8f0')
      .attr('font-size', '12px');

    // Draw circles
    const node = g.selectAll('g')
      .data(root.descendants())
      .join('g')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    const circle = node.append('circle')
      .attr('r', d => d.r)
      .attr('fill', d => {
        if (!d.children) {
          return colorScale(memoizedGetFileType((d.data as RepoNode).name));
        }
        return d.depth === 0 ? 'transparent' : '#1E293B';
      })
      .attr('fill-opacity', d => d.children ? 0.2 : 0.7)
      .attr('stroke', d => d.children ? '#334155' : 'none')
      .attr('stroke-width', 1.5)
      .attr('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        const node = d.data as RepoNode;
        const tooltipContent = node.type === 'blob' 
          ? `${node.name}\n${memoizedGetFileType(node.name)} • ${formatFileSize(node.size)}\n${node.path}`
          : `${node.name}\nFolder • ${d.leaves().length} files`;

        const lines = tooltipContent.split('\n');
        tooltipText.selectAll('tspan').remove();
        
        lines.forEach((line, i) => {
          tooltipText
            .append('tspan')
            .attr('x', 8)
            .attr('dy', i === 0 ? '1.2em' : '1.2em')
            .text(line)
            .attr('fill', i === 0 ? '#e2e8f0' : '#94a3b8');
        });

        const bbox = tooltipText.node()?.getBBox();
        if (bbox) {
          tooltip.select('rect')
            .attr('width', bbox.width + 16)
            .attr('height', bbox.height + 16);
        }

        const [x, y] = d3.pointer(event, svg.node());
        tooltip
          .attr('transform', `translate(${x + 10},${y + 10})`)
          .style('display', null);

        d3.select(event.currentTarget)
          .attr('fill-opacity', d.children ? 0.3 : 0.9)
          .attr('stroke-width', 2);
      })
      .on('mousemove', (event) => {
        const [x, y] = d3.pointer(event, svg.node());
        tooltip.attr('transform', `translate(${x + 10},${y + 10})`);
      })
      .on('mouseout', (event) => {
        tooltip.style('display', 'none');
        d3.select(event.currentTarget)
          .attr('fill-opacity', d => d.children ? 0.2 : 0.7)
          .attr('stroke-width', 1.5);
      })
      .on('click', (event, d) => {
        const node = d.data as RepoNode;
        if (node.type === 'blob') {
          handleFileClick(node);
        } else {
          // Zoom to the clicked folder
          const k = width / (d.r * 2);
          const t = [width / 2 - d.x * k, height / 2 - d.y * k];
          svg.transition().duration(750)
            .call(zoom.transform, d3.zoomIdentity
              .translate(t[0], t[1])
              .scale(k));
        }
      });

    // Add labels for larger circles
    node.append('text')
      .filter(d => d.r > 15)
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .style('font-size', d => Math.min(Math.max(d.r / 3, 10), 16) + 'px')
      .style('pointer-events', 'none')
      .style('fill', d => d.children ? '#fff' : '#1a1a1a')
      .style('font-weight', d => d.children ? '500' : '400')
      .style('opacity', 0.9)
      .style('text-shadow', d => d.children ? '0 1px 3px rgba(0,0,0,0.3)' : 'none')
      .text(d => {
        const node = d.data as RepoNode;
        return node.name.length > 20 ? node.name.slice(0, 17) + '...' : node.name;
      });

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 150}, 20)`)
      .selectAll('g')
      .data(fileTypes)
      .join('g')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legend.append('circle')
      .attr('r', 6)
      .attr('fill', d => colorScale(d))
      .attr('fill-opacity', 0.7);

    legend.append('text')
      .attr('x', 12)
      .attr('y', 4)
      .style('font-size', '12px')
      .style('fill', 'currentColor')
      .text(d => d);

    // Initial zoom to fit
    const bounds = g.node()?.getBBox();
    if (bounds) {
      const scale = 0.9 / Math.max(bounds.width / width, bounds.height / height);
      const transform = d3.zoomIdentity
        .translate(
          width / 2 - (bounds.x + bounds.width / 2) * scale,
          height / 2 - (bounds.y + bounds.height / 2) * scale
        )
        .scale(scale);
      
      svg.transition()
        .duration(750)
        .call(zoom.transform, transform);
    }
  };

  // Add function to group files by type
  const groupFilesByType = useCallback((nodes: RepoNode[]): Record<string, RepoNode[]> => {
    const groups: Record<string, RepoNode[]> = {};
    
    const processNode = (node: RepoNode) => {
      if (node.type === 'blob') {
        const extension = node.name.split('.').pop()?.toLowerCase() || 'Unknown';
        let category = 'Other';

        // Categorize based on file extension
        switch (extension) {
          case 'js':
            category = 'JavaScript';
            break;
          case 'ts':
          case 'tsx':
            category = 'TypeScript';
            break;
          case 'json':
            category = 'JSON';
            break;
          case 'md':
            category = 'Markdown';
            break;
          case 'jpg':
          case 'jpeg':
          case 'png':
          case 'gif':
          case 'svg':
            category = 'Images';
            break;
          case 'java':
            category = 'Java';
            break;
          case 'py':
            category = 'Python';
            break;
          case 'sql':
            category = 'SQL';
            break;
          case 'html':
            category = 'HTML';
            break;
          case 'yml':
          case 'yaml':
          case 'toml':
          case 'ini':
            category = 'Config';
            break;
          case 'sh':
          case 'bash':
            category = 'Shell';
            break;
          case 'zip':
          case 'tar':
          case 'gz':
            category = 'Archive';
            break;
          case 'csv':
          case 'xlsx':
            category = 'Data';
            break;
        }

        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(node);
      }
      
      if (node.children) {
        node.children.forEach(processNode);
      }
    };

    nodes.forEach(processNode);
    return groups;
  }, []);

  // Update groups when data changes
  useEffect(() => {
    if (data) {
      const newGroups = groupFilesByType(data.children || []);
      setGroups(newGroups);
      setTotalFiles(Object.values(newGroups).reduce((acc, files) => acc + files.length, 0));
    }
  }, [data, groupFilesByType]);

  const handleCategoryClick = useCallback((type: string | null) => {
    setSelectedCategory(prevCategory => prevCategory === type ? null : type);
  }, []);

  // Update renderSmartView to show files based on selected category
  const renderSmartView = () => {
    const filesToShow = selectedCategory 
      ? groups[selectedCategory] || []
      : data ? getAllFiles(data) : [];

    return (
      <div className="h-[calc(100vh-200px)] overflow-y-auto scrollbar-custom hardware-accelerated p-4">
        {/* Categories Filter */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleCategoryClick(null)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2 hardware-accelerated
              ${!selectedCategory 
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                : 'bg-navy-700/50 text-gray-400 border border-navy-600 hover:text-white hover:border-navy-500'
              }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>All Files</span>
            <span className="text-xs opacity-60">({totalFiles})</span>
          </button>
          {Object.entries(groups).map(([type, files]) => {
            const isSelected = selectedCategory === type;
            const icon = groupIcons[type] || <File className="w-4 h-4 text-gray-400 shrink-0" />;
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleCategoryClick(type)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2 hardware-accelerated
                  ${isSelected
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                    : 'bg-navy-700/50 text-gray-400 border border-navy-600 hover:text-white hover:border-navy-500'
                  }`}
              >
                {icon}
                <span>{type}</span>
                <span className="text-xs opacity-60">({files.length})</span>
              </button>
            );
          })}
        </div>

        {/* File List */}
        <div className="space-y-2">
          {filesToShow.map((file) => (
            <div
              key={file.path}
              onClick={() => handleFileClick(file)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-navy-700/50 cursor-pointer transition-colors hardware-accelerated"
            >
              {groupIcons[file.name.split('.').pop()?.toLowerCase() || ''] || <File className="w-4 h-4 text-gray-400 shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-300 truncate">{file.name}</div>
                <div className="text-xs text-gray-500 truncate">{file.path}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Memoize the current view component
  const currentView = useMemo(() => {
    switch (viewMode) {
      case 'smart':
        return renderSmartView();
      case 'circle':
        return (
          <svg
            ref={svgRef}
            width={isFullScreen ? window.innerWidth * 0.6 : width}
            height={isFullScreen ? window.innerHeight - 200 : height}
            className="w-full h-full transition-all duration-300"
          />
        );
      default: // tree view
        return (
          <svg
            ref={svgRef}
            width={isFullScreen ? window.innerWidth * 0.6 : width}
            height={isFullScreen ? window.innerHeight - 200 : height}
            className="w-full h-full transition-all duration-300"
          />
        );
    }
  }, [viewMode, data, searchTerm, width, height, isFullScreen, selectedCategory]);

  // Add function to handle view mode changes
  const handleViewModeChange = (mode: 'tree' | 'smart' | 'circle') => {
    setViewMode(mode);
    if (mode === 'smart') {
      setSelectedCategory(null);
    }
  };

  // Add getFileLanguage helper
  const getFileLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    switch (ext) {
      case 'js': return 'javascript';
      case 'ts': return 'typescript';
      case 'py': return 'python';
      case 'java': return 'java';
      case 'json': return 'json';
      case 'md': return 'markdown';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'sh': return 'bash';
      case 'yml':
      case 'yaml': return 'yaml';
      default: return ext;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[400px] text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${isFullScreen ? 'fixed inset-0 z-50 bg-navy-900/95 backdrop-blur-sm p-4' : 'h-full'}`}>
      <div className="flex items-center justify-between bg-navy-800/50 rounded-lg p-4 border border-navy-700 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-500/10">
            <FolderTree className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight">
              {repoUrl.split('/').slice(-2).join('/')}
            </h2>
            <p className="text-sm text-gray-400">
              Repository Structure • {data?.children?.length || 0} files
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-navy-700/50 rounded-lg p-1">
            <Tooltip content="Tree View">
              <button
                type="button"
                onClick={() => handleViewModeChange('tree')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'tree' 
                    ? 'bg-primary-500/20 text-primary-400' 
                    : 'text-gray-400 hover:text-white hover:bg-navy-600/50'
                }`}
              >
                <TreePine className="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip content="Smart View">
              <button
                type="button"
                onClick={() => handleViewModeChange('smart')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'smart'
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-gray-400 hover:text-white hover:bg-navy-600/50'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip content="Circle Pack View">
              <button
                type="button"
                onClick={() => handleViewModeChange('circle')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'circle'
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-gray-400 hover:text-white hover:bg-navy-600/50'
                }`}
              >
                <CircleDot className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
          <Tooltip content="Analyze Repository">
            <button
              type="button"
              onClick={() => setIsAnalysisModalOpen(true)}
              className="p-2 text-gray-400 hover:text-white hover:bg-navy-700/50 rounded-lg transition-all duration-200"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  <path d="M12 7v6m0 0v.01" />
                </svg>
              )}
            </button>
          </Tooltip>
          
          <Tooltip content="Visualize Architecture">
            <button
              type="button"
              onClick={() => setShowArchitectureModal(true)}
              className="p-2 text-gray-400 hover:text-white hover:bg-navy-700/50 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </button>
          </Tooltip>
          <Tooltip content="Change AI Model">
            <button
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="p-2 text-gray-400 hover:text-white hover:bg-navy-700/50 rounded-lg transition-all duration-200 relative"
            >
              <Bot className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full" />
            </button>
          </Tooltip>
          <Tooltip content={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 text-gray-400 hover:text-white hover:bg-navy-700/50 rounded-lg transition-all duration-200"
            >
              {isFullScreen ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              )}
            </button>
          </Tooltip>
          {onClose && (
            <Tooltip content="Close">
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      <ModelSelector />

      <div className={`flex gap-4 ${isFullScreen ? 'flex-1' : ''} h-[calc(100%-80px)]`}>
        <div className={`flex-1 bg-navy-800/50 rounded-lg overflow-hidden border border-navy-700 backdrop-blur-sm flex flex-col
          ${isFullScreen ? 'min-h-0' : 'min-h-[600px]'}`}>
          <div className="shrink-0 p-3 border-b border-navy-700 flex items-center justify-between bg-navy-800/50">
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Click on a file to view its contents
            </div>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search files..."
                className="pl-9 pr-4 py-1.5 text-sm bg-navy-700/50 border border-navy-600 rounded-lg text-white placeholder-gray-400 
                  focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 w-48 hover:w-64 focus:w-64"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <Transition
              show={true}
              enter="transition-opacity duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {currentView}
            </Transition>
          </div>
        </div>

        <Transition
          show={!!selectedFile}
          enter="transition-opacity duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
        {selectedFile && (
            <div className={`bg-navy-800/50 rounded-lg overflow-hidden border border-navy-700 backdrop-blur-sm
              ${isFullScreen ? 'w-2/5' : 'w-96'} flex flex-col h-full transition-all duration-300`}>
              <div className="shrink-0 p-4 border-b border-navy-700 bg-navy-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-primary-500/10">
                    <svg className="w-4 h-4 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                      <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                  </div>
                    <span className="text-white font-medium truncate">{selectedFile}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col flex-1 min-h-0">
                <div className="shrink-0 p-4 border-b border-navy-700">
                  <div className="relative">
                    <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap max-h-[200px] overflow-y-auto 
                      scrollbar-thin scrollbar-thumb-navy-600 scrollbar-track-navy-800 p-2 bg-navy-900/50 rounded-lg">
                {fileContent}
              </pre>
                    <div className="absolute top-0 right-0 p-2 bg-gradient-to-l from-navy-800/90 via-navy-800/50 to-transparent">
                      <Tooltip content="Toggle file view">
                        <button
                          onClick={() => setIsFullScreen(!isFullScreen)}
                          className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-navy-700/50 transition-all duration-200"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                          </svg>
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                <div 
                  ref={chatContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scrollbar-thin scrollbar-thumb-navy-600 scrollbar-track-navy-800"
                >
                  <AnimatePresence mode="popLayout">
                    {messages.map(message => renderMessage(message))}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {showScrollButton && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onClick={() => {
                        if (chatContainerRef.current) {
                          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                          setAutoScroll(true);
                        }
                      }}
                      className="absolute bottom-20 right-4 p-2 bg-primary-500 text-white rounded-full shadow-lg 
                        hover:bg-primary-600 transition-all duration-200 hover:shadow-primary-500/20 hover:-translate-y-0.5"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>

                <div className="shrink-0 border-t border-navy-700 p-4 bg-navy-800/50">
                  <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about this file..."
                      className="flex-1 bg-navy-700/50 border border-navy-600 rounded-lg px-4 py-2 text-white 
                        placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                      disabled={isLoading || !geminiKey}
                    />
                    <Tooltip content={!geminiKey ? "Add API key in settings" : "Send message"}>
                      <button
                        type="submit"
                        disabled={!input.trim() || isLoading || !geminiKey}
                        className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 
                          disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/20 
                          hover:-translate-y-0.5 active:translate-y-0"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </Tooltip>
                  </form>
                  {!geminiKey && (
                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      Please add your Gemini API key in settings to use the chat feature
                    </p>
                  )}
                </div>
              </div>
          </div>
        )}
        </Transition>
      </div>

      {/* Add Create Snippet Modal */}
      <CreateSnippetModal
        isOpen={isCreateSnippetModalOpen}
        onClose={() => setIsCreateSnippetModalOpen(false)}
        onSave={handleSaveSnippet}
        initialData={{
          code: snippetCode,
          language: snippetLanguage,
          title: '',
          description: '',
          author: 'AI Assistant',
          createdAt: new Date().toISOString(),
        }}
      />

      {/* Add Analysis Modal */}
      <AnalysisModal 
        isOpen={isAnalysisModalOpen} 
        onClose={() => {
          setIsAnalysisModalOpen(false);
          setCustomAnalysisPrompt('');
          setAnalysisType('general');
        }} 
      />

      {/* Add PreviewModal */}
      {selectedFile && fileContent && (
        <PreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          content={fileContent}
          language={getFileLanguage(selectedFile)}
        />
      )}

      {/* Add ArchitectureModal */}
      <ArchitectureModal 
        isOpen={showArchitectureModal} 
        onClose={() => setShowArchitectureModal(false)} 
        treeData={data}
        repoUrl={repoUrl}  // Pass repoUrl to modal
      />
    </div>
  );
}; 