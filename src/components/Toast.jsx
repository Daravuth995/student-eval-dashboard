import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ message, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-24 left-1/2 z-[800] flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap"
          style={{
            background: '#161626',
            border: '1px solid rgba(52,211,153,0.3)',
            color: '#34d399',
            x: '-50%',
          }}
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 10, x: '-50%' }}
          transition={{ duration: 0.3 }}
        >
          <i className="fas fa-check-circle" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
