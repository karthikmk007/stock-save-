import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Filter, Search, Download, Calendar, DollarSign } from 'lucide-react'

const TransactionHistoryPage = () => {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const transactions = [
    { id: 1, type: 'roundup', merchant: 'Starbucks', amount: 2.75, saved: 0.25, date: '2024-01-15', time: '09:30 AM', status: 'completed' },
    { id: 2, type: 'roundup', merchant: 'Amazon', amount: 12.10, saved: 0.90, date: '2024-01-14', time: '02:15 PM', status: 'completed' },
    { id: 3, type: 'investment', merchant: 'Apple Inc.', amount: 10.00, saved: 0, date: '2024-01-13', time: '10:00 AM', status: 'completed' },
    { id: 4, type: 'roundup', merchant: 'Uber', amount: 8.45, saved: 0.55, date: '2024-01-14', time: '11:20 AM', status: 'completed' },
    { id: 5, type: 'investment', merchant: 'Tesla Inc.', amount: 7.50, saved: 0, date: '2024-01-12', time: '03:30 PM', status: 'completed' },
    { id: 6, type: 'roundup', merchant: 'Netflix', amount: 15.99, saved: 0.01, date: '2024-01-13', time: '08:00 PM', status: 'completed' },
    { id: 7, type: 'roundup', merchant: 'McDonald\'s', amount: 6.75, saved: 0.25, date: '2024-01-12', time: '12:45 PM', status: 'completed' },
    { id: 8, type: 'investment', merchant: 'Infosys Ltd.', amount: 8.00, saved: 0, date: '2024-01-11', time: '09:15 AM', status: 'completed' },
  ]

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter
    const matchesSearch = transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getTypeIcon = (type) => {
    if (type === 'roundup') return <DollarSign className="w-4 h-4" />
    if (type === 'investment') return <TrendingUp className="w-4 h-4" />
    return <DollarSign className="w-4 h-4" />
  }

  const getTypeColor = (type) => {
    if (type === 'roundup') return 'bg-green-100 text-green-600'
    if (type === 'investment') return 'bg-blue-100 text-blue-600'
    return 'bg-gray-100 text-gray-600'
  }

  const getTypeLabel = (type) => {
    if (type === 'roundup') return 'Round-Up'
    if (type === 'investment') return 'Investment'
    return 'Transaction'
  }

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
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Transaction History</h2>
          <p className="text-gray-600">Track all your round-ups and investments</p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Transactions</option>
                <option value="roundup">Round-Ups</option>
                <option value="investment">Investments</option>
              </select>
            </div>

            {/* Export */}
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </motion.div>

        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {filteredTransactions.length} Transactions
            </h3>
            <div className="text-sm text-gray-600">
              Total Saved: ${filteredTransactions.filter(t => t.type === 'roundup').reduce((sum, t) => sum + t.saved, 0).toFixed(2)}
            </div>
          </div>

          <div className="space-y-4">
            {filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getTypeColor(transaction.type)}`}>
                    {getTypeIcon(transaction.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{transaction.merchant}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(transaction.type)}`}>
                        {getTypeLabel(transaction.type)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{transaction.date} • {transaction.time}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {transaction.type === 'roundup' ? (
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm text-gray-600">${transaction.amount.toFixed(2)}</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-sm font-medium text-gray-900">
                          ${(transaction.amount + transaction.saved).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        +${transaction.saved.toFixed(2)} saved
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-gray-900">${transaction.amount.toFixed(2)}</p>
                      <p className="text-sm text-blue-600">Stock Purchase</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}

export default TransactionHistoryPage 