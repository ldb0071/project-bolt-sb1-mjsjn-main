import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Key, Save, Check } from 'lucide-react';

export function SettingsPage() {
  const { apiKey, setApiKey } = useStore();
  const [newApiKey, setNewApiKey] = useState(apiKey);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(newApiKey);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
              OpenAI API Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="apiKey"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
                className="block w-full pl-10 pr-12 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="sk-..."
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Your API key will be stored locally and never shared.
            </p>
          </div>

          <button
            type="submit"
            className="btn bg-primary-500 text-white hover:bg-primary-600 w-full flex items-center justify-center space-x-2"
          >
            {showSuccess ? (
              <>
                <Check className="h-5 w-5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}