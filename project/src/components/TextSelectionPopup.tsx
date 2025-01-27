import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, RefreshCw, FileText, X, ChevronRight, Image as ImageIcon, Send, StickyNote } from 'lucide-react';
import axios from 'axios';

interface PopupPosition {
  x: number;
  y: number;
}

interface TextSelectionPopupProps {
  selectedText: string;
  position: PopupPosition;
  onClose: () => void;
  onAddNote: (noteText: string) => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  image?: string;
}

type ActionType = 'explain' | 'summarize' | 'rewrite' | 'note';

const API_BASE = 'http://localhost:8080';

interface APIResponse {
  response?: string;
  error?: string;
}

const analyzeText = async (text: string, action: ActionType, image?: string): Promise<string> => {
  console.log('Sending analyze request:', { text, action, image: image ? 'present' : 'absent' });
  
  try {
    const response = await axios.post<APIResponse>(`${API_BASE}/api/analyze`, {
      text,
      action,
      image
    });

    console.log('Received API response:', response.data);

    if (response.data.error) {
      console.error('API returned error:', response.data.error);
      throw new Error(response.data.error);
    }

    return response.data.response || 'No response received';
  } catch (error) {
    console.error('Error analyzing text:', error);
    if (error && typeof error === 'object' && 'isAxiosError' in error) {
      const axiosError = error as any;
      console.error('Axios error details:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message
      });
    }
    throw error;
  }
};

