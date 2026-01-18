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

```bash
cd frontend
npm install
cp env.example .env
