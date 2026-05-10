<div align="center">

# 🍽️ CanteenConnect

[![GitHub license](https://img.shields.io/github/license/username/canteen-connect?style=for-the-badge&color=blue)](https://github.com/username/canteen-connect/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/username/canteen-connect?style=for-the-badge&color=yellow)](https://github.com/username/canteen-connect/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/username/canteen-connect?style=for-the-badge&color=green)](https://github.com/username/canteen-connect/network)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/username/canteen-connect/pulls)

*A modern, full-stack college canteen management system built with React and Supabase. Streamline your campus dining experience with real-time order tracking, intuitive menu browsing, and efficient staff management.*

---

## 🚀 Tech Stack

### Frontend
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%61DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-%23000000.svg?style=for-the-badge&logo=zustand&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black.svg?style=for-the-badge&logo=framer-motion&logoColor=0099FF)
![Lucide](https://img.shields.io/badge/Lucide-000000?style=for-the-badge&logo=Lucide&logoColor=white)

### Backend & Database
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Axios](https://img.shields.io/badge/axios-671ddf?style=for-the-badge&logo=axios&logoLogo=white)

### Testing & DevTools
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Testing Library](https://img.shields.io/badge/Testing_Library-C21325?style=for-the-badge&logo=testing-library&logoColor=white)

---

## ✨ Features

### 🎓 Student Experience
- **🔐 Seamless Authentication** - Quick signup and login with secure session management
- **📱 Intuitive Menu Browsing** - Browse items by category with rich details and images
- **🛒 Smart Cart Management** - Add, remove, and update quantities with real-time calculations
- **⚡ One-Click Checkout** - Streamlined payment process with order confirmation
- **📊 Real-Time Order Tracking** - Live status updates from preparation to delivery
- **📜 Order History** - View past orders and re-order favorite items

### 👨‍🍳 Staff Dashboard
- **📈 Real-Time Order Dashboard** - Live view of all active orders with status indicators
- **🔄 Status Management** - Update orders: Placed → Preparing → Ready → Delivered
- **🔍 Smart Filtering** - Filter orders by status, time, or customer
- **💰 Bill Preview** - Detailed order breakdown with pricing and taxes
- **⏱️ Preparation Timer** - Track estimated preparation times for efficiency
- **📊 Analytics Overview** - Order trends and popular items insights

---

## 🛠️ Installation

### Prerequisites
- ![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=flat-square&logo=node.js&logoColor=white) **Node.js 18+** 
- ![npm](https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white) **npm or yarn**
- ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white) **Supabase account**

### Quick Start

```bash
# Clone the repository
git clone https://github.com/username/canteen-connect.git
cd canteen-connect

# Install dependencies
cd frontend
npm install

# Configure environment
cp env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

---

## 📁 Project Structure

```
canteen-connect/
├── frontend/
│   ├── src/
│   │   ├── api/              # 🌐 API client configuration
│   │   ├── components/       # 🧩 Reusable React components
│   │   │   ├── NavBar.jsx
│   │   │   ├── MenuCard.jsx
│   │   │   ├── CartSidebar.jsx
│   │   │   └── StaffOrderCard.jsx
│   │   ├── hooks/            # 🎣 Custom React hooks
│   │   ├── lib/              # 🛠️ Utilities & Supabase setup
│   │   ├── pages/            # 📄 Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── state/            # 📦 Zustand store management
│   │   │   ├── store.js
│   │   │   └── cartStore.js
│   │   ├── App.jsx           # 🎯 Main app component
│   │   ├── main.jsx          # 🚀 Entry point
│   │   └── index.css         # 🎨 Global styles (Tailwind)
│   ├── public/               # 📂 Static assets
│   ├── vite.config.js        # ⚙️ Vite configuration
│   ├── tailwind.config.js    # 🎨 Tailwind CSS configuration
│   └── package.json          # 📋 Dependencies & scripts
├── README.md                 # 📖 Project documentation
└── .gitignore               # 🚫 Git ignore rules
```

---

## 🎯 Usage Guide

### For Students
1. **Create Account** - Sign up with email and password
2. **Browse Menu** - Explore categories and view item details
3. **Add to Cart** - Select items and customize quantities
4. **Place Order** - Review cart and confirm order
5. **Track Status** - Monitor real-time order progress

### For Staff
1. **Login Dashboard** - Access staff portal with credentials
2. **View Orders** - See incoming orders in real-time
3. **Update Status** - Change order status as you progress
4. **Manage Menu** - Add, edit, or remove menu items
5. **View Analytics** - Track sales and popular items

---

## 🔧 Environment Configuration

Create a `.env` file in the `frontend/` directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anonymous_key

# API Configuration
VITE_API_BASE_URL=http://localhost:3000
```

### Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema to create required tables
3. Configure authentication providers
4. Set up Row Level Security (RLS) policies

---

## 🧪 Testing

```bash
# Run test suite
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Current test coverage:
- ✅ Component rendering
- ✅ User interactions
- ✅ API integration
- 🔄 State management (in progress)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **🍴 Fork the repository**
2. **🌿 Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **💾 Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **📤 Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **🔄 Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Write tests for new features
- Update documentation
- Ensure all tests pass

---

## 🗺️ Roadmap

- [ ] 💳 **Payment Gateway Integration** - Stripe, Razorpay support
- [ ] 📧 **Email Notifications** - Order confirmations and status updates
- [ ] 📅 **Order Scheduling** - Pre-order meals in advance
- [ ] ⭐ **Review System** - Rate and review menu items
- [ ] 📊 **Advanced Analytics** - Detailed sales insights and reports
- [ ] 📱 **Mobile App** - React Native version
- [ ] 🌐 **Multi-Language Support** - Internationalization
- [ ] 🎨 **Dark Mode** - Theme customization

---

## 🐛 Troubleshooting

### Common Issues

**Supabase Connection Error**
```bash
# Verify environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Check Supabase project status
# Visit dashboard.supabase.com
```

**Build Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Authentication Problems**
- Check RLS policies in Supabase
- Verify email confirmation settings
- Review authentication configuration

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgments

- **React Team** - For the amazing frontend framework
- **Supabase** - For the excellent backend-as-a-service platform
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For smooth animations and transitions

---

## 📞 Support

- 📧 **Email**: support@canteenconnect.com
- 💬 **Discord**: [Join our community](https://discord.gg/canteenconnect)
- 🐛 **Issues**: [Report a bug](https://github.com/username/canteen-connect/issues)
- 💡 **Feature Requests**: [Suggest an idea](https://github.com/username/canteen-connect/discussions)

---

<div align="center">

**⭐ Star this repository if it helped you!**

Made with ❤️ by [Your Name](https://github.com/username)

[![Back to top](https://img.shields.io/badge/Back%20to%20top-%23000000.svg?style=for-the-badge&logo=github&logoColor=white)](#-canteenconnect)

</div>
