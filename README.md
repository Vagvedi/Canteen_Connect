# CanteenConnect

Full-stack web application for a college canteen management system. Students browse the menu, add items to cart, place orders, and track order status in real-time. Staff can manage orders, update order status, and maintain the menu.

## Tech Stack

### Frontend
- **Framework**: React 18.3.1 with Vite
- **Routing**: React Router DOM 6.26.2
- **State Management**: Zustand 4.5.4
- **Styling**: Tailwind CSS 3.4.19 with PostCSS
- **HTTP Client**: Axios 1.7.7
- **Real-time**: Socket.io Client 4.7.5
- **Backend**: Supabase JS 2.90.1 (auth, database, real-time)
- **UI Components**: Lucide React 0.562.0 (icons)
- **Animation**: Framer Motion 12.23.26
- **Testing**: Vitest 2.1.2, Testing Library React 16.0.1, Testing Library User Event 14.5.2
- **Build Tool**: Vite 5.4.1

### Backend
- **Runtime**: Node.js
- **Framework**: Express 4.19.2
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 2.4.3
- **Real-time**: Socket.io 4.7.5
- **CORS**: cors 2.8.5
- **UUID Generation**: uuid 9.0.1
- **Environment**: dotenv 17.2.3
- **Development**: Nodemon 3.1.0
- **Testing**: Jest 29.7.0, Supertest 6.3.4

## Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. Install dependencies for both frontend and backend:
```bash
cd backend && npm install
cd ../frontend && npm install
```

2. Configure environment variables:
   - **Backend**: Copy `backend/env.example` to `backend/.env` and set `JWT_SECRET`, `PORT` (optional, defaults to 4000)
   - **Frontend**: Copy `frontend/env.example` to `frontend/.env` and set `VITE_API_BASE`, `VITE_SOCKET_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

3. Run development servers:
```bash
cd backend && npm run dev   # http://localhost:4000
cd frontend && npm run dev  # http://localhost:5173
```

## Backend API Endpoints

- `POST /api/auth/register` → `{name,email,password,role}` → `201 { user, token }`
- `POST /api/auth/login` → `{email,password}` → `200 { user, token }`
- `GET /api/menu` → menu list
- `GET /api/menu/:id` → menu item
- `POST /api/cart/checkout` (student auth) → `{ items:[{menuId,qty}] }` → `201 {order}`
- `GET /api/orders` (student) → user orders
- `GET /api/orders/all` (staff) → all orders
- `PATCH /api/orders/:id/status` (staff) → `{status}` → `200 {order}`

## Project Structure

### Frontend
```
frontend/
├── src/
│   ├── main.jsx         # React entry point
│   ├── App.jsx          # Main app component
│   ├── index.css        # Global styles
│   ├── setupTests.js    # Test configuration
│   ├── api/
│   │   └── client.js    # Axios HTTP client with auth
│   ├── lib/
│   │   └── supabase.js  # Supabase integration
│   ├── components/      # Reusable UI components
│   │   ├── AuthLayout.jsx
│   │   ├── Bill.jsx
│   │   ├── CartSidebar.jsx
│   │   ├── MenuCard.jsx
│   │   ├── NavBar.jsx
│   │   ├── NavBar.test.jsx
│   │   ├── OrderStatusBadge.jsx
│   │   └── StaffOrderCard.jsx
│   ├── pages/           # Full page components
│   │   ├── AdminDashboard.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Dashboard.jsx
│   │   ├── DashboardTabs.jsx
│   │   ├── Home.jsx
│   │   ├── ItemDetail.jsx
│   │   ├── Login.jsx
│   │   ├── Menu.jsx
│   │   ├── Orders.jsx
│   │   └── Register.jsx
│   └── state/
│       ├── cartStore.js # Zustand cart store
│       └── store.js     # Zustand auth store
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── env.example
└── ...
```

## Features

### Student Features
- User authentication (register/login)
- Browse menu by categories
- View item details with descriptions and pricing
- Add/remove items from cart
- Checkout and place orders
- Track order status in real-time
- View order history

### Staff Features
- Authentication with staff role
- View all orders in real-time
- Update order status (pending → preparing → ready → delivered)
- Menu management
- Order analytics and tracking

### Real-time Features
- Socket.io integration for instant order updates
- Live order status notifications
- Real-time cart synchronization
- Supabase real-time subscriptions

## Supabase Integration

CanteenConnect leverages **Supabase** for:
- **Authentication**: User sign-up, login, and session management
- **Database**: Real-time PostgreSQL database for users, menu items, orders, and cart data
- **Real-time Features**: Supabase real-time subscriptions for live data synchronization
- **Storage**: Optional file storage for menu item images

## Default Users & Seed Data
- Default Student: `alice@uni.edu` (password: `password`)
- Default Staff: `staff@uni.edu` (password: `password`)
- Uses in-memory seed data for demo purposes

## Development Scripts

### Backend
```bash
npm run dev      # Start dev server with Nodemon
npm start        # Start production server
npm test         # Run tests with Jest
```

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm test         # Run tests with Vitest
npm run deploy   # Deploy to GitHub Pages
```

## Testing
- Backend: Jest + Supertest (`npm test` in backend)
- Frontend: Vitest + Testing Library (`npm test` in frontend)

## Deployment Notes
- Replace secrets in `.env` before deploying
- Keep dev secrets out of commits
- Frontend can be deployed on GitHub Pages, Vercel, or Netlify
- Backend can be deployed to any Node.js hosting (Heroku, Railway, Render, etc.)

## License
MIT
