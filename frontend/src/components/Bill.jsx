import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useOrderTimer } from '../hooks/useOrderTimer';
import { X, Printer } from 'lucide-react';

const Bill = ({ bill, onClose }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { formattedTime, isExpired } = useOrderTimer(bill);

  if (!bill) return null;
  const orderCode = bill.order_code || 'N/A';
  const registerNumber = bill.register_number;
  const subtotal = bill.total;
  const dateStr = new Date(bill.created_at).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/30 backdrop-blur-[3px]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-cream-light max-w-[380px] w-full overflow-hidden rounded-2xl shadow-neu-deep"
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
        >
          {/* ── Receipt Header ── */}
          <div className="bg-teal px-6 pt-5 pb-4 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-teal-light font-semibold mb-1">
                Canteen Connect
              </p>
              <h2 className="font-display text-xl font-bold">Receipt</h2>
              <p className="text-teal-light text-xs mt-1">Campus Canteen • Est. 2024</p>
            </div>
          </div>

          {/* ── Zigzag edge ── */}
          <div className="h-3 bg-teal relative">
            <svg viewBox="0 0 380 12" className="absolute bottom-0 left-0 w-full" preserveAspectRatio="none">
              <path d="M0,12 L0,0 Q5,12 10,0 Q15,12 20,0 Q25,12 30,0 Q35,12 40,0 Q45,12 50,0 Q55,12 60,0 Q65,12 70,0 Q75,12 80,0 Q85,12 90,0 Q95,12 100,0 Q105,12 110,0 Q115,12 120,0 Q125,12 130,0 Q135,12 140,0 Q145,12 150,0 Q155,12 160,0 Q165,12 170,0 Q175,12 180,0 Q185,12 190,0 Q195,12 200,0 Q205,12 210,0 Q215,12 220,0 Q225,12 230,0 Q235,12 240,0 Q245,12 250,0 Q255,12 260,0 Q265,12 270,0 Q275,12 280,0 Q285,12 290,0 Q295,12 300,0 Q305,12 310,0 Q315,12 320,0 Q325,12 330,0 Q335,12 340,0 Q345,12 350,0 Q355,12 360,0 Q365,12 370,0 Q375,12 380,0 L380,12 Z" fill="#F0EBE3"/>
            </svg>
          </div>

          {/* ── Order info row ── */}
          <div className="px-6 pt-4 pb-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-charcoal-40 uppercase tracking-wider font-bold">Order No.</p>
                <p className="font-mono text-lg font-bold text-charcoal tracking-wider">{orderCode}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-charcoal-40 uppercase tracking-wider font-bold">Status</p>
                <span className={`badge-neu ${bill.status} mt-0.5`}>{bill.status}</span>
              </div>
            </div>
          </div>

          {/* ── Dashed divider ── */}
          <div className="mx-5 border-b-2 border-dashed border-charcoal-40/20" />

          {/* ── Customer details ── */}
          <div className="px-6 py-3 text-[13px] space-y-1.5">
            <div className="flex justify-between">
              <span className="text-charcoal-40">Customer</span>
              <span className="text-charcoal font-semibold">{bill.customer_name || 'N/A'}</span>
            </div>
            {registerNumber && (
              <div className="flex justify-between">
                <span className="text-charcoal-40">Roll No.</span>
                <span className="text-charcoal font-semibold font-mono">{registerNumber}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-charcoal-40">Date & Time</span>
              <span className="text-charcoal font-semibold">{dateStr}</span>
            </div>
          </div>

          {/* ── Dashed divider ── */}
          <div className="mx-5 border-b-2 border-dashed border-charcoal-40/20" />

          {/* ── Items table ── */}
          <div className="px-6 py-3">
            {/* Header */}
            <div className="flex text-[10px] uppercase tracking-wider font-bold text-charcoal-40 pb-2 border-b border-charcoal-40/15">
              <span className="flex-1">Item</span>
              <span className="w-12 text-center">Qty</span>
              <span className="w-14 text-center">Rate</span>
              <span className="w-16 text-right">Amount</span>
            </div>

            {/* Items */}
            <div className="py-1">
              {(isExpanded ? bill.items : bill.items?.slice(0, 6))?.map((item, i) => (
                <div key={i} className="flex items-center py-2 text-[13px]">
                  <span className="flex-1 text-charcoal font-medium truncate pr-2">{item.name}</span>
                  <span className="w-12 text-center text-charcoal-60 font-mono">{item.qty}</span>
                  <span className="w-14 text-center text-charcoal-60 font-mono">₹{item.price}</span>
                  <span className="w-16 text-right text-charcoal font-semibold font-mono tabular-nums">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            {!isExpanded && bill.items?.length > 6 && (
              <button
                onClick={() => setIsExpanded(true)}
                className="text-xs font-semibold text-teal hover:text-teal-dark transition-colors py-1"
              >
                + {bill.items.length - 6} more items
              </button>
            )}
          </div>

          {/* ── Dashed divider ── */}
          <div className="mx-5 border-b-2 border-dashed border-charcoal-40/20" />

          {/* ── Totals ── */}
          <div className="px-6 py-3 space-y-1.5 text-[13px]">
            <div className="flex justify-between">
              <span className="text-charcoal-60">Subtotal</span>
              <span className="text-charcoal font-mono tabular-nums">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-60">Tax</span>
              <span className="text-charcoal font-mono tabular-nums">₹0.00</span>
            </div>
            <div className="mx-5 border-b border-charcoal-40/15 my-1" />
            <div className="flex justify-between items-baseline pt-1">
              <span className="text-sm font-bold text-charcoal uppercase tracking-wide">Grand Total</span>
              <span className="font-display text-xl font-bold text-teal tabular-nums">₹{subtotal}</span>
            </div>
          </div>

          {/* ── Dashed divider ── */}
          <div className="mx-5 border-b-2 border-dashed border-charcoal-40/20" />

          {/* ── Footer ── */}
          <div className="px-6 pt-3 pb-2 text-center">
            <p className="text-[10px] text-charcoal-40 uppercase tracking-widest font-bold">
              Thank you for ordering!
            </p>
            <p className="text-[10px] text-charcoal-40 mt-0.5">
              Show this receipt at the counter for pickup
            </p>
          </div>

          {/* ── Action button ── */}
          <div className="px-6 pb-5 pt-2">
            <button onClick={onClose} className="btn-neu-accent w-full h-11 text-sm">
              Close Receipt
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Bill;
