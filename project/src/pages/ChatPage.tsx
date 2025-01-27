import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Maximize2, Minimize2, AlertCircle, Settings, Trash2, Plus, MessageSquare, Cpu, Image as ImageIcon, X, Database, Play } from 'lucide-react';
import { useStore } from '../store/useStore';
import { StreamingText } from '../components/StreamingText';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, sendChatMessage, AssistantRole, ROLE_CONFIGS, ModelId, AVAILABLE_MODELS } from '../services/chatService';
import { toast } from 'react-hot-toast';
import { ComparisonTable } from '../components/ComparisonTable';
import { PaperDownloadCards } from '../components/PaperDownloadCards';
import { useNavigate } from 'react-router-dom';
import { ragChat } from '../services/apiClient';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

// Update ModelConfig type to include type field
interface ModelConfig {
  name: string;
  type: 'gemini' | 'gpt4';  // Update the type to be more specific
}

// Remove AVAILABLE_MODELS redeclaration
declare module '../services/chatService' {
  interface AVAILABLE_MODELS_TYPE {
    [key: string]: ModelConfig;
  }
}

interface ChatPageProps {
  onFullScreenChange?: (isFullScreen: boolean) => void;
  isInChatWindow?: boolean;
}

interface Chat {
  id: string;
  name: string;
  messages: ChatMessage[];
  role: AssistantRole;
  model: ModelId;
  createdAt: string;
}

interface CompletedMessage {
  messageId: string;
  isComplete: boolean;
}

interface CodeOutput {
  messageIndex: number;
  output: string;
  error: string;
}

const BUILT_IN_ROLES = [
  'default',
  'developer',
  'researcher',
  'analyst',
  'medical',
  'administrator',
  'ragChat'
] as const;

