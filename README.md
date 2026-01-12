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
1) Install deps
```bash
cd backend && npm install
cd ../frontend && npm install
```

2) Environment
- Backend: copy `backend/env.example` to `.env` (same dir) and set `JWT_SECRET`, `PORT` (optional).
- Frontend: copy `frontend/env.example` to `.env` and set `VITE_API_BASE`, `VITE_SOCKET_URL` (point to backend).

3) Run dev servers
```bash
cd backend && npm run dev   # http://localhost:4000
cd frontend && npm run dev  # http://localhost:5173
```

## Backend endpoints (examples)
- `POST /api/auth/register` → `{name,email,password,role}` → `201 { user, token }`
- `POST /api/auth/login` → `{email,password}` → `200 { user, token }`
- `GET /api/menu` → menu list
- `GET /api/menu/:id` → menu item
- `POST /api/cart/checkout` (student auth) → `{ items:[{menuId,qty}] }` → `201 {order}`
- `GET /api/orders` (student) → user orders
- `GET /api/orders/all` (staff) → all orders
- `PATCH /api/orders/:id/status` (staff) → `{status}` → `200 {order}`

### Sample cURL
```bash
# Register student
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@uni.edu","password":"password","role":"student"}'

# Login (store token)
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@uni.edu","password":"password"}' | jq -r .token)

# Get menu
curl http://localhost:4000/api/menu

# Checkout cart (student token)
curl -X POST http://localhost:4000/api/cart/checkout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"menuId":"m1","qty":1}]}'

# Staff get all orders
STAFF_TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"staff@uni.edu","password":"password"}' | jq -r .token)
curl -H "Authorization: Bearer $STAFF_TOKEN" http://localhost:4000/api/orders/all

# Update order status
curl -X PATCH http://localhost:4000/api/orders/o1/status \
  -H "Authorization: Bearer $STAFF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"preparing"}'
```

## Frontend pages
- Home, Menu (category browsing), Item detail, Cart, Checkout, Orders (student), Staff dashboard, Login/Register
- Components: NavBar, MenuCard, CartSidebar, OrderStatusBadge, StaffOrderCard

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

## Supabase Integration

CanteenConnect leverages **Supabase** for:
- **Authentication**: User sign-up, login, and session management
- **Database**: Real-time PostgreSQL database for users, menu items, orders, and cart data
- **Real-time Features**: Supabase real-time subscriptions for live data synchronization
- **Storage**: Optional file storage for menu item images

Supabase provides a scalable, open-source backend alternative with built-in real-time capabilities, making it ideal for applications requiring live updates like order tracking.

## Architecture

### Backend Structure
```
backend/
├── src/
│   ├── index.js          # Server entry point
│   ├── auth.js          # Authentication logic
│   ├── data.js          # In-memory database & seed data
│   ├── routes/
│   │   ├── auth.js      # Auth endpoints (register, login)
│   │   ├── menu.js      # Menu endpoints (list, detail)
│   │   └── orders.js    # Order endpoints
│   └── middleware/       # JWT and auth middleware
├── tests/
│   └── api.test.js      # API integration tests
└── public/              # Static files
```

### Frontend Structure
```
frontend/src/
├── App.jsx              # Main app component
├── main.jsx             # React entry point
├── api/
│   └── client.js        # Axios HTTP client with auth
├── lib/
│   └── supabase.js      # Supabase integration
├── components/          # Reusable UI components
│   ├── NavBar.jsx
│   ├── MenuCard.jsx
│   ├── CartSidebar.jsx
│   ├── OrderStatusBadge.jsx
│   └── ...
├── pages/               # Full page components
│   ├── Home.jsx
│   ├── Menu.jsx
│   ├── ItemDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Orders.jsx
│   ├── AdminDashboard.jsx
│   ├── Login.jsx
│   └── Register.jsx
├── state/
│   └── store.js         # Zustand store (auth + cart)
├── index.css            # Global styles
└── setupTests.js        # Test configuration
```

## State & real-time
- Zustand stores auth + cart
- Axios client auto-attaches JWT
- Socket.io client listens for `order:update` and `order:new`

## Tests
- Backend: Jest + Supertest smoke test (`npm test` in backend)
- Frontend: Vitest + Testing Library (`npm test` in frontend)

## Project Information

### Seed Data & Default Users
- Default Student: `alice@uni.edu` (password: `password`)
- Default Staff: `staff@uni.edu` (password: `password`)
- Uses in-memory seed data for demo purposes

### Environment Variables
- Backend: `JWT_SECRET`, `PORT` (optional, defaults to 4000)
- Frontend: `VITE_API_BASE`, `VITE_SOCKET_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### Deployment Notes
- Replace secrets in `.env` before deploying
- Keep dev secret out of commits
- Frontend deployed on GitHub Pages
- Backend can be deployed to any Node.js hosting (Heroku, Railway, Vercel, etc.)

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

## License
MIT
