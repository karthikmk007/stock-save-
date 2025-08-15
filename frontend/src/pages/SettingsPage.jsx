import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, User, Shield, Bell, CreditCard, Globe, Moon, Sun, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const SettingsPage = () => {
  const { user, logout } = useAuth()
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [roundUpEnabled, setRoundUpEnabled] = useState(true)
  const [investmentThreshold, setInvestmentThreshold] = useState(10)

  const settingsSections = [
    {
      title: 'Account Settings',
      icon: User,
      items: [
        { label: 'Full Name', value: user.name, type: 'text', editable: true },
        { label: 'Email', value: user.email, type: 'email', editable: false },
        { label: 'Phone Number', value: '+1 (555) 123-4567', type: 'tel', editable: true },
        { label: 'Date of Birth', value: 'January 15, 1990', type: 'date', editable: true },
      ]
    },
    {
      title: 'Investment Preferences',
      icon: TrendingUp,
      items: [
        { label: 'Round-Up Enabled', value: roundUpEnabled, type: 'toggle', onChange: setRoundUpEnabled },
        { label: 'Investment Threshold', value: `$${investmentThreshold}`, type: 'range', min: 5, max: 50, onChange: setInvestmentThreshold },
        { label: 'Auto-Invest', value: true, type: 'toggle' },
        { label: 'Risk Tolerance', value: 'Moderate', type: 'select', options: ['Conservative', 'Moderate', 'Aggressive'] },
      ]
    },
    {
      title: 'Payment Methods',
      icon: CreditCard,
      items: [
        { label: 'Primary Card', value: '•••• •••• •••• 1234', type: 'card' },
        { label: 'Apple Pay', value: 'Connected', type: 'status', status: 'success' },
        { label: 'Google Pay', value: 'Connected', type: 'status', status: 'success' },
        { label: 'Bank Account', value: '•••• 5678', type: 'bank' },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Push Notifications', value: notifications, type: 'toggle', onChange: setNotifications },
        { label: 'Email Alerts', value: true, type: 'toggle' },
        { label: 'Investment Updates', value: true, type: 'toggle' },
        { label: 'Weekly Reports', value: false, type: 'toggle' },
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        { label: 'Two-Factor Auth', value: 'Enabled', type: 'status', status: 'success' },
        { label: 'Biometric Login', value: 'Enabled', type: 'status', status: 'success' },
        { label: 'Session Timeout', value: '30 minutes', type: 'select', options: ['15 minutes', '30 minutes', '1 hour'] },
        { label: 'Login Alerts', value: true, type: 'toggle' },
      ]
    }
  ]

  const handleLogout = () => {
    logout()
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
          <p className="text-gray-600">Manage your account preferences and security</p>
        </motion.div>

        {/* Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {darkMode ? <Moon className="w-5 h-5 text-gray-600" /> : <Sun className="w-5 h-5 text-yellow-500" />}
              <div>
                <h3 className="font-medium text-gray-900">Theme</h3>
                <p className="text-sm text-gray-600">
                  {darkMode ? 'Dark mode' : 'Light mode'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {settingsSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + sectionIndex * 0.1 }}
              className="card"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
              </div>

              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      {item.type === 'status' && (
                        <p className="text-sm text-gray-600">{item.value}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      {item.type === 'toggle' && (
                        <button
                          onClick={() => item.onChange && item.onChange(!item.value)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            item.value ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              item.value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      )}

                      {item.type === 'text' && item.editable && (
                        <input
                          type="text"
                          defaultValue={item.value}
                          className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      )}

                      {item.type === 'select' && (
                        <select className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                          {item.options?.map((option, optionIndex) => (
                            <option key={optionIndex} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}

                      {item.type === 'range' && (
                        <div className="flex items-center space-x-3">
                          <input
                            type="range"
                            min={item.min}
                            max={item.max}
                            value={investmentThreshold}
                            onChange={(e) => setInvestmentThreshold(parseInt(e.target.value))}
                            className="w-20"
                          />
                          <span className="text-sm font-medium text-gray-900 w-16 text-right">
                            {item.value}
                          </span>
                        </div>
                      )}

                      {item.type === 'status' && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.value}
                        </span>
                      )}

                      {item.type === 'card' && (
                        <span className="text-sm text-gray-600">{item.value}</span>
                      )}

                      {item.type === 'bank' && (
                        <span className="text-sm text-gray-600">{item.value}</span>
                      )}

                      {!['toggle', 'text', 'select', 'range', 'status', 'card', 'bank'].includes(item.type) && (
                        <span className="text-sm text-gray-600">{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <button
            onClick={handleLogout}
            className="w-full btn-secondary text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </motion.div>
      </main>
    </div>
  )
}

export default SettingsPage 