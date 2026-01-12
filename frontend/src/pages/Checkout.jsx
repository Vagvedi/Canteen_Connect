import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkout } from '../api/client';
import { useCartStore, useAuthStore } from '../state/store';
import { useNavigate } from 'react-router-dom';
import Bill from '../components/Bill';

const Checkout = () => {
  const { items, clear } = useCartStore();
  const { user, session } = useAuthStore();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [bill, setBill] = useState(null);

  useEffect(() => {
    // Prevent admin from accessing checkout
    if (user?.role === 'admin') {
      setMessage('Admins cannot place orders. Please use a student or staff account.');
      setTimeout(() => navigate('/menu'), 2000);
    }
  }, [user, navigate]);

  const handleCheckout = async () => {
    if (!user || !session) {
      setMessage('Please login to checkout.');
      navigate('/login');
      return;
    }
    
    if (user.role === 'admin') {
      setMessage('Admins cannot place orders.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await checkout(items.map(({ menuId, qty }) => ({ menuId, qty })));
      clear();
      setBill(response.bill);
      setMessage('Order placed successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const total = items.reduce((sum, i) => sum + i.menuItem.price * i.qty, 0);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="max-w-3xl mx-auto px-4 py-8 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className="text-4xl font-bold gradient-text"
        variants={itemVariants}
      >
        Checkout
      </motion.h1>
      
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl text-yellow-800 font-medium"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {bill ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <Bill bill={bill} />
          <div className="flex gap-4">
            <motion.button
              onClick={() => navigate('/orders')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 btn-primary py-4 text-lg font-bold"
            >
              View Orders
            </motion.button>
            <motion.button
              onClick={() => {
                setBill(null);
                navigate('/menu');
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 btn-secondary py-4 text-lg font-bold"
            >
              Back to Menu
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="glass p-8 rounded-2xl shadow-xl space-y-6"
          variants={itemVariants}
        >
          <h2 className="font-bold text-2xl text-gray-800">Order Summary</h2>
          {items.length === 0 ? (
            <motion.p 
              className="text-gray-500 text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No items in cart.
            </motion.p>
          ) : (
            <motion.ul 
              className="space-y-3"
              variants={containerVariants}
            >
              {items.map((item, index) => (
                <motion.li
                  key={item.menuId}
                  variants={itemVariants}
                  className="flex justify-between items-center p-3 bg-white/50 rounded-lg border border-gray-100"
                >
                  <span className="font-medium text-gray-800">
                    {item.menuItem.name} <span className="text-gray-500">x {item.qty}</span>
                  </span>
                  <span className="font-bold text-primary-600">₹{item.menuItem.price * item.qty}</span>
                </motion.li>
              ))}
            </motion.ul>
          )}
          <motion.div 
            className="flex justify-between items-center pt-4 border-t-2 border-gray-200"
            variants={itemVariants}
          >
            <span className="font-bold text-xl text-gray-700">Total</span>
            <motion.span 
              className="text-3xl font-bold gradient-text"
              key={total}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              ₹{total}
            </motion.span>
          </motion.div>
          <div className="flex gap-4">
            <motion.button
              onClick={() => {
                clear();
                navigate('/menu');
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 btn-secondary py-4 text-lg font-bold"
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleCheckout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={items.length === 0 || loading || user?.role === 'admin'}
              className="flex-1 btn-primary py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    ⏳
                  </motion.span>
                  Placing Order...
                </span>
              ) : (
                'Place Order 🚀'
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Checkout;

