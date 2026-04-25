import { motion } from 'framer-motion';

export default function FloatingActionButton({ onClick, visible }) {
  if (!visible) return null;
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-5 z-[90] rounded-2xl flex items-center justify-center text-white text-xl cursor-pointer border-0"
      style={{
        width: 56, height: 56,
        background: 'linear-gradient(135deg, #ff6b2b, #ea580c)',
        boxShadow: '0 8px 24px rgba(255,107,43,0.5)',
      }}
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.1, y: -3, boxShadow: '0 12px 36px rgba(255,107,43,0.65)' }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{ background: 'rgba(255,107,43,0.4)' }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
      />
      <i className="fas fa-paper-plane relative z-10" />
    </motion.button>
  );
}