export const TextSelectionPopup: React.FC<TextSelectionPopupProps> = ({
  selectedText,
  position,
  onClose,
  onAddNote,
}) => {
  const [showChat, setShowChat] = useState(false);
  const [action, setAction] = useState<ActionType>('explain');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const input = fileInputRef.current;
    
    if (file && input) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
          // Clear the input value to allow selecting the same file again
          input.value = '';
        } else {
          console.error('Failed to read image file');
          setError('Failed to read image file');
        }
      };
      reader.onerror = () => {
        console.error('Error reading file:', reader.error);
        setError('Error reading image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return;

    if (action === 'note') {
      onAddNote(inputMessage);
      setShowChat(false);
      onClose();
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setSelectedImage(null);
    setIsLoading(true);
    setError(null);

    try {
      const response = await analyzeText(inputMessage, action || 'explain', selectedImage || undefined);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while processing your request';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAction = async (type: ActionType, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (type === 'note') {
      setShowChat(true);
      setAction(type);
      setMessages([
        { role: 'user', content: 'Add a note for the selected text:' },
        { role: 'assistant', content: 'Enter your note below:' }
      ]);
      return;
    }

    console.log('Action triggered:', {
      type,
      selectedText,
      eventTarget: e.target
    });

    setShowChat(true);
    setAction(type);
    setIsLoading(true);
    setError(null);

    try {
      console.log('Making API request to analyze text...');
      const response = await analyzeText(selectedText, type);
      console.log('Received response:', response);
      
      setMessages([
        { role: 'user', content: selectedText },
        { role: 'assistant', content: response }
      ]);
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while processing your request';
      console.error('Error details:', {
        message: errorMessage,
        error
      });
      setError(errorMessage);
      setMessages([
        { role: 'user', content: selectedText },
        { role: 'assistant', content: 'Sorry, I encountered an error processing your request.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShowChat(false);
    setMessages([]);
    onClose();
  };

  const handleTabClick = (type: ActionType) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setAction(type);
    handleAction(type, e);
  };

  const getActionIcon = (type: ActionType) => {
    switch (type) {
      case 'explain':
        return <MessageSquare size={16} />;
      case 'summarize':
        return <FileText size={16} />;
      case 'rewrite':
        return <RefreshCw size={16} />;
      case 'note':
        return <StickyNote size={16} />;
      default:
        return <MessageSquare size={16} />;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Don't close if clicking inside the chat window or selection popup
      if (chatRef.current?.contains(target) || target.closest('.selection-popup')) {
        return;
      }

      // Don't close if chat is open
      if (showChat) {
        return;
      }

      onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, showChat]);

  // Get action title with proper type safety
  const getActionTitle = (type: ActionType): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Log when the popup is mounted
  useEffect(() => {
    console.log('TextSelectionPopup mounted:', {
      selectedText,
      position,
      showChat
    });
  }, [selectedText, position, showChat]);

  return (
    <div 
      className="fixed inset-0 z-[9999]" 
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Selection Popup Menu */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="absolute bg-navy-800 rounded-lg shadow-xl border border-navy-600 selection-popup"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -120%)',
          zIndex: 10000
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-1 p-1">
          {(['explain', 'summarize', 'rewrite', 'note'] as const).map((type) => (
            <button
              key={type}
              onClick={(e) => {
                e.stopPropagation();
                handleAction(type, e);
              }}
              className="flex items-center space-x-2 px-3 py-1.5 hover:bg-navy-700 rounded-md text-white text-sm"
            >
              {getActionIcon(type)}
              <span>{type === 'note' ? 'Add Note' : type.charAt(0).toUpperCase() + type.slice(1)}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Chat Interface */}
      <AnimatePresence mode="wait">
        {showChat && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              style={{ zIndex: 10001 }}
              onClick={handleClose}
            />
            
            {/* Chat Window */}
            <motion.div
              ref={chatRef}
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              className="fixed right-4 top-4 bottom-4 w-[400px] bg-navy-900 border-l border-navy-700 shadow-xl rounded-lg overflow-hidden chat-window"
              style={{ zIndex: 10002 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="border-b border-navy-700">
                  <div className="flex items-center justify-between px-4 py-3">
                    <h3 className="text-lg font-semibold text-white">
                      {action === 'note' ? 'Add Note' : 'AI Assistant'}
                    </h3>
                    <button
                      onClick={handleClose}
                      className="p-1 hover:bg-navy-700 rounded-lg text-gray-400 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  {action !== 'note' && (
                    <div className="flex px-4 space-x-4">
                      {(['explain', 'summarize', 'rewrite'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={handleTabClick(type)}
                          className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                            action === type
                              ? 'text-primary-400 border-primary-400'
                              : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-700'
                          }`}
                        >
                          {getActionIcon(type)}
                          <span>{getActionTitle(type)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 border-b border-navy-700">
                    <div className="text-sm text-gray-400">Selected text:</div>
                    <div className="mt-1 text-white">{selectedText}</div>
                  </div>
                  {action !== 'note' && (
                    <div className="p-4 space-y-4">
                      {error && (
                        <div className="bg-red-900/50 text-red-400 p-4 rounded-lg">
                          {error}
                        </div>
                      )}
                      {messages.map((message, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <span>{message.role === 'user' ? 'You' : 'Response'}</span>
                            {message.role === 'assistant' && (
                              <>
                                <ChevronRight size={16} />
                                <span>{action?.charAt(0).toUpperCase() + action?.slice(1)}</span>
                              </>
                            )}
                          </div>
                          <div className={`rounded-lg p-4 ${
                            message.role === 'user' 
                              ? 'bg-navy-700 text-white' 
                              : 'bg-navy-800 text-white'
                          }`}>
                            {message.image && (
                              <div className="mb-2">
                                <img 
                                  src={message.image} 
                                  alt="User uploaded" 
                                  className="max-w-full rounded-lg"
                                />
                              </div>
                            )}
                            {message.content}
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-center py-4">
                          <div className="animate-pulse text-primary-400">
                            Processing...
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="border-t border-navy-700 p-4">
                  <div className="space-y-4">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={action === 'note' ? "Write your note here..." : "Type your message..."}
                      className="w-full bg-navy-800 text-white rounded-lg p-3 min-h-[100px] resize-y"
                      style={{ lineHeight: '1.5rem' }}
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputMessage.trim()}
                        className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                          isLoading || !inputMessage.trim()
                            ? 'bg-navy-700 text-gray-500 cursor-not-allowed'
                            : 'bg-primary-500 text-white hover:bg-primary-600'
                        }`}
                      >
                        <span>{action === 'note' ? 'Save Note' : 'Send'}</span>
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}; 