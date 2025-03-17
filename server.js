require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB using the MONGO_URI from .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define Event Schema
const eventSchema = new mongoose.Schema({
  name: String,
  description: String
});

const Event = mongoose.model("Event", eventSchema);

// Insert Sample Events (Run only once, then comment this out)
async function seedDB() {
    await Event.deleteMany({});  // Clears existing data
    await Event.insertMany([
      { name: "Tax & Toasted", description: "A fun event about taxes!" },
      { name: "Tax Gambit", description: "Tax-themed bingo game." }
    ]);
    console.log("Sample events added!");
}

// seedDB();

// API to Get Events
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// Chatbot API
app.post("/api/chatbot", async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }],
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Send chatbot response back to frontend
        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error in chatbot:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch chatbot response" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
