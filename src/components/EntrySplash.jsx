import { motion, AnimatePresence } from 'framer-motion';

export default function EntrySplash({ visible, studentName }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9998] bg-black flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5, ease: 'easeIn' }}
        >
          {/* Burst bg */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, rgba(232,25,44,0.15) 40%, transparent 70%)',
              backgroundPosition: 'center',
              backgroundSize: '0% 0%',
            }}
            animate={{ backgroundSize: ['0% 0%', '200% 200%'] }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />

          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className="text-xs font-semibold tracking-[0.35em] uppercase text-purple-400 mb-3">
              Welcome back
            </div>
            <div
              className="text-6xl font-extrabold leading-none mb-4"
              style={{
                background: 'linear-gradient(135deg, #fff 0%, #ff6b2b 50%, #e8192c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {studentName || '—'}
            </div>
            <div className="text-white/40 text-sm tracking-wider khmer">
              សូមស្វាគមន៍ · Your dashboard is ready
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
