import { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import ScoreRing from './ScoreRing';
import ProfileSection from './ProfileSection';
import PerformanceChart from './PerformanceChart';
import ScoreGuideModal from './ScoreGuideModal';
import { StatCard } from './Cards';
import { SCRIPT_URL, POINTS_BACKEND_URL, SAMPLE_HISTORY, getScoreClass, getScoreColor, getScoreGradient } from '../config';

const CRITERIA = [
  { id: 'pronunciation',  label: 'Pronunciation',  labelKh: 'បញ្ចេញសំឡេង',   icon: 'volume-up',  color: '#a855f7', bg: 'rgba(124,58,237,0.2)' },
  { id: 'intonation',     label: 'Intonation',     labelKh: 'លំហូរសម្លេង',   icon: 'music',      color: '#ff6b2b', bg: 'rgba(255,107,43,0.2)' },
  { id: 'communication',  label: 'Communication',  labelKh: 'ជំនាញទំនាក់ទំនង', icon: 'comments',   color: '#60a5fa', bg: 'rgba(59,130,246,0.2)' },
  { id: 'participation',  label: 'Participation',  labelKh: 'ការចូលរួម',      icon: 'users',      color: '#34d399', bg: 'rgba(16,185,129,0.2)' },
  { id: 'risingFalling',  label: 'Rising & Falling',labelKh: 'សំឡេងឡើងឬចុះ', icon: 'chart-line', color: '#f87171', bg: 'rgba(232,25,44,0.2)' },
  { id: 'linkingSounds',  label: 'Linking Sounds', labelKh: 'ការភ្ជាប់សំឡេង', icon: 'link',       color: '#f472b6', bg: 'rgba(236,72,153,0.2)' },
];

function SectionTitle({ children, delay = 0 }) {
  return (
    <motion.div
      className="text-xs font-bold uppercase tracking-[0.15em] text-white/25 mb-3 flex items-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      {children}
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.09)' }} />
    </motion.div>
  );
}

function CriterionCard({ criterion, score, delay }) {
  const cls = getScoreClass(score || 0);
  const color = getScoreColor(score || 0);
  const pct = score ? (score / 10) * 100 : 0;

  return (
    <StatCard delay={delay}>
      <div className="p-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm mb-2.5 flex-shrink-0"
          style={{ background: criterion.bg, color: criterion.color }}>
          <i className={`fas fa-${criterion.icon}`} />
        </div>
        <div className="text-sm font-bold mb-0.5">{criterion.label}</div>
        <div className="text-xs mb-2.5 khmer" style={{ color: 'rgba(255,255,255,0.25)' }}>{criterion.labelKh}</div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-extrabold font-mono" style={{ color }}>
            {score != null ? score.toFixed(1) : '—'}
          </span>
          <span className="text-xs text-white/20">/10</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full bar-animated" style={{ background: color, width: `${pct}%` }} />
        </div>
      </div>
    </StatCard>
  );
}

