const mongoose = require('mongoose');
const User = require('./models/User');  // Import the User model

// Connection URI
const dbURI = 'mongodb://localhost:27017/finflare';  // Adjust if needed

// Connect to MongoDB
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Create a new user
    const createUser = async () => {
      const newUser = new User({
        name: 'John Doe',
        email: 'johndoe@example.com',
        age: 30,
      });

      try {
        const savedUser = await newUser.save();
        console.log('User saved:', savedUser);
      } catch (err) {
        console.error('Error saving user:', err);
      }
    };

    createUser();  // Call the function to create a user
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err);
  });
