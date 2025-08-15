const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock investment database (replace with actual database)
let investments = [
  {
    id: '1',
    userId: '1',
    stockSymbol: 'AAPL',
    stockName: 'Apple Inc.',
    shares: 0.5,
    amount: 10.00,
    currency: 'USD',
    country: 'US',
    purchasePrice: 20.00,
    currentPrice: 20.20,
    status: 'active',
    purchaseDate: '2024-01-13',
    createdAt: new Date('2024-01-13T10:00:00Z'),
    updatedAt: new Date('2024-01-13T10:00:00Z')
  },
  {
    id: '2',
    userId: '1',
    stockSymbol: 'TSLA',
    stockName: 'Tesla Inc.',
    shares: 0.3,
    amount: 7.50,
    currency: 'USD',
    country: 'US',
    purchasePrice: 25.00,
    currentPrice: 24.70,
    status: 'active',
    purchaseDate: '2024-01-12',
    createdAt: new Date('2024-01-12T15:30:00Z'),
    updatedAt: new Date('2024-01-12T15:30:00Z')
  },
  {
    id: '3',
    userId: '1',
    stockSymbol: 'INFY',
    stockName: 'Infosys Ltd.',
    shares: 0.2,
    amount: 8.00,
    currency: 'INR',
    country: 'IN',
    purchasePrice: 400.00,
    currentPrice: 402.00,
    status: 'active',
    purchaseDate: '2024-01-11',
    createdAt: new Date('2024-01-11T09:15:00Z'),
    updatedAt: new Date('2024-01-11T09:15:00Z')
  }
];

// Mock user database for updates
let users = [
  {
    id: '1',
    totalSaved: 12.75,
    totalInvested: 10.00,
    upcomingInvestment: 2.75,
    currency: 'USD'
  }
];

// Mock stock data (replace with real stock API)
const stockData = {
  'AAPL': { name: 'Apple Inc.', price: 20.20, currency: 'USD', country: 'US' },
  'TSLA': { name: 'Tesla Inc.', price: 24.70, currency: 'USD', country: 'US' },
  'INFY': { name: 'Infosys Ltd.', price: 402.00, currency: 'INR', country: 'IN' },
  'GOOGL': { name: 'Alphabet Inc.', price: 150.00, currency: 'USD', country: 'US' },
  'MSFT': { name: 'Microsoft Corporation', price: 380.00, currency: 'USD', country: 'US' }
};

// Validation middleware
const validateInvestment = [
  body('stockSymbol').trim().notEmpty().withMessage('Stock symbol is required'),
  body('amount').isFloat({ min: 5, max: 1000 }).withMessage('Amount must be between $5 and $1000'),
  body('currency').isIn(['USD', 'CAD', 'INR']).withMessage('Invalid currency')
];

// Calculate shares based on amount and price
const calculateShares = (amount, price) => {
  return parseFloat((amount / price).toFixed(4));
};

// Convert currency (mock implementation - replace with real API)
const convertCurrency = (amount, fromCurrency, toCurrency) => {
  const rates = {
    'USD_TO_INR': 83.0,
    'CAD_TO_INR': 61.0,
    'USD_TO_CAD': 1.35
  };

  if (fromCurrency === 'USD' && toCurrency === 'INR') {
    return amount * rates.USD_TO_INR;
  } else if (fromCurrency === 'CAD' && toCurrency === 'INR') {
    return amount * rates.CAD_TO_INR;
  } else if (fromCurrency === 'USD' && toCurrency === 'CAD') {
    return amount * rates.USD_TO_CAD;
  }

  return amount; // Same currency
};

