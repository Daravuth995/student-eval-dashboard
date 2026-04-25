import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center gap-8"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeIn' }}
        >
          <div className="relative w-20 h-20">
            <svg className="w-full h-full animate-spin" viewBox="0 0 36 36">
              <defs>
                <linearGradient id="loaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#e8192c" />
                </linearGradient>
              </defs>
              <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="16"
                fill="none" stroke="url(#loaderGrad)" strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="200" strokeDashoffset="60"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-white text-2xl">
              <i className="fas fa-graduation-cap" />
            </div>
          </div>

          <motion.div
            className="text-sm font-bold tracking-[0.25em] uppercase text-white/50"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Student Portal
          </motion.div>

          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ background: i === 0 ? '#a855f7' : i === 1 ? '#ff6b2b' : '#e8192c' }}
                animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
