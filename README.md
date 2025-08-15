# StockSave - Micro-Investment Service

StockSave is a revolutionary micro-investment service that integrates with digital payment platforms (like GPay and Apple Wallet) to help users save and invest spare change automatically while they shop.

## 🚀 Core Concept

Every time a user makes a purchase (e.g., $2.75), the app rounds up the transaction (to $3.00) and deposits the remaining $0.25 into a StockSave wallet. Once the saved amount reaches a threshold ($10 or INR 300), StockSave automatically invests it into:

- **US Stocks** (e.g., fractional shares like Apple, Tesla)
- **Indian Stocks** (converted from saved CAD or USD into INR)

## ✨ Features

### 🎯 Round-Up Savings
- Automatic transaction rounding to nearest dollar
- Integration with payment platforms (GPay, Apple Pay, Google Pay)
- Real-time savings tracking

### 💰 Micro-Investing
- Automatic investment triggers at customizable thresholds
- Fractional share purchases
- Multi-currency support (USD, CAD, INR)

### 📊 Portfolio Management
- Real-time portfolio tracking
- Performance analytics and charts
- Future value projections
- Multi-country stock holdings

### 🔐 Security & Authentication
- JWT-based authentication
- OAuth integration (Google, Apple)
- Secure payment processing
- Two-factor authentication

## 🏗️ Project Structure

```
stocksave-new/
├── frontend/           # React-based frontend application
│   ├── public/         # Static files
│   └── src/            # Source code
│       ├── components/ # Reusable UI components
│       ├── pages/      # Page components
│       ├── services/   # API services
│       ├── assets/     # Images, fonts, etc.
│       ├── utils/      # Utility functions
│       └── context/    # React context for state management
│
├── backend/            # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Utility functions
│   │   ├── middleware/   # Express middleware
│   │   └── config/       # Configuration files
│   └── tests/          # Backend tests
│
└── docs/               # Documentation
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Recharts** - Beautiful charts and visualizations
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Morgan** - HTTP request logger
- **Helmet** - Security middleware

### APIs & Integrations
- **Payment Platform APIs** - GPay, Apple Pay, Google Pay
- **Stock Market APIs** - Real-time stock data
- **Currency Conversion APIs** - Exchange rates
- **Webhook Support** - Real-time transaction processing

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd stocksave-new/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd stocksave-new/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **API will be available at:**
   ```
   http://localhost:5000
   ```

## 📱 App Screenshots

### Login Page
- Modern, Wealthsimple-style design
- OAuth integration options
- Smooth animations and transitions

### Dashboard
- Portfolio summary cards
- Investment projections
- Recent round-up transactions
- Quick action buttons

### Portfolio
- Detailed holdings view
- Performance charts
- Allocation breakdown
- Future projections

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/oauth/google` - Google OAuth
- `POST /api/auth/oauth/apple` - Apple OAuth

### Transactions
- `POST /api/transactions/roundup` - Process round-up
- `POST /api/transactions/webhook` - Payment provider webhook
- `GET /api/transactions/user/:userId` - User transaction history

### Investments
- `POST /api/investments/purchase` - Buy stocks
- `POST /api/investments/auto-invest` - Automatic investment
- `GET /api/investments/user/:userId` - User portfolio

### Portfolio
- `GET /api/portfolio/summary/:userId` - Portfolio overview
- `GET /api/portfolio/performance/:userId` - Performance data
- `GET /api/portfolio/projections/:userId` - Future projections

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers
- Webhook signature verification

## 🌍 Multi-Currency Support

- **USD** - Primary currency for US stocks
- **CAD** - Canadian dollar support
- **INR** - Indian Rupee for Indian stocks
- Automatic currency conversion
- Real-time exchange rates

## 📈 Investment Features

- **Automatic Round-Ups** - Save on every purchase
- **Threshold Investing** - Invest when savings reach $10/₹300
- **Fractional Shares** - Buy partial shares
- **Diversification** - US and Indian markets
- **Auto-Rebalancing** - Maintain target allocations

## 🚧 Development Roadmap

### Phase 1 (Current)
- ✅ Basic authentication system
- ✅ Round-up transaction processing
- ✅ Portfolio management
- ✅ Investment system

### Phase 2 (Next)
- 🔄 Real payment platform integration
- 🔄 Live stock market data
- 🔄 Advanced analytics
- 🔄 Mobile app development

### Phase 3 (Future)
- 📋 AI-powered investment recommendations
- 📋 Social features and sharing
- 📋 Advanced portfolio optimization
- 📋 Cryptocurrency support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: support@stocksave.com
- Documentation: [docs.stocksave.com](https://docs.stocksave.com)
- Issues: [GitHub Issues](https://github.com/stocksave/stocksave/issues)

## 🙏 Acknowledgments

- Inspired by Wealthsimple and Acorns
- Built with modern web technologies
- Designed for financial inclusion
- Empowering micro-investors worldwide

---

**StockSave** - Invest While You Spend 💰📈 # stock-save-
