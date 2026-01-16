import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useOrderTimer } from '../hooks/useOrderTimer';

const Bill = ({ bill, onClose }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { formattedTime, isExpired } = useOrderTimer(bill);

  if (!bill) return null;

  const orderCode = bill.order_code || 'N/A';
  const registerNumber = bill.register_number;
  const isStudent = registerNumber !== null && registerNumber !== undefined;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass p-8 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl font-bold"
          >
            ×
          </button>

          {/* Order Code - Top Center, Bold, Highlighted */}
          <div className="text-center mb-6">
            <p className="text-sm text-white/60 mb-2 uppercase tracking-wider">
              Order Code
            </p>
            <motion.div
              className="text-5xl font-black gradient-text tracking-wider"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {orderCode}
            </motion.div>
            
            {/* Timer Display */}
            {bill.expires_at && bill.status !== 'completed' && bill.status !== 'cancelled' && (
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-xs text-white/60 mb-2 uppercase tracking-wider">
                  Time Remaining
                </p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  isExpired 
                    ? 'bg-red-500/30 border border-red-400/50' 
                    : 'bg-purple-500/30 border border-purple-400/50'
                }`}>
                  <span className="text-lg">⏱️</span>
                  <span className={`font-mono font-bold text-lg ${
                    isExpired ? 'text-red-300' : 'text-purple-200'
                  }`}>
                    {isExpired ? 'EXPIRED' : formattedTime}
                  </span>
                </div>
                {isExpired && (
                  <p className="text-xs text-red-400 mt-2 font-semibold">
                    Order will be marked as completed
                  </p>
                )}
              </motion.div>
            )}
          </div>

          {/* Order Details */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-white/70">Customer Name:</span>
              <span className="font-semibold text-white">{bill.customer_name || 'N/A'}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-white/70">Roll Number:</span>
              {isStudent ? (
                <span className="font-bold text-lg bg-purple-500/30 px-3 py-1 rounded-lg text-purple-200 border border-purple-400/50">
                  {registerNumber}
                </span>
              ) : (
                <span className="text-white/50 italic">N/A</span>
              )}
            </div>

            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-white/70">Order Date:</span>
              <span className="font-semibold text-white">
                {bill.created_at
                  ? new Date(bill.created_at).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'N/A'}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-white/70">Status:</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white uppercase">
                {bill.status || 'placed'}
              </span>
            </div>
          </div>

          {/* Items Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-white">Order Items</h3>
              {bill.items && bill.items.length > 3 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-sm text-purple-300 hover:text-purple-200 font-semibold"
                >
                  {isExpanded ? 'Show Less' : `View All (${bill.items.length})`}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {bill.items && bill.items.length > 0 ? (
                <>
                  {(isExpanded ? bill.items : bill.items.slice(0, 3)).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 rounded-lg bg-white/5"
                    >
                      <span className="text-white">
                        {item.name} <span className="text-white/60">× {item.qty}</span>
                      </span>
                      <span className="font-semibold text-white">
                        ₹{item.price * item.qty}
                      </span>
                    </div>
                  ))}
                  {!isExpanded && bill.items.length > 3 && (
                    <p className="text-center text-white/60 text-sm py-2">
                      + {bill.items.length - 3} more items
                    </p>
                  )}
                </>
              ) : (
                <p className="text-white/60">No items</p>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="pt-4 border-t-2 border-white/20 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-white">Total Amount:</span>
              <span className="text-3xl font-black gradient-text">₹{bill.total || 0}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-bold text-white transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Bill;

