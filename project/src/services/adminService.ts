import { useStore } from '../store/useStore';
import { Tool, CustomTool, validateToolConfig } from './toolService';
import { CustomRole, RoleConfig, AssistantRole } from './chatService';

export interface AdminCommandResult {
  success: boolean;
  message: string;
  data?: any;
}

export async function handleAdminCommand(command: string): Promise<AdminCommandResult> {
  const store = useStore.getState();
  const commandLower = command.toLowerCase();

  try {
    // Tool Management Commands
    if (commandLower.includes('create a new tool')) {
      return await handleCreateTool(command, store);
    }
    if (commandLower.includes('edit the tool')) {
      return await handleEditTool(command, store);
    }
    if (commandLower.includes('remove the tool')) {
      return await handleRemoveTool(command, store);
    }
    if (commandLower.includes('show me the configuration for tool')) {
      return await handleShowToolConfig(command, store);
    }
    if (commandLower.includes('enable tool') || commandLower.includes('disable tool')) {
      return await handleToggleTool(command, store);
    }

    // Role Management Commands
    if (commandLower.includes('create a new role')) {
      return await handleCreateRole(command, store);
    }
    if (commandLower.includes('edit the role')) {
      return await handleEditRole(command, store);
    }
    if (commandLower.includes('remove the role')) {
      return await handleRemoveRole(command, store);
    }
    if (commandLower.includes('show me the configuration for role')) {
      return await handleShowRoleConfig(command, store);
    }

    // List Commands
    if (commandLower.includes('list all tools')) {
      return await handleListTools(store);
    }
    if (commandLower.includes('list all roles')) {
      return await handleListRoles(store);
    }

    return {
      success: false,
      message: "I don't understand that command. Please use one of the supported commands."
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

async function handleCreateTool(command: string, store: any): Promise<AdminCommandResult> {
  // Extract tool configuration from natural language command
  const toolConfig = parseToolConfig(command);
  
  if (!validateToolConfig(toolConfig)) {
    return {
      success: false,
      message: 'Invalid tool configuration. Please provide all required parameters.'
    };
  }

  const customTool: CustomTool = {
    ...toolConfig,
    isCustom: true,
    isEnabled: true
  };

  store.addCustomTool(customTool);

  return {
    success: true,
    message: `Tool "${toolConfig.name}" has been created successfully.`,
    data: customTool
  };
}

async function handleEditTool(command: string, store: any): Promise<AdminCommandResult> {
  const { toolId, updates } = parseToolUpdates(command);
  const tool = store.getCustomTool(toolId);

  if (!tool) {
    return {
      success: false,
      message: `Tool "${toolId}" not found.`
    };
  }

  const updatedTool = { ...tool, ...updates };
  if (!validateToolConfig(updatedTool)) {
    return {
      success: false,
      message: 'Invalid tool configuration. Please check the updates.'
    };
  }

  store.updateCustomTool(toolId, updates);

  return {
    success: true,
    message: `Tool "${toolId}" has been updated successfully.`,
    data: updatedTool
  };
}

async function handleRemoveTool(command: string, store: any): Promise<AdminCommandResult> {
  const toolId = command.match(/remove the tool ["'](.+?)["']/i)?.[1];
  
  if (!toolId) {
    return {
      success: false,
      message: 'Please specify the tool name in quotes.'
    };
  }

  const tool = store.getCustomTool(toolId);
  if (!tool) {
    return {
      success: false,
      message: `Tool "${toolId}" not found.`
    };
  }

  store.deleteCustomTool(toolId);

  return {
    success: true,
    message: `Tool "${toolId}" has been removed successfully.`
  };
}

async function handleCreateRole(command: string, store: any): Promise<AdminCommandResult> {
  const roleConfig = parseRoleConfig(command);
  
  const customRole: CustomRole = {
    id: crypto.randomUUID(),
    config: roleConfig,
    isCustom: true
  };

  store.addCustomRole(customRole);

  return {
    success: true,
    message: `Role "${roleConfig.title}" has been created successfully.`,
    data: customRole
  };
}

async function handleEditRole(command: string, store: any): Promise<AdminCommandResult> {
  const { roleId, updates } = parseRoleUpdates(command);
  const role = store.customRoles.find((r: CustomRole) => r.id === roleId);

  if (!role) {
    return {
      success: false,
      message: `Role "${roleId}" not found.`
    };
  }

  store.updateCustomRole(roleId, { config: { ...role.config, ...updates } });

  return {
    success: true,
    message: `Role "${roleId}" has been updated successfully.`,
    data: { ...role, config: { ...role.config, ...updates } }
  };
}

async function handleRemoveRole(command: string, store: any): Promise<AdminCommandResult> {
  const roleId = command.match(/remove the role ["'](.+?)["']/i)?.[1];
  
  if (!roleId) {
    return {
      success: false,
      message: 'Please specify the role name in quotes.'
    };
  }

  const role = store.customRoles.find((r: CustomRole) => r.id === roleId);
  if (!role) {
    return {
      success: false,
      message: `Role "${roleId}" not found.`
    };
  }

  store.deleteCustomRole(roleId);

  return {
    success: true,
    message: `Role "${roleId}" has been removed successfully.`
  };
}

async function handleToggleTool(command: string, store: any): Promise<AdminCommandResult> {
  const toolId = command.match(/(?:enable|disable) tool ["'](.+?)["']/i)?.[1];
  const isEnable = command.toLowerCase().includes('enable');
  
  if (!toolId) {
    return {
      success: false,
      message: 'Please specify the tool name in quotes.'
    };
  }

  store.toggleTool(toolId);

  return {
    success: true,
    message: `Tool "${toolId}" has been ${isEnable ? 'enabled' : 'disabled'} successfully.`
  };
}

async function handleShowToolConfig(command: string, store: any): Promise<AdminCommandResult> {
  const toolId = command.match(/configuration for tool ["'](.+?)["']/i)?.[1];
  
  if (!toolId) {
    return {
      success: false,
      message: 'Please specify the tool name in quotes.'
    };
  }

  const tool = store.getCustomTool(toolId);
  if (!tool) {
    return {
      success: false,
      message: `Tool "${toolId}" not found.`
    };
  }

  return {
    success: true,
    message: 'Tool configuration:',
    data: tool
  };
}

async function handleShowRoleConfig(command: string, store: any): Promise<AdminCommandResult> {
  const roleId = command.match(/configuration for role ["'](.+?)["']/i)?.[1];
  
  if (!roleId) {
    return {
      success: false,
      message: 'Please specify the role name in quotes.'
    };
  }

  const role = store.customRoles.find((r: CustomRole) => r.id === roleId);
  if (!role) {
    return {
      success: false,
      message: `Role "${roleId}" not found.`
    };
  }

  return {
    success: true,
    message: 'Role configuration:',
    data: role
  };
}

async function handleListTools(store: any): Promise<AdminCommandResult> {
  const customTools = store.customTools;
  const builtInTools = Object.values(store.modifiedBuiltInTools);

  return {
    success: true,
    message: 'Available tools:',
    data: {
      customTools,
      builtInTools
    }
  };
}

async function handleListRoles(store: any): Promise<AdminCommandResult> {
  const customRoles = store.customRoles;
  const builtInRoles = store.modifiedBuiltInRoles;

  return {
    success: true,
    message: 'Available roles:',
    data: {
      customRoles,
      builtInRoles
    }
  };
}

// Helper functions to parse natural language commands into configurations
function parseToolConfig(command: string): Tool {
  const nameMatch = command.match(/create a new tool ["'](.+?)["']/i);
  const descriptionMatch = command.match(/with description ["'](.+?)["']/i);
  const endpointMatch = command.match(/at endpoint ["'](.+?)["']/i);
  const methodMatch = command.match(/using (GET|POST)/i);
  const paramsMatch = command.match(/with parameters ["'](.+?)["']/i);
  const requiresKeyMatch = command.match(/requires API key ["'](.+?)["']/i);

  if (!nameMatch || !descriptionMatch || !endpointMatch || !methodMatch) {
    throw new Error('Missing required tool configuration parameters. Please provide name, description, endpoint, and HTTP method.');
  }

  const tool: Tool = {
    id: crypto.randomUUID(),
    name: nameMatch[1],
    description: descriptionMatch[1],
    endpoint: endpointMatch[1],
    method: methodMatch[1].toUpperCase() as 'GET' | 'POST',
    parameters: paramsMatch ? JSON.parse(paramsMatch[1]) : [],
    isEnabled: true,
    requiresApiKey: !!requiresKeyMatch,
    apiKeyName: requiresKeyMatch ? requiresKeyMatch[1] : undefined
  };

  return tool;
}

function parseToolUpdates(command: string): { toolId: string; updates: Partial<Tool> } {
  const toolIdMatch = command.match(/edit the tool ["'](.+?)["']/i);
  if (!toolIdMatch) {
    throw new Error('Please specify the tool name in quotes.');
  }

  const updates: Partial<Tool> = {};
  const nameMatch = command.match(/set name to ["'](.+?)["']/i);
  const descriptionMatch = command.match(/set description to ["'](.+?)["']/i);
  const endpointMatch = command.match(/set endpoint to ["'](.+?)["']/i);
  const methodMatch = command.match(/set method to (GET|POST)/i);
  const paramsMatch = command.match(/set parameters to ["'](.+?)["']/i);
  const requiresKeyMatch = command.match(/set API key parameter to ["'](.+?)["']/i);

  if (nameMatch) updates.name = nameMatch[1];
  if (descriptionMatch) updates.description = descriptionMatch[1];
  if (endpointMatch) updates.endpoint = endpointMatch[1];
  if (methodMatch) updates.method = methodMatch[1].toUpperCase() as 'GET' | 'POST';
  if (paramsMatch) updates.parameters = JSON.parse(paramsMatch[1]);
  if (requiresKeyMatch) {
    updates.requiresApiKey = true;
    updates.apiKeyName = requiresKeyMatch[1];
  }

  return { toolId: toolIdMatch[1], updates };
}

function parseRoleConfig(command: string): RoleConfig {
  const titleMatch = command.match(/create a new role ["'](.+?)["']/i);
  const descriptionMatch = command.match(/with description ["'](.+?)["']/i);
  const promptMatch = command.match(/with prompt ["'](.+?)["']/i);

  if (!titleMatch || !descriptionMatch || !promptMatch) {
    throw new Error('Missing required role configuration parameters. Please provide title, description, and system prompt.');
  }

  return {
    title: titleMatch[1],
    description: descriptionMatch[1],
    systemPrompt: promptMatch[1]
  };
}

function parseRoleUpdates(command: string): { roleId: string; updates: Partial<RoleConfig> } {
  const roleIdMatch = command.match(/edit the role ["'](.+?)["']/i);
  if (!roleIdMatch) {
    throw new Error('Please specify the role name in quotes.');
  }

  const updates: Partial<RoleConfig> = {};
  const titleMatch = command.match(/set title to ["'](.+?)["']/i);
  const descriptionMatch = command.match(/set description to ["'](.+?)["']/i);
  const promptMatch = command.match(/set prompt to ["'](.+?)["']/i);

  if (titleMatch) updates.title = titleMatch[1];
  if (descriptionMatch) updates.description = descriptionMatch[1];
  if (promptMatch) updates.systemPrompt = promptMatch[1];

  return { roleId: roleIdMatch[1], updates };
} 