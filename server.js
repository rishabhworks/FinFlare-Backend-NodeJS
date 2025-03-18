require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { OpenAI } = require("openai");

const app = express();

// CORS Configuration
app.use(cors({
  origin: "https://finflare-front-end-react.vercel.app/", // Vercel frontend URL
  methods: ["GET", "POST"], // Allowed methods
  credentials: true // Agar cookies ya auth use karna ho
}));

app.use(express.json());

// MongoDB Connection
//mongoose.connect(process.env.MONGO_URI)
  //.then(() => console.log("Connected to MongoDB"))
 // .catch(err => console.error("MongoDB connection error:", err));

// OpenAI Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chatbot Endpoint
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
    console.error("Error in chatbot:", error.message);
    res.status(500).json({ error: "Oops, chatbot crashed—check API key or quota!" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});