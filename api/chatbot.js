import fs from 'fs';
import path from 'path';

// This is a Vercel serverless function that handles chatbot requests
export default async function handler(req, res) {
  // Set CORS headers for your domain
  res.setHeader('Access-Control-Allow-Origin', '*'); // Change this to your Vercel domain in production
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('API called with method:', req.method);
    console.log('Request body:', req.body);

    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      console.log('Invalid message provided:', message);
      return res.status(400).json({ error: 'Message is required' });
    }

    // Rate limiting (simple implementation)
    if (message.length > 500) {
      return res.status(400).json({ error: 'Message too long' });
    }

    console.log('Processing message:', message);

    // Load company knowledge base
    const knowledgeBase = await loadCompanyKnowledge();
    console.log('Knowledge base loaded successfully');

    // Create system prompt with company context
    const systemPrompt = createSystemPrompt(knowledgeBase);
    console.log('System prompt created');

    // Prepare conversation history for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    console.log('Calling OpenAI API...');

    // Call OpenAI API
    const openaiResponse = await callOpenAI(messages);

    console.log('OpenAI API response received:', openaiResponse);

    return res.status(200).json({
      response: openaiResponse,
      timestamp: new Date().toISOString(),
      debug: 'API working correctly'
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    console.error('Error stack:', error.stack);
    
    return res.status(500).json({
      error: `I apologize, but I'm experiencing technical difficulties: ${error.message}. Please try again later or contact us directly through our website form or Facebook page.`,
      timestamp: new Date().toISOString(),
      debug: error.message
    });
  }
}

async function loadCompanyKnowledge() {
  try {
    // In Vercel, we need to read from the file system differently
    const knowledgePath = path.join(process.cwd(), 'data', 'company-knowledge.json');
    const knowledgeData = fs.readFileSync(knowledgePath, 'utf8');
    return JSON.parse(knowledgeData);
  } catch (error) {
    console.error('Error loading knowledge base:', error);
    // Fallback knowledge if file can't be loaded
    return {
      company: {
        name: "Cross-Care Medical Services",
        description: "Medical referral services between Myanmar and Thailand"
      }
    };
  }
}

function createSystemPrompt(knowledgeBase) {
  return `You are a helpful AI assistant for Cross-Care Medical Services. You help people from Myanmar access quality medical care in Thailand.

COMPANY INFORMATION:
${JSON.stringify(knowledgeBase, null, 2)}

INSTRUCTIONS:
1. Be helpful, professional, and empathetic
2. Focus on Cross-Care's medical referral services and team
3. Provide specific information about services, team members, doctors, and processes
4. When asked about doctors/team, refer to the team section in the knowledge base
5. For medical questions, provide brief helpful information using the medical_response_guidelines, then ALWAYS end with the consultation reminder
6. For medical emergencies, direct users to emergency services first
7. Keep responses concise but informative (under 250 words)
8. Always be supportive and understanding of medical concerns
9. If asked about costs, direct them to contact Cross-Care for personalized pricing
10. For urgent medical needs, emphasize contacting Cross-Care immediately

MEDICAL QUESTION HANDLING:
- Provide brief, helpful information about common conditions using the guidelines
- Always include the disclaimer about information being for general guidance only
- Always end medical responses with: "Contact Cross-Care to consult with our doctors for personalized medical guidance and proper treatment planning."

TEAM QUESTIONS:
- Use the team section to describe Cross-Care's medical coordinators, doctors, and specialists
- Mention their qualifications and expertise areas
- Explain how patients can consult with the medical team

TONE: Professional, caring, and supportive. Remember you're helping people with important medical needs.

LANGUAGE: Respond in English unless specifically asked to use another language.`;
}

async function callOpenAI(messages) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  console.log('OpenAI API Key available:', !!OPENAI_API_KEY);
  console.log('API Key starts with:', OPENAI_API_KEY ? OPENAI_API_KEY.substring(0, 20) + '...' : 'NOT FOUND');
  
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in Vercel environment variables.');
  }

  const requestPayload = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    max_tokens: 300,
    temperature: 0.7,
    presence_penalty: 0.1,
    frequency_penalty: 0.1,
  };

  console.log('Sending request to OpenAI with payload:', {
    ...requestPayload,
    messages: messages.map(m => ({ role: m.role, content: m.content.substring(0, 100) + '...' }))
  });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestPayload),
  });

  console.log('OpenAI response status:', response.status);
  console.log('OpenAI response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const error = await response.text();
    console.error('OpenAI API error response:', error);
    throw new Error(`OpenAI API call failed with status ${response.status}: ${error}`);
  }

  const data = await response.json();
  console.log('OpenAI response data:', data);
  
  if (data.choices && data.choices[0] && data.choices[0].message) {
    const responseText = data.choices[0].message.content.trim();
    console.log('Extracted response text:', responseText);
    return responseText;
  } else {
    console.error('Unexpected response format:', data);
    throw new Error('Unexpected OpenAI API response format');
  }
}