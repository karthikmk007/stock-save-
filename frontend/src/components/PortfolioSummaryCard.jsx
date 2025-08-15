import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'

const PortfolioSummaryCard = ({ title, value, icon: Icon, color, change, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  const trendIcons = {
    up: <ArrowUpRight className="w-4 h-4 text-green-600" />,
    down: <ArrowDownRight className="w-4 h-4 text-red-600" />,
    neutral: <Minus className="w-4 h-4 text-gray-400" />,
  }

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-500',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="card hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`text-sm font-medium ${trendColors[trend]}`}>
          {trendIcons[trend]}
        </div>
      </div>
      
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
        <p className={`text-sm font-medium ${trendColors[trend]}`}>
          {change}
        </p>
      </div>
    </motion.div>
  )
}

export default PortfolioSummaryCard 