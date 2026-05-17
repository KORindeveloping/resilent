const express = require('express');
const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Connect to local/remote Ollama API
    const ollamaUrl = 'http://127.0.0.1:11434/api/chat';
    
    const payload = {
      model: 'gemma3:4b',
      messages: [{ role: 'user', content: message }],
      stream: false
    };

    const response = await fetch(ollamaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    // Return only the assistant response text
    if (data && data.message && data.message.content) {
      return res.json({ response: data.message.content });
    } else {
      throw new Error('Unexpected response format from Ollama');
    }

  } catch (error) {
    console.error('AI Chat Error:', error.message || error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

module.exports = router;
