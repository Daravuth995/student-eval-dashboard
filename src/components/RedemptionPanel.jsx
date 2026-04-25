import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SCRIPT_URL } from '../config';

export default function RedemptionPanel({ student, paymentAmount = 200 }) {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [afterAmount, setAfterAmount] = useState(paymentAmount);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  async function apply() {
    if (!code.trim()) { setMsg({ type: 'error', text: 'Please enter a coupon code.' }); return; }
    setLoading(true);
    setMsg(null);
    try {
      const r = await fetch(`${SCRIPT_URL}?action=validateCoupon&studentId=${student.StudentID}&couponCode=${code.trim()}&t=${Date.now()}`);
      const d = await r.json();
      if (d.success) {
        setDiscount(d.discountPercent);
        setAfterAmount(d.newAmount);
        setMsg({ type: 'success', text: d.message });
      } else {
        setDiscount(0);
        setAfterAmount(paymentAmount);
        setMsg({ type: 'error', text: d.message || 'Invalid coupon code.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Error validating coupon.' });
    }
    setLoading(false);
  }

  return (
    <motion.div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255,107,43,0.08) 0%, rgba(255,255,255,0.02) 100%)',
        borderStyle: 'dashed',
        borderColor: 'rgba(255,255,255,0.18)',
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,107,43,0.2)', color: '#ff6b2b' }}>
          <i className="fas fa-ticket-alt text-xs" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>Coupon Redemption</span>
      </div>

      <div className="px-4 pb-4 space-y-3">
        {/* Input row */}
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && apply()}
            placeholder="COUPON-CODE"
            className="flex-1 px-3 py-2.5 rounded-xl text-white text-sm outline-none font-mono tracking-wider"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
            onFocus={e => e.target.style.borderColor = '#a855f7'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
          <motion.button
            onClick={apply}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl font-bold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #e8192c)' }}
            whileTap={{ scale: 0.96 }}
          >
            {loading ? <i className="fas fa-spinner fa-spin" /> : 'Apply'}
          </motion.button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Amount', value: `$${paymentAmount}` },
            { label: 'Discount', value: `${discount}%`, highlight: discount > 0 },
            { label: 'After', value: `$${afterAmount}`, highlight: discount > 0 },
          ].map((item, i) => (
            <div key={i} className="rounded-xl text-center py-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>{item.label}</div>
              <div className="font-bold font-mono text-sm" style={{ color: item.highlight ? '#34d399' : 'rgba(255,255,255,0.8)' }}>{item.value}</div>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {msg && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-2.5 rounded-xl text-xs"
              style={msg.type === 'success'
                ? { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' }
                : { background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }
              }
            >
              {msg.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
