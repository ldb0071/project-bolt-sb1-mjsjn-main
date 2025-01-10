import { Tool, BUILT_IN_TOOLS, isToolAvailableForRole } from './toolService';
import { useStore } from '../store/useStore';
import { AssistantRole } from './chatService';

interface ToolExecutionParams {
  [key: string]: any;
}

interface ToolExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function executeTool(
  toolId: string,
  params: ToolExecutionParams,
  role: AssistantRole
): Promise<ToolExecutionResult> {
  try {
    const store = useStore.getState();
    
    // Get tool configuration
    const customTool = store.getCustomTool(toolId);
    const modifiedTool = store.modifiedBuiltInTools[toolId];
    const builtInTool = BUILT_IN_TOOLS[toolId];
    const tool = customTool || modifiedTool || builtInTool;
    
    if (!tool) {
      throw new Error(`Tool ${toolId} not found`);
    }

    if (!store.isToolEnabled(toolId)) {
      throw new Error(`Tool ${toolId} is disabled`);
    }

    // Check if the tool is available for the current role
    if (!isToolAvailableForRole(tool, role)) {
      throw new Error(`Tool ${toolId} is not available for the current role`);
    }

    // Check if API key is required and present
    if (tool.requiresApiKey) {
      const apiKey = store.getToolApiKey(toolId);
      if (!apiKey) {
        throw new Error(`API key required for tool ${toolId}`);
      }
      params[tool.apiKeyName || 'api_key'] = apiKey;
    }

    // Validate required parameters
    const missingParams = tool.parameters
      .filter(p => p.required && !params.hasOwnProperty(p.name))
      .map(p => p.name);

    if (missingParams.length > 0) {
      throw new Error(`Missing required parameters: ${missingParams.join(', ')}`);
    }

    // Add default values for optional parameters
    tool.parameters
      .filter(p => !p.required && !params.hasOwnProperty(p.name) && p.default !== undefined)
      .forEach(p => {
        params[p.name] = p.default;
      });

    // Build URL with query parameters for GET requests
    let url = tool.endpoint;
    if (tool.method === 'GET') {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });
      url += `?${queryParams.toString()}`;
    }

    // Execute the request
    const response = await fetch(url, {
      method: tool.method,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(tool.method === 'POST' && {
        body: JSON.stringify(params),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Tool execution failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Helper function to format tool results based on the tool type
export function formatToolResults(toolId: string, results: any): string {
  const store = useStore.getState();
  const tool = store.getCustomTool(toolId) || 
               store.modifiedBuiltInTools[toolId] || 
               BUILT_IN_TOOLS[toolId];

  if (!tool) return JSON.stringify(results, null, 2);

  switch (toolId) {
    case 'arxiv':
      return formatArxivResults(results);
    case 'duckduckgo':
      return formatDuckDuckGoResults(results);
    case 'googleScholar':
      return formatGoogleScholarResults(results);
    default:
      return JSON.stringify(results, null, 2);
  }
}

function formatArxivResults(results: any): string {
  if (!results.feed?.entry) return 'No results found';
  
  return results.feed.entry
    .map((entry: any) => {
      const authors = entry.author
        .map((author: any) => author.name)
        .join(', ');
      
      return `
Title: ${entry.title}
Authors: ${authors}
Published: ${entry.published}
Summary: ${entry.summary.slice(0, 200)}...
Link: ${entry.id}
---`;
    })
    .join('\n');
}

function formatDuckDuckGoResults(results: any): string {
  if (!results.RelatedTopics) return 'No results found';
  
  return results.RelatedTopics
    .map((topic: any) => {
      if (topic.Result) {
        return `
${topic.Text}
Link: ${topic.FirstURL}
---`;
      }
      return '';
    })
    .filter(Boolean)
    .join('\n');
}

function formatGoogleScholarResults(results: any): string {
  if (!results.organic_results) return 'No results found';
  
  return results.organic_results
    .map((result: any) => {
      return `
Title: ${result.title}
Authors: ${result.publication_info?.authors?.join(', ') || 'N/A'}
Year: ${result.publication_info?.year || 'N/A'}
Citations: ${result.inline_links?.cited_by?.total || 0}
Link: ${result.link}
---`;
    })
    .join('\n');
} 