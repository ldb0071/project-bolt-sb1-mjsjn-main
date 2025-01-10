/**
 * Frontend Chat Service Module
 * 
 * This module handles the frontend chat functionality, including:
 * - Message management and formatting
 * - AI model integration (Gemini and Azure)
 * - Role-based chat configuration
 * - ArXiv paper integration
 * - Admin command processing
 * 
 * @module chatService
 */

import { apiClient } from './apiClient';
import { useStore } from '../store/useStore';
import { Tool } from './toolService';
import { handleAdminCommand, AdminCommandResult } from './adminService';

/**
 * Represents a chat message in the system
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  image?: string;
  arxivPapers?: ArxivPaper[];
  timestamp?: string;
}

/**
 * Represents an ArXiv paper with its metadata
 */
export interface ArxivPaper {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  pdfUrl: string;
}

/**
 * Represents a search result item
 */
export interface SearchResult {
  title: string;
  url: string;
  description: string;
}

/**
 * Searches ArXiv for relevant papers based on query
 * 
 * @param query - The search query
 * @returns Promise<ArxivPaper[]> - Array of relevant papers
 */
async function searchArxiv(query: string): Promise<ArxivPaper[]> {
  try {
    // Enhance query for medical segmentation papers
    const enhancedQuery = `${query} AND (medical segmentation OR image segmentation OR medical imaging)`;
    const categories = 'cat:cs.CV+OR+cat:cs.AI+OR+cat:cs.LG+OR+cat:q-bio.QM';
    const searchQuery = `search_query=${encodeURIComponent(enhancedQuery)}+AND+(${categories})&sortBy=relevance&sortOrder=descending&max_results=5`;
    
    const response = await fetch(
      `https://export.arxiv.org/api/query?${searchQuery}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from ArXiv API');
    }

    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    const entries = xmlDoc.getElementsByTagName('entry');

    const papers = Array.from(entries).map(entry => {
      const id = entry.getElementsByTagName('id')[0]?.textContent?.split('/').pop() || '';
      const links = Array.from(entry.getElementsByTagName('link'));
      const pdfLink = links.find(link => link.getAttribute('title') === 'pdf')?.getAttribute('href') || '';
      
      return {
        id,
        title: entry.getElementsByTagName('title')[0]?.textContent?.replace(/\n/g, ' ').trim() || '',
        summary: entry.getElementsByTagName('summary')[0]?.textContent?.replace(/\n/g, ' ').trim() || '',
        authors: Array.from(entry.getElementsByTagName('author')).map(
          author => author.getElementsByTagName('name')[0]?.textContent || ''
        ),
        pdfUrl: pdfLink || `https://arxiv.org/pdf/${id}.pdf`
      };
    });

    // Sort papers by relevance to medical segmentation
    return papers.sort((a, b) => {
      const scoreA = getRelevanceScore(a, query);
      const scoreB = getRelevanceScore(b, query);
      return scoreB - scoreA;
    });

  } catch (error) {
    console.error('ArXiv search error:', error);
    return [];
  }
}

function getRelevanceScore(paper: ArxivPaper, query: string): number {
  const keywords = ['medical', 'segmentation', 'imaging', 'deep learning', 'neural network', 'healthcare'];
  const text = (paper.title + ' ' + paper.summary).toLowerCase();
  
  return keywords.reduce((score, keyword) => {
    return score + (text.includes(keyword.toLowerCase()) ? 1 : 0);
  }, 0);
}

