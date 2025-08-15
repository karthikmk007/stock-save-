const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock transaction database (replace with actual database)
let transactions = [
  {
    id: '1',
    userId: '1',
    type: 'roundup',
    merchant: 'Starbucks',
    amount: 2.75,
    saved: 0.25,
    status: 'completed',
    date: '2024-01-15',
    time: '09:30:00',
    paymentMethod: 'apple_pay',
    createdAt: new Date('2024-01-15T09:30:00Z'),
    updatedAt: new Date('2024-01-15T09:30:00Z')
  },
  {
    id: '2',
    userId: '1',
    type: 'roundup',
    merchant: 'Amazon',
    amount: 12.10,
    saved: 0.90,
    status: 'completed',
    date: '2024-01-14',
    time: '14:15:00',
    paymentMethod: 'credit_card',
    createdAt: new Date('2024-01-14T14:15:00Z'),
    updatedAt: new Date('2024-01-14T14:15:00Z')
  }
];

// Mock user database for updates
let users = [
  {
    id: '1',
    totalSaved: 12.75,
    totalInvested: 10.00,
    upcomingInvestment: 2.75
  }
];

// Validation middleware
const validateTransaction = [
  body('merchant').trim().notEmpty().withMessage('Merchant name is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('paymentMethod').isIn(['apple_pay', 'google_pay', 'credit_card', 'debit_card']).withMessage('Invalid payment method'),
  body('currency').optional().isIn(['USD', 'CAD', 'INR']).withMessage('Invalid currency')
];

// Calculate round-up amount
const calculateRoundUp = (amount) => {
  const roundedAmount = Math.ceil(amount);
  return parseFloat((roundedAmount - amount).toFixed(2));
};

// @route   POST /api/transactions/roundup
// @desc    Process a round-up transaction
// @access  Private
router.post('/roundup', validateTransaction, async (req, res) => {
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

    const { merchant, amount, paymentMethod, currency = 'USD', userId = '1' } = req.body;

    // Calculate round-up amount
    const saved = calculateRoundUp(amount);
    
    // Create transaction record
    const transaction = {
      id: (transactions.length + 1).toString(),
      userId,
      type: 'roundup',
      merchant,
      amount: parseFloat(amount),
      saved,
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0],
      paymentMethod,
      currency,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to transactions
    transactions.push(transaction);

    // Update user's total saved amount
    const user = users.find(u => u.id === userId);
    if (user) {
      user.totalSaved += saved;
      user.upcomingInvestment += saved;
      user.updatedAt = new Date();
    }

    res.status(201).json({
      success: true,
      message: 'Round-up transaction processed successfully',
      data: {
        transaction,
        roundUpAmount: saved,
        totalSaved: user ? user.totalSaved : 0,
        upcomingInvestment: user ? user.upcomingInvestment : 0
      }
    });

  } catch (error) {
    console.error('Round-up transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/transactions/webhook
// @desc    Webhook endpoint for payment providers (GPay, Apple Pay, etc.)
// @access  Public
router.post('/webhook', async (req, res) => {
  try {
    const { 
      event_type, 
      transaction_id, 
      merchant, 
      amount, 
      currency, 
      payment_method,
      user_id 
    } = req.body;

    // Verify webhook signature in production
    // const signature = req.headers['x-webhook-signature'];
    // if (!verifyWebhookSignature(signature, req.body)) {
    //   return res.status(401).json({ success: false, message: 'Invalid signature' });
    // }

    if (event_type === 'transaction.completed') {
      // Process round-up
      const saved = calculateRoundUp(amount);
      
      const transaction = {
        id: (transactions.length + 1).toString(),
        userId: user_id || '1',
        type: 'roundup',
        merchant,
        amount: parseFloat(amount),
        saved,
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        paymentMethod: payment_method,
        currency: currency || 'USD',
        externalTransactionId: transaction_id,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      transactions.push(transaction);

      // Update user stats
      const user = users.find(u => u.id === (user_id || '1'));
      if (user) {
        user.totalSaved += saved;
        user.upcomingInvestment += saved;
        user.updatedAt = new Date();
      }

      console.log(`Webhook processed: ${merchant} - $${amount} → Saved $${saved}`);
    }

    res.json({ success: true, message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/transactions/user/:userId
// @desc    Get user's transaction history
// @access  Private
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, limit = 50, offset = 0 } = req.query;

    let userTransactions = transactions.filter(t => t.userId === userId);

    // Filter by type if specified
    if (type && type !== 'all') {
      userTransactions = userTransactions.filter(t => t.type === type);
    }

    // Sort by date (newest first)
    userTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply pagination
    const paginatedTransactions = userTransactions.slice(offset, offset + parseInt(limit));

    // Calculate totals
    const totalRoundUps = userTransactions.filter(t => t.type === 'roundup').reduce((sum, t) => sum + t.saved, 0);
    const totalInvestments = userTransactions.filter(t => t.type === 'investment').reduce((sum, t) => sum + t.amount, 0);

    res.json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: {
        transactions: paginatedTransactions,
        pagination: {
          total: userTransactions.length,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: offset + parseInt(limit) < userTransactions.length
        },
        summary: {
          totalRoundUps,
          totalInvestments,
          totalTransactions: userTransactions.length
        }
      }
    });

  } catch (error) {
    console.error('Get user transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/transactions/:id
// @desc    Get specific transaction details
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = transactions.find(t => t.id === id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      message: 'Transaction retrieved successfully',
      data: { transaction }
    });

  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/transactions/:id/status
// @desc    Update transaction status
// @access  Private
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const transaction = transactions.find(t => t.id === id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    transaction.status = status;
    transaction.updatedAt = new Date();

    res.json({
      success: true,
      message: 'Transaction status updated successfully',
      data: { transaction }
    });

  } catch (error) {
    console.error('Update transaction status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction (admin only)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const transactionIndex = transactions.findIndex(t => t.id === id);

    if (transactionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    const deletedTransaction = transactions.splice(transactionIndex, 1)[0];

    res.json({
      success: true,
      message: 'Transaction deleted successfully',
      data: { deletedTransaction }
    });

  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 