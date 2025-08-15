import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Calendar, Target, DollarSign } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const InvestmentProjectionCard = () => {
  const projectionData = [
    { month: 'Jan', saved: 12.75, projected: 15.00 },
    { month: 'Feb', saved: 18.50, projected: 22.00 },
    { month: 'Mar', saved: 25.25, projected: 30.00 },
    { month: 'Apr', saved: 32.00, projected: 38.00 },
    { month: 'May', saved: 40.00, projected: 47.00 },
    { month: 'Jun', saved: 48.50, projected: 56.00 },
  ]

  const portfolioData = [
    { name: 'US Stocks', value: 6.00, color: '#3B82F6' },
    { name: 'Indian Stocks', value: 4.00, color: '#10B981' },
  ]

  const nextInvestment = {
    amount: 2.75,
    target: 10.00,
    daysRemaining: 2,
    projectedDate: 'Jan 17, 2024'
  }

  const progress = (nextInvestment.amount / nextInvestment.target) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Investment Projections</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>Growing steadily</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Projection Chart */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Savings Growth</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, '']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="saved" 
                stroke="#0ea5e9" 
                strokeWidth={3}
                dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#0ea5e9', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="projected" 
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-primary-600">Projection:</span> You'll reach{' '}
              <span className="font-bold text-gray-900">$50 by September 2025</span>
            </p>
          </div>
        </div>

        {/* Right Side - Next Investment & Portfolio */}
        <div className="space-y-6">
          {/* Next Investment */}
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Next Investment</h4>
              <Target className="w-5 h-5 text-primary-600" />
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">
                  ${nextInvestment.amount} / ${nextInvestment.target}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-primary-600 h-2 rounded-full"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Ready in {nextInvestment.daysRemaining} days</span>
              <span className="font-medium text-primary-600">{nextInvestment.projectedDate}</span>
            </div>
          </div>

          {/* Portfolio Distribution */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Portfolio Distribution</h4>
            <div className="flex items-center space-x-4">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-2">
                {portfolioData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                    <span className="text-sm font-medium text-gray-900">${item.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default InvestmentProjectionCard 