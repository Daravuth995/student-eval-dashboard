import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { getScoreColor } from '../config';

const CIRCUMFERENCE = 339.3;

export default function ScoreRing({ score, size = 160 }) {
  const [displayScore, setDisplayScore] = useState(0);
  const [dashOffset, setDashOffset] = useState(CIRCUMFERENCE);
  const color = getScoreColor(score || 0);

  useEffect(() => {
    if (!score) return;
    const timer = setTimeout(() => {
      const progress = score / 10;
      setDashOffset(CIRCUMFERENCE * (1 - progress));
      // Animate number counter
      const duration = 1800;
      const start = Date.now();
      const animate = () => {
        const elapsed = Date.now() - start;
        const t = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        setDisplayScore(+(score * ease).toFixed(1));
        if (t < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const gradId = `ringGrad-${size}`;

  return (
    <motion.div
      className="relative mx-auto"
      style={{ width: size, height: size }}
      animate={{ scale: [1, 1.01, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Glow background */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
          transform: 'scale(1.3)',
        }}
      />

      <svg className="w-full h-full" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color === '#34d399' ? '#10b981' : color === '#ff6b2b' ? '#f97316' : '#ef4444'} />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        {/* Fill */}
        <circle
          cx="60" cy="60" r="54"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>

      {/* Inner content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-mono font-extrabold leading-none" style={{ fontSize: size * 0.22, color }}>
          {displayScore.toFixed(1)}
        </div>
        <div className="text-white/30 font-mono" style={{ fontSize: size * 0.08 }}>/10</div>
      </div>
    </motion.div>
  );
}
