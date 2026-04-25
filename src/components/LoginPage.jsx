import { useState } from 'react';
import { motion } from 'framer-motion';
import { SCRIPT_URL } from '../config';

export default function LoginPage({ onLogin }) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hint, setHint] = useState('');

  async function handleLogin() {
    if (!studentId.trim() || !password.trim()) {
      setError('Please enter your Student ID and password.');
      return;
    }
    setLoading(true);
    setError('');
    setHint('');
    try {
      const params = new URLSearchParams({ action: 'login', id: studentId.trim(), password: password.trim() });
      const r = await fetch(`${SCRIPT_URL}?${params}`);
      const d = await r.json();
      if (d.success) {
        onLogin(d.student);
      } else {
        setError(d.message || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  function showHint() {
    setHint('Your password is provided by your teacher. Contact them if you need help.');
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-5" style={{ zIndex: 10 }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1,
        background: `radial-gradient(ellipse 60% 50% at 20% 80%, rgba(124,58,237,0.18) 0%, transparent 60%),
                     radial-gradient(ellipse 50% 40% at 80% 20%, rgba(232,25,44,0.12) 0%, transparent 60%)`,
      }} />

      <motion.div
        className="relative w-full max-w-[420px] rounded-3xl p-10 border"
        style={{
          zIndex: 2,
          background: '#161626',
          borderColor: 'rgba(255,255,255,0.09)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #e8192c 100%)', boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}>
            <i className="fas fa-graduation-cap" />
          </div>
          <div>
            <div className="text-base font-bold leading-tight">Student Portal</div>
            <div className="text-xs text-white/35 tracking-widest uppercase mt-0.5">Evaluation Dashboard</div>
          </div>
        </div>

        <div className="h-px mb-7" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent)' }} />

        {/* ID Field */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">Student ID</label>
          <div className="relative">
            <i className="fas fa-id-badge absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm pointer-events-none" />
            <input
              type="text"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleLogin()}
              placeholder="e.g. stu001"
              autoCapitalize="none"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all duration-200"
              style={{
                background: '#1e1e30',
                border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: 'Syne, sans-serif',
              }}
              onFocus={e => { e.target.style.borderColor = '#a855f7'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="mb-2">
          <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">Password</label>
          <div className="relative">
            <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm pointer-events-none" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleLogin()}
              placeholder="Enter your password"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all duration-200"
              style={{
                background: '#1e1e30',
                border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: 'Syne, sans-serif',
              }}
              onFocus={e => { e.target.style.borderColor = '#a855f7'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        <div className="text-right mb-5">
          <button onClick={showHint} className="text-xs text-white/30 hover:text-purple-400 transition-colors">
            <i className="fas fa-question-circle mr-1" /> Forgot password?
          </button>
        </div>

        {/* Login Button */}
        <motion.button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 rounded-xl text-white font-bold text-sm tracking-wide relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #e8192c 100%)', boxShadow: '0 8px 24px rgba(124,58,237,0.3)' }}
          whileHover={{ y: -2, boxShadow: '0 12px 32px rgba(124,58,237,0.5)' }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.12), transparent)' }} />
          <div className="relative flex items-center justify-center gap-2">
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Verifying…</span>
              </>
            ) : (
              <>
                <i className="fas fa-arrow-right" />
                <span>Enter Dashboard</span>
              </>
            )}
          </div>
        </motion.button>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 rounded-xl text-sm"
            style={{ background: 'rgba(232,25,44,0.12)', border: '1px solid rgba(232,25,44,0.25)', color: '#ff6b7a' }}
          >
            {error}
          </motion.div>
        )}
        {hint && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 rounded-xl text-sm"
            style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: '#a855f7' }}
          >
            {hint}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
