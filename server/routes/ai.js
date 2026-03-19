const express = require('express');
const router = express.Router();
const https = require('https');

router.post('/analyze', async (req, res) => {
    const { item } = req.body;
    console.log(`[AI] Analyzing item: ${item}`);

    if (!item) {
        return res.status(400).json({ error: 'Item description is required' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
        console.warn('[AI] Anthropic API Key missing. Using fallback mock response.');
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

    const data = JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1000,
        messages: [{
            role: "user",
            content: `You are a smart waste management AI for CleanPulse platform.
Analyze this waste item: "${item}"
Reply ONLY in raw JSON, no markdown, no backticks:
{
  "item_name": "cleaned item name",
  "category": one of ["Recyclable","Compostable","Hazardous","E-Waste","General Waste"],
  "emoji": "relevant emoji",
  "disposal_method": "clear 1-2 sentence instruction",
  "tips": ["tip 1", "tip 2", "tip 3"],
  "environmental_impact": "1 sentence about why proper disposal matters",
  "eco_score": a number from 1 to 10 (10 = most eco-friendly),
  "color": one of ["green","teal","brown","red","blue","gray"]
}`
        }]
    });

    const options = {
        hostname: 'api.anthropic.com',
        port: 443,
        path: '/v1/messages',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        }
    };

    const anthropicReq = https.request(options, (anthropicRes) => {
        let responseData = '';

        anthropicRes.on('data', (chunk) => {
            responseData += chunk;
        });

        anthropicRes.on('end', () => {
            try {
                const parsedData = JSON.parse(responseData);
                if (anthropicRes.statusCode !== 200) {
                    throw new Error(parsedData.error?.message || 'Anthropic API error');
                }

                if (!parsedData.content || !parsedData.content[0] || !parsedData.content[0].text) {
                    throw new Error("Guardian response silent or invalid");
                }

                let text = parsedData.content[0].text;
                // Robust JSON extraction
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    throw new Error("No JSON found in AI response");
                }

                res.json(JSON.parse(jsonMatch[0]));
            } catch (err) {
                console.error('AI Processing Error:', err.message);
                res.status(500).json({ error: err.message });
            }
        });
    });

    anthropicReq.on('error', (err) => {
        console.error('HTTPS Error:', err.message);
        res.status(500).json({ error: 'Communication with AI Guardian failed' });
    });

    anthropicReq.write(data);
    anthropicReq.end();
});

module.exports = router;
