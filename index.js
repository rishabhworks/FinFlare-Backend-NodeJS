// index.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // Import mongoose
const Event = require("./models/Event"); // Import the Event model

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection setup with Mongoose
const mongoURI = "mongodb://localhost:27017/finflare"; // Use your database URL
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB using Mongoose!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB with Mongoose", err);
  });

// Define routes
app.get("/", (req, res) => {
  res.send("FinFlare Backend Running!");
});

// Get events from MongoDB using Mongoose
app.get("/api/events", (req, res) => {
  Event.find() // Mongoose query
    .then((events) => {
      res.json(events);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to fetch events", details: err });
    });
});

// Add an event to MongoDB using Mongoose
app.post("/api/events", (req, res) => {
  const newEvent = new Event(req.body);

  newEvent.save() // Save the new event using Mongoose
    .then(() => {
      res.status(201).json({ message: "Event added!" });
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to add event", details: err });
    });
});

// Set up the server to listen on a port
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
