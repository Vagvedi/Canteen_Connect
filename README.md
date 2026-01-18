# CanteenConnect

A full-stack college canteen management system where students can browse menus, place orders, track status, and staff can manage orders and menu items in real-time.

## Stack
- **Frontend**: React 18 (Vite), React Router, Tailwind CSS, Zustand, Framer Motion, Lucide Icons
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **UI/UX**: Modern glass-morphism design with smooth animations

## Features
### For Students
- Browse menu items by category
- View detailed item information
- Add items to cart with quantity control
- Checkout with order confirmation
- Track real-time order status (placed → preparing → ready)
- View order history

### For Staff
- Real-time dashboard with all active orders
- Filter orders by status
- Update order status with one click
- Bill preview and order details
- Estimated preparation time tracker

## Setup & Run Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Supabase account with project setup

### Frontend Setup
```bash
cd frontend
npm install
cp env.example .env
```

Update `.env` with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Development Server
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Build for Production
```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── api/              # Supabase API client
│   ├── components/       # Reusable UI components
│   │   ├── AuthLayout.jsx
│   │   ├── Bill.jsx
│   │   ├── CartSidebar.jsx
│   │   ├── MenuCard.jsx
│   │   ├── NavBar.jsx
│   │   ├── OrderStatusBadge.jsx
│   │   └── StaffOrderCard.jsx
│   ├── hooks/            # Custom React hooks
│   │   └── useOrderTimer.js
│   ├── lib/              # Library setup
│   │   └── supabase.js
│   ├── pages/            # Route pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Menu.jsx
│   │   ├── ItemDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Orders.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── DashboardTabs.jsx
│   ├── state/            # State management (Zustand)
│   │   ├── store.js      # Auth store
│   │   └── cartStore.js  # Cart store
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── env.example
```

## Pages Overview
- **Home** - Landing page with login/register CTA
- **Login/Register** - User authentication
- **Menu** - Browse items by category
- **ItemDetail** - View item details and nutrition
- **Cart** - Review and modify items in cart
- **Checkout** - Place order and confirm
- **Orders** - Student order history and tracking
- **Dashboard** - Student dashboard with quick access
- **AdminDashboard** - Staff panel for order management

## State Management
- **Zustand** for auth and cart state
- **Supabase Auth** for user authentication
- **Real-time updates** via Supabase subscriptions

## Testing
```bash
# Run tests
npm test

# Vitest + Testing Library for component tests
```

## Key Dependencies
- `@supabase/supabase-js` - Backend & authentication
- `react-router-dom` - Routing
- `tailwindcss` - Styling
- `zustand` - State management
- `framer-motion` - Animations
- `lucide-react` - Icons
- `axios` - HTTP client

## Deployment
Frontend is built to deploy on GitHub Pages. Configure homepage in `package.json`:
```bash
npm run predeploy
npm run deploy

