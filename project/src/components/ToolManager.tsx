/**
 * Tool Manager Component
 * 
 * This component provides a UI for managing custom and built-in tools.
 * It allows users to:
 * - Create new tools
 * - Edit existing tools
 * - Enable/disable tools
 * - Configure tool parameters
 * - Manage API keys
 * - Set role permissions
 * 
 * Related Components:
 * - CustomRoleManager: Manages role configurations
 * - SettingsPage: Parent component
 * 
 * State Management:
 * - Uses useStore for tool state
 * - Local state for form management
 */

import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Tool, CustomTool, BUILT_IN_TOOLS, validateToolConfig, isToolAvailableForRole } from '../services/toolService';
import { AssistantRole, ROLE_CONFIGS } from '../services/chatService';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, Wrench, Key, Check, X, ChevronDown, ChevronUp, Edit2, RotateCcw, Trash2 } from 'lucide-react';

/**
 * Interface for tool parameter configuration
 */
interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean';
  description: string;
  required: boolean;
  default?: any;
}

/**
 * Interface for tool configuration form data
 */
interface ToolFormData {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST';
  parameters: ToolParameter[];
  requiresApiKey: boolean;
  apiKeyName?: string;
  allowedRoles?: AssistantRole[];
}

/**
 * Default form data for new tools
 */
const defaultFormData: ToolFormData = {
  id: '',
  name: '',
  description: '',
  endpoint: '',
  method: 'GET',
  parameters: [],
  requiresApiKey: false,
  allowedRoles: []
};

/**
 * Extended Store interface with tool management properties
 */
interface ToolStore {
  customTools: CustomTool[];
  modifiedBuiltInTools: Record<string, Tool>;
  toolApiKeys: Record<string, string>;
  addCustomTool: (tool: CustomTool) => void;
  updateCustomTool: (id: string, tool: Partial<CustomTool>) => void;
  deleteCustomTool: (id: string) => void;
  updateBuiltInTool: (id: string, config: Partial<Tool>) => void;
  resetBuiltInTool: (id: string) => void;
  setToolApiKey: (toolId: string, apiKey: string) => void;
  isToolEnabled: (toolId: string) => boolean;
  toggleTool: (toolId: string) => void;
}

