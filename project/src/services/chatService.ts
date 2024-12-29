import { apiClient } from './apiClient';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  arxivPapers?: ArxivPaper[];
  timestamp?: string;
}

export interface ArxivPaper {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  pdfUrl: string;
}

export interface SearchResult {
  title: string;
  url: string;
  description: string;
}

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

export type AssistantRole = 'default' | 'researcher' | 'developer' | 'analyst' | 'medical';

export interface RoleConfig {
  title: string;
  description: string;
  systemPrompt: string;
}

export const ROLE_CONFIGS: Record<AssistantRole, RoleConfig> = {
  default: {
    title: 'General Assistant',
    description: 'A helpful AI assistant for general conversations',
    systemPrompt: 'You are a helpful AI assistant. When provided with ArXiv papers or web search results, use them to enhance your responses with current information.'
  },
  researcher: {
    title: 'AI Research Analyst',
    description: 'Specialized in AI model analysis with ArXiv paper integration',
    systemPrompt: `You are an AI research analyst specializing in model evaluation and comparison, with access to ArXiv papers. Your expertise includes:

1. Comprehensive model analysis:
- State-of-the-art performance metrics
- Benchmark comparisons
- Architecture details
- Training requirements
- Resource considerations

2. Data presentation:
- Present comparisons in markdown tables
- Include key metrics (accuracy, F1-score, mAP, etc.)
- List advantages and limitations
- Provide implementation considerations

3. Research synthesis:
- Analyze ArXiv papers in detail
- Cite relevant papers with years
- Compare across different approaches
- Highlight recent developments
- Consider practical deployment factors

When discussing models or papers, always structure your response with:
1. Brief overview of the domain
2. Analysis of relevant ArXiv papers
3. Comparison table of top models/approaches
4. Detailed technical analysis
5. Practical recommendations
6. References to papers and sources

Use markdown formatting for better readability. When ArXiv papers are provided, analyze their methodology, results, and implications in detail.`
  },
  developer: {
    title: 'Software Developer',
    description: 'Specialized in software development, coding, and technical solutions',
    systemPrompt: 'You are a software developer with expertise in programming, system design, and technical problem-solving. Provide detailed technical explanations, code examples when relevant, and focus on best practices and efficient solutions. Consider scalability, maintainability, and performance in your responses.'
  },
  analyst: {
    title: 'Data Analyst',
    description: 'Specialized in data analysis, statistics, and research interpretation',
    systemPrompt: 'You are a data analyst with expertise in interpreting research findings, statistical analysis, and data visualization. Focus on extracting meaningful insights from data, explaining statistical concepts, and providing data-driven recommendations.'
  },
  medical: {
    title: 'Medical Expert',
    description: 'Specialized in medical imaging, segmentation, and healthcare AI',
    systemPrompt: 'You are a medical AI expert with deep knowledge of medical imaging, segmentation models, and healthcare applications. Provide detailed technical analysis of medical imaging models, focusing on accuracy, performance, and clinical applications. Consider factors like data requirements, preprocessing, and validation methods.'
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

export const sendChatMessage = async (
  messages: ChatMessage[], 
  apiKey: string,
  role: AssistantRole = 'default'
): Promise<{ content: string; arxivPapers?: ArxivPaper[] }> => {
  try {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    const contextMessages = messages.slice(-10);
    const lastMessage = contextMessages[contextMessages.length - 1];

    // Search ArXiv if the message seems to be a research query
    const isResearchQuery = /research|paper|model|algorithm|method|arxiv|study|medical|segmentation/i.test(lastMessage.content);
    let arxivPapers: ArxivPaper[] = [];
    if (isResearchQuery) {
      arxivPapers = await searchArxiv(lastMessage.content);
      console.log('Found ArXiv papers:', arxivPapers);
    }

    // Get context including ArXiv paper details if available
    const additionalContext = await enhanceWithContext(
      lastMessage.content,
      arxivPapers[0] // Use the most relevant paper
    );

    // Format ArXiv papers for context
    const arxivContext = arxivPapers.length > 0 
      ? "\n\nRelevant Medical Segmentation Papers:\n\n" + 
        "| Paper | Authors | Links |\n" +
        "|-------|---------|-------|\n" +
        arxivPapers.map((paper, index) => 
          `| ${index + 1}. ${paper.title} | ${paper.authors.join(', ')} | [📄 PDF](${paper.pdfUrl}) [📚 ArXiv](https://arxiv.org/abs/${paper.id}) |`
        ).join('\n') +
        "\n\n### Paper Details\n\n" +
        arxivPapers.map((paper, index) => 
          `### ${index + 1}. ${paper.title}\n\n` +
          `**Authors:** ${paper.authors.join(', ')}\n\n` +
          `**Summary:** ${paper.summary}\n\n` +
          `**Links:**\n` +
          `- [📄 Download PDF](${paper.pdfUrl})\n` +
          `- [📚 View on ArXiv](https://arxiv.org/abs/${paper.id})\n` +
          `- [📝 BibTeX](https://arxiv.org/bibtex/${paper.id})\n`
        ).join('\n\n')
      : "";

    const formattedMessages = [
      {
        parts: [{ 
          text: ROLE_CONFIGS[role].systemPrompt + 
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
                (additionalContext ? "\n\n" + additionalContext : "")
        }]
      }
    ];

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to get response from Gemini API');
    }

    const data = await response.json();
    console.log('Gemini API Response:', data);

    // Get the response text
    let responseText = '';
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      responseText = data.candidates[0].content.parts[0].text;
    } else if (data.candidates?.[0]?.content?.text) {
      responseText = data.candidates[0].content.text;
    } else if (data.text) {
      responseText = data.text;
    } else if (typeof data === 'string') {
      responseText = data;
    } else if (data.candidates?.[0]?.output) {
      responseText = data.candidates[0].output;
    } else {
      responseText = JSON.stringify(data, null, 2);
    }

    // Return both the response text and any referenced ArXiv papers
    return {
      content: responseText,
      arxivPapers: arxivPapers // Include all found papers
    };
  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    throw error;
  }
};
