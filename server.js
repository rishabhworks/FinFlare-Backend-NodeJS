require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "https://finflare-front-end-react.vercel.app"],  
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chatbot", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: "Message is required!" });
  }
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a witty financial assistant for FinFlare, helping users with tax tips, credit card hacks, and money-saving tricks in a fun, engaging way."
        },
        { role: "user", content: userMessage },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });
    const botReply = completion.choices[0].message.content.trim();
    res.json({ reply: botReply });
  } catch (error) {
    console.error("OpenAI Error:", error.message);
    res.status(500).json({ error: "Oops, chatbot crashed—check API key or quota!" });
  }
});

const PORT = process.env.PORT || 10000;  // Use the default port Render assigns
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
