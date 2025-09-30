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
  // Comprehensive Cross-Care Medical Services knowledge base
  return {
    "company": {
      "name": "Cross-Care Medical Services",
      "tagline": "Bringing Myanmar Patients to World-Class Healthcare in Thailand",
      "full_description": "Cross Care is a Myanmar-based medical referral and patient coordination service that specializes in connecting Myanmar patients with world-class medical treatment in Thailand and beyond. With a team of experienced healthcare professionals and strong local expertise, we ensure seamless, ethical, and patient-centered medical travel solutions.",
      "mission": "To become Myanmar's most trusted medical coordination service by building long-term partnerships with leading hospitals and specialists worldwide, enhancing accessibility, affordability, and continuity of care for patients.",
      "vision": "To provide high-quality, transparent, and personalized medical referral services for Myanmar patients, ensuring they receive the right treatment at the right hospital with complete medical, travel, and post-care support.",
      "established": "Founded in 1992 (Thukha Medical Center base)",
      "languages": ["Myanmar (Burmese)", "English", "Thai"],
      "countries": {
        "from": "Myanmar (Burma)",
        "to": "Thailand and beyond"
      }
    },
    "leadership_team": {
      "medical_director": {
        "name": "Dr. Si Thu Aung",
        "position": "Medical Director (Yangon)",
        "qualifications": "MBBS (Malaysia), Diploma in Women's Health (Ireland), MBA (Geneva)",
        "expertise": "Runs Thukha Medical Center, excels in cardiology, women's health, oncology",
        "role": "Reviews cases for accurate referrals and medical consultations"
      },
      "managing_director": {
        "name": "Lu Min Thar Tun",
        "position": "Marketing & Managing Director",
        "expertise": "Logistics, patient travel, hospital coordination, Partnerships with 500K-1M Myanmar social reach",
        "role": "Secures MOUs, drives patient flow, ensures smooth patient arrivals and coordination"
      },
      "business_director": {
        "name": "Yan Naing Win",
        "position": "Business Development Director",
        "expertise": "Market expansion, business strategy, partnerships, and competitive growth",
        "role": "Develops strategies, secures key partnerships, and drives sustainable business growth"
      }
    },
    "medical_staff": {
      "thukha_doctors": [
        {
          "name": "Dr. Chit Tin",
          "specialty": "General Practitioner",
          "role": "Primary care consultations and general medical assessments"
        },
        {
          "name": "Dr. Phyu Thwe",
          "specialty": "Radiologist",
          "role": "Diagnostic imaging, X-ray, and ultrasound services"
        },
        {
          "name": "Dr. Phyo Thit",
          "specialty": "Eye, Nose & Throat (ENT)",
          "role": "ENT consultations and specialized treatments"
        },
        {
          "name": "Dr. Thurein Lin",
          "specialty": "Orthopedic Surgeon",
          "role": "Bone, joint, and musculoskeletal treatments"
        },
        {
          "name": "Dr. Su Wai Phyo",
          "specialty": "OBGYN (Obstetrics & Gynecology)",
          "role": "Women's health, pregnancy care, and gynecological treatments"
        },
        {
          "name": "Dr. Than Swe",
          "specialty": "Chest Physician",
          "role": "Respiratory diseases and lung health treatments"
        }
      ]
    },
    "thukha_medical_center": {
      "established": "Founded 1992",
      "experience": "30+ years as a multi-specialty clinic",
      "address": "1/A, Thukha Street, Hlaing Township, Yangon",
      "services": {
        "consultations": "General, specialist, oncology consultations",
        "diagnostics": "Diagnostics Imaging, ECG, Ultrasound, Laboratory Investigations, X-ray",
        "care": "General Care, Women's Health, Chronic Disease, Physiotherapy & Cardiac Rehabilitation",
        "extras": "Pharmacy, nurse training, telemedicine"
      },
      "specialties": [
        "Cardiovascular (Heart Failure, ECP therapy)",
        "Oncology (Breast, Liver cancers)",
        "Stroke treatment and rehabilitation",
        "Nephrology (Chronic Kidney Disease)",
        "Gastroenterology (Hepatitis treatment)",
        "Women's health (Fibroids, OBGYN care)"
      ]
    },
    "international_partnerships": {
      "malaysia": [
        {
          "name": "Klinik Ebrahim (Malaysia)",
          "description": "A leader in integrative medicine, offering ECP therapy, Hyperbaric Oxygen Therapy, and advanced chronic disease management solutions"
        },
        {
          "name": "Academy CMT (Malaysia)",
          "description": "A premier medical training institution specializing in clinical education, certification programs, and healthcare innovation"
        }
      ]
    },
    "services": {
      "pre_treatment": [
        "Medical Consultation & Case Evaluation",
        "Second Opinion Services",
        "Hospital & Doctor Matching",
        "Cost Estimation & Financial Planning",
        "Visa & Travel Arrangements",
        "Medical Record Preparation & Translation"
      ],
      "during_treatment": [
        "Appointment Scheduling & Hospital Coordination",
        "Interpreter & Language Assistance",
        "In-Hospital Patient Support"
      ],
      "post_treatment": [
        "Medical Reports & Prescription Management",
        "Telemedicine & Follow-Up Appointments",
        "Rehabilitation & Recovery Support",
        "Medication Supply Assistance"
      ],
      "key_features": [
        "Expert Consultations - Get the right diagnosis and second opinions",
        "Seamless Travel and Visa Support - No stress, we handle it all",
        "Trusted Partner Hospitals - We connect you to the best"
      ]
    },
    "contact_information": {
      "email": "crosscarethmm@gmail.com",
      "phone_myanmar": "+959 8911 64676",
      "phone_bangkok": "+66 094 092 01849",
      "viber": "+959 790630413",
      "line": "+66 094 092 01849",
      "address": "Kha Clinic, 1/A Thu Kha Street, Hlaing, Yangon",
      "facebook": {
        "name": "Cross-Care Medical Services",
        "url": "https://www.facebook.com/share/1D8nLa1aMj/"
      },
      "consultation_form": "https://docs.google.com/forms/d/e/1FAIpQLSfxUoOyY_IBER3C-rCNIxHzmH-fJOROCkBuFexFl8UUV7WNMw/viewform?usp=header"
    }
  };
}