export function ChatPage({ onFullScreenChange, isInChatWindow }: ChatPageProps) {
  const {
    customRoles,
    modifiedBuiltInRoles,
    getBuiltInRoleConfig,
    projects
  } = useStore();
  const [chats, setChats] = useState<Chat[]>(() => {
    const savedChats = localStorage.getItem('chats');
    return savedChats ? JSON.parse(savedChats) : [{
      id: crypto.randomUUID(),
      name: 'New Chat',
      messages: [],
      role: 'default',
      model: 'gemini-1.5-flash',
      createdAt: new Date().toISOString()
    }];
  });
  const [currentChatId, setCurrentChatId] = useState<string>(() => {
    return chats[0]?.id;
  });
  const [showChatList, setShowChatList] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<AssistantRole>('default');
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [currentModel, setCurrentModel] = useState<ModelId>('gemini-1.5-flash');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const geminiKey = useStore((state) => state.geminiKey);
  const githubToken = useStore((state) => state.githubToken);
  const [completedMessages, setCompletedMessages] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('completedMessages');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [codeOutput, setCodeOutput] = useState<CodeOutput | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Get all available roles (built-in + custom)
  const availableRoles = React.useMemo(() => {
    // Get built-in roles, filtering out disabled ones
    const builtInRoles = BUILT_IN_ROLES.map(role => ({
      id: role,
      config: modifiedBuiltInRoles.find(r => r.originalRole === role)?.config || ROLE_CONFIGS[role],
      isBuiltIn: true
    })).filter(role => !role.config.isDisabled);

    // Get custom roles
    const customRolesList = customRoles.map(role => ({
      id: role.id,
      config: role.config,
      isBuiltIn: false
    }));

    return [...builtInRoles, ...customRolesList];
  }, [customRoles, modifiedBuiltInRoles]);

  const markdownComponents = {
    h1: (props: any) => (
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100" {...props} />
    ),
    h2: (props: any) => (
      <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100" {...props} />
    ),
    h3: (props: any) => (
      <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-100" {...props} />
    ),
    ul: (props: any) => (
      <ul className="list-disc list-inside mb-4 space-y-1" {...props} />
    ),
    ol: (props: any) => (
      <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />
    ),
    li: (props: any) => (
      <li className="mb-1 text-gray-700 dark:text-gray-300" {...props} />
    ),
    p: (props: any) => (
      <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed" {...props} />
    ),
    a: (props: any) => (
      <a 
        {...props} 
        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline"
        target="_blank"
        rel="noopener noreferrer"
      />
    ),
    code: (props: any) => (
      <code className="px-2 py-1 bg-gray-100 dark:bg-navy-700 rounded text-sm" {...props} />
    ),
    pre: (props: any) => (
      <pre className="block bg-gray-100 dark:bg-navy-700 p-4 rounded-lg text-sm overflow-x-auto mb-4" {...props} />
    ),
    table: (props: any) => (
      <div className="overflow-x-auto my-8">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-700 rounded-lg">
            <table className="min-w-full divide-y divide-gray-700 bg-[#1b1b1b]" {...props} />
          </div>
        </div>
      </div>
    ),
    thead: (props: any) => (
      <thead className="bg-[#1b1b1b]">
        <tr className="divide-x divide-gray-700" {...props} />
      </thead>
    ),
    tbody: (props: any) => (
      <tbody className="divide-y divide-gray-700 bg-[#1b1b1b]" {...props} />
    ),
    tr: (props: any) => (
      <tr className="divide-x divide-gray-700 hover:bg-[#2a2a2a] transition-colors" {...props} />
    ),
    th: (props: any) => (
      <th 
        scope="col"
        className="px-6 py-3.5 text-left text-sm font-semibold text-gray-100 whitespace-nowrap" 
        {...props} 
      />
    ),
    td: (props: any) => (
      <td 
        className="px-6 py-3.5 text-sm text-gray-300 whitespace-pre-wrap break-words" 
        {...props}
      />
    ),
  };

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  // Save completed messages to localStorage
  useEffect(() => {
    localStorage.setItem('completedMessages', JSON.stringify(completedMessages));
  }, [completedMessages]);

  const currentChat = chats.find(chat => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  const createNewChat = () => {
    const defaultName = 'New Chat';
    const newChat: Chat = {
      id: crypto.randomUUID(),
      name: defaultName,
      messages: [],
      role: currentRole,
      model: currentModel,
      createdAt: new Date().toISOString()
    };
    setChats(prev => [...prev, newChat]);
    setCurrentChatId(newChat.id);
    setShowChatList(false);

    // Prompt for chat name
    setTimeout(() => {
      const chatName = prompt('Enter a name for this chat:', defaultName);
      if (chatName && chatName.trim() !== '') {
        updateChatName(newChat.id, chatName.trim());
      }
    }, 100);
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => {
      const updatedChats = prev.filter(chat => chat.id !== chatId);
      // If we're deleting the current chat or if there are no chats left
      if (updatedChats.length === 0) {
        // Create a new chat immediately
        const newChat: Chat = {
          id: crypto.randomUUID(),
          name: 'New Chat',
          messages: [],
          role: currentRole,
          model: currentModel,
          createdAt: new Date().toISOString()
        };
        return [newChat];
      }
      // If we're deleting the current chat, switch to the first available chat
      if (currentChatId === chatId) {
        setCurrentChatId(updatedChats[0].id);
      }
      return updatedChats;
    });
    toast.success('Chat deleted');
  };

  // Ensure there's always at least one chat
  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    }
  }, [chats.length]);

  const updateChatName = (chatId: string, newName: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, name: newName } : chat
    ));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]); // Update dependency to chats instead of messages

  // Handle message completion
  const handleMessageComplete = (messageId: string) => {
    setCompletedMessages(prev => ({
      ...prev,
      [messageId]: true
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;
    
    // Check if project is selected for ragChat role
    if (currentRole === 'ragChat' && !selectedProject) {
      toast.error('Please select a project first');
      setShowProjectSelector(true);
      return;
    }

    const modelConfig = AVAILABLE_MODELS[currentModel];
    if (!modelConfig) {
      toast.error('Invalid model selected');
      return;
    }
    
    if (!geminiKey) {
      toast.error('Please add your Gemini API key in settings first');
      return;
    }

    setError(null);
    const messageId = crypto.randomUUID();
    const newMessage: ChatMessage = { 
      id: messageId,
      role: 'user', 
      content: input,
      image: selectedImage || undefined,
      timestamp: new Date().toISOString()
    };

    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, messages: [...chat.messages, newMessage] }
        : chat
    ));
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      let response;
      if (currentRole === 'ragChat') {
        // Use RAG chat service
        const ragResponse = await ragChat(selectedProject!, input.trim());
        response = {
          content: ragResponse.answer,
          arxivPapers: undefined
        };
      } else {
        // Use regular chat service
        response = await sendChatMessage(
          [...messages, newMessage], 
          geminiKey, 
          currentRole,
          currentModel,
          githubToken
        );
      }

      const assistantMessageId = crypto.randomUUID();
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { 
              ...chat, 
              messages: [...chat.messages, { 
                id: assistantMessageId,
                role: 'assistant', 
                content: response.content,
                arxivPapers: response.arxivPapers,
                timestamp: new Date().toISOString()
              }]
            }
          : chat
      ));
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
      toast.error('Failed to get response from AI');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (role: AssistantRole) => {
    setCurrentRole(role);
    setShowRoleSelector(false);
    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, messages: [] }
        : chat
    ));

    // If ragChat role is selected, show project selector
    if (role === 'ragChat') {
      setShowProjectSelector(true);
      setSelectedProject(null);
    } else {
      setShowProjectSelector(false);
      setSelectedProject(null);
    }

    // Get the role title from either built-in or custom roles
    let roleTitle: string;
    if (role.startsWith('custom_')) {
      const customRole = customRoles.find(r => r.id === role.replace('custom_', ''));
      roleTitle = customRole?.config.title || 'Custom Role';
    } else {
      roleTitle = ROLE_CONFIGS[role]?.title || role;
    }
    
    toast.success(`Switched to ${roleTitle} mode`);
  };

  const handleModelChange = (model: ModelId) => {
    setCurrentModel(model);
    setShowModelSelector(false);
    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, messages: [], model } 
        : chat
    ));
    toast.success(`Switched to ${AVAILABLE_MODELS[model]}`);
  };

  const toggleFullScreen = () => {
    const newFullScreenState = !isFullScreen;
    setIsFullScreen(newFullScreenState);
    onFullScreenChange?.(newFullScreenState);
  };

  // Update clear chat history function
  const clearChatHistory = () => {
    setChats(prev => prev.map(chat => 
      chat.id === currentChatId ? { ...chat, messages: [] } : chat
    ));
    toast.success('Chat history cleared');
  };

  // Add function to delete a message
  const deleteMessage = (messageIndex: number) => {
    if (!currentChat) return;
    
    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? {
            ...chat,
            messages: chat.messages.filter((_, index) => index !== messageIndex)
          }
        : chat
    ));
    toast.success('Message deleted');
  };

  const parseComparisonTable = (content: string): { data: any[] } | null => {
    try {
      const tableMatch = content.match(/^(?:\|[^\n]+\|)+\n(?:\|[-]+\|)+\n(?:(?:\|[^\n]+\|)+\n)+/m);
      if (!tableMatch) return null;

      const tableString = tableMatch[0];
      const rows = tableString.trim().split('\n').map(row =>
        row.split('|').filter(cell => cell.trim()).map(cell => cell.trim())
      );

      // Skip header and separator rows
      const data = rows.slice(2).map(row => ({
        method: row[0],
        dataset: row[1],
        performance: row[2],
        year: row[3]
      }));

      return { data };
    } catch (error) {
      console.error('Error parsing table:', error);
      return null;
    }
  };

  const renderMessageContent = (content: string) => {
    const tableData = parseComparisonTable(content);
    if (tableData) {
      const textBeforeTable = content.split('|')[0];
      const textAfterTable = content.split('\n\n').slice(-1)[0];
      
      return (
        <>
          {textBeforeTable && (
            <ReactMarkdown components={markdownComponents}>
              {textBeforeTable}
            </ReactMarkdown>
          )}
          <ComparisonTable data={tableData.data} />
          {textAfterTable && !textAfterTable.includes('|') && (
            <ReactMarkdown components={markdownComponents}>
              {textAfterTable}
            </ReactMarkdown>
          )}
        </>
      );
    }
    
    return (
      <ReactMarkdown components={markdownComponents}>
        {content}
      </ReactMarkdown>
    );
  };

  const executeCode = async (code: string, messageIndex: number) => {
    try {
      const response = await fetch('http://localhost:8080/api/execute-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse response:', text);
        throw new Error('Invalid response format from server');
      }

      setCodeOutput({
        messageIndex,
        ...result
      });
    } catch (error) {
      console.error('Code execution error:', error);
      setCodeOutput({
        messageIndex,
        output: '',
        error: 'Failed to execute code: ' + (error instanceof Error ? error.message : String(error))
      });
    }
  };

  const renderMessage = (message: ChatMessage, messageIndex: number) => {
    const codeBlocks = message.content.match(/```[\s\S]*?```/g) || [];
    const parts = message.content.split(/```[\s\S]*?```/);

    return (
      <motion.div
        key={messageIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`group relative flex items-start gap-3 mb-4 ${
          message.role === 'assistant'
            ? 'bg-gray-50 dark:bg-navy-800 rounded-xl p-6'
            : 'px-2'
        }`}
      >
        {message.role === 'assistant' ? (
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
            <Bot className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5 text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-gray-600 dark:text-gray-300">
                {message.role === 'assistant' ? 'AI Assistant' : 'You'}
              </span>
              {message.timestamp && (
                <span className="text-xs text-gray-400">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>
            <button
              onClick={() => deleteMessage(messageIndex)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-400 
                hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
              title="Delete message"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none break-words">
            {parts.map((part, i) => (
              <React.Fragment key={i}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    ...markdownComponents,
                    p: (props: any) => (
                      <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed break-words" {...props} />
                    ),
                    pre: (props: any) => (
                      <pre className="overflow-x-auto max-w-full" {...props} />
                    ),
                    code: (props: any) => {
                      if (props.inline) {
                        return <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-navy-700 rounded text-sm font-mono break-all" {...props} />;
                      }
                      return (
                        <div className="relative">
                          <SyntaxHighlighter
                            language="python"
                            style={oneDark}
                            className="rounded-lg !mt-0 max-w-full overflow-x-auto"
                            customStyle={{ maxWidth: '100%' }}
                          >
                            {props.children}
                          </SyntaxHighlighter>
                          {message.role === 'assistant' && (
                            <button
                              onClick={() => executeCode(props.children, messageIndex)}
                              className="absolute top-2 right-2 p-2 bg-primary-500 text-white rounded-lg 
                                hover:bg-primary-600 transition-colors"
                              title="Run code"
                            >
                              <Play className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      );
                    }
                  }}
                >
                  {part}
                </ReactMarkdown>
                {i < (message.content.match(/```[\s\S]*?```/g)?.length || 0) && (
                  <div className="relative">
                    <SyntaxHighlighter
                      language="python"
                      style={oneDark}
                      className="rounded-lg !mt-0 max-w-full overflow-x-auto"
                      customStyle={{ maxWidth: '100%' }}
                    >
                      {(message.content.match(/```[\s\S]*?```/g) || [])[i]?.replace(/```(python)?\n?/g, '') || ''}
                    </SyntaxHighlighter>
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => executeCode((message.content.match(/```[\s\S]*?```/g) || [])[i]?.replace(/```(python)?\n?/g, '') || '', messageIndex)}
                        className="absolute top-2 right-2 p-2 bg-primary-500 text-white rounded-lg 
                          hover:bg-primary-600 transition-colors"
                        title="Run code"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          {codeOutput && codeOutput.messageIndex === messageIndex && (
                  <div className="mt-4 space-y-2">
                    {codeOutput.output && (
                <div className="bg-gray-100 dark:bg-navy-700 p-4 rounded-lg overflow-x-auto">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Output:</h4>
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                          {codeOutput.output}
                        </pre>
                      </div>
                    )}
                    {codeOutput.error && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg overflow-x-auto">
                        <h4 className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">Error:</h4>
                  <pre className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap break-words">
                          {codeOutput.error}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
        </div>
      </motion.div>
    );
  };

  // Add project selector dropdown
  const ProjectSelector = () => (
    <AnimatePresence>
      {showProjectSelector && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-16 right-4 w-80 bg-white dark:bg-navy-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-navy-700 p-2"
        >
          <div className="space-y-2">
            <div className="px-2 py-1">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Project</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Choose a project to chat about</p>
            </div>
            <div className="space-y-1">
              {projects.map(project => (
                <button
                  key={project.id}
                  onClick={() => {
                    setSelectedProject(project.name);
                    setShowProjectSelector(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    selectedProject === project.name
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'hover:bg-gray-50 dark:hover:bg-navy-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-gray-400" />
                    <span>{project.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {project.files?.length || 0} files
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`relative flex flex-col ${
      isFullScreen 
        ? 'fixed inset-0 z-[100] bg-white dark:bg-navy-900' 
        : 'h-full'
    }`}>
      {/* Chat List Sidebar */}
      <AnimatePresence>
        {showChatList && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-navy-800 border-r border-gray-200 dark:border-navy-700 z-50 overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-gray-200 dark:border-navy-700">
              <button
                onClick={createNewChat}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5" />
                New Chat
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group flex items-center justify-between gap-2 px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors ${
                    chat.id === currentChatId ? 'bg-gray-100 dark:bg-navy-700' : ''
                  }`}
                  onClick={() => {
                    setCurrentChatId(chat.id);
                    setShowChatList(false);
                  }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <MessageSquare className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      {chat.name}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-400 
                      hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    title="Delete chat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-navy-700 
        ${isFullScreen ? 'sticky top-0 bg-white dark:bg-navy-900 z-10' : ''}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowChatList(!showChatList)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-lg transition-colors"
          >
            <MessageSquare className="h-5 w-5 text-gray-500" />
          </button>
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary-500" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h1>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {ROLE_CONFIGS[currentRole]?.title || 'Assistant'}
                </p>
                {currentRole === 'ragChat' && (
                  <>
                    <span className="text-gray-400">•</span>
                    <button
                      onClick={() => setShowProjectSelector(true)}
                      className="text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      {selectedProject || 'Select Project'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModelSelector(!showModelSelector)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-lg transition-colors"
            title="Change Model"
          >
            <Cpu className="h-5 w-5 text-gray-500" />
          </button>
          <button
            onClick={clearChatHistory}
            className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-lg transition-colors text-gray-500"
            title="Clear Chat History"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          {isInChatWindow && (
            <button
              onClick={toggleFullScreen}
              className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-lg transition-colors"
              title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
            >
              {isFullScreen ? (
                <Minimize2 className="h-5 w-5 text-gray-500" />
              ) : (
                <Maximize2 className="h-5 w-5 text-gray-500" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Add ProjectSelector component */}
      <ProjectSelector />

      {/* Model & Role Settings Modal */}
      <AnimatePresence>
        {showModelSelector && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 right-4 w-[600px] max-h-[calc(100vh-8rem)] bg-navy-900 rounded-lg shadow-lg z-[60] border border-navy-700 flex flex-col"
          >
            <div className="p-6 border-b border-navy-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Model & Role Settings</h2>
                <button
                  onClick={() => setShowModelSelector(false)}
                  className="p-2 hover:bg-navy-800 rounded-lg transition-colors text-gray-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-12">
                {/* Model Selection */}
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-6">Select Model</h3>
                  <div className="space-y-2 overflow-y-auto">
                    {Object.entries(AVAILABLE_MODELS).map(([modelId, config]) => (
                      <button
                        key={modelId}
                        onClick={() => handleModelChange(modelId as ModelId)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          currentModel === modelId 
                            ? 'bg-primary-900/20 border border-primary-500/50'
                            : 'hover:bg-navy-800 border border-transparent'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center ${
                            currentModel === modelId ? 'text-primary-400' : 'text-gray-400'
                          }`}>
                            <Cpu className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-white">{config.name}</div>
                          <div className="text-sm text-gray-400">
                            {config.type === 'gpt4' ? 'Azure OpenAI' : 'Google Gemini'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-6">Select Role</h3>
                  <div className="space-y-2 overflow-y-auto">
                    {/* Built-in Roles */}
                    <div className="space-y-2">
                      {availableRoles
                        .filter(role => role.isBuiltIn)
                        .map(role => (
                          <button
                            key={role.id}
                            onClick={() => handleRoleChange(role.id as AssistantRole)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                              currentRole === role.id 
                                ? 'bg-primary-900/20 border border-primary-500/50'
                                : 'hover:bg-navy-800 border border-transparent'
                            }`}
                          >
                            <div className="flex-shrink-0">
                              <div className={`w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center ${
                                currentRole === role.id ? 'text-primary-400' : 'text-gray-400'
                              }`}>
                                <Bot className="h-5 w-5" />
                              </div>
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-white">{role.config?.title || 'Custom Role'}</div>
                              <div className="text-sm text-gray-400 line-clamp-1">
                                {role.config?.description || 'No description available'}
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>

                    {/* Custom Roles */}
                    {availableRoles.filter(role => !role.isBuiltIn).length > 0 && (
                      <>
                        <div className="h-px bg-navy-700 my-3" />
                        <div className="space-y-2">
                          {availableRoles
                            .filter(role => !role.isBuiltIn)
                            .map(role => (
                              <button
                                key={role.id}
                                onClick={() => handleRoleChange(`custom_${role.id}` as AssistantRole)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                  currentRole === `custom_${role.id}`
                                    ? 'bg-primary-900/20 border border-primary-500/50'
                                    : 'hover:bg-navy-800 border border-transparent'
                                }`}
                              >
                                <div className="flex-shrink-0">
                                  <div className={`w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center ${
                                    currentRole === `custom_${role.id}` ? 'text-primary-400' : 'text-gray-400'
                                  }`}>
                                    <Bot className="h-5 w-5" />
                                  </div>
                                </div>
                                <div className="text-left">
                                  <div className="font-medium text-white">{role.config?.title || 'Custom Role'}</div>
                                  <div className="text-sm text-gray-400 line-clamp-1">
                                    {role.config?.description || 'No description available'}
                                  </div>
                                </div>
                              </button>
                            ))}
                        </div>
                      </>
                    )}

                    {/* Create Custom Role Button */}
                    <button
                      onClick={() => {
                        setShowModelSelector(false);
                        navigate('/settings');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-primary-400 
                        hover:text-primary-300 hover:bg-navy-800 rounded-lg transition-colors border border-dashed border-navy-700"
                    >
                      <Plus className="h-4 w-4" />
                      Create Custom Role
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-navy-700">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowModelSelector(false)}
                  className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Container */}
      <div className={`flex-1 overflow-y-auto ${isFullScreen ? 'h-[calc(100vh-8rem)]' : ''}`}
           style={{ overflowY: 'auto', maxHeight: isFullScreen ? 'calc(100vh - 8rem)' : undefined }}>
        <div className="max-w-4xl mx-auto w-full p-4 overflow-hidden">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex items-center justify-center text-gray-500 min-h-[200px]"
              >
                <div className="text-center max-w-full">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-primary-500" />
                  <p>Start a conversation with the {ROLE_CONFIGS[currentRole]?.title || 'Assistant'}</p>
                  <p className="mt-2 text-sm text-gray-400 max-w-md mx-auto">
                    {ROLE_CONFIGS[currentRole]?.description || 'No description available'}
                  </p>
                  {!geminiKey && (
                    <p className="mt-2 text-sm text-red-500 flex items-center justify-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Please add your Gemini API key in settings
                    </p>
                  )}
                </div>
              </motion.div>
            ) : (
              messages.map((message, messageIndex) => (
                <motion.div
                  key={messageIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`group relative flex items-start gap-3 mb-4 ${
                    message.role === 'assistant'
                      ? 'bg-gray-50 dark:bg-navy-800 rounded-xl p-6'
                      : 'px-2'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-gray-600 dark:text-gray-300">
                          {message.role === 'assistant' ? 'AI Assistant' : 'You'}
                        </span>
                        {message.timestamp && (
                          <span className="text-xs text-gray-400">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => deleteMessage(messageIndex)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-400 
                          hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                        title="Delete message"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                      {message.content.split(/```[\s\S]*?```/).map((part, i) => (
                        <React.Fragment key={i}>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              ...markdownComponents,
                              p: (props: any) => (
                                <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed break-words" {...props} />
                              ),
                              pre: (props: any) => (
                                <pre className="overflow-x-auto max-w-full" {...props} />
                              ),
                              code: (props: any) => {
                                if (props.inline) {
                                  return <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-navy-700 rounded text-sm font-mono break-all" {...props} />;
                                }
                                return (
                                  <div className="relative">
                                    <SyntaxHighlighter
                                      language="python"
                                      style={oneDark}
                                      className="rounded-lg !mt-0 max-w-full overflow-x-auto"
                                      customStyle={{ maxWidth: '100%' }}
                                    >
                                      {props.children}
                                    </SyntaxHighlighter>
                                    {message.role === 'assistant' && (
                                      <button
                                        onClick={() => executeCode(props.children, messageIndex)}
                                        className="absolute top-2 right-2 p-2 bg-primary-500 text-white rounded-lg 
                                          hover:bg-primary-600 transition-colors"
                                        title="Run code"
                                      >
                                        <Play className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>
                                );
                              }
                            }}
                          >
                            {part}
                          </ReactMarkdown>
                          {i < (message.content.match(/```[\s\S]*?```/g)?.length || 0) && (
                            <div className="relative">
                              <SyntaxHighlighter
                                language="python"
                                style={oneDark}
                                className="rounded-lg !mt-0 max-w-full overflow-x-auto"
                                customStyle={{ maxWidth: '100%' }}
                              >
                                {(message.content.match(/```[\s\S]*?```/g) || [])[i]?.replace(/```(python)?\n?/g, '') || ''}
                              </SyntaxHighlighter>
                              {message.role === 'assistant' && (
                                <button
                                  onClick={() => executeCode((message.content.match(/```[\s\S]*?```/g) || [])[i]?.replace(/```(python)?\n?/g, '') || '', messageIndex)}
                                  className="absolute top-2 right-2 p-2 bg-primary-500 text-white rounded-lg 
                                    hover:bg-primary-600 transition-colors"
                                  title="Run code"
                                >
                                  <Play className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    {codeOutput && codeOutput.messageIndex === messageIndex && (
                      <div className="mt-4 space-y-2">
                        {codeOutput.output && (
                          <div className="bg-gray-100 dark:bg-navy-700 p-4 rounded-lg overflow-x-auto">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Output:</h4>
                            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                              {codeOutput.output}
                            </pre>
                          </div>
                        )}
                        {codeOutput.error && (
                          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg overflow-x-auto">
                            <h4 className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">Error:</h4>
                            <pre className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap break-words">
                              {codeOutput.error}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm flex items-center gap-2 justify-center"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className={`border-t border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 
        ${isFullScreen ? 'sticky bottom-0 z-10 w-full' : ''}`}>
        <div className={`p-4 ${isFullScreen ? 'max-w-4xl mx-auto' : ''}`}>
          {selectedImage && (
            <div className="mb-4 relative">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="max-h-[200px] rounded-lg shadow-sm"
              />
              <button
                onClick={removeSelectedImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  geminiKey
                    ? `Ask the ${ROLE_CONFIGS[currentRole]?.title.toLowerCase()}...`
                    : 'Please add your Gemini API key in settings first'
                }
                disabled={!geminiKey || isLoading}
                className="flex-1 p-4 pr-24 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 
                  focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400
                  disabled:bg-gray-100 dark:disabled:bg-navy-700 text-gray-900 dark:text-white"
              />
              <div className="absolute right-2 flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  className="hidden"
                  disabled={!geminiKey || isLoading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!geminiKey || isLoading}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                    disabled:text-gray-300 dark:disabled:text-gray-600"
                  title="Upload image"
                >
                  <ImageIcon className="h-5 w-5" />
                </button>
                <button
                  type="submit"
                  disabled={(!input.trim() && !selectedImage) || !geminiKey || isLoading}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                    disabled:text-gray-300 dark:disabled:text-gray-600"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Chat Button - Updated Scale */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg shadow-lg 
          hover:shadow-xl transition-all duration-300 z-30 flex items-center gap-2 scale-100 hover:scale-105"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="font-medium">Chat</span>
      </button>
    </div>
  );
}