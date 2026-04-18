# CanteenConnect

CanteenConnect is a full-stack college canteen management system where students can browse menus, place orders, and track order status in real time, while staff can manage orders and menu items efficiently.

---

## Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Routing**: React Router
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide Icons

### Backend
- **Supabase**
  - PostgreSQL Database
  - Authentication
  - Real-time subscriptions

---

## Features

### Student Features
- User authentication (register / login)
- Browse menu items by category
- View detailed item information
- Add/remove items from cart
- Checkout and place orders
- Track real-time order status
- View order history

### Staff Features
- Real-time dashboard with active orders
- Filter orders by status
- Update order status (placed → preparing → ready → delivered)
- View bill preview and order details
- Track estimated preparation time

---

## Setup & Run Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Supabase account with a project created

---

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp env.example .env
   ```
   Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=<your-supabase-url>
   VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   VITE_API_BASE_URL=<backend-api-url>
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

---

## Project Structure

```
frontend/
├── src/
│   ├── api/              # API client configuration
│   ├── components/       # Reusable React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and Supabase setup
│   ├── pages/            # Page components (routed)
│   ├── state/            # Zustand store management
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles (Tailwind)
├── public/               # Static assets
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Dependencies and scripts
```

---

## Key Files

### State Management
- **`state/store.js`** - Main Zustand store for app state
- **`state/cartStore.js`** - Shopping cart state management

### Pages
- **`pages/Home.jsx`** - Landing page
- **`pages/Menu.jsx`** - Menu browsing
- **`pages/Cart.jsx`** - Shopping cart view
- **`pages/Checkout.jsx`** - Order checkout
- **`pages/Orders.jsx`** - Order history/tracking
- **`pages/AdminDashboard.jsx`** - Staff management dashboard
- **`pages/Login.jsx`** & **`pages/Register.jsx`** - Authentication

### Components
- **`components/NavBar.jsx`** - Main navigation
- **`components/MenuCard.jsx`** - Menu item card
- **`components/CartSidebar.jsx`** - Cart sidebar
- **`components/StaffOrderCard.jsx`** - Order card for staff view
- **`components/OrderStatusBadge.jsx`** - Order status indicator

---

## Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test             # Run tests
```

---

## Environment Variables Required

Create a `.env` file in the `frontend/` directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:3000  # or your backend URL
```

---

## Database Setup (Supabase)

The application uses Supabase for:
- **Authentication**: User signup, login, session management
- **Database**: PostgreSQL tables for menu items, orders, users
- **Real-time**: Realtime subscriptions for order status updates

Set up the following tables in Supabase:
- `users` - User profiles
- `menu_items` - Available menu items
- `orders` - Customer orders
- `order_items` - Items in each order

---

## Testing

```bash
npm test             # Run test suite
npm run test:watch   # Watch mode
```

Current test files:
- `components/NavBar.test.jsx`
- `setupTests.js`

---

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

---

## Troubleshooting

### Supabase Connection Issues
- Verify `.env` variables are correctly set
- Check Supabase project is active
- Ensure authentication policies allow operations

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm run build -- --clean`

---

## Future Enhancements

- [ ] Payment gateway integration
- [ ] Email order notifications
- [ ] Order scheduling/pre-orders
- [ ] User reviews and ratings
- [ ] Advanced analytics dashboard
- [ ] Mobile app version

---

## License

MIT License - See LICENSE file for details

---

## Support

For issues or questions, please open an issue on the repository