function createSystemPrompt(knowledgeBase) {
  return `You are a helpful AI assistant for Cross-Care Medical Services. You help people from Myanmar access quality medical care in Thailand and beyond.

COMPANY INFORMATION:
${JSON.stringify(knowledgeBase, null, 2)}

INSTRUCTIONS:
1. Be helpful, professional, and empathetic
2. Focus on Cross-Care's medical referral services, team, and comprehensive healthcare solutions
3. Provide specific information about services, leadership team, doctors, partnerships, and processes
4. When asked about doctors/team, provide detailed information about our leadership team and Thukha Medical Center doctors with their specialties
5. For contact information, ALWAYS provide clickable links and properly formatted contact details
6. For medical questions, provide brief helpful information, then direct to our medical team
7. Always be supportive and understanding of medical concerns
8. Keep responses informative but concise (under 300 words)

CONTACT INFORMATION FORMATTING:
When providing contact information, format as follows:
- Phone numbers: "📞 Call us at [+959 8911 64676](tel:+959891164676) (Myanmar) or [+66 094 092 01849](tel:+66094092018491) (Bangkok)"
- Email: "✉️ Email: [crosscarethmm@gmail.com](mailto:crosscarethmm@gmail.com)"
- Facebook: "📘 Facebook: [Cross-Care Medical Services](https://www.facebook.com/share/1D8nLa1aMj/)"
- Viber: "💬 Viber: [+959 790630413](viber://chat?number=%2B959790630413)"
- Line: "💬 Line: [+66 094 092 01849](https://line.me/ti/p/~+66094092018491)"
- Address: "📍 Address: Kha Clinic, 1/A Thu Kha Street, Hlaing, Yangon"
- Consultation Form: "[Fill our consultation form](https://docs.google.com/forms/d/e/1FAIpQLSfxUoOyY_IBER3C-rCNIxHzmH-fJOROCkBuFexFl8UUV7WNMw/viewform?usp=header)"

TEAM & DOCTOR INFORMATION:
- Leadership: Dr. Si Thu Aung (Medical Director), Lu Min Thar Tun (Managing Director), Yan Naing Win (Business Director)
- Thukha Medical Center Doctors: Dr. Chit Tin (GP), Dr. Phyu Thwe (Radiologist), Dr. Phyo Thit (ENT), Dr. Thurein Lin (Orthopedic), Dr. Su Wai Phyo (OBGYN), Dr. Than Swe (Chest Physician)
- Include qualifications and expertise for leadership team

MEDICAL CONSULTATION REMINDER:
For medical questions, always end with: "For personalized medical consultation, contact our medical team led by Dr. Si Thu Aung. Use our consultation form or call us directly."

SERVICES EMPHASIS:
- Expert Consultations & Second Opinions
- Seamless Travel & Visa Support  
- Trusted Partner Hospitals in Thailand
- 30+ years experience through Thukha Medical Center

TONE: Professional, caring, and supportive. Remember you're helping people with important medical needs and connecting them to experienced healthcare professionals.

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