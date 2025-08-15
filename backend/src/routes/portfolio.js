const express = require('express');
const router = express.Router();

// Mock data (replace with actual database queries)
const mockPortfolioData = {
  '1': {
    userId: '1',
    totalValue: 25.50,
    totalInvested: 25.50,
    totalGainLoss: 0.50,
    totalGainLossPercent: 2.0,
    currency: 'USD',
    lastUpdated: new Date()
  }
};

const mockHoldings = [
  {
    id: '1',
    userId: '1',
    stockSymbol: 'AAPL',
    stockName: 'Apple Inc.',
    shares: 0.5,
    value: 10.10,
    gainLoss: 0.10,
    gainLossPercent: 1.0,
    weight: 39.6,
    currency: 'USD',
    country: 'US'
  },
  {
    id: '2',
    userId: '1',
    stockSymbol: 'TSLA',
    stockName: 'Tesla Inc.',
    shares: 0.3,
    value: 7.41,
    gainLoss: -0.09,
    gainLossPercent: -1.2,
    weight: 29.1,
    currency: 'USD',
    country: 'US'
  },
  {
    id: '3',
    userId: '1',
    stockSymbol: 'INFY',
    stockName: 'Infosys Ltd.',
    shares: 0.2,
    value: 8.04,
    gainLoss: 0.04,
    gainLossPercent: 0.5,
    weight: 31.5,
    currency: 'INR',
    country: 'IN'
  }
];

const mockPerformanceData = [
  { date: '2024-01-01', value: 20.00, change: 0 },
  { date: '2024-01-02', value: 20.25, change: 1.25 },
  { date: '2024-01-03', value: 20.50, change: 1.23 },
  { date: '2024-01-04', value: 20.75, change: 1.22 },
  { date: '2024-01-05', value: 21.00, change: 1.20 },
  { date: '2024-01-06', value: 21.25, change: 1.19 },
  { date: '2024-01-07', value: 21.50, change: 1.18 },
  { date: '2024-01-08', value: 21.75, change: 1.16 },
  { date: '2024-01-09', value: 22.00, change: 1.15 },
  { date: '2024-01-10', value: 22.25, change: 1.14 },
  { date: '2024-01-11', value: 22.50, change: 1.12 },
  { date: '2024-01-12', value: 22.75, change: 1.11 },
  { date: '2024-01-13', value: 23.00, change: 1.10 },
  { date: '2024-01-14', value: 23.25, change: 1.09 },
  { date: '2024-01-15', value: 23.50, change: 1.07 }
];

// @route   GET /api/portfolio/summary/:userId
// @desc    Get portfolio summary and overview
// @access  Private
router.get('/summary/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const portfolio = mockPortfolioData[userId];

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    // Calculate additional metrics
    const summary = {
      ...portfolio,
      holdings: mockHoldings.filter(h => h.userId === userId),
      performance: {
        daily: mockPerformanceData[mockPerformanceData.length - 1]?.change || 0,
        weekly: mockPerformanceData.slice(-7).reduce((sum, d) => sum + d.change, 0),
        monthly: mockPerformanceData.slice(-30).reduce((sum, d) => sum + d.change, 0)
      },
      allocation: {
        byCountry: {
          'US': mockHoldings.filter(h => h.country === 'US').reduce((sum, h) => sum + h.weight, 0),
          'IN': mockHoldings.filter(h => h.country === 'IN').reduce((sum, h) => sum + h.weight, 0)
        },
        byCurrency: {
          'USD': mockHoldings.filter(h => h.currency === 'USD').reduce((sum, h) => sum + h.weight, 0),
          'INR': mockHoldings.filter(h => h.currency === 'INR').reduce((sum, h) => sum + h.weight, 0)
        }
      }
    };

    res.json({
      success: true,
      message: 'Portfolio summary retrieved successfully',
      data: { summary }
    });

  } catch (error) {
    console.error('Get portfolio summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/portfolio/holdings/:userId
// @desc    Get detailed portfolio holdings
// @access  Private
router.get('/holdings/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { sortBy = 'value', sortOrder = 'desc' } = req.query;

    let holdings = mockHoldings.filter(h => h.userId === userId);

    // Sort holdings
    holdings.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    // Calculate totals
    const totals = {
      totalValue: holdings.reduce((sum, h) => sum + h.value, 0),
      totalGainLoss: holdings.reduce((sum, h) => sum + h.gainLoss, 0),
      totalGainLossPercent: 0,
      totalWeight: holdings.reduce((sum, h) => sum + h.weight, 0)
    };

    if (totals.totalValue > 0) {
      totals.totalGainLossPercent = ((totals.totalGainLoss / (totals.totalValue - totals.totalGainLoss)) * 100).toFixed(2);
    }

    res.json({
      success: true,
      message: 'Portfolio holdings retrieved successfully',
      data: {
        holdings,
        totals,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error('Get portfolio holdings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/portfolio/performance/:userId
// @desc    Get portfolio performance data
// @access  Private
router.get('/performance/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = '30d' } = req.query;

    // Filter data based on period
    let performanceData = [...mockPerformanceData];
    
    if (period === '7d') {
      performanceData = mockPerformanceData.slice(-7);
    } else if (period === '14d') {
      performanceData = mockPerformanceData.slice(-14);
    } else if (period === '30d') {
      performanceData = mockPerformanceData.slice(-30);
    }

    // Calculate performance metrics
    const startValue = performanceData[0]?.value || 0;
    const endValue = performanceData[performanceData.length - 1]?.value || 0;
    const totalChange = endValue - startValue;
    const totalChangePercent = startValue > 0 ? ((totalChange / startValue) * 100).toFixed(2) : 0;

    // Calculate volatility (standard deviation of daily returns)
    const dailyReturns = performanceData.slice(1).map((d, i) => {
      const prevValue = performanceData[i]?.value || d.value;
      return ((d.value - prevValue) / prevValue) * 100;
    });

    const avgReturn = dailyReturns.reduce((sum, r) => sum + r, 0) / dailyReturns.length;
    const variance = dailyReturns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / dailyReturns.length;
    const volatility = Math.sqrt(variance).toFixed(2);

    res.json({
      success: true,
      message: 'Portfolio performance retrieved successfully',
      data: {
        performance: performanceData,
        metrics: {
          totalChange,
          totalChangePercent,
          volatility,
          period,
          startValue,
          endValue
        }
      }
    });

  } catch (error) {
    console.error('Get portfolio performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/portfolio/allocation/:userId
// @desc    Get portfolio allocation breakdown
// @access  Private
router.get('/allocation/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const holdings = mockHoldings.filter(h => h.userId === userId);

    // Calculate allocations
    const allocation = {
      byCountry: {},
      byCurrency: {},
      bySector: {},
      byMarketCap: {}
    };

    holdings.forEach(holding => {
      // By country
      if (!allocation.byCountry[holding.country]) {
        allocation.byCountry[holding.country] = 0;
      }
      allocation.byCountry[holding.country] += holding.weight;

      // By currency
      if (!allocation.byCurrency[holding.currency]) {
        allocation.byCurrency[holding.currency] = 0;
      }
      allocation.byCurrency[holding.currency] += holding.weight;

      // By sector (mock data)
      const sector = getSectorBySymbol(holding.stockSymbol);
      if (!allocation.bySector[sector]) {
        allocation.bySector[sector] = 0;
      }
      allocation.bySector[sector] += holding.weight;

      // By market cap (mock data)
      const marketCap = getMarketCapBySymbol(holding.stockSymbol);
      if (!allocation.byMarketCap[marketCap]) {
        allocation.byMarketCap[marketCap] = 0;
      }
      allocation.byMarketCap[marketCap] += holding.weight;
    });

    // Convert to arrays for charting
    const allocationData = {
      byCountry: Object.entries(allocation.byCountry).map(([key, value]) => ({ name: key, value })),
      byCurrency: Object.entries(allocation.byCurrency).map(([key, value]) => ({ name: key, value })),
      bySector: Object.entries(allocation.bySector).map(([key, value]) => ({ name: key, value })),
      byMarketCap: Object.entries(allocation.byMarketCap).map(([key, value]) => ({ name: key, value }))
    };

    res.json({
      success: true,
      message: 'Portfolio allocation retrieved successfully',
      data: { allocation: allocationData }
    });

  } catch (error) {
    console.error('Get portfolio allocation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/portfolio/projections/:userId
// @desc    Get portfolio future projections
// @access  Private
router.get('/projections/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { years = 5 } = req.query;

    const portfolio = mockPortfolioData[userId];
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    // Calculate projections based on historical performance
    const currentValue = portfolio.totalValue;
    const annualReturn = 0.08; // 8% annual return assumption
    const monthlyReturn = Math.pow(1 + annualReturn, 1/12) - 1;

    const projections = [];
    for (let i = 0; i <= years * 12; i++) {
      const projectedValue = currentValue * Math.pow(1 + monthlyReturn, i);
      const month = i;
      const year = Math.floor(month / 12);
      
      projections.push({
        month,
        year,
        projectedValue: parseFloat(projectedValue.toFixed(2)),
        cumulativeReturn: parseFloat(((projectedValue / currentValue - 1) * 100).toFixed(2))
      });
    }

    // Calculate milestones
    const milestones = [
      { target: 50, label: '$50' },
      { target: 100, label: '$100' },
      { target: 250, label: '$250' },
      { target: 500, label: '$500' },
      { target: 1000, label: '$1,000' }
    ];

    const milestoneProjections = milestones.map(milestone => {
      const monthsToReach = Math.log(milestone.target / currentValue) / Math.log(1 + monthlyReturn);
      const yearsToReach = monthsToReach / 12;
      
      return {
        target: milestone.target,
        label: milestone.label,
        monthsToReach: Math.ceil(monthsToReach),
        yearsToReach: parseFloat(yearsToReach.toFixed(1)),
        achievable: monthsToReach > 0
      };
    });

    res.json({
      success: true,
      message: 'Portfolio projections retrieved successfully',
      data: {
        projections,
        milestones: milestoneProjections,
        assumptions: {
          annualReturn: (annualReturn * 100).toFixed(1) + '%',
          monthlyReturn: (monthlyReturn * 100).toFixed(2) + '%',
          currentValue: `$${currentValue.toFixed(2)}`
        }
      }
    });

  } catch (error) {
    console.error('Get portfolio projections error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Helper functions
const getSectorBySymbol = (symbol) => {
  const sectors = {
    'AAPL': 'Technology',
    'TSLA': 'Automotive',
    'INFY': 'Technology',
    'GOOGL': 'Technology',
    'MSFT': 'Technology'
  };
  return sectors[symbol] || 'Other';
};

const getMarketCapBySymbol = (symbol) => {
  const marketCaps = {
    'AAPL': 'Large Cap',
    'TSLA': 'Large Cap',
    'INFY': 'Large Cap',
    'GOOGL': 'Large Cap',
    'MSFT': 'Large Cap'
  };
  return marketCaps[symbol] || 'Unknown';
};

module.exports = router; 