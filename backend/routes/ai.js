const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// AI Chat Endpoint
router.post('/chat', async (req, res) => {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Use Gemini if API key is present, otherwise mock
    if (!apiKey) {
        console.warn('[AI] GEMINI_API_KEY missing. Using Smart Eco-Mock.');
        const lastMessage = messages[messages.length - 1].content.toLowerCase();
        
        // Simple heuristic for a smart mock
        let response = "I'm your CleanPulse Eco-Assistant. How can I help you save the planet today?";
        if (lastMessage.includes('recycle')) response = "Recycling is key! Make sure to rinse containers and separate plastics by number (1-7). Which item are you looking at?";
        else if (lastMessage.includes('cleanpulse')) response = "CleanPulse is a community platform where you can report waste and earn Eco-Credits for your positive impact!";
        else if (lastMessage.includes('points') || lastMessage.includes('credits')) response = "You earn Eco-Credits by reporting waste or resolving cleanups. You can spend them in the Rewards Hub!";
        else if (lastMessage.includes('hello') || lastMessage.includes('hi')) response = "Hello Eco-Citizen! Ready to make the world a cleaner place?";

        return res.json({ response });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const history = messages.slice(0, -1).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }));

        const chat = model.startChat({
            history: history,
            generationConfig: { maxOutputTokens: 500 },
        });

        const systemPrompt = "You are the CleanPulse Eco-Assistant, a helpful and enthusiastic sustainability guardian. Your goal is to help citizens report waste, understand recycling, and stay motivated. Keep responses concise and focused on environmental impact and CleanPulse features.";
        
        const result = await chat.sendMessage(`${systemPrompt}\n\nUser: ${messages[messages.length - 1].content}`);
        const response = await result.response;
        res.json({ response: response.text() });
    } catch (err) {
        console.error('Gemini Chat Error:', err.message);
        res.status(500).json({ error: 'AI Assistant is currently resting. Please try again later.' });
    }
});

// Analyze Item (Legacy behavior, upgraded to Gemini)
router.post('/analyze', async (req, res) => {
    const { item } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        const mockResponse = {
            item_name: item,
            category: "General Waste",
            emoji: "🗑️",
            disposal_method: "Dispose of this item in a standard waste bin. If it's recyclable or hazardous, please check local guidelines.",
            tips: ["Keep waste segregated", "Reuse if possible", "Clean the item before disposal"],
            environmental_impact: "Proper disposal helps keep our community clean and reduces landfill waste.",
            eco_score: 5,
            color: "gray"
        };
        return res.json(mockResponse);
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Analyze this waste item: "${item}". 
        Reply ONLY in raw JSON:
        {
          "item_name": "cleaned name",
          "category": "Recyclable"|"Compostable"|"Hazardous"|"E-Waste"|"General Waste",
          "emoji": "emoji",
          "disposal_method": "1-2 sentence instruction",
          "tips": ["tip1", "tip2", "tip3"],
          "environmental_impact": "impact sentence",
          "eco_score": 1-10,
          "color": "green"|"teal"|"brown"|"red"|"blue"|"gray"
        }`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        // Robust JSON extraction
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        let parsedData;
        try {
            parsedData = JSON.parse(jsonMatch ? jsonMatch[0] : text);
        } catch (parseErr) {
            console.error('Gemini JSON Parse Error:', parseErr.message, 'Raw Text:', text);
            // Fallback to a structured error or mock
            parsedData = {
                item_name: item,
                category: "Analysis Pending",
                emoji: "🔍",
                disposal_method: "The AI is having trouble parsing the result. Please try again.",
                tips: ["Check your connection", "Try a simpler item name"],
                environmental_impact: "Analysis incomplete.",
                eco_score: 0,
                color: "gray"
            };
        }
        res.json(parsedData);
    } catch (err) {
        console.error('AI Analysis Error:', err.message);
        res.status(500).json({ error: 'AI Analysis failed. Please check your API key.' });
    }
});

const multer = require('multer');
const upload = multer({ 
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    storage: multer.memoryHost ? multer.memoryStorage() : multer.memoryStorage() 
});

// AI Analyze Image Endpoint (Multimodal)
router.post('/analyze/image', upload.single('image'), async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(400).json({ error: 'Gemini API Key missing' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No image provided' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const imageParts = [
            {
                inlineData: {
                    data: req.file.buffer.toString('base64'),
                    mimeType: req.file.mimetype
                }
            }
        ];

        const prompt = `Analyze this waste item from the image. 
        Reply ONLY in raw JSON:
        {
          "item_name": "identified item name",
          "category": "Recyclable"|"Compostable"|"Hazardous"|"E-Waste"|"General Waste",
          "emoji": "emoji",
          "disposal_method": "1-2 sentence instruction",
          "tips": ["tip1", "tip2", "tip3"],
          "environmental_impact": "impact sentence",
          "eco_score": 1-10,
          "color": "green"|"teal"|"brown"|"red"|"blue"|"gray"
        }`;

        const result = await model.generateContent([prompt, ...imageParts]);
        const text = result.response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        let parsedData;
        try {
            parsedData = JSON.parse(jsonMatch ? jsonMatch[0] : text);
        } catch (parseErr) {
            console.error('Gemini Vision JSON Parse Error:', parseErr.message, 'Raw Text:', text);
            throw new Error('Could not parse AI response');
        }

        res.json(parsedData);
    } catch (err) {
        console.error('Vision Analysis Error:', err.message);
        res.status(500).json({ error: 'Vision analysis failed' });
    }
});

module.exports = router;

