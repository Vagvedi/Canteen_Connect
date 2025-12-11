const express = require('express');
const { db, createOrder, enrichOrder } = require('../data');
const { authMiddleware } = require('../auth');

const router = express.Router();

router.post('/cart/checkout', authMiddleware('student'), (req, res) => {
  const { items = [], address = '' } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'items required' });
  }
  const mapped = items.map(({ menuId, qty }) => {
    const menuItem = db.menu.find((m) => m.id === menuId && m.available);
    if (!menuItem) {
      throw new Error(`Item ${menuId} unavailable`);
    }
    return {
      menuId,
      qty: Number(qty) || 1,
      price: menuItem.price,
      name: menuItem.name,
    };
  });
  const total = mapped.reduce((acc, cur) => acc + cur.price * cur.qty, 0);
  try {
    const order = createOrder({
      userId: req.user.id,
      userName: req.user.name,
      items: mapped.map(({ menuId, qty, price, name }) => ({ menuId, qty, price, name })),
      total,
      address,
    });
    const enriched = enrichOrder(order);
    req.io?.to('staff').emit('order:new', enriched);
    return res.status(201).json(enriched);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.get('/orders', authMiddleware('student'), (req, res) => {
  const orders = db.orders.filter((o) => o.userId === req.user.id).map(enrichOrder);
  return res.json(orders);
});

router.get('/orders/all', authMiddleware('staff'), (req, res) => {
  return res.json(db.orders.map(enrichOrder));
});

router.patch('/orders/:id/status', authMiddleware('staff'), (req, res) => {
  const { status } = req.body;
  const allowed = ['placed', 'preparing', 'ready', 'completed'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  const idx = db.orders.findIndex((o) => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Order not found' });
  db.orders[idx].status = status;
  const enriched = enrichOrder(db.orders[idx]);
  req.io?.to(db.orders[idx].userId).emit('order:update', enriched);
  req.io?.to('staff').emit('order:update', enriched);
  return res.json(enriched);
});

module.exports = router;

