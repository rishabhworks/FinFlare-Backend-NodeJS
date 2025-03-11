require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

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

  //seedDB();
// API to Get Events
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
