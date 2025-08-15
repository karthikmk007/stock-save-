import React from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Settings, 
  BarChart3, 
  CreditCard, 
  Globe, 
  Bell,
  Target,
  TrendingUp
} from 'lucide-react'

const QuickActionsCard = () => {
  const actions = [
    {
      icon: Plus,
      title: 'Add Funds',
      description: 'Deposit additional money',
      color: 'bg-primary-100 text-primary-600',
      action: () => console.log('Add Funds clicked')
    },
    {
      icon: Target,
      title: 'Set Goals',
      description: 'Create investment targets',
      color: 'bg-green-100 text-green-600',
      action: () => console.log('Set Goals clicked')
    },
    {
      icon: BarChart3,
      title: 'View Analytics',
      description: 'Detailed performance',
      color: 'bg-purple-100 text-purple-600',
      action: () => console.log('Analytics clicked')
    },
    {
      icon: Globe,
      title: 'Currency Convert',
      description: 'USD to INR conversion',
      color: 'bg-orange-100 text-orange-600',
      action: () => console.log('Currency clicked')
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      description: 'Manage cards & wallets',
      color: 'bg-blue-100 text-blue-600',
      action: () => console.log('Payment clicked')
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Alerts & reminders',
      color: 'bg-red-100 text-red-600',
      action: () => console.log('Notifications clicked')
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
        <TrendingUp className="w-5 h-5 text-primary-600" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            onClick={action.action}
            className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 text-left group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${action.color}`}>
              <action.icon className="w-5 h-5" />
            </div>
            <h4 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-primary-600 transition-colors">
              {action.title}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {action.description}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button className="w-full btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Start New Investment
        </button>
      </div>
    </motion.div>
  )
}

export default QuickActionsCard 