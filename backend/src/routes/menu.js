const express = require('express');
const { db } = require('../data');
const { authMiddleware } = require('../auth');

const router = express.Router();

router.get('/', (req, res) => {
  const { category } = req.query;
  const items = category ? db.menu.filter((m) => m.category === category) : db.menu;
  res.json(items);
});

router.get('/:id', (req, res) => {
  const item = db.menu.find((m) => m.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Menu item not found' });
  return res.json(item);
});

router.patch('/:id', authMiddleware('staff'), (req, res) => {
  const idx = db.menu.findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Menu item not found' });
  db.menu[idx] = { ...db.menu[idx], ...req.body };
  return res.json(db.menu[idx]);
});

router.post('/', authMiddleware('staff'), (req, res) => {
  const { name, category, price, available = true, description = '' } = req.body;
  if (!name || !category || !price) {
    return res.status(400).json({ message: 'name, category, price required' });
  }
  const item = {
    id: `m${db.menu.length + 1}`,
    name,
    category,
    price,
    available,
    description,
  };
  db.menu.push(item);
  return res.status(201).json(item);
});

module.exports = router;