async function enhanceWithContext(query: string, arxivPaper?: ArxivPaper): Promise<string> {
  try {
    let context = '';

    // If we have an ArXiv paper, include its details
    if (arxivPaper) {
      context += `\nArXiv Paper Context:
Title: ${arxivPaper.title}
Authors: ${arxivPaper.authors.join(', ')}
Summary: ${arxivPaper.summary}
Paper ID: ${arxivPaper.id}
PDF URL: ${arxivPaper.pdfUrl}\n\n`;
    }

    // Get Wikipedia context
    const wikiResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?` + 
      `action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(query)}&origin=*`
    );

    if (wikiResponse.ok) {
      const data = await wikiResponse.json();
      const pages = data.query?.pages;
      if (pages) {
        const pageContent = Object.values(pages)[0] as any;
        if (pageContent.extract) {
          context += `Wikipedia Context:\n${pageContent.extract}`;
        }
      }
    }

    return context;
  } catch (error) {
    console.error('Context enhancement error:', error);
    return '';
  }
}

export type AssistantRole = 'default' | 'researcher' | 'developer' | 'analyst' | 'medical' | 'imageAnalyst' | 'administrator' | string;

export interface RoleConfig {
  title: string;
  description: string;
  systemPrompt: string;
  isDisabled?: boolean;
}

export const ROLE_CONFIGS: Record<AssistantRole, RoleConfig> = {
  default: {
    title: 'Assistant',
    description: 'A helpful AI assistant',
    systemPrompt: 'You are a helpful AI assistant. Answer questions and help with tasks in a clear and concise manner.'
  },
  developer: {
    title: 'Developer',
    description: 'A software development expert',
    systemPrompt: 'You are an expert software developer. Help with coding tasks, debugging, and technical questions.'
  },
  researcher: {
    title: 'Researcher',
    description: 'A research and academic expert',
    systemPrompt: 'You are a research expert. Help with academic research, literature review, and scientific analysis.'
  },
  analyst: {
    title: 'Analyst',
    description: 'A data analysis expert',
    systemPrompt: 'You are a data analysis expert. Help with data analysis, visualization, and interpretation.'
  },
  medical: {
    title: 'Medical Expert',
    description: 'A medical and healthcare expert',
    systemPrompt: 'You are a medical expert. Help with medical research and healthcare-related questions.'
  },
  administrator: {
    title: 'Administrator',
    description: 'A system administrator with tool and role management capabilities',
    systemPrompt: `You are a system administrator with the ability to manage tools and roles through natural language commands.

Available commands:

Tool Management:
- Create a new tool: "create a new tool 'name' with description 'desc' at endpoint 'url' using GET/POST with parameters 'params' requires API key 'key_param'"
- Edit a tool: "edit the tool 'name' set [property] to 'value'"
- Remove a tool: "remove the tool 'name'"
- Show tool config: "show me the configuration for tool 'name'"
- Enable/disable tool: "enable/disable tool 'name'"
- List tools: "list all tools"

Role Management:
- Create a new role: "create a new role 'name' with description 'desc' with prompt 'system_prompt'"
- Edit a role: "edit the role 'name' set [property] to 'value'"
- Remove a role: "remove the role 'name'"
- Show role config: "show me the configuration for role 'name'"
- List roles: "list all roles"

Please provide clear and specific commands, and I'll help you manage the system configuration.`
  }
};

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

const formatArxivContext = (arxivPapers: ArxivPaper[]): string => {
  if (arxivPapers.length === 0) return "";

  return (
    "\n\nRelevant Medical Segmentation Papers:\n\n" +
    "| Paper | Authors | Links |\n" +
    "|-------|---------|-------|\n" +
    arxivPapers
      .map(
        (paper, index) =>
          `| ${index + 1}. ${paper.title} | ${paper.authors.join(
            ", "
          )} | [📄 PDF](${paper.pdfUrl}) [📚 ArXiv](https://arxiv.org/abs/${
            paper.id
          }) |`
      )
      .join("\n") +
    "\n\n### Paper Details\n\n" +
    arxivPapers
      .map(
        (paper, index) =>
          `### ${index + 1}. ${paper.title}\n\n` +
          `**Authors:** ${paper.authors.join(", ")}\n\n` +
          `**Summary:** ${paper.summary}\n\n` +
          `**Links:**\n` +
          `- [📄 Download PDF](${paper.pdfUrl})\n` +
          `- [📚 View on ArXiv](https://arxiv.org/abs/${paper.id})\n` +
          `- [📝 BibTeX](https://arxiv.org/bibtex/${paper.id})\n`
      )
      .join("\n\n")
  );
};

