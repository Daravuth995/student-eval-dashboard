import { motion, AnimatePresence } from 'framer-motion';

const GUIDE = [
  { range: '0.0 – 1.9', desc: 'Very Poor – Serious improvement needed', color: '#ef4444' },
  { range: '2.0 – 3.9', desc: 'Poor – Not enough effort', color: '#f97316' },
  { range: '4.0 – 4.9', desc: 'Below Average – Some effort', color: '#eab308' },
  { range: '5.0 – 5.9', desc: 'Average – Meets the minimum', color: '#84cc16' },
  { range: '6.0 – 6.9', desc: 'Above Average – Good effort', color: '#22c55e' },
  { range: '7.0 – 7.9', desc: 'Good – Shows effort and understanding', color: '#22c55e' },
  { range: '8.0 – 8.9', desc: 'Very Good – Strong work', color: '#06b6d4' },
  { range: '9.0 – 9.5', desc: 'Excellent – Very few mistakes', color: '#8b5cf6' },
  { range: '9.6 – 10', desc: 'Outstanding – Perfect or near-perfect!', color: '#fbbf24' },
];

export default function ScoreGuideModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[600] flex items-end justify-center p-5"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="w-full max-w-[480px] rounded-3xl overflow-hidden border"
            style={{ background: '#161626', borderColor: 'rgba(255,255,255,0.09)' }}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.09)' }}>
              <div className="flex items-center gap-2 font-bold text-sm">
                <i className="fas fa-info-circle" style={{ color: '#ff6b2b' }} />
                Score Guide
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-xs"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.5)' }}>
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="p-5 space-y-0">
              {GUIDE.map((g, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: g.color }} />
                  <div className="text-xs font-bold font-mono min-w-[80px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{g.range}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>{g.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