export function ToolManager() {
  // Global state from store
  const store = useStore();
  const {
    customTools,
    modifiedBuiltInTools,
    toolApiKeys,
    addCustomTool,
    updateCustomTool,
    deleteCustomTool,
    updateBuiltInTool,
    resetBuiltInTool,
    setToolApiKey,
    isToolEnabled,
    toggleTool,
  } = store as unknown as ToolStore;

  // Local state for UI management
  const [formData, setFormData] = useState<ToolFormData>(defaultFormData);
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<AssistantRole[]>([]);

  /**
   * Handle form submission for creating/updating tools
   * Validates configuration and updates store
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const toolConfig: CustomTool = {
      ...formData,
      isEnabled: true,
      isCustom: true,
      allowedRoles: selectedRoles.length > 0 ? selectedRoles : undefined
    };

    if (!validateToolConfig(toolConfig)) {
      toast.error('Invalid tool configuration');
      return;
    }

    if (editingToolId) {
      updateCustomTool(editingToolId, toolConfig);
      toast.success('Tool updated successfully');
    } else {
      addCustomTool(toolConfig);
      toast.success('Tool added successfully');
    }

    setFormData(defaultFormData);
    setEditingToolId(null);
    setShowForm(false);
    setSelectedRoles([]);
  };

  /**
   * Handle editing an existing tool
   * Populates form with tool data
   */
  const handleEdit = (tool: Tool) => {
    setFormData(tool);
    setEditingToolId(tool.id);
    setSelectedRoles(tool.allowedRoles || []);
    setShowForm(true);
  };

  /**
   * Handle deleting a tool
   */
  const handleDelete = (id: string) => {
    deleteCustomTool(id);
    toast.success('Tool deleted successfully');
  };

  /**
   * Handle resetting a built-in tool to defaults
   */
  const handleReset = (id: string) => {
    resetBuiltInTool(id);
    toast.success('Tool reset to default configuration');
  };

  /**
   * Handle API key updates
   */
  const handleApiKeyChange = (toolId: string, apiKey: string) => {
    setToolApiKey(toolId, apiKey);
    toast.success('API key updated');
  };

  /**
   * Toggle tool details expansion
   */
  const toggleToolExpansion = (toolId: string) => {
    setExpandedTool(expandedTool === toolId ? null : toolId);
  };

  /**
   * Toggle role selection for tool permissions
   */
  const toggleRoleSelection = (role: AssistantRole) => {
    setSelectedRoles(prev => 
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  /**
   * Render a tool card with details and actions
   */
  const renderToolCard = (tool: Tool, isBuiltIn: boolean = false) => {
    const isExpanded = expandedTool === tool.id;
    const modifiedTool = modifiedBuiltInTools[tool.id];
    const isModified = !!modifiedTool;
    const currentTool = modifiedTool || tool;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white dark:bg-navy-800 rounded-lg shadow-sm border border-gray-200 dark:border-navy-700 overflow-hidden"
      >
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Wrench className="h-5 w-5 text-primary-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {currentTool.name}
                  </h3>
                  {isModified && (
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                      Modified
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {currentTool.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleTool(tool.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isToolEnabled(tool.id)
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-navy-700 dark:text-gray-400'
                }`}
              >
                {isToolEnabled(tool.id) ? 'Enabled' : 'Disabled'}
              </button>
              <button
                onClick={() => {
                  setFormData({
                    id: tool.id,
                    name: currentTool.name,
                    description: currentTool.description,
                    endpoint: currentTool.endpoint,
                    method: currentTool.method,
                    parameters: [...currentTool.parameters],
                    requiresApiKey: currentTool.requiresApiKey,
                    apiKeyName: currentTool.apiKeyName,
                    allowedRoles: currentTool.allowedRoles || []
                  });
                  setSelectedRoles(currentTool.allowedRoles || []);
                  setEditingToolId(tool.id);
                  setShowForm(true);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                title={isBuiltIn ? "Modify built-in tool" : "Edit tool"}
              >
                <Edit2 className="h-4 w-4" />
              </button>
              {isBuiltIn && isModified ? (
                <button
                  onClick={() => handleReset(tool.id)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                  title="Reset to default configuration"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              ) : !isBuiltIn ? (
                <button
                  onClick={() => handleDelete(tool.id)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  title="Delete tool"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
              <button
                onClick={() => toggleToolExpansion(tool.id)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors"
                title={isExpanded ? "Hide details" : "Show details"}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Endpoint:</span>
                    <span className="font-mono">{currentTool.endpoint}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Method:</span>
                    <span className="font-mono">{currentTool.method}</span>
                  </div>
                  {currentTool.requiresApiKey && (
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>API Key Parameter:</span>
                      <span className="font-mono">{currentTool.apiKeyName || 'api_key'}</span>
                    </div>
                  )}
                </div>

                {currentTool.parameters.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Parameters:</h4>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      {currentTool.parameters.map((param, index) => (
                        <motion.div
                          key={`${param.name}-${index}`}
                          className="p-2 bg-gray-50 dark:bg-navy-900 rounded-lg"
                        >
                          <div className="font-medium text-gray-700 dark:text-gray-300">
                            {param.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Type: {param.type}
                            {param.required && ' (Required)'}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {currentTool.allowedRoles && currentTool.allowedRoles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Allowed Roles:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentTool.allowedRoles.map(role => (
                        <span
                          key={role}
                          className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-navy-700 text-gray-700 dark:text-gray-300 rounded-full"
                        >
                          {ROLE_CONFIGS[role].title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">External Tools</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 
            text-white rounded-lg transition-colors"
        >
          {showForm ? (
            <>
              <X className="h-5 w-5" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              Add New Tool
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4 bg-white dark:bg-navy-800 rounded-lg p-6 border border-gray-200 dark:border-navy-700"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tool Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-navy-600 rounded-lg
                  bg-white dark:bg-navy-800 text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-navy-600 rounded-lg
                  bg-white dark:bg-navy-800 text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Endpoint URL
              </label>
              <input
                type="url"
                value={formData.endpoint}
                onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-navy-600 rounded-lg
                  bg-white dark:bg-navy-800 text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                HTTP Method
              </label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value as 'GET' | 'POST' })}
                className="w-full p-2 border border-gray-300 dark:border-navy-600 rounded-lg
                  bg-white dark:bg-navy-800 text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Parameters
              </label>
              <div className="space-y-2">
                {formData.parameters.map((param, index) => (
                  <motion.div
                    key={`${param.name}-${index}`}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={param.name}
                      onChange={(e) => {
                        const newParams = [...formData.parameters];
                        newParams[index] = { ...param, name: e.target.value };
                        setFormData({ ...formData, parameters: newParams });
                      }}
                      placeholder="Parameter name"
                      className="flex-1 p-2 border border-gray-300 dark:border-navy-600 rounded-lg
                        bg-white dark:bg-navy-800 text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                    />
                    <select
                      value={param.type}
                      onChange={(e) => {
                        const newParams = [...formData.parameters];
                        newParams[index] = { ...param, type: e.target.value as 'string' | 'number' | 'boolean' };
                        setFormData({ ...formData, parameters: newParams });
                      }}
                      className="w-32 p-2 border border-gray-300 dark:border-navy-600 rounded-lg
                        bg-white dark:bg-navy-800 text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const newParams = formData.parameters.filter((_, i) => i !== index);
                        setFormData({ ...formData, parameters: newParams });
                      }}
                      className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </motion.div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      parameters: [
                        ...formData.parameters,
                        { name: '', type: 'string', description: '', required: true }
                      ]
                    });
                  }}
                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700
                    dark:text-primary-400 dark:hover:text-primary-300"
                >
                  <Plus className="h-4 w-4" />
                  Add Parameter
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.requiresApiKey}
                onChange={(e) => setFormData({ ...formData, requiresApiKey: e.target.checked })}
                className="rounded border-gray-300 dark:border-navy-600 text-primary-600
                  focus:ring-primary-500 dark:focus:ring-primary-400"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Requires API Key
              </label>
            </div>

            {formData.requiresApiKey && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  API Key Parameter Name
                </label>
                <input
                  type="text"
                  value={formData.apiKeyName || ''}
                  onChange={(e) => setFormData({ ...formData, apiKeyName: e.target.value })}
                  placeholder="e.g., api_key, token, etc."
                  className="w-full p-2 border border-gray-300 dark:border-navy-600 rounded-lg
                    bg-white dark:bg-navy-800 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Allowed Roles
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(ROLE_CONFIGS).map(([roleId, config]) => (
                  <motion.button
                    key={roleId}
                    type="button"
                    onClick={() => toggleRoleSelection(roleId as AssistantRole)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedRoles.includes(roleId as AssistantRole)
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-navy-700 dark:text-gray-400'
                    }`}
                  >
                    {config.title}
                  </motion.button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 
                text-white rounded-lg transition-colors"
            >
              {editingToolId ? 'Update Tool' : 'Add Tool'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Built-in Tools</h3>
          <div className="space-y-4">
            {Object.entries(BUILT_IN_TOOLS).map(([id, tool]) => (
              <motion.div key={id}>
                {renderToolCard(tool, true)}
              </motion.div>
            ))}
          </div>
        </div>

        {customTools.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Custom Tools</h3>
            <div className="space-y-4">
              {customTools.map((tool) => (
                <motion.div key={tool.id}>
                  {renderToolCard(tool)}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 