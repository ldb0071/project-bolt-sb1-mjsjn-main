<div className={`flex-1 overflow-y-auto ${isFullScreen ? 'h-[calc(100vh-8rem)]' : ''}`}
     style={{ overflowY: 'auto', maxHeight: isFullScreen ? 'calc(100vh - 8rem)' : undefined }}>
  <div className="max-w-3xl mx-auto w-full p-4 space-y-6 overflow-hidden">
    <AnimatePresence mode="wait">
      {messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="h-full flex items-center justify-center text-gray-500 min-h-[200px]"
        >
          {/* ... existing empty state content ... */}
        </motion.div>
      ) : (
        <div className="space-y-6 w-full">
          {messages.map((message, messageIndex) => (
            <motion.div
              key={messageIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`group relative flex items-start gap-3 w-full overflow-hidden ${
                message.role === 'assistant'
                  ? 'bg-gray-50 dark:bg-navy-800 rounded-xl p-4'
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
                <div className="flex items-center justify-between gap-2 mb-2">
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
                <div className="prose prose-sm dark:prose-invert w-full max-w-none overflow-hidden">
                  {parts.map((part, i) => (
                    <React.Fragment key={i}>
                      <div className="break-words whitespace-pre-wrap overflow-hidden">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            ...markdownComponents,
                            p: (props: any) => (
                              <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words overflow-hidden" {...props} />
                            ),
                            code: (props: any) => {
                              if (props.inline) {
                                return <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-navy-700 rounded text-sm font-mono break-all" {...props} />;
                              }
                              return <code className="block bg-gray-100 dark:bg-navy-700 p-4 rounded-lg text-sm overflow-x-auto mb-4 font-mono w-full" {...props} />;
                            },
                            pre: (props: any) => (
                              <pre className="w-full overflow-x-auto" {...props} />
                            ),
                          }}
                        >
                          {part}
                        </ReactMarkdown>
                      </div>
                      {i < codeBlocks.length && (
                        <div className="relative mt-3 mb-3 w-full">
                          <div className="rounded-lg bg-[#1b1b1b] w-full overflow-hidden">
                            <div className="overflow-x-auto">
                              <SyntaxHighlighter
                                language="python"
                                style={oneDark}
                                customStyle={{
                                  margin: 0,
                                  padding: '1rem',
                                  fontSize: '0.875rem',
                                  lineHeight: '1.5',
                                  background: '#1b1b1b',
                                  width: '100%',
                                }}
                                wrapLongLines={true}
                                showLineNumbers={true}
                                wrapLines={true}
                                className="w-full"
                              >
                                {codeBlocks[i].replace(/```(python)?\n?/g, '')}
                              </SyntaxHighlighter>
                            </div>
                          </div>
                          {message.role === 'assistant' && (
                            <button
                              onClick={() => executeCode(codeBlocks[i].replace(/```(python)?\n?/g, ''), messageIndex)}
                              className="absolute top-2 right-2 p-2 bg-primary-500 text-white rounded-lg 
                                hover:bg-primary-600 transition-colors z-10"
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
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {/* ... existing error state ... */}
    </AnimatePresence>
    <div ref={messagesEndRef} />
  </div>
</div> 