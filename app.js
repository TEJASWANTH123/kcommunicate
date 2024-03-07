const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/complete_chat', async (req, res) => {
    try {
        const { partial_text } = req.body;

        if (!partial_text) {
            return res.status(400).json({ error: "Missing 'partial_text' in the request body" });
        }

        const openaiResponse = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                model: 'gpt-3.5-turbo-instruct',
                prompt: partial_text,
                max_tokens: 1500
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        );

        const completed_text = openaiResponse.data.choices[0].text.trim();

        res.status(200).json({ completed_text });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