export default memo(function Dashboard({ student, onLogout, onSendPoints }) {
  const [scores, setScores] = useState(null);
  const [overallScore, setOverallScore] = useState(null);
  const [monthlyScore, setMonthlyScore] = useState(null);
  const [currentMonth, setCurrentMonth] = useState('—');
  const [history, setHistory] = useState([]);
  const [comments, setComments] = useState([]);
  const [points, setPoints] = useState(null);
  const [feedback, setFeedback] = useState({ strength: '', weakness: '', improvement: '' });
  const [guideOpen, setGuideOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => setScrolled(window.scrollY > 40));
    return () => window.removeEventListener('scroll', () => {});
  }, []);

  useEffect(() => {
    if (!student) return;
    loadData();
  }, [student]);

  async function loadData() {
    await Promise.allSettled([loadEvaluation(), loadPerformance(), loadComments(), loadPoints()]);
  }

  async function loadEvaluation() {
    try {
      const r = await fetch(`${SCRIPT_URL}?action=getStudentData&studentId=${student.StudentID}&t=${Date.now()}`);
      const d = await r.json();
      if (!d.error) {
        const s = {
          pronunciation: parseFloat(d.pronunciation) || 0,
          intonation: parseFloat(d.intonation) || 0,
          communication: parseFloat(d.communication) || 0,
          participation: parseFloat(d.participation) || 0,
          risingFalling: parseFloat(d.risingFalling) || 0,
          linkingSounds: parseFloat(d.linkingSounds) || 0,
        };
        setScores(s);
        const avg = Object.values(s).reduce((a, b) => a + b, 0) / Object.values(s).length;
        setOverallScore(+avg.toFixed(2));
        setFeedback({
          strength: d.strength || 'Strong engagement and clear articulation.',
          weakness: d.weakness || 'Intonation and linking sounds need work.',
          improvement: d.improvement || 'Focus on daily listening exercises and speaking drills.',
        });
      }
    } catch {}
  }

  async function loadPerformance() {
    try {
      const r = await fetch(`${SCRIPT_URL}?action=getPerformanceHistory&studentId=${student.StudentID}&t=${Date.now()}`);
      const hist = await r.json();
      const data = (!hist || hist.length === 0 || hist.error) ? SAMPLE_HISTORY : hist;
      setHistory(data);
      if (data.length > 0) {
        const latest = data[data.length - 1];
        const score = (latest.overallScore * 10).toFixed(1);
        setMonthlyScore(score);
        const [year, month] = (latest.date || '').split('-');
        const d = new Date(parseInt(year), parseInt(month) - 1);
        setCurrentMonth(d.toLocaleString('default', { month: 'long', year: 'numeric' }));
      }
    } catch {
      setHistory(SAMPLE_HISTORY);
    }
  }

  async function loadComments() {
    try {
      const r = await fetch(`${SCRIPT_URL}?action=getComments&studentId=${student.StudentID}&t=${Date.now()}`);
      const d = await r.json();
      if (Array.isArray(d)) setComments(d);
    } catch {}
  }

  async function loadPoints() {
    try {
      const params = new URLSearchParams({ action: 'login', id: student.StudentID, password: student.Password });
      const r = await fetch(`${POINTS_BACKEND_URL}?${params}`);
      const d = await r.json();
      if (d.success) setPoints(d.points);
    } catch {}
  }

  const monthlyPct = monthlyScore ? parseFloat(monthlyScore) : 0;
  const monthlyColor = monthlyPct >= 80 ? '#34d399' : monthlyPct >= 60 ? '#ff6b2b' : '#f87171';

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

  return (
    <div className="relative z-10 min-h-screen">
      {/* Header */}
      <motion.div
        className="sticky top-0 z-[100] border-b flex items-center justify-between px-5"
        style={{
          background: 'rgba(8,8,16,0.85)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(255,255,255,0.09)',
          padding: scrolled ? '10px 20px' : '14px 20px',
          transition: 'padding 0.3s',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #e8192c 100%)' }}>
            <i className="fas fa-chart-line text-white" />
          </div>
          <span className="text-base font-bold tracking-tight">EvalBoard</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGuideOpen(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all text-sm"
            style={{ border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}
          >
            <i className="fas fa-info-circle" />
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={{ border: '1px solid rgba(232,25,44,0.3)', background: 'rgba(232,25,44,0.08)', color: '#ff6b7a' }}
          >
            <i className="fas fa-sign-out-alt" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        className="px-4 pt-5 pb-28 max-w-[600px] mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >

        {/* ── HERO: OVERALL SCORE ─────────────────────────── */}
        <motion.div
          className="rounded-2xl border p-6 mb-4 text-center overflow-hidden relative"
          style={{ background: '#161626', borderColor: 'rgba(255,255,255,0.09)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.5 }}
          whileHover={{ scale: 1.01 }}
        >
          {/* Radial purple glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(124,58,237,0.22) 0%, transparent 70%)' }} />

          <div className="relative z-10">
            <div className="text-xs font-bold uppercase tracking-[0.15em] text-white/40 mb-4">
              Overall Score
            </div>

            <ScoreRing score={overallScore || 0} size={160} />

            <div className="mt-4 text-sm font-semibold text-white/60">
              {overallScore >= 9 ? '🏆 Outstanding Performance!' :
               overallScore >= 8 ? '⭐ Excellent Work' :
               overallScore >= 7 ? '👍 Good Progress' :
               overallScore >= 6 ? '📈 Keep Improving' : '💪 Room to Grow'}
            </div>

            {overallScore >= 9.6 && (
              <motion.div
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full text-xs font-bold text-black"
                style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <i className="fas fa-trophy" /> Top Performer
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ── MONTHLY PERFORMANCE ─────────────────────────── */}
        <motion.div
          className="rounded-2xl border p-5 mb-4"
          style={{ background: '#161626', borderColor: 'rgba(255,255,255,0.09)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.5 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-bold uppercase tracking-widest text-white/40">
              <span className="khmer">លទ្ធផលខែ</span> · Monthly Result
            </div>
            <div className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ color: '#a855f7', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}>
              {currentMonth}
            </div>
          </div>

          <div className="flex items-end gap-2 mb-3">
            <div className="text-6xl font-extrabold leading-none"
              style={{ color: monthlyColor }}>
              {monthlyScore ?? '—'}
            </div>
            <div className="text-sm text-white/30 mb-2">out of 100%</div>
          </div>

          <div className="h-2 rounded-full overflow-hidden relative mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              className="h-full rounded-full relative"
              style={{ background: `linear-gradient(90deg, ${monthlyColor}, ${monthlyColor}cc)` }}
              initial={{ width: '0%' }}
              animate={{ width: `${monthlyPct}%` }}
              transition={{ delay: 0.5, duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full"
                style={{ background: monthlyColor, boxShadow: `0 0 12px ${monthlyColor}` }} />
            </motion.div>
          </div>
          <div className="flex justify-between text-xs text-white/20 font-mono">
            <span>0</span><span>25</span><span>50</span><span>75</span><span>100%</span>
          </div>
        </motion.div>

        {/* ── CRITERIA GRID ─────────────────────────────────── */}
        <SectionTitle delay={0.12}>Performance Criteria</SectionTitle>
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {CRITERIA.map((c, i) => (
            <CriterionCard
              key={c.id}
              criterion={c}
              score={scores ? scores[c.id] : null}
              delay={0.13 + i * 0.06}
            />
          ))}
        </div>

        {/* ── FEEDBACK ──────────────────────────────────────── */}
        <SectionTitle delay={0.45}>Feedback</SectionTitle>
        <div className="space-y-2.5 mb-4">
          <FeedbackCard
            icon="star" iconBg="rgba(52,211,153,0.15)" iconColor="#34d399"
            title="Strength" text={feedback.strength} delay={0.46}
          />
          <FeedbackCard
            icon="exclamation-triangle" iconBg="rgba(248,113,113,0.15)" iconColor="#f87171"
            title="Weakness" text={feedback.weakness} delay={0.5}
          />
          <FeedbackCard
            icon="arrow-up" iconBg="rgba(96,165,250,0.15)" iconColor="#60a5fa"
            title="Improvements" text={feedback.improvement} delay={0.54}
          />
        </div>

        {/* ── COMMENTS ──────────────────────────────────────── */}
        <SectionTitle delay={0.56}>Comments</SectionTitle>
        <motion.div
          className="rounded-2xl border p-5 mb-4"
          style={{ background: '#161626', borderColor: 'rgba(255,255,255,0.09)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.57, duration: 0.5 }}
        >
          {comments.length === 0 ? (
            <div className="text-center py-6 text-white/20">
              <i className="fas fa-comment-dots text-3xl block mb-2" />
              <p className="text-sm">No comments yet</p>
            </div>
          ) : comments.map((c, i) => (
            <div key={i} className="py-3.5 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold" style={{ color: '#a855f7' }}>{c.teacherName || 'Teacher'}</span>
                <span className="text-xs font-mono text-white/25">{c.date || ''}</span>
              </div>
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-1.5"
                style={{ background: 'rgba(124,58,237,0.15)', color: '#a855f7' }}>
                {c.type || 'general'}
              </span>
              <p className="text-sm leading-relaxed text-white/65">{c.comment || c.text || ''}</p>
            </div>
          ))}
        </motion.div>

        {/* ── PROFILE + COUPON ──────────────────────────────── */}
        <SectionTitle delay={0.6}>Profile</SectionTitle>
        <ProfileSection
          student={student}
          points={points}
          onSendPoints={onSendPoints}
          delay={0.61}
        />

        {/* ── PERFORMANCE HISTORY ───────────────────────────── */}
        <SectionTitle delay={0.7}>Performance History</SectionTitle>
        <PerformanceChart history={history} />

      </motion.div>

      <ScoreGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
});

// FeedbackCard override with text prop (not id)
function FeedbackCard({ icon, iconBg, iconColor, title, text, delay = 0 }) {
  return (
    <StatCard delay={delay}>
      <div className="p-4 flex gap-3.5 items-start">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0" style={{ background: iconBg, color: iconColor }}>
          <i className={`fas fa-${icon}`} />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{title}</div>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>{text || 'Loading…'}</p>
        </div>
      </div>
    </StatCard>
  );
}
