// Simple test API endpoint to check if OpenAI is working
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    // Test environment variables
    console.log('Environment check:');
    console.log('- OpenAI API Key exists:', !!OPENAI_API_KEY);
    console.log('- API Key starts with:', OPENAI_API_KEY ? OPENAI_API_KEY.substring(0, 20) + '...' : 'NOT FOUND');
    console.log('- All env vars:', Object.keys(process.env).filter(key => key.includes('OPENAI')));

    if (!OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'OpenAI API key not found in environment variables',
        debug: {
          hasKey: false,
          allEnvKeys: Object.keys(process.env).filter(key => key.includes('OPENAI'))
        }
      });
    }

    // Test simple OpenAI API call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: 'Say "Hello from Cross-Care API test!"' }
        ],
        max_tokens: 50,
        temperature: 0.7,
      }),
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      return res.status(500).json({
        error: 'OpenAI API call failed',
        status: response.status,
        details: errorText,
        debug: {
          hasKey: true,
          keyLength: OPENAI_API_KEY.length
        }
      });
    }

    const data = await response.json();
    console.log('OpenAI API success:', data);

    return res.status(200).json({
      success: true,
      message: 'OpenAI API is working correctly!',
      response: data.choices[0].message.content,
      debug: {
        hasKey: true,
        keyLength: OPENAI_API_KEY.length,
        model: data.model,
        usage: data.usage
      }
    });

  } catch (error) {
    console.error('Test API error:', error);
    return res.status(500).json({
      error: 'Test failed',
      details: error.message,
      stack: error.stack
    });
  }
}