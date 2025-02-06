import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { CustomRoleManager } from '../components/CustomRoleManager';
import { ToolManager } from '../components/ToolManager';
import { motion } from 'framer-motion';
import { Key, Bot, Wrench, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function SettingsPage() {
  const {
    youtubeApiKey,
    setYoutubeApiKey,
    chatApiKey,
    setChatApiKey,
    geminiKey,
    setGeminiKey,
    githubToken,
    setGithubToken,
    azureOpenAIKey,
    setAzureOpenAIKey,
    azureOpenAIEndpoint,
    setAzureOpenAIEndpoint,
  } = useStore();

  const [isLoading, setIsLoading] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Fetch current API keys when component mounts
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/settings/keys');
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response:', errorText);
        throw new Error(`Failed to fetch API keys: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Only update state if the values exist in the response
      if (data.youtube_api_key !== undefined) setYoutubeApiKey(data.youtube_api_key);
      if (data.chat_api_key !== undefined) setChatApiKey(data.chat_api_key);
      if (data.gemini_api_key !== undefined) setGeminiKey(data.gemini_api_key);
      if (data.github_token !== undefined) setGithubToken(data.github_token);
      if (data.azure_openai_api_key !== undefined) setAzureOpenAIKey(data.azure_openai_api_key);
      if (data.azure_openai_endpoint !== undefined) setAzureOpenAIEndpoint(data.azure_openai_endpoint);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast.error('Failed to fetch API keys. Please try again later.');
    }
  };

  const handleSaveKeys = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/settings/update-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youtube_api_key: youtubeApiKey,
          chat_api_key: chatApiKey,
          gemini_api_key: geminiKey,
          github_token: githubToken,
          azure_openai_api_key: azureOpenAIKey,
          azure_openai_endpoint: azureOpenAIEndpoint,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response:', errorText);
        throw new Error(`Failed to update API keys: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API keys updated successfully:', data);
      toast.success('API keys updated successfully');
    } catch (error) {
      console.error('Error updating API keys:', error);
      toast.error('Failed to update API keys. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle visibility for a specific key field
  const toggleKeyVisibility = (keyName: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyName]: !prev[keyName]
    }));
  };

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
                YouTube API Key
              </label>
              <div className="relative">
                <input
                  type={visibleKeys['youtube'] ? 'text' : 'password'}
                  value={youtubeApiKey}
                  onChange={(e) => setYoutubeApiKey(e.target.value)}
                  className="w-full p-2 pr-10 border border-gray-300 dark:border-navy-600 rounded-lg
                    bg-white dark:bg-navy-800 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                  placeholder="Enter your YouTube API key"
                />
                <button
                  type="button"
                  onClick={() => toggleKeyVisibility('youtube')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {visibleKeys['youtube'] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Chat API Key
              </label>
              <div className="relative">
                <input
                  type={visibleKeys['chat'] ? 'text' : 'password'}
                  value={chatApiKey}
                  onChange={(e) => setChatApiKey(e.target.value)}
                  className="w-full p-2 pr-10 border border-gray-300 dark:border-navy-600 rounded-lg
                    bg-white dark:bg-navy-800 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                  placeholder="Enter your Chat API key"
                />
                <button
                  type="button"
                  onClick={() => toggleKeyVisibility('chat')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {visibleKeys['chat'] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gemini API Key
              </label>
              <div className="relative">
                <input
                  type={visibleKeys['gemini'] ? 'text' : 'password'}
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full p-2 pr-10 border border-gray-300 dark:border-navy-600 rounded-lg
                    bg-white dark:bg-navy-800 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                  placeholder="Enter your Gemini API key"
                />
                <button
                  type="button"
                  onClick={() => toggleKeyVisibility('gemini')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {visibleKeys['gemini'] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GitHub Token
              </label>
              <div className="relative">
                <input
                  type={visibleKeys['github'] ? 'text' : 'password'}
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  className="w-full p-2 pr-10 border border-gray-300 dark:border-navy-600 rounded-lg
                    bg-white dark:bg-navy-800 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                  placeholder="Enter your GitHub token"
                />
                <button
                  type="button"
                  onClick={() => toggleKeyVisibility('github')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {visibleKeys['github'] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Azure OpenAI API Key
              </label>
              <div className="relative">
                <input
                  type={visibleKeys['azure'] ? 'text' : 'password'}
                  value={azureOpenAIKey}
                  onChange={(e) => setAzureOpenAIKey(e.target.value)}
                  className="w-full p-2 pr-10 border border-gray-300 dark:border-navy-600 rounded-lg
                    bg-white dark:bg-navy-800 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                  placeholder="Enter your Azure OpenAI API key"
                />
                <button
                  type="button"
                  onClick={() => toggleKeyVisibility('azure')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {visibleKeys['azure'] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Azure OpenAI Endpoint
              </label>
              <div className="relative">
                <input
                  type={visibleKeys['azureEndpoint'] ? 'text' : 'password'}
                  value={azureOpenAIEndpoint}
                  onChange={(e) => setAzureOpenAIEndpoint(e.target.value)}
                  className="w-full p-2 pr-10 border border-gray-300 dark:border-navy-600 rounded-lg
                    bg-white dark:bg-navy-800 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                  placeholder="Enter your Azure OpenAI endpoint"
                />
                <button
                  type="button"
                  onClick={() => toggleKeyVisibility('azureEndpoint')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {visibleKeys['azureEndpoint'] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleSaveKeys}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 
                  text-white font-medium rounded-lg transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save API Keys'}
              </button>
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