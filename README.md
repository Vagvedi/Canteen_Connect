# Canteen Connect

Full-stack demo for a college canteen: students browse menu, add to cart, place orders, and track status; staff manage orders and menu.

## Stack
- Frontend: React (Vite), React Router, Tailwind, Zustand, Socket.io client
- Backend: Node.js, Express, Socket.io, JWT auth, in-memory seed data

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

## State & real-time
- Zustand stores auth + cart
- Axios client auto-attaches JWT
- Socket.io client listens for `order:update` and `order:new`

## Tests
- Backend: Jest + Supertest smoke test (`npm test` in backend)
- Frontend: Vitest + Testing Library (`npm test` in frontend)

## Notes
- Seed users: `alice@uni.edu` (student), `staff@uni.edu` (staff); password `password`
- Replace secrets in `.env` before deploying; keep dev secret out of commits.

## CanteenConnect
A full-stack canteen management system.

## Setup & Run Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp env.example .env
npm run dev

