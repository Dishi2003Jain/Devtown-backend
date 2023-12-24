const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
require('dotenv').config();
// User signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  
  }
});

router.post('/logout', (req, res) => {
  // Assuming you are using JWT for token-based authentication
  // Clear the token by setting it to null or an empty string on the client-side
  // For example, clearing a token stored in cookies:
  res.clearCookie('token'); // Clear the token cookie

  // Alternatively, if using local storage:
  // res.clearCookie('token').send(); // Clear the token and send an empty response

  // Respond with a success message
  res.status(200).json({ message: 'Logout successful' });
});
module.exports = router;
