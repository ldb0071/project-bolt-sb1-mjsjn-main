import { z } from 'zod';
import { AssistantRole } from './chatService';

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean';
  description: string;
  required: boolean;
  default?: any;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST';
  parameters: ToolParameter[];
  isEnabled: boolean;
  requiresApiKey: boolean;
  apiKeyName?: string;
  allowedRoles?: AssistantRole[]; // Roles that can use this tool
}

// Built-in tool configurations
export const BUILT_IN_TOOLS: Record<string, Tool> = {
  arxiv: {
    id: 'arxiv',
    name: 'arXiv Search',
    description: 'Search academic papers on arXiv',
    endpoint: 'http://export.arxiv.org/api/query',
    method: 'GET',
    parameters: [
      {
        name: 'search_query',
        type: 'string',
        description: 'Search query string',
        required: true
      },
      {
        name: 'max_results',
        type: 'number',
        description: 'Maximum number of results',
        required: false,
        default: 10
      }
    ],
    isEnabled: true,
    requiresApiKey: false,
    allowedRoles: ['researcher', 'analyst', 'medical']
  },
  duckduckgo: {
    id: 'duckduckgo',
    name: 'DuckDuckGo Search',
    description: 'Search the web using DuckDuckGo',
    endpoint: 'https://api.duckduckgo.com/',
    method: 'GET',
    parameters: [
      {
        name: 'q',
        type: 'string',
        description: 'Search query',
        required: true
      },
      {
        name: 'format',
        type: 'string',
        description: 'Response format',
        required: false,
        default: 'json'
      }
    ],
    isEnabled: true,
    requiresApiKey: false,
    allowedRoles: ['default', 'researcher', 'analyst', 'developer']
  },
  googleScholar: {
    id: 'googleScholar',
    name: 'Google Scholar',
    description: 'Search academic papers on Google Scholar',
    endpoint: 'https://serpapi.com/search',
    method: 'GET',
    parameters: [
      {
        name: 'engine',
        type: 'string',
        description: 'Search engine',
        required: true,
        default: 'google_scholar'
      },
      {
        name: 'q',
        type: 'string',
        description: 'Search query',
        required: true
      }
    ],
    isEnabled: true,
    requiresApiKey: true,
    apiKeyName: 'serpApiKey',
    allowedRoles: ['researcher', 'analyst', 'medical']
  }
};

// Validation schema for tool configuration
export const toolSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  endpoint: z.string().url(),
  method: z.enum(['GET', 'POST']),
  parameters: z.array(z.object({
    name: z.string(),
    type: z.enum(['string', 'number', 'boolean']),
    description: z.string(),
    required: z.boolean(),
    default: z.any().optional()
  })),
  isEnabled: z.boolean(),
  requiresApiKey: z.boolean(),
  apiKeyName: z.string().optional(),
  allowedRoles: z.array(z.string()).optional()
});

export type CustomTool = Tool & {
  isCustom: true;
};

// Helper function to validate tool configuration
export function validateToolConfig(tool: Tool): boolean {
  try {
    toolSchema.parse(tool);
    return true;
  } catch (error) {
    console.error('Tool validation failed:', error);
    return false;
  }
}

// Helper function to check if a tool is available for a role
export function isToolAvailableForRole(tool: Tool, role: AssistantRole): boolean {
  if (!tool.allowedRoles) return true; // If no roles specified, tool is available to all
  return tool.allowedRoles.includes(role);
} 