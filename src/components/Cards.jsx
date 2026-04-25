import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getScoreClass, getScoreColor } from '../config';

export function StatCard({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={`rounded-2xl border relative overflow-hidden ${className}`}
      style={{ background: '#161626', borderColor: 'rgba(255,255,255,0.09)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.18)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}

const ICON_STYLES = {
  purple: { bg: 'rgba(124,58,237,0.2)', color: '#a855f7' },
  orange: { bg: 'rgba(255,107,43,0.2)', color: '#ff6b2b' },
  red:    { bg: 'rgba(232,25,44,0.2)',  color: '#f87171' },
  blue:   { bg: 'rgba(59,130,246,0.2)', color: '#60a5fa' },
  green:  { bg: 'rgba(16,185,129,0.2)', color: '#34d399' },
  pink:   { bg: 'rgba(236,72,153,0.2)', color: '#f472b6' },
};

export function CriteriaCard({ icon, iconColor = 'purple', name, nameKh, scoreId, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const score = scoreId ? parseFloat(document.getElementById?.(scoreId)?.textContent) || 0 : 0;
  const cls = getScoreClass(score);
  const color = getScoreColor(score);
  const style = ICON_STYLES[iconColor];

  return (
    <StatCard delay={delay}>
      <div className="p-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm mb-2.5" style={{ background: style.bg, color: style.color }}>
          <i className={`fas fa-${icon}`} />
        </div>
        <div className="text-sm font-bold mb-0.5">{name}</div>
        <div className="text-xs mb-2.5 khmer" style={{ color: 'rgba(255,255,255,0.25)' }}>{nameKh}</div>
        <div className="flex items-center justify-between mb-2">
          <span id={scoreId} className="text-xl font-extrabold font-mono" style={{ color }}>—</span>
          <span className="text-xs text-white/20">/10</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div id={scoreId?.replace('ScoreTable', 'Bar') || ''} className="h-full rounded-full" style={{ background: color, width: '0%', transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
        </div>
      </div>
    </StatCard>
  );
}

export function FeedbackCard({ icon, iconBg, iconColor, title, textId, delay = 0 }) {
  return (
    <StatCard delay={delay}>
      <div className="p-4 flex gap-3.5 items-start">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0" style={{ background: iconBg, color: iconColor }}>
          <i className={`fas fa-${icon}`} />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{title}</div>
          <p id={textId} className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>Loading…</p>
        </div>
      </div>
    </StatCard>
  );
}
