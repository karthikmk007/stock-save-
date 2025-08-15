const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock user database (replace with actual database)
let users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    totalSaved: 12.75,
    totalInvested: 10.00,
    upcomingInvestment: 2.75,
    currency: 'USD',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Validation middleware
const validateSignup = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('currency').isIn(['USD', 'CAD', 'INR']).withMessage('Invalid currency')
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', validateSignup, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, currency = 'USD' } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      password: hashedPassword,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0ea5e9&color=fff&size=150`,
      totalSaved: 0,
      totalInvested: 0,
      upcomingInvestment: 0,
      currency,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userWithoutPassword,
        token
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/auth/oauth/google
// @desc    Google OAuth authentication
// @access  Public
router.post('/oauth/google', async (req, res) => {
  try {
    const { token, userData } = req.body;

    // In a real implementation, you would verify the Google token
    // and extract user information from it
    
    // For now, we'll use the provided userData
    if (!userData || !userData.email) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google OAuth data'
      });
    }

    // Check if user exists
    let user = users.find(u => u.email === userData.email);
    
    if (!user) {
      // Create new user from Google data
      user = {
        id: (users.length + 1).toString(),
        name: userData.name || userData.email.split('@')[0],
        email: userData.email,
        password: '', // No password for OAuth users
        avatar: userData.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=0ea5e9&color=fff&size=150`,
        totalSaved: 0,
        totalInvested: 0,
        upcomingInvestment: 0,
        currency: 'USD',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      users.push(user);
    }

    // Generate token
    const jwtToken = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Google OAuth successful',
      data: {
        user: userWithoutPassword,
        token: jwtToken
      }
    });

  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/auth/oauth/apple
// @desc    Apple OAuth authentication
// @access  Public
router.post('/oauth/apple', async (req, res) => {
  try {
    const { token, userData } = req.body;

    // In a real implementation, you would verify the Apple token
    
    if (!userData || !userData.email) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Apple OAuth data'
      });
    }

    // Check if user exists
    let user = users.find(u => u.email === userData.email);
    
    if (!user) {
      // Create new user from Apple data
      user = {
        id: (users.length + 1).toString(),
        name: userData.name || userData.email.split('@')[0],
        email: userData.email,
        password: '', // No password for OAuth users
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || userData.email.split('@')[0])}&background=0ea5e9&color=fff&size=150`,
        totalSaved: 0,
        totalInvested: 0,
        upcomingInvestment: 0,
        currency: 'USD',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      users.push(user);
    }

    // Generate token
    const jwtToken = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Apple OAuth successful',
      data: {
        user: userWithoutPassword,
        token: jwtToken
      }
    });

  } catch (error) {
    console.error('Apple OAuth error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', async (req, res) => {
  try {
    // In a real implementation, you would verify the JWT token
    // and get the user from the database
    
    // For now, we'll return a mock response
    res.json({
      success: true,
      message: 'User info retrieved successfully',
      data: {
        user: users[0] // Return first user for demo
      }
    });

  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 