const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('🚀 Helios API is Live!');
});

app.post('/webhook', async (req, res) => {
  const { userId, promptType, customInput } = req.body;

  try {
    const prompt = `Create a ${promptType} for: ${customInput}`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are Helios, an AI marketing assistant.' },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const result = response.data.choices[0].message.content;
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'API error' });
  }
});

app.listen(port, () => {
  console.log(`Helios API listening on port ${port}`);
});