const buildGeminiPrompt = (
  role: AssistantRole,
  arxivContext: string,
  additionalContext: string
): { parts: { text: string }[] }[] => {
  const prompt = ROLE_CONFIGS[role].systemPrompt +
    "\n\nPlease analyze the provided papers and format your response as follows:\n" +
    "1. A brief overview of each paper's main contributions\n" +
    "2. A comparison table using this exact format:\n\n" +
    "| Method | Dataset | Performance | Year |\n" +
    "|--------|---------|-------------|------|\n" +
    "| Method Name | Dataset Name | Performance Metric | YYYY |\n\n" +
    "Note: Ensure the table is properly formatted with:\n" +
    "- Aligned columns using | character\n" +
    "- Header row separator using dashes (-)\n" +
    "- Consistent spacing in cells\n" +
    "- Exact performance metrics (e.g., 95.2% mean Dice)\n\n" +
    "3. Key findings and practical applications\n" +
    "4. References to specific sections in the papers" +
    (arxivContext ? "\n\n" + arxivContext : "") +
    (additionalContext ? "\n\n" + additionalContext : "");

  return [{
    parts: [{
      text: prompt
    }]
  }];
};

const callGeminiAPI = async (
  formattedMessages: { role: 'user' | 'assistant' | 'system'; parts: { text: string }[] }[],
  apiKey: string,
  model: ModelId = "gemini-1.5-flash"
): Promise<any> => {
  // Clean and validate the API key
  const cleanApiKey = apiKey.replace(/^AIzaSyB-/, '').replace(/lBxinyrKi9Jlx2m-AXfPwuDP4uVlYpU$/, '').trim();
  
  if (!cleanApiKey.startsWith('AIzaSy')) {
    throw new Error('Invalid API key format');
  }

  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  
  console.log('Using API key:', cleanApiKey); // For debugging
  
  const response = await fetch(`${url}?key=${cleanApiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: formattedMessages.map(msg => ({
        role: msg.role,
        parts: msg.parts
      }))
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("API Error:", errorData);
    throw new Error(
      errorData.error?.message || "Failed to get response from Gemini API"
    );
  }

  return await response.json();
};

const formatResponse = (content: string): string => {
  // Remove excessive newlines and spaces
  let formatted = content.replace(/\n{3,}/g, '\n\n').trim();

  // Add markdown formatting for code blocks
  formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)\n```/g, (_, lang, code) => {
    return `\n\`\`\`${lang || ''}\n${code.trim()}\n\`\`\`\n`;
  });

  // Format lists consistently
  formatted = formatted.replace(/^[•●∙-]\s/gm, '- ');

  // Format headers consistently
  formatted = formatted.replace(/^(#+)\s*/gm, (_, hashes) => `${hashes} `);

  // Format bold text
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '**$1**');

  // Format inline code
  formatted = formatted.replace(/`([^`]+)`/g, '`$1`');

  // Add spacing around sections
  formatted = formatted.replace(/\n(#+\s[^\n]+)/g, '\n\n$1');

  return formatted;
};

// Update model types to only include gpt-4o for Azure
export type AzureModelId = 'gpt-4o';
export type ModelId = 'gemini-2.0-flash-exp' | 'gemini-1.5-flash' | 'gemini-1.0-pro' | 'gemini-1.5-pro' | 'gemini-2.0-flash-thinking-exp-1219' | AzureModelId;

export const AVAILABLE_MODELS: Record<ModelId, { name: string; type: 'gemini' | 'azure' }> = {
  'gemini-2.0-flash-exp': { name: 'Gemini 2.0 Flash (Experimental)', type: 'gemini' },
  'gemini-1.5-flash': { name: 'Gemini 1.5 Flash', type: 'gemini' },
  'gemini-1.0-pro': { name: 'Gemini 1.0 Pro', type: 'gemini' },
  'gemini-1.5-pro': { name: 'Gemini 1.5 Pro', type: 'gemini' },
  'gemini-2.0-flash-thinking-exp-1219': { name: 'Gemini 2.0 Flash Thinking', type: 'gemini' },
  'gpt-4o': { name: 'GPT-4', type: 'azure' }
};

const callAzureAPI = async (
  messages: { role: string; content: string }[],
  githubToken: string
): Promise<any> => {
  try {
    console.log('Starting Azure API call...');
    console.log('Messages:', JSON.stringify(messages, null, 2));

    const response = await fetch('http://localhost:8080/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${githubToken}`
      },
      body: JSON.stringify({
        messages,
        model: 'gpt-4o'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Azure API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Azure API Response:', data);
    return {
      content: formatResponse(data.content)
    };
  } catch (error) {
    console.error('Azure API Error:', error);
    throw error;
  }
};

