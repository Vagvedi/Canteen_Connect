const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

// Seed users (password: "password")
const seedUsers = [
  {
    id: 'u1',
    name: 'Alice',
    email: 'alice@uni.edu',
    role: 'student',
    password: bcrypt.hashSync('password', 8),
  },
  {
    id: 's1',
    name: 'Counter Staff',
    email: 'staff@uni.edu',
    role: 'staff',
    password: bcrypt.hashSync('password', 8),
  },
];

const seedMenu = [
  { id: 'm1', name: 'Veg Burger', category: 'Meals', price: 80, available: true, description: 'Veg patty, lettuce, sauce' },
  { id: 'm2', name: 'Masala Tea', category: 'Drinks', price: 15, available: true, description: 'Strong Indian masala tea' },
  { id: 'm3', name: 'Paneer Wrap', category: 'Meals', price: 90, available: true, description: 'Paneer tikka wrap with veggies' },
  { id: 'm4', name: 'Cold Coffee', category: 'Drinks', price: 60, available: true, description: 'Iced coffee with cream' },
  { id: 'm5', name: 'French Fries', category: 'Snacks', price: 50, available: true, description: 'Crispy fries with ketchup' },
  { id: 'm6', name: 'Veg Puff', category: 'Snacks', price: 25, available: true, description: 'Baked puff pastry with veggies' },
  { id: 'm7', name: 'Veg Thali', category: 'Meals', price: 120, available: true, description: 'Rice, dal, sabzi, roti, salad' },
  { id: 'm8', name: 'Lemon Soda', category: 'Drinks', price: 30, available: true, description: 'Fresh lime soda' },
  { id: 'm9', name: 'Chocolate Donut', category: 'Snacks', price: 40, available: true, description: 'Chocolate glazed donut' },
  { id: 'm10', name: 'Pasta Arrabbiata', category: 'Meals', price: 110, available: true, description: 'Spicy tomato pasta' },
];

const seedOrders = [
  {
    id: 'o1',
    userId: 'u1',
    customerName: 'Alice',
    tokenNumber: 'T-001-o1',
    items: [{ menuId: 'm2', name: 'Masala Tea', qty: 2, price: 15 }],
    total: 30,
    status: 'placed',
    createdAt: new Date('2025-12-11T10:00:00Z').toISOString(),
  },
];

const db = {
  users: [...seedUsers],
  menu: [...seedMenu],
  orders: [...seedOrders],
};

const createOrder = ({ userId, userName, items, total }) => {
  const id = uuid();
  const tokenNumber = `T-${(db.orders.length + 1).toString().padStart(3, '0')}-${id.slice(0, 4)}`;
  const order = {
    id,
    userId,
    customerName: userName,
    tokenNumber,
    items,
    total,
    status: 'placed',
    createdAt: new Date().toISOString(),
  };
  db.orders.unshift(order);
  return order;
};

const enrichOrder = (order) => {
  const user = db.users.find((u) => u.id === order.userId);
  const customerName = order.customerName || user?.name || 'Student';
  const items = order.items.map((i) => {
    if (i.name && i.price) return i;
    const menu = db.menu.find((m) => m.id === i.menuId) || {};
    return { ...i, name: i.name || menu.name, price: i.price || menu.price };
  });
  return {
    ...order,
    customerName,
    items,
  };
};

module.exports = {
  db,
  createOrder,
  enrichOrder,
};

