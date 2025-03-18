require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { OpenAI } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
// mongoose.connect(process.env.MONGO_URI)
  //.then(() => console.log("Connected to MongoDB"))
  //.catch(err => console.error("MongoDB connection error:", err));

// Event Schema and Model
const eventSchema = new mongoose.Schema({
  name: String,
  description: String
});

const Event = mongoose.model("Event", eventSchema);

// Seed DB
async function seedDB() {
  await Event.deleteMany({});
  await Event.insertMany([
    { name: "Tax & Toasted", description: "A fun event about taxes!" },
    { name: "Tax Gambit", description: "Tax-themed bingo game." }
  ]);
  console.log("Sample events added!");
}

// seedDB();

// Get Events API
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// Initialize OpenAI with the new API key from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chatbot API
app.post("/chatbot", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required, bhai!" });
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
    res.status(500).json({ error: "Arre, chatbot thoda hang ho gaya—check API key ya quota!" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});