const extractGeminiResponse = (data: any): string => {
  let responseText = "";
  if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
    responseText = data.candidates[0].content.parts[0].text;
  } else if (data.candidates?.[0]?.content?.text) {
    responseText = data.candidates[0].content.text;
  } else if (data.text) {
    responseText = data.text;
  } else if (typeof data === "string") {
    responseText = data;
  } else if (data.candidates?.[0]?.output) {
    responseText = data.candidates[0].output;
  } else {
    responseText = JSON.stringify(data, null, 2);
  }
  return formatResponse(responseText);
};

// Add paper count extraction function
const extractPaperCount = (message: string): number => {
  // Look for patterns like "show me 10 papers" or "find 15 research papers"
  const match = message.match(/(?:show|find|get|search|display)\s+(\d+)\s+(?:papers?|research papers?|articles?)/i);
  return match ? parseInt(match[1]) : 5; // Default to 5 if no number specified
};

export interface CustomRole {
  id: string;
  config: RoleConfig;
  isCustom: true;
}

export interface ModifiedBuiltInRole {
  originalRole: AssistantRole;
  config: RoleConfig;
}

export const sendChatMessage = async (
  messages: ChatMessage[],
  apiKey: string = "AIzaSyBQfQ7sN-ASKnlFe8Zg50xsp6qmDdZoweU",
  role: AssistantRole = "default",
  model: ModelId = "gemini-1.5-flash",
  githubToken?: string
): Promise<{ content: string; arxivPapers?: ArxivPaper[] }> => {
  try {
    console.log('Starting sendChatMessage...');
    console.log('Model:', model);
    
    const modelConfig = AVAILABLE_MODELS[model];
    if (!modelConfig) {
      throw new Error(`Invalid model: ${model}`);
    }

    // Get role configuration
    let roleConfig: RoleConfig;
    if (role.startsWith('custom_')) {
      const customRole = useStore.getState().customRoles.find(r => r.id === role.replace('custom_', ''));
      if (!customRole) {
        throw new Error(`Custom role not found: ${role}`);
      }
      roleConfig = customRole.config;
    } else {
      const builtInConfig = useStore.getState().getBuiltInRoleConfig(role as AssistantRole);
      if (builtInConfig.isDisabled) {
        throw new Error(`Role is disabled: ${role}`);
      }
      roleConfig = builtInConfig;
    }

    // Get the last message to check for research queries
    const lastMessage = messages[messages.length - 1];
    const isResearchQuery = /research|paper|model|algorithm|method|arxiv|study|medical|segmentation/i.test(
      lastMessage.content
    );

    // Search for relevant papers if it's a research query
    let arxivPapers: ArxivPaper[] = [];
    if (isResearchQuery) {
      try {
        // Extract desired number of papers from the message
        const paperCount = extractPaperCount(lastMessage.content);
        console.log(`Requesting ${paperCount} papers`);

        const response = await fetch(
          `http://localhost:8080/api/arxiv/search?query=${encodeURIComponent(lastMessage.content)}&max_results=${paperCount}`
        );
        if (response.ok) {
          const data = await response.json();
          arxivPapers = data.papers;
          console.log(`Found ${arxivPapers.length} papers:`, arxivPapers);
        }
      } catch (error) {
        console.error("Error fetching ArXiv papers:", error);
      }
    }

    // Format the response based on the model type
    if (modelConfig.type === 'azure') {
      console.log('Using Azure model with GitHub token');
      if (!githubToken) {
        throw new Error("GitHub token is required for Azure OpenAI models");
      }

      // Format messages for Azure API
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content || ''
      }));

      // Add system message with research paper summarization format
      let systemPrompt = `${ROLE_CONFIGS[role].systemPrompt || 'You are a helpful research assistant.'}\n\n`;
      systemPrompt += 'Please structure your research summary in the following format:\n\n';
      systemPrompt += '# Research Summary\n\n';
      systemPrompt += '## Key Research Questions\n';
      systemPrompt += '- List the main research questions addressed\n\n';
      systemPrompt += '## Methodology Overview\n';
      systemPrompt += '- Research approach\n';
      systemPrompt += '- Data collection methods\n';
      systemPrompt += '- Analysis techniques\n\n';
      systemPrompt += '## Key Findings\n';
      systemPrompt += '- Main results and discoveries\n';
      systemPrompt += '- Statistical significance\n';
      systemPrompt += '- Practical implications\n\n';
      systemPrompt += '## Technical Implementation\n';
      systemPrompt += '- Algorithms used\n';
      systemPrompt += '- Model architectures\n';
      systemPrompt += '- Performance metrics\n\n';
      systemPrompt += '## Benchmarking Results\n';
      systemPrompt += '| Model/Method | Metrics | Performance |\n';
      systemPrompt += '|--------------|---------|-------------|\n\n';
      systemPrompt += '## Future Research Directions\n';
      systemPrompt += '- Limitations of current approach\n';
      systemPrompt += '- Potential improvements\n';
      systemPrompt += '- Open research questions\n\n';
      systemPrompt += '## Critical Analysis\n';
      systemPrompt += '- Strengths of the approach\n';
      systemPrompt += '- Limitations and constraints\n';
      systemPrompt += '- Comparison with existing methods\n\n';

      if (arxivPapers.length > 0) {
        systemPrompt += '# Relevant Research Papers\n\n';
        arxivPapers.forEach((paper, index) => {
          systemPrompt += `## Paper ${index + 1}: ${paper.title}\n\n`;
          systemPrompt += `**Authors:** ${paper.authors.join(', ')}\n\n`;
          systemPrompt += `**Summary:**\n${paper.summary}\n\n`;
          systemPrompt += `**Key Contributions:**\n`;
          systemPrompt += `- Extract and list key contributions from the summary\n`;
          systemPrompt += `- Focus on novel methods and findings\n`;
          systemPrompt += `- Highlight practical applications\n\n`;
          systemPrompt += `**Technical Details:**\n`;
          systemPrompt += `- Methods and algorithms used\n`;
          systemPrompt += `- Performance metrics and results\n`;
          systemPrompt += `- Implementation details\n\n`;
          systemPrompt += `**PDF Link:** [${paper.title}](${paper.pdfUrl})\n\n`;
        });
      }

      formattedMessages.unshift({
        role: 'system',
        content: systemPrompt
      });

      console.log('Formatted messages for Azure:', formattedMessages);
      const response = await callAzureAPI(formattedMessages, githubToken);
      return {
        content: response.content,
        arxivPapers
      };
    } else if (modelConfig.type === 'gemini') {
      console.log('Using Gemini model with API key');
      if (!apiKey) {
        throw new Error("API key is required for Gemini models");
      }

      const contextMessages = messages.slice(-10);
      const lastMessage = contextMessages[contextMessages.length - 1];

      // Handle image if present
      if (lastMessage.image) {
        const response = await fetch(
          'http://localhost:8000/api/analyze',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: lastMessage.content || "Please analyze this image",
              image: lastMessage.image
            })
          }
        );

        if (!response.ok) {
          throw new Error('Failed to analyze image');
        }

        const data = await response.json();
        return {
          content: formatResponse(data.response),
          arxivPapers
        };
      }

      // Format messages for Gemini with paper context
      let paperContext = '';
      if (arxivPapers.length > 0) {
        paperContext = '\n### Relevant Research Papers\n' + arxivPapers.map(paper => 
          `- **${paper.title}** by ${paper.authors.join(', ')}\n  ${paper.summary}`
        ).join('\n\n');
      }

      // Add formatting instructions to the context
      const formattingInstructions = `
Please format your response using markdown:
- Use headers (# ## ###) for sections
- Use bullet points for lists
- Use code blocks with language specification
- Use bold for emphasis
- Keep responses clear and well-structured
`;

      const formattedMessages = contextMessages.map((msg, index) => ({
        role: msg.role,
        parts: [{ 
          text: index === 0 
            ? `${roleConfig.systemPrompt}\n\n${formattingInstructions}${msg.content || ''}`
            : index === contextMessages.length - 1 && paperContext 
              ? msg.content + paperContext 
              : msg.content || '' 
        }],
      }));

      const response = await callGeminiAPI(formattedMessages, apiKey, model);
      const content = extractGeminiResponse(response);

      return {
        content,
        arxivPapers
      };
    }

    throw new Error(`Unsupported model type: ${modelConfig.type}`);
  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    throw error;
  }
};

