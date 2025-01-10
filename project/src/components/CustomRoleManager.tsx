import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { AssistantRole, ROLE_CONFIGS } from '../services/chatService';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Bot, 
  X, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Trash2,
  Edit2,
  RotateCcw,
  Info
} from 'lucide-react';

interface RoleFormData {
  id: string;
  title: string;
  description: string;
  systemPrompt: string;
}

const defaultFormData: RoleFormData = {
  id: '',
  title: '',
  description: '',
  systemPrompt: ''
};

const tooltipStyles = `
  absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 
  -translate-x-1/2 whitespace-nowrap z-50 left-1/2 pointer-events-none
  shadow-lg border border-gray-700
  before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2
  before:border-4 before:border-transparent before:border-t-gray-800
`;

export function CustomRoleManager() {
  const {
    customRoles,
    modifiedBuiltInRoles,
    addCustomRole,
    updateCustomRole,
    deleteCustomRole,
    updateBuiltInRole,
    resetBuiltInRole,
  } = useStore();

  const [formData, setFormData] = useState<RoleFormData>(defaultFormData);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editingBuiltInRole, setEditingBuiltInRole] = useState<AssistantRole | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingBuiltInRole) {
      updateBuiltInRole(editingBuiltInRole, {
        title: formData.title,
        description: formData.description,
        systemPrompt: formData.systemPrompt
      });
      toast.success('Built-in role updated successfully');
      setEditingBuiltInRole(null);
    } else if (editingRoleId) {
      updateCustomRole(editingRoleId, {
        config: {
          title: formData.title,
          description: formData.description,
          systemPrompt: formData.systemPrompt
        }
      });
      toast.success('Role updated successfully');
    } else {
      addCustomRole({
        id: crypto.randomUUID(),
        config: {
          title: formData.title,
          description: formData.description,
          systemPrompt: formData.systemPrompt
        },
        isCustom: true
      });
      toast.success('Role added successfully');
    }

    setFormData(defaultFormData);
    setEditingRoleId(null);
    setShowForm(false);
  };

  const handleEdit = (roleId: string) => {
    const role = customRoles.find(r => r.id === roleId);
    if (role) {
      setFormData({
        id: role.id,
        title: role.config.title,
        description: role.config.description,
        systemPrompt: role.config.systemPrompt
      });
      setEditingRoleId(role.id);
      setShowForm(true);
    }
  };

  const handleEditBuiltIn = (role: AssistantRole) => {
    const config = modifiedBuiltInRoles.find(r => r.originalRole === role)?.config || ROLE_CONFIGS[role];
    setFormData({
      id: role,
      title: config.title,
      description: config.description,
      systemPrompt: config.systemPrompt
    });
    setEditingBuiltInRole(role);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteCustomRole(id);
    toast.success('Role deleted successfully');
  };

  const handleReset = (role: AssistantRole) => {
    resetBuiltInRole(role);
    toast.success('Role reset to default configuration');
  };

  const toggleRoleExpansion = (roleId: string) => {
    setExpandedRole(expandedRole === roleId ? null : roleId);
  };

  const handleDisableBuiltIn = (role: AssistantRole) => {
    updateBuiltInRole(role, {
      ...ROLE_CONFIGS[role],
      isDisabled: true
    });
    toast.success('Role disabled successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Roles</h2>
          <div className="relative">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-full transition-colors group"
            >
              <HelpCircle className="h-5 w-5 text-gray-500" />
              <span className={`${tooltipStyles} bottom-[calc(100%+10px)]`}>
                Show help
              </span>
            </button>
          </div>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingBuiltInRole(null);
            setEditingRoleId(null);
            setFormData(defaultFormData);
          }}
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
              Add New Role
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 dark:bg-navy-900 border border-blue-200 dark:border-navy-600 rounded-lg p-6 space-y-4"
          >
            <h3 className="font-semibold text-blue-900 dark:text-blue-400">How to Manage Roles and Tools</h3>
            
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800 dark:text-blue-300">Managing Roles:</h4>
              <ul className="list-disc list-inside text-blue-700 dark:text-blue-200 space-y-1">
                <li>Click "Add New Role" to create a custom role</li>
                <li>Use "Edit" to modify any role's configuration</li>
                <li>Use "Reset" to restore a built-in role to its default settings</li>
                <li>Use "Remove" to disable a built-in role</li>
                <li>Use "Delete" to remove a custom role</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-blue-800 dark:text-blue-300">Adding Tools to Roles:</h4>
              <ul className="list-disc list-inside text-blue-700 dark:text-blue-200 space-y-1">
                <li>Go to the External Tools section below</li>
                <li>Click "Add New Tool" to create a custom tool</li>
                <li>Configure the tool's API endpoint and parameters</li>
                <li>Test the tool using the "Test Tool" button</li>
                <li>Once tested, you can enable the tool for specific roles</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-blue-800 dark:text-blue-300">Testing Tools:</h4>
              <ul className="list-disc list-inside text-blue-700 dark:text-blue-200 space-y-1">
                <li>Use the "Test Tool" button to verify functionality</li>
                <li>Enter test parameters to simulate tool usage</li>
                <li>Review the test response before enabling</li>
                <li>Configure error handling and response format</li>
              </ul>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Close Help
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
                Role Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                System Prompt
              </label>
              <textarea
                value={formData.systemPrompt}
                onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-navy-600 rounded-lg
                  bg-white dark:bg-navy-800 text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400
                  min-h-[200px]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 
                text-white rounded-lg transition-colors"
            >
              {editingBuiltInRole ? 'Update Built-in Role' : editingRoleId ? 'Update Role' : 'Add Role'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Built-in Roles</h3>
          <div className="space-y-4">
            {Object.entries(ROLE_CONFIGS).map(([role, config]) => {
              const modifiedRole = modifiedBuiltInRoles.find(r => r.originalRole === role);
              const isModified = !!modifiedRole;
              const currentConfig = modifiedRole?.config || config;
              const isDisabled = currentConfig.isDisabled;

              if (isDisabled) return null;

              return (
                <motion.div
                  key={role}
                  layout
                  className="bg-white dark:bg-navy-800 rounded-lg shadow-sm border border-gray-200 dark:border-navy-700 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <Bot className="h-5 w-5 text-primary-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {currentConfig.title}
                            </h3>
                            {isModified && (
                              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                                Modified
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {currentConfig.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <button
                            onClick={() => handleEditBuiltIn(role as AssistantRole)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-full transition-colors text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 group"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span className={`${tooltipStyles} bottom-[calc(100%+10px)]`}>
                              Edit role
                            </span>
                          </button>
                        </div>
                        {isModified && (
                          <div className="relative">
                            <button
                              onClick={() => handleReset(role as AssistantRole)}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-full transition-colors text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 group"
                            >
                              <RotateCcw className="h-4 w-4" />
                              <span className={`${tooltipStyles} bottom-[calc(100%+10px)]`}>
                                Reset to default
                              </span>
                            </button>
                          </div>
                        )}
                        <div className="relative">
                          <button
                            onClick={() => handleDisableBuiltIn(role as AssistantRole)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-full transition-colors text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 group"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className={`${tooltipStyles} bottom-[calc(100%+10px)]`}>
                              Remove role
                            </span>
                          </button>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => toggleRoleExpansion(role)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-full transition-colors group"
                          >
                            {expandedRole === role ? (
                              <>
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                                <span className={`${tooltipStyles} bottom-[calc(100%+10px)]`}>
                                  Hide details
                                </span>
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                                <span className={`${tooltipStyles} bottom-[calc(100%+10px)]`}>
                                  Show details
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedRole === role && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4"
                        >
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <pre className="p-4 bg-gray-50 dark:bg-navy-900 rounded-lg overflow-x-auto">
                              {currentConfig.systemPrompt}
                            </pre>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {customRoles.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Custom Roles</h3>
            <div className="space-y-4">
              {customRoles.map((role) => (
                <motion.div
                  key={role.id}
                  layout
                  className="bg-white dark:bg-navy-800 rounded-lg shadow-sm border border-gray-200 dark:border-navy-700 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <Bot className="h-5 w-5 text-primary-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {role.config.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {role.config.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <button
                            onClick={() => handleEdit(role.id)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-full transition-colors text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 group"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span className={`${tooltipStyles} bottom-[calc(100%+10px)]`}>
                              Edit role
                            </span>
                          </button>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => handleDelete(role.id)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-full transition-colors text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 group"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className={`${tooltipStyles} bottom-[calc(100%+10px)]`}>
                              Delete role
                            </span>
                          </button>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => toggleRoleExpansion(role.id)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-full transition-colors group"
                          >
                            {expandedRole === role.id ? (
                              <>
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                                <span className={`${tooltipStyles} bottom-[calc(100%+10px)]`}>
                                  Hide details
                                </span>
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                                <span className={`${tooltipStyles} bottom-[calc(100%+10px)]`}>
                                  Show details
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedRole === role.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4"
                        >
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <pre className="p-4 bg-gray-50 dark:bg-navy-900 rounded-lg overflow-x-auto">
                              {role.config.systemPrompt}
                            </pre>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 