            className={`fixed z-40 overflow-hidden bg-white dark:bg-navy-900 rounded-lg shadow-xl
              ${isFullScreen 
                ? 'inset-0 rounded-none' 
                : 'bottom-24 right-6 w-[800px] h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)]'}`}
          >
            <div className="absolute top-2 right-2 z-50">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="w-full h-full overflow-hidden">
              <ChatPage onFullScreenChange={setIsFullScreen} isInChatWindow={true} />
            </div>
          </div> 