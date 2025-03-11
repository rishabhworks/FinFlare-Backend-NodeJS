const mongoose = require('mongoose');

// Define a schema for the User
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;  // Export the User model
