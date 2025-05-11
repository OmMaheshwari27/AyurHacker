const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route    POST api/users
// @desc     Register a user
// @access   Public
router.post('/', async (req, res) => {
  console.log('Registration request received with body:', JSON.stringify(req.body));
  
  // Check if request body is empty
  if (!req.body || Object.keys(req.body).length === 0) {
    console.error('Empty request body received');
    return res.status(400).json({ msg: 'No registration data provided' });
  }
  
  const { name, email, password, role } = req.body;

  // Validate input
  if (!name || !email || !password) {
    console.error('Missing required fields:', { name: !!name, email: !!email, password: !!password });
    return res.status(400).json({ msg: 'Please enter all required fields' });
  }

  try {
    console.log('Checking if user with email already exists:', email);
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('Registration failed: Email already exists:', email);
      return res.status(400).json({ msg: 'User already exists' });
    }

    console.log('Creating new user with role:', role || 'patient');
    
    user = new User({
      name,
      email,
      password,
      role: role || 'patient' // Default to patient if no role is provided
    });

    // Encrypt password
    console.log('Encrypting password');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    console.log('Saving user to database');
    await user.save();
    
    console.log('User registered successfully:', email);

    // Return JWT
    console.log('Generating JWT');
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    console.log('JWT Secret available:', !!process.env.JWT_SECRET);
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('JWT signing error:', err);
          return res.status(500).json({ msg: 'Error generating authentication token' });
        }
        console.log('JWT token generated successfully');
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Registration error details:', err);
    let errorMessage = 'Server error during registration';
    
    if (err.name === 'ValidationError') {
      console.error('Mongoose validation error:', err.message);
      errorMessage = 'Validation error: ' + err.message;
    } else if (err.code === 11000) {
      console.error('Duplicate key error:', err);
      errorMessage = 'User with this email already exists';
    }
    
    res.status(500).json({ msg: errorMessage });
  }
});

// @route    PUT api/users/profile
// @desc     Update user profile
// @access   Private
router.put('/profile', auth, async (req, res) => {
  const { name, profile } = req.body;
  
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    if (name) user.name = name;
    if (profile) user.profile = { ...user.profile, ...profile };
    
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/users/doctors
// @desc     Get all doctors
// @access   Public
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 