// @route   POST /api/investments/purchase
// @desc    Purchase stocks with saved amount
// @access  Private
router.post('/purchase', validateInvestment, async (req, res) => {
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

    const { stockSymbol, amount, currency = 'USD', userId = '1' } = req.body;

    // Check if stock exists
    const stock = stockData[stockSymbol];
    if (!stock) {
      return res.status(400).json({
        success: false,
        message: 'Stock not found'
      });
    }

    // Check if user has enough saved amount
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.upcomingInvestment < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient saved amount for investment'
      });
    }

    // Convert currency if needed
    let investmentAmount = amount;
    let investmentCurrency = currency;
    
    if (stock.country === 'IN' && currency !== 'INR') {
      investmentAmount = convertCurrency(amount, currency, 'INR');
      investmentCurrency = 'INR';
    }

    // Calculate shares
    const shares = calculateShares(investmentAmount, stock.price);

    // Create investment record
    const investment = {
      id: (investments.length + 1).toString(),
      userId,
      stockSymbol,
      stockName: stock.name,
      shares,
      amount: investmentAmount,
      currency: investmentCurrency,
      country: stock.country,
      purchasePrice: stock.price,
      currentPrice: stock.price,
      status: 'active',
      purchaseDate: new Date().toISOString().split('T')[0],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to investments
    investments.push(investment);

    // Update user stats
    user.totalInvested += amount;
    user.upcomingInvestment -= amount;
    user.updatedAt = new Date();

    res.status(201).json({
      success: true,
      message: 'Investment successful',
      data: {
        investment,
        shares,
        totalInvested: user.totalInvested,
        upcomingInvestment: user.upcomingInvestment
      }
    });

  } catch (error) {
    console.error('Investment purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/investments/auto-invest
// @desc    Automatically invest when threshold is reached
// @access  Private
router.post('/auto-invest', async (req, res) => {
  try {
    const { userId = '1' } = req.body;

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has enough saved amount
    if (user.upcomingInvestment < user.investmentThreshold) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient saved amount for auto-investment'
      });
    }

    // Get available stocks based on user preferences
    const availableStocks = Object.entries(stockData).filter(([symbol, stock]) => {
      if (user.currency === 'USD' && stock.country === 'US') return true;
      if (user.currency === 'INR' && stock.country === 'IN') return true;
      return false;
    });

    if (availableStocks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No suitable stocks available for investment'
      });
    }

    // Select stock (simple round-robin for demo)
    const stockIndex = Math.floor(Math.random() * availableStocks.length);
    const [stockSymbol, stock] = availableStocks[stockIndex];

    // Calculate investment amount
    const investmentAmount = Math.min(user.upcomingInvestment, user.investmentThreshold);
    const shares = calculateShares(investmentAmount, stock.price);

    // Create investment record
    const investment = {
      id: (investments.length + 1).toString(),
      userId,
      stockSymbol,
      stockName: stock.name,
      shares,
      amount: investmentAmount,
      currency: stock.currency,
      country: stock.country,
      purchasePrice: stock.price,
      currentPrice: stock.price,
      status: 'active',
      purchaseDate: new Date().toISOString().split('T')[0],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to investments
    investments.push(investment);

    // Update user stats
    user.totalInvested += investmentAmount;
    user.upcomingInvestment -= investmentAmount;
    user.updatedAt = new Date();

    res.json({
      success: true,
      message: 'Auto-investment successful',
      data: {
        investment,
        shares,
        totalInvested: user.totalInvested,
        upcomingInvestment: user.upcomingInvestment
      }
    });

  } catch (error) {
    console.error('Auto-investment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/investments/user/:userId
// @desc    Get user's investment portfolio
// @access  Private
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status = 'all' } = req.query;

    let userInvestments = investments.filter(i => i.userId === userId);

    // Filter by status if specified
    if (status !== 'all') {
      userInvestments = userInvestments.filter(i => i.status === status);
    }

    // Sort by purchase date (newest first)
    userInvestments.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));

    // Calculate portfolio summary
    const portfolioSummary = {
      totalInvested: userInvestments.reduce((sum, i) => sum + i.amount, 0),
      totalValue: userInvestments.reduce((sum, i) => sum + (i.shares * i.currentPrice), 0),
      totalGainLoss: userInvestments.reduce((sum, i) => {
        const currentValue = i.shares * i.currentPrice;
        const purchaseValue = i.shares * i.purchasePrice;
        return sum + (currentValue - purchaseValue);
      }, 0),
      totalGainLossPercent: 0,
      investmentCount: userInvestments.length
    };

    if (portfolioSummary.totalInvested > 0) {
      portfolioSummary.totalGainLossPercent = ((portfolioSummary.totalGainLoss / portfolioSummary.totalInvested) * 100).toFixed(2);
    }

    res.json({
      success: true,
      message: 'Portfolio retrieved successfully',
      data: {
        investments: userInvestments,
        summary: portfolioSummary
      }
    });

  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/investments/:id
// @desc    Get specific investment details
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const investment = investments.find(i => i.id === id);

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }

    res.json({
      success: true,
      message: 'Investment retrieved successfully',
      data: { investment }
    });

  } catch (error) {
    console.error('Get investment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/investments/:id/sell
// @desc    Sell investment
// @access  Private
router.put('/:id/sell', async (req, res) => {
  try {
    const { id } = req.params;
    const { sellPrice, sellShares } = req.body;

    const investment = investments.find(i => i.id === id);
    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }

    if (sellShares > investment.shares) {
      return res.status(400).json({
        success: false,
        message: 'Cannot sell more shares than owned'
      });
    }

    // Calculate sale proceeds
    const saleAmount = sellShares * sellPrice;
    const gainLoss = saleAmount - (sellShares * investment.purchasePrice);

    // Update investment
    investment.shares -= sellShares;
    investment.updatedAt = new Date();

    if (investment.shares === 0) {
      investment.status = 'sold';
    }

    res.json({
      success: true,
      message: 'Investment sold successfully',
      data: {
        investment,
        saleAmount,
        gainLoss,
        remainingShares: investment.shares
      }
    });

  } catch (error) {
    console.error('Sell investment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/investments/stocks/available
// @desc    Get available stocks for investment
// @access  Public
router.get('/stocks/available', async (req, res) => {
  try {
    const { currency = 'USD', country } = req.query;

    let availableStocks = Object.entries(stockData);

    // Filter by currency/country if specified
    if (currency) {
      availableStocks = availableStocks.filter(([symbol, stock]) => stock.currency === currency);
    }

    if (country) {
      availableStocks = availableStocks.filter(([symbol, stock]) => stock.country === country);
    }

    const stocks = availableStocks.map(([symbol, stock]) => ({
      symbol,
      name: stock.name,
      price: stock.price,
      currency: stock.currency,
      country: stock.country
    }));

    res.json({
      success: true,
      message: 'Available stocks retrieved successfully',
      data: { stocks }
    });

  } catch (error) {
    console.error('Get available stocks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 