async function handleMessage(message: string, role: AssistantRole, chatId: string): Promise<string> {
  const store = useStore.getState();
  
  // Handle administrator commands
  if (role === 'administrator') {
    try {
      const result = await handleAdminCommand(message);
      return formatAdminCommandResult(result);
    } catch (error) {
      return error instanceof Error 
        ? `Error: ${error.message}`
        : 'An unknown error occurred while processing the administrator command.';
    }
  }

  // Handle regular chat messages
  // ... existing message handling code ...
  return 'Message processed successfully'; // Add a default return statement
}

function formatAdminCommandResult(result: AdminCommandResult): string {
  if (!result.success) {
    return `Error: ${result.message}`;
  }

  let response = result.message;

  if (result.data) {
    if (typeof result.data === 'object') {
      // Format specific data types
      if ('customTools' in result.data && 'builtInTools' in result.data) {
        response += '\n\nBuilt-in Tools:\n' + formatToolList(result.data.builtInTools);
        if (result.data.customTools.length > 0) {
          response += '\n\nCustom Tools:\n' + formatToolList(result.data.customTools);
        }
      } else if ('customRoles' in result.data && 'builtInRoles' in result.data) {
        response += '\n\nBuilt-in Roles:\n' + formatRoleList(result.data.builtInRoles);
        if (result.data.customRoles.length > 0) {
          response += '\n\nCustom Roles:\n' + formatRoleList(result.data.customRoles);
        }
      } else {
        // For individual tool/role configurations
        response += '\n\n' + JSON.stringify(result.data, null, 2);
      }
    } else {
      response += '\n\n' + result.data;
    }
  }

  return response;
}

function formatToolList(tools: Tool[]): string {
  return tools.map(tool => 
    `- ${tool.name}: ${tool.description} (${tool.isEnabled ? 'Enabled' : 'Disabled'})`
  ).join('\n');
}

function formatRoleList(roles: any[]): string {
  return roles.map(role => {
    const config = role.config || role;
    return `- ${config.title}: ${config.description}`;
  }).join('\n');
}
