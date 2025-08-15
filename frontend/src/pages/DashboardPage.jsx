import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Clock, 
  ArrowUpRight,
  Plus,
  Minus,
  Wallet,
  PieChart
} from 'lucide-react'
import PortfolioSummaryCard from '../components/PortfolioSummaryCard'
import RecentRoundUpsCard from '../components/RecentRoundUpsCard'
import InvestmentProjectionCard from '../components/InvestmentProjectionCard'
import QuickActionsCard from '../components/QuickActionsCard'

const DashboardPage = () => {
  const { user, logout } = useAuth()

  const mockRoundUps = [
    { id: 1, merchant: 'Starbucks', amount: 2.75, saved: 0.25, date: '2024-01-15', time: '09:30 AM' },
    { id: 2, merchant: 'Amazon', amount: 12.10, saved: 0.90, date: '2024-01-14', time: '02:15 PM' },
    { id: 3, merchant: 'Uber', amount: 8.45, saved: 0.55, date: '2024-01-14', time: '11:20 AM' },
    { id: 4, merchant: 'Netflix', amount: 15.99, saved: 0.01, date: '2024-01-13', time: '08:00 PM' },
  ]

  const mockPortfolio = [
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 0.5, value: 4.00, change: 2.5, color: '#3B82F6' },
    { symbol: 'TSLA', name: 'Tesla Inc.', shares: 0.3, value: 3.00, change: -1.2, color: '#10B981' },
    { symbol: 'INFY', name: 'Infosys Ltd.', shares: 0.2, value: 3.00, change: 0.8, color: '#F59E0B' },
  ]

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
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h2>
          <p className="text-gray-600">
            Here's how your micro-investments are growing today
          </p>
        </motion.div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <PortfolioSummaryCard
            title="Total Saved"
            value={`$${user.totalSaved.toFixed(2)}`}
            icon={Wallet}
            color="blue"
            change="+$2.75 this week"
            trend="up"
          />
          <PortfolioSummaryCard
            title="Total Invested"
            value={`$${user.totalInvested.toFixed(2)}`}
            icon={TrendingUp}
            color="green"
            change="+$0.25 today"
            trend="up"
          />
          <PortfolioSummaryCard
            title="Upcoming Investment"
            value={`$${user.upcomingInvestment.toFixed(2)}`}
            icon={Target}
            color="purple"
            change="Ready in 2 days"
            trend="neutral"
          />
          <PortfolioSummaryCard
            title="Portfolio Value"
            value="$10.00"
            icon={PieChart}
            color="orange"
            change="+$0.15 today"
            trend="up"
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Portfolio & Projections */}
          <div className="lg:col-span-2 space-y-8">
            {/* Investment Projection */}
            <InvestmentProjectionCard />
            
            {/* Portfolio Holdings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Your Portfolio</h3>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {mockPortfolio.map((stock, index) => (
                  <motion.div
                    key={stock.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: stock.color }}
                      ></div>
                      <div>
                        <p className="font-medium text-gray-900">{stock.symbol}</p>
                        <p className="text-sm text-gray-600">{stock.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${stock.value.toFixed(2)}</p>
                      <p className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Round-ups & Actions */}
          <div className="space-y-8">
            <RecentRoundUpsCard roundUps={mockRoundUps} />
            <QuickActionsCard />
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage 