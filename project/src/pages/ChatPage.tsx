import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Maximize2, Minimize2, AlertCircle, Settings, Trash2, Plus, MessageSquare } from 'lucide-react';
import { useStore } from '../store/useStore';
import { StreamingText } from '../components/StreamingText';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, sendChatMessage, AssistantRole, ROLE_CONFIGS } from '../services/chatService';
import { toast } from 'react-hot-toast';
import { ComparisonTable } from '../components/ComparisonTable';
import { PaperDownloadCards } from '../components/PaperDownloadCards';

interface ChatPageProps {
  onFullScreenChange?: (isFullScreen: boolean) => void;
}

interface Chat {
  id: string;
  name: string;
  messages: ChatMessage[];
  role: AssistantRole;
  createdAt: string;
}

interface CompletedMessage {
  messageId: string;
  isComplete: boolean;
}

export function ChatPage({ onFullScreenChange }: ChatPageProps) {
  const [chats, setChats] = useState<Chat[]>(() => {
    const savedChats = localStorage.getItem('chats');
    return savedChats ? JSON.parse(savedChats) : [{
      id: crypto.randomUUID(),
      name: 'New Chat',
      messages: [],
      role: 'default',
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const geminiKey = useStore((state) => state.geminiKey);
  const [completedMessages, setCompletedMessages] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('completedMessages');
    return saved ? JSON.parse(saved) : {};
  });

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
    const newChat: Chat = {
      id: crypto.randomUUID(),
      name: 'New Chat',
      messages: [],
      role: currentRole,
      createdAt: new Date().toISOString()
    };
    setChats(prev => [...prev, newChat]);
    setCurrentChatId(newChat.id);
    setShowChatList(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
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
      timestamp: new Date().toISOString()
    };

    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, messages: [...chat.messages, newMessage] }
        : chat
    ));
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage([...messages, newMessage], geminiKey, currentRole);
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
    toast.success(`Switched to ${ROLE_CONFIGS[role].title} mode`);
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
      const tableMatch = content.match(/\|([^\n]+)\|([^\n]+)\|([^\n]+)\|([^\n]+)\|/g);
      if (!tableMatch) return null;

      const rows = tableMatch.map(row => 
        row.split('|')
          .filter(cell => cell.trim())
          .map(cell => cell.trim())
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
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {ROLE_CONFIGS[currentRole].title}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRoleSelector(!showRoleSelector)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-lg transition-colors"
            title="Change Assistant Role"
          >
            <Settings className="h-5 w-5 text-gray-500" />
          </button>
          <button
            onClick={clearChatHistory}
            className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-lg transition-colors text-gray-500"
            title="Clear Chat History"
          >
            <Trash2 className="h-5 w-5" />
          </button>
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
        </div>
      </div>

      {/* Role Selector Dropdown */}
      <AnimatePresence>
        {showRoleSelector && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 right-4 w-64 bg-white dark:bg-navy-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-navy-700"
          >
            {Object.entries(ROLE_CONFIGS).map(([role, config]) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role as AssistantRole)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors
                  ${currentRole === role ? 'bg-gray-50 dark:bg-navy-700' : ''}`}
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {config.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {config.description}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Container */}
      <div className={`flex-1 overflow-y-auto ${isFullScreen ? 'h-[calc(100vh-8rem)]' : ''}`}
           style={{ overflowY: 'auto', maxHeight: isFullScreen ? 'calc(100vh - 8rem)' : undefined }}>
        <div className={`max-w-4xl mx-auto w-full p-4`}>
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex items-center justify-center text-gray-500 min-h-[200px]"
              >
                <div className="text-center">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-primary-500" />
                  <p>Start a conversation with the {ROLE_CONFIGS[currentRole].title}</p>
                  <p className="mt-2 text-sm text-gray-400 max-w-md">
                    {ROLE_CONFIGS[currentRole].description}
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
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-4 group ${
                    message.role === 'assistant' 
                      ? 'bg-gray-50 dark:bg-navy-800 rounded-lg p-6' 
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
                  <div className="flex-1">
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
                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none overflow-x-auto">
                      {message.role === 'assistant' ? (
                        <>
                          {message.id === messages[messages.length - 1]?.id && isLoading ? (
                            <StreamingText onComplete={() => handleMessageComplete(message.id)}>
                              {renderMessageContent(message.content)}
                            </StreamingText>
                          ) : (
                            renderMessageContent(message.content)
                          )}
                          {message.arxivPapers && message.arxivPapers.length > 0 && (
                            <PaperDownloadCards papers={message.arxivPapers} />
                          )}
                        </>
                      ) : (
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      )}
                    </div>
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
          <form onSubmit={handleSubmit}>
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  geminiKey
                    ? `Ask the ${ROLE_CONFIGS[currentRole].title.toLowerCase()}...`
                    : 'Please add your Gemini API key in settings first'
                }
                disabled={!geminiKey || isLoading}
                className="flex-1 p-4 pr-12 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 
                  focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400
                  disabled:bg-gray-100 dark:disabled:bg-navy-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={!geminiKey || !input.trim() || isLoading}
                className="absolute right-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                  disabled:text-gray-300 dark:disabled:text-gray-600"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}