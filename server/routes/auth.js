const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching user data for ID:', req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({ msg: 'User not found' });
    }
    
    console.log('User data fetched successfully');
    res.json(user);
  } catch (err) {
    console.error('Error fetching user data:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post('/', async (req, res) => {
  console.log('Login attempt received');
  
  // Validate request body
  if (!req.body || !req.body.email || !req.body.password) {
    console.log('Login failed: Missing email or password');
    return res.status(400).json({ msg: 'Please provide email and password' });
  }
  
  const { email, password } = req.body;

  try {
    // Check if user exists
    console.log('Checking if user exists:', email);
    let user = await User.findOne({ email });
    
    if (!user) {
      console.log('Login failed: User not found for email:', email);
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Check password
    console.log('Verifying password for user:', email);
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('Login failed: Invalid password for user:', email);
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('Server Error: JWT_SECRET not defined in environment variables');
      return res.status(500).json({ msg: 'Server configuration error' });
    }

    // Return JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    console.log('Generating token for user:', email, 'with role:', user.role);
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('Error generating token:', err.message);
          throw err;
        }
        console.log('Login successful for user:', email);
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Server error during login:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 