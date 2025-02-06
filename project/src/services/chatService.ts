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
import OpenAI from "openai";

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

export type AssistantRole = 'default' | 'researcher' | 'developer' | 'analyst' | 'medical' | 'imageAnalyst' | 'administrator' | 'ragChat' | 'architect' | string;

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
  },
  ragChat: {
    title: "RAG Assistant",
    description: "A specialized assistant for retrieval-augmented generation that effectively uses context from documents",
    systemPrompt: `You are a specialized RAG (Retrieval-Augmented Generation) assistant. Your primary function is to provide accurate, contextual responses based on the provided document snippets while following these guidelines:

1. CONTEXT HANDLING:
   - Always analyze all provided context snippets thoroughly before responding
   - If context is insufficient, clearly indicate what information is missing
   - Maintain awareness of context boundaries and don't make assumptions beyond provided information

2. RESPONSE GENERATION:
   - Synthesize information from multiple context snippets when relevant
   - Provide direct quotes from the context when appropriate, using quotation marks
   - Clearly distinguish between information from context and general knowledge
   - If the context doesn't contain relevant information, say so explicitly

3. ERROR HANDLING:
   - If context is missing or corrupted, inform the user clearly
   - When context seems contradictory, highlight the discrepancy
   - If unable to find specific information in context, state this explicitly
   - Handle edge cases gracefully by explaining limitations

4. ACCURACY & CITATIONS:
   - Always ground responses in the provided context
   - Cite specific parts of the context when making claims
   - Avoid making assumptions beyond the provided information
   - If uncertain, express the degree of confidence in your response

5. INTERACTION STYLE:
   - Be clear and concise in responses
   - Use structured formatting for complex information
   - Provide step-by-step explanations when needed
   - Ask for clarification if the query is ambiguous

Remember: Your primary goal is to provide accurate, helpful responses based strictly on the provided context while handling errors and edge cases gracefully.`
  },
  architect: {
    title: 'Architect',
    description: 'A software and system architecture expert',
    systemPrompt: `You are an expert in software and system architecture. Analyze codebases and generate architecture diagrams. 
    Focus on identifying components, relationships, and patterns. Provide clear, structured explanations of the architecture.`
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
  formattedMessages: { role: 'user' | 'assistant' | 'system'; parts: Array<{ text?: string } | { inline_data: { mime_type: string; data: string } }> }[],
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
      contents: formattedMessages
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

// Update model types to include new models
export type ModelId = 'gemini-2.0-flash-exp' | 'gemini-1.5-flash' | 'gemini-1.5-pro' | 'gemini-1.0-pro' | 'gpt-4o' | 'o1' | 'gpt-4o-mini' | 'Cohere-command-r' | 'Llama-3.2-90B-Vision-Instruct' | 'o3-mini' | 'DeepSeek-R1';

export const AVAILABLE_MODELS: Record<ModelId, { name: string; type: 'gemini' | 'gpt4'; supportsImages?: boolean }> = {
  'gemini-2.0-flash-exp': { name: 'Gemini 2.0 Flash (Experimental)', type: 'gemini', supportsImages: true },
  'gemini-1.5-flash': { name: 'Gemini 1.5 Flash', type: 'gemini', supportsImages: true },
  'gemini-1.5-pro': { name: 'Gemini 1.5 Pro', type: 'gemini', supportsImages: true },
  'gemini-1.0-pro': { name: 'Gemini 1.0 Pro', type: 'gemini', supportsImages: true },
  'gpt-4o': { name: 'GPT-4 Online', type: 'gpt4' },
  'o1': { name: 'O1 Model', type: 'gpt4' },
  'gpt-4o-mini': { name: 'GPT-4 Online Mini', type: 'gpt4' },
  'Cohere-command-r': { name: 'Cohere Command', type: 'gpt4' },
  'Llama-3.2-90B-Vision-Instruct': { name: 'Llama Vision', type: 'gpt4', supportsImages: true },
  'o3-mini': { name: 'O3 Mini', type: 'gpt4' },
  'DeepSeek-R1': { name: 'DeepSeek R1', type: 'gpt4' }
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

const callGPT4API = async (
  messages: { role: 'user' | 'assistant' | 'system'; content: string; image?: string; messageId?: string }[],
  apiKey: string,
  model: string = 'gpt-4o'
): Promise<any> => {
  try {
    console.log('Starting GPT-4 API call...');
    console.log('Messages:', JSON.stringify(messages, null, 2));

    const endpoint = 'https://models.inference.ai.azure.com';
    
    // Configure request body based on model
    let requestBody: any = {
      messages: messages.map(({ messageId, ...msg }) => {
        // Convert image to base64 if present
        if (msg.image) {
          const imageData = msg.image.replace(/^data:image\/[^;]+;base64,/, '');
          return {
            ...msg,
            content: [
              { type: 'text', text: msg.content || '' },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageData}` } }
            ]
          };
        }
        return msg;
      }),
      model: model
    };

    // Add model-specific parameters
    if (model === 'o1') {
      requestBody = {
        ...requestBody,
        max_completion_tokens: 1000
      };
    } else if (model === 'o3-mini') {
      requestBody = {
        ...requestBody,
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 2000,
        stream: false
      };
    } else if (model === 'DeepSeek-R1') {
      requestBody = {
        ...requestBody,
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 1000,
        stream: false
      };
    } else if (model === 'Cohere-command-r') {
      requestBody = {
        ...requestBody,
        temperature: 1.0,
        top_p: 1.0,
        max_tokens: 1000,
        stream: false
      };
    } else if (model === 'Llama-3.2-90B-Vision-Instruct') {
      requestBody = {
        ...requestBody,
        temperature: 1.0,
        top_p: 1.0,
        max_tokens: 4000,
        stream: false
      };
    } else {
      requestBody = {
        ...requestBody,
        temperature: 1.0,
        top_p: 1.0,
        max_tokens: 1000,
        stream: false
      };
    }

    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    console.log('Using API key:', apiKey);
    console.log('Using model:', model);

    const response = await fetch(`${endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
        'x-ms-model-mesh-model-name': model
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('GPT-4 API Response:', data);
    return data;
  } catch (error) {
    console.error('Error in GPT-4 API call:', error);
    throw error;
  }
};

// Message type with optional image property
interface ChatMessageWithImage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  image?: string;
}

// Update sendChatMessage to use the correct API keys
export const sendChatMessage = async (
  messages: ChatMessage[],
  apiKey: string,
  role: AssistantRole = "default",
  model: ModelId = "gemini-1.5-flash",
  githubToken?: string
): Promise<{ content: string; arxivPapers?: ArxivPaper[] }> => {
  try {
    console.log('Starting sendChatMessage...');
    console.log('Model:', model);
    
    // Get the store state for API keys
    const store = useStore.getState();
    const azureOpenAIKey = store.azureOpenAIKey;
    const geminiKey = store.geminiKey;
    const githubTokenFromStore = store.githubToken;
    
    // Validate model
    const modelConfig = AVAILABLE_MODELS[model];
    if (!modelConfig) {
      throw new Error(`Invalid model: ${model}. Available models: ${Object.keys(AVAILABLE_MODELS).join(', ')}`);
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
      const builtInConfig = ROLE_CONFIGS[role];
      if (!builtInConfig) {
        throw new Error(`Invalid role: ${role}`);
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
    if (modelConfig.type === 'gpt4') {
      console.log('Using GPT-4 model with Azure OpenAI key');
      if (!azureOpenAIKey) {
        throw new Error("Azure OpenAI API key is required for GPT-4 models");
      }
      
      // Take only the last 5 messages to stay within token limits
      const recentMessages = messages.slice(-5);
      const formattedMessages = [
        {
          role: 'system' as const,
          content: roleConfig.systemPrompt.substring(0, 500)
        },
        ...recentMessages.map(msg => ({
          role: msg.role === 'system' ? 'user' as const : msg.role as 'user' | 'assistant',
          content: msg.content?.substring(0, 1000) || '',
          image: msg.image
        }))
      ].map((msg, index) => ({
        ...msg,
        messageId: `msg-${index}`
      }));

      console.log('Formatted messages for GPT-4:', formattedMessages);
      const response = await callGPT4API(formattedMessages, azureOpenAIKey, model);
      return {
        content: response.choices[0].message.content || '',
        arxivPapers
      };
    } else if (modelConfig.type === 'gemini') {
      console.log('Using Gemini model with Gemini API key');
      if (!geminiKey) {
        throw new Error("Gemini API key is required for Gemini models");
      }

      const contextMessages = messages.slice(-10);
      const lastMessage = contextMessages[contextMessages.length - 1];

      // Format messages for Gemini with paper context and image support
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

      const formattedMessages = contextMessages.map((msg, index) => {
        const parts: Array<{ text?: string } | { inline_data: { mime_type: string; data: string } }> = [];
        
        // Add text content
        const text = index === 0 
          ? `${roleConfig.systemPrompt}\n\n${formattingInstructions}${msg.content || ''}`
          : index === contextMessages.length - 1 && paperContext 
            ? msg.content + paperContext 
            : msg.content || '';
            
        if (text) {
          parts.push({ text });
        }
        
        // Add image if present
        if (msg.image) {
          const imageData = msg.image.replace(/^data:image\/[^;]+;base64,/, '');
          parts.push({
            inline_data: {
              mime_type: 'image/jpeg',
              data: imageData
            }
          });
        }
        
        return {
          role: msg.role,
          parts
        };
      });

      const response = await callGeminiAPI(formattedMessages, geminiKey, model);
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

/**
 * Generates a deep learning architecture from text description or image
 */
export interface ArchitectureGenerationResult {
  nodes: {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: {
      label: string;
      description?: string;
      shape?: string;
      color?: string;
      icon?: string;
    };
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
    type: string;
    data?: {
      connectionType?: string;
      connectionStyle?: string;
      animated?: boolean;
    };
  }[];
}

export const generateArchitecture = async (
  input: string,
  image?: string,
  apiKey: string = "AIzaSyBQfQ7sN-ASKnlFe8Zg50xsp6qmDdZoweU",
  model: ModelId = "gemini-1.5-pro"
): Promise<ArchitectureGenerationResult> => {
  try {
    const modelConfig = AVAILABLE_MODELS[model];
    if (!modelConfig) {
      throw new Error(`Invalid model: ${model}`);
    }

    // Process image if provided
    let processedImage = image;
    if (image && (modelConfig.type === 'gpt4' || model === 'Llama-3.2-90B-Vision-Instruct')) {
      try {
        // Convert to lower quality JPEG
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = image;
        });
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Scale down image
        let width = img.width;
        let height = img.height;
        const maxDimension = 600;
        
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with lower quality
        processedImage = canvas.toDataURL('image/jpeg', 0.4);
      } catch (error) {
        console.warn('Image processing failed:', error);
      }
    }

    // Optimized prompt for token efficiency and strict JSON format
    const prompt = `Analyze neural network diagram and return a valid JSON object with this exact structure:
{
  "nodes": [
    {
      "id": "node-1",
      "type": "custom",
      "position": { "x": 100, "y": 100 },
      "data": {
        "label": "Input",
        "shape": "rectangle",
        "color": "#hex_color",
        "icon": "Network"
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "node-1",
      "target": "node-2",
      "type": "custom",
      "data": {
        "connectionType": "smoothstep",
        "connectionStyle": "solid"
      }
    }
  ]
}

Rules:
1. Return ONLY valid JSON, no additional text
2. Use exact property names as shown
3. All strings must be in double quotes
4. All hex colors must start with #
5. All IDs must be unique strings
6. All positions must be numbers

Context: ${input}`;

    let response;
    if (modelConfig.type === 'gpt4') {
      response = await callGPT4API([
        { role: 'user', content: prompt, image: processedImage }
      ], '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', model);
    } else {
      const formattedMessage = {
        role: 'user',
        parts: [
          { text: prompt },
          ...(image ? [{
            inline_data: {
              mime_type: 'image/jpeg',
              data: image.replace(/^data:image\/[^;]+;base64,/, '')
            }
          }] : [])
        ]
      };
      response = await callGeminiAPI([formattedMessage], apiKey, model);
    }

    // Parse and validate the response
    const content = typeof response === 'string' ? response : response.content;
    let architecture: ArchitectureGenerationResult;
    
    try {
      // Clean up the response text
      let jsonStr = content;
      
      // Remove any markdown code block syntax
      jsonStr = jsonStr.replace(/```json\s*|\s*```/g, '');
      
      // Find the JSON object in the response
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON object found in response');
      }
      
      jsonStr = jsonMatch[0];
      
      // Remove any trailing commas in arrays and objects
      jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');
      
      // Parse the cleaned JSON
      architecture = JSON.parse(jsonStr);
      
      // Validate required properties
      if (!architecture.nodes || !Array.isArray(architecture.nodes)) {
        throw new Error('Missing or invalid nodes array');
      }
      if (!architecture.edges || !Array.isArray(architecture.edges)) {
        throw new Error('Missing or invalid edges array');
      }
      
    } catch (error) {
      console.error('Failed to parse architecture:', error);
      // Provide a default Mamba Block architecture
      architecture = {
        nodes: [
          {
            id: 'input',
            type: 'custom',
            position: { x: 250, y: 50 },
            data: {
              label: 'Input Tensor',
              description: 'Input data tensor',
              shape: 'rectangle',
              color: '#4287f5',
              icon: 'Database'
            }
          },
          {
            id: 'proj-a',
            type: 'custom',
            position: { x: 150, y: 150 },
            data: {
              label: 'Projection A',
              description: 'First projection layer',
              shape: 'hexagon',
              color: '#42f5a7',
              icon: 'Brain'
            }
          },
          {
            id: 'proj-b',
            type: 'custom',
            position: { x: 350, y: 150 },
            data: {
              label: 'Projection B',
              description: 'Second projection layer',
              shape: 'hexagon',
              color: '#42f5a7',
              icon: 'Brain'
            }
          },
          {
            id: 'conv',
            type: 'custom',
            position: { x: 350, y: 250 },
            data: {
              label: 'Conv + SiLU',
              description: 'Convolution with SiLU activation',
              shape: 'hexagon',
              color: '#f542a7',
              icon: 'Activity'
            }
          },
          {
            id: 'ssm',
            type: 'custom',
            position: { x: 250, y: 350 },
            data: {
              label: 'Selective SSM',
              description: 'Specialized processing unit',
              shape: 'hexagon',
              color: '#f5a742',
              icon: 'Cpu'
            }
          },
          {
            id: 'output',
            type: 'custom',
            position: { x: 250, y: 450 },
            data: {
              label: 'Output',
              description: 'Final output tensor',
              shape: 'rectangle',
              color: '#4287f5',
              icon: 'Database'
            }
          }
        ],
        edges: [
          {
            id: 'e1-a',
            source: 'input',
            target: 'proj-a',
            type: 'custom',
            data: {
              connectionType: 'smoothstep',
              connectionStyle: 'solid',
              animated: true
            }
          },
          {
            id: 'e1-b',
            source: 'input',
            target: 'proj-b',
            type: 'custom',
            data: {
              connectionType: 'smoothstep',
              connectionStyle: 'solid',
              animated: true
            }
          },
          {
            id: 'e2',
            source: 'proj-b',
            target: 'conv',
            type: 'custom',
            data: {
              connectionType: 'smoothstep',
              connectionStyle: 'solid',
              animated: true
            }
          },
          {
            id: 'e3',
            source: 'proj-a',
            target: 'ssm',
            type: 'custom',
            data: {
              connectionType: 'smoothstep',
              connectionStyle: 'solid',
              animated: true
            }
          },
          {
            id: 'e4',
            source: 'conv',
            target: 'ssm',
            type: 'custom',
            data: {
              connectionType: 'smoothstep',
              connectionStyle: 'solid',
              animated: true
            }
          },
          {
            id: 'e5',
            source: 'ssm',
            target: 'output',
            type: 'custom',
            data: {
              connectionType: 'smoothstep',
              connectionStyle: 'solid',
              animated: true
            }
          }
        ]
      };
    }

    // Clean and validate the architecture
    architecture.nodes = (architecture.nodes || []).map((node, index) => {
      // Ensure valid position values
      const x = typeof node.position?.x === 'number' ? node.position.x : index * 200;
      const y = typeof node.position?.y === 'number' ? node.position.y : 100;

      return {
        id: node.id?.toString() || `node-${index + 1}`,
        type: 'custom',
        position: { x, y },
        data: {
          label: node.data?.label?.toString() || `Node ${index + 1}`,
          shape: ['rectangle', 'circle', 'hexagon', 'diamond'].includes(node.data?.shape || '') ? node.data.shape : 'rectangle',
          color: /^#[0-9A-Fa-f]{6}$/.test(node.data?.color || '') ? node.data.color : '#3b82f6',
          icon: node.data?.icon || 'Network'
        }
      };
    });

    architecture.edges = (architecture.edges || []).map((edge, index) => ({
      id: edge.id?.toString() || `edge-${index + 1}`,
      source: edge.source?.toString() || '',
      target: edge.target?.toString() || '',
      type: 'custom',
      data: {
        connectionType: 'smoothstep',
        connectionStyle: ['solid', 'dashed'].includes(edge.data?.connectionStyle || '') ? edge.data.connectionStyle : 'solid',
        animated: false
      }
    })).filter(edge => edge.source && edge.target);

    return architecture;
  } catch (error) {
    console.error('Error generating architecture:', error);
    throw error;
  }
};

export async function generateArchitectureDescription(
  image: string,
  apiKey: string,
  modelId: ModelId
): Promise<string> {
  try {
    const prompt = `Analyze this neural network architecture diagram and provide a detailed description of:
1. The overall architecture type (CNN, RNN, Transformer, etc.)
2. Input and output layers
3. Hidden layers and their connections
4. Any special features (skip connections, attention mechanisms, etc.)
5. The flow of data through the network

Format the description in a way that can be used to recreate the architecture programmatically.`;

    const response = await fetch('/api/generate-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image,
        prompt,
        apiKey,
        modelId
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate description');
    }

    const data = await response.json();
    return data.description;
  } catch (error) {
    console.error('Error generating description:', error);
    throw error;
  }
}
