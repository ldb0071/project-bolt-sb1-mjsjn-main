import express from 'express';
import { OpenAI } from 'openai';

const router = express.Router();

// Initialize OpenAI client with Azure configuration
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY || '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',
  baseURL: process.env.AZURE_OPENAI_ENDPOINT || 'https://models.inference.ai.azure.com',
});

router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o',
      messages,
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 1000,
    });

    res.json(response);
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router; 