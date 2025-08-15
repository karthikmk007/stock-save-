import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Clock, DollarSign } from 'lucide-react'

const RecentRoundUpsCard = ({ roundUps }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Recent Round-Ups</h3>
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {roundUps.map((roundUp, index) => (
          <motion.div
            key={roundUp.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{roundUp.merchant}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(roundUp.date)} • {roundUp.time}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm text-gray-600">${roundUp.amount.toFixed(2)}</span>
                <span className="text-gray-400">→</span>
                <span className="text-sm font-medium text-gray-900">${(roundUp.amount + roundUp.saved).toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-1 text-success-600">
                <Plus className="w-3 h-3" />
                <span className="text-sm font-medium">${roundUp.saved.toFixed(2)} saved</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-success-600" />
            <span className="text-sm text-gray-600">This week's savings:</span>
          </div>
          <span className="text-lg font-bold text-success-600">
            ${roundUps.reduce((sum, roundUp) => sum + roundUp.saved, 0).toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default RecentRoundUpsCard 