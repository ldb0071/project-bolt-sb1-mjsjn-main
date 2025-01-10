import React from 'react';
import { useStore } from '../store/useStore';
import { CustomRoleManager } from '../components/CustomRoleManager';
import { ToolManager } from '../components/ToolManager';
import { motion } from 'framer-motion';
import { Key, Bot, Wrench } from 'lucide-react';

export function SettingsPage() {
  const {
    apiKey,
    setApiKey,
    geminiKey,
    setGeminiKey,
    githubToken,
    setGithubToken,
  } = useStore();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Settings</h1>

      <div className="space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-navy-800 rounded-lg shadow-sm border border-gray-200 dark:border-navy-700 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
              <Key className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">API Keys</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Configure your API keys for various services
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Scopus API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-navy-600 rounded-lg
                  bg-white dark:bg-navy-800 text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                placeholder="Enter your Scopus API key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gemini API Key
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-navy-600 rounded-lg
                  bg-white dark:bg-navy-800 text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                placeholder="Enter your Gemini API key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GitHub Token
              </label>
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-navy-600 rounded-lg
                  bg-white dark:bg-navy-800 text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                placeholder="Enter your GitHub token"
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-navy-800 rounded-lg shadow-sm border border-gray-200 dark:border-navy-700 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Custom Roles</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create and manage custom roles for the chat assistant
              </p>
            </div>
          </div>

          <CustomRoleManager />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-navy-800 rounded-lg shadow-sm border border-gray-200 dark:border-navy-700 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">External Tools</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Configure and manage external tools for different assistant roles
              </p>
            </div>
          </div>

          <ToolManager />
        </motion.section>
      </div>
    </div>
  );
}