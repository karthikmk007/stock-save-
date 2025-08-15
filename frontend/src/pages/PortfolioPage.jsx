import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Target, Globe, BarChart3 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const PortfolioPage = () => {
  const { user } = useAuth()

  const portfolioData = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 0.5,
      value: 4.00,
      change: 2.5,
      changeAmount: 0.10,
      color: '#3B82F6',
      country: 'US'
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      shares: 0.3,
      value: 3.00,
      change: -1.2,
      changeAmount: -0.04,
      color: '#10B981',
      country: 'US'
    },
    {
      symbol: 'INFY',
      name: 'Infosys Ltd.',
      shares: 0.2,
      value: 3.00,
      change: 0.8,
      changeAmount: 0.02,
      color: '#F59E0B',
      country: 'IN'
    }
  ]

  const totalValue = portfolioData.reduce((sum, stock) => sum + stock.value, 0)
  const totalChange = portfolioData.reduce((sum, stock) => sum + stock.changeAmount, 0)
  const totalChangePercent = (totalChange / (totalValue - totalChange)) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">StockSave</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Overview</h2>
          <p className="text-gray-600">Track your investments and performance</p>
        </motion.div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
              </div>
            </div>
            <div className={`text-sm font-medium ${totalChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalChangePercent >= 0 ? '+' : ''}{totalChangePercent.toFixed(2)}% today
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Invested</p>
                <p className="text-2xl font-bold text-gray-900">${user.totalInvested.toFixed(2)}</p>
              </div>
            </div>
            <div className="text-sm font-medium text-green-600">
              +$0.25 today
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Investment</p>
                <p className="text-2xl font-bold text-gray-900">${user.upcomingInvestment.toFixed(2)}</p>
              </div>
            </div>
            <div className="text-sm font-medium text-purple-600">
              Ready in 2 days
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Countries</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
            <div className="text-sm font-medium text-orange-600">
              US & India
            </div>
          </motion.div>
        </div>

        {/* Portfolio Holdings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="card mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Your Holdings</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {portfolioData.map((stock, index) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: stock.color }}
                  ></div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{stock.symbol}</p>
                      <span className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-600">
                        {stock.country}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{stock.name}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-medium text-gray-900">${stock.value.toFixed(2)}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change}%
                    </span>
                    <span className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ({stock.change >= 0 ? '+' : ''}${stock.changeAmount.toFixed(2)})
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Performance Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Performance Over Time</h3>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-primary-600" />
              <span className="text-sm text-gray-600">Coming Soon</span>
            </div>
          </div>
          
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Advanced performance charts will be available soon</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default PortfolioPage 