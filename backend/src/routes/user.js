const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock user database (replace with actual database)
let users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    totalSaved: 12.75,
    totalInvested: 10.00,
    upcomingInvestment: 2.75,
    currency: 'USD',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-01-15',
    riskTolerance: 'Moderate',
    autoInvest: true,
    roundUpEnabled: true,
    investmentThreshold: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Validation middleware
const validateProfileUpdate = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('phone').optional().matches(/^\+?[\d\s\-\(\)]+$/).withMessage('Invalid phone number format'),
  body('currency').optional().isIn(['USD', 'CAD', 'INR']).withMessage('Invalid currency'),
  body('riskTolerance').optional().isIn(['Conservative', 'Moderate', 'Aggressive']).withMessage('Invalid risk tolerance'),
  body('investmentThreshold').optional().isFloat({ min: 5, max: 100 }).withMessage('Investment threshold must be between $5 and $100')
];

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    // In a real implementation, you would get the user ID from the JWT token
    const userId = req.query.userId || '1';
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove sensitive information
    const { password, ...userProfile } = user;

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: { user: userProfile }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', validateProfileUpdate, async (req, res) => {
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

    const userId = req.body.userId || '1';
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update allowed fields
    const allowedFields = [
      'name', 'phone', 'currency', 'riskTolerance', 
      'autoInvest', 'roundUpEnabled', 'investmentThreshold'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    user.updatedAt = new Date();

    // Remove sensitive information
    const { password, ...userProfile } = user;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: userProfile }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/user/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', async (req, res) => {
  try {
    const userId = req.body.userId || '1';
    const { 
      roundUpEnabled, 
      autoInvest, 
      investmentThreshold, 
      riskTolerance,
      notifications 
    } = req.body;

    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update preferences
    if (roundUpEnabled !== undefined) user.roundUpEnabled = roundUpEnabled;
    if (autoInvest !== undefined) user.autoInvest = autoInvest;
    if (investmentThreshold !== undefined) user.investmentThreshold = investmentThreshold;
    if (riskTolerance !== undefined) user.riskTolerance = riskTolerance;
    if (notifications !== undefined) user.notifications = notifications;

    user.updatedAt = new Date();

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: { 
        roundUpEnabled: user.roundUpEnabled,
        autoInvest: user.autoInvest,
        investmentThreshold: user.investmentThreshold,
        riskTolerance: user.riskTolerance,
        notifications: user.notifications
      }
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/user/stats
// @desc    Get user statistics and summary
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const userId = req.query.userId || '1';
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate additional stats
    const stats = {
      totalSaved: user.totalSaved,
      totalInvested: user.totalInvested,
      upcomingInvestment: user.upcomingInvestment,
      savingsRate: user.totalSaved > 0 ? ((user.totalSaved / (user.totalSaved + user.totalInvested)) * 100).toFixed(1) : 0,
      investmentProgress: user.investmentThreshold > 0 ? ((user.upcomingInvestment / user.investmentThreshold) * 100).toFixed(1) : 0,
      daysToNextInvestment: user.upcomingInvestment >= user.investmentThreshold ? 0 : 
        Math.ceil((user.investmentThreshold - user.upcomingInvestment) / 0.25), // Assuming average $0.25 per day
      currency: user.currency
    };

    res.json({
      success: true,
      message: 'User stats retrieved successfully',
      data: { stats }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/user/avatar
// @desc    Update user avatar
// @access  Private
router.post('/avatar', async (req, res) => {
  try {
    const userId = req.body.userId || '1';
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({
        success: false,
        message: 'Avatar URL is required'
      });
    }

    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.avatar = avatarUrl;
    user.updatedAt = new Date();

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      data: { avatar: avatarUrl }
    });

  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   DELETE /api/user/account
// @desc    Delete user account
// @access  Private
router.delete('/account', async (req, res) => {
  try {
    const userId = req.body.userId || '1';
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account'
      });
    }

    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // In a real implementation, you would verify the password
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Invalid password'
    //   });
    // }

    // Remove user
    const deletedUser = users.splice(userIndex, 1)[0];

    res.json({
      success: true,
      message: 'Account deleted successfully',
      data: { userId }
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 