import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatPage } from '../pages/ChatPage';

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg shadow-lg 
          hover:shadow-xl transition-all duration-300 z-30 flex items-center gap-2 scale-100 hover:scale-105"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="font-medium">Chat</span>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: "spring", stiffness: 300, damping: 30 }
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed z-40 overflow-hidden bg-white dark:bg-navy-900 rounded-lg shadow-xl
              ${isFullScreen 
                ? 'inset-0 rounded-none' 
                : 'bottom-24 right-6 w-[500px] h-[400px]'}`}
          >
            <div className="absolute top-2 right-2 z-50">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="w-full h-full">
              <ChatPage onFullScreenChange={setIsFullScreen} isInChatWindow={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 