import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SCRIPT_URL, gasGet } from '../config';

export default function LoginPage({ onLogin }) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hint, setHint] = useState('');
  const [showPass, setShowPass] = useState(false);

  async function handleLogin() {
    const id = studentId.trim();
    const pw = password.trim();
    if (!id || !pw) {
      setError('Please enter both Student ID and password.');
      return;
    }
    setLoading(true);
    setError('');
    setHint('');
    try {
      const d = await gasGet(SCRIPT_URL, { action: 'login', id, password: pw });
      if (d.success) {
        const student = {
          ...(d.student || d),
          StudentID: d.student?.StudentID || d.student?.id || d.id || id,
          Name: d.student?.Name || d.student?.name || d.name || id,
          Password: d.student?.Password || d.student?.password || d.password || pw,
          PaymentStatus: d.student?.PaymentStatus || d.paymentStatus || 'pending',
          PaymentAmount: d.student?.PaymentAmount || d.paymentAmount || 200,
        };
        onLogin(student);
      } else {
        setError(d.message || d.error || 'Incorrect ID or password. Please try again.');
        setHint('Your Student ID and password are provided by your teacher.');
      }
    } catch (err) {
      console.error('[Login error]', err);
      setError('Cannot reach the server. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    background: '#1e1e30',
    border: '1px solid rgba(255,255,255,0.08)',
    fontFamily: 'Syne, sans-serif',
    color: '#fff',
    outline: 'none',
    width: '100%',
    borderRadius: '12px',
    padding: '14px 16px 14px 44px',
    fontSize: '14px',
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-5" style={{ zIndex: 10 }}>
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1,
        background: `radial-gradient(ellipse 60% 50% at 20% 80%, rgba(124,58,237,0.2) 0%, transparent 60%),
                     radial-gradient(ellipse 50% 40% at 80% 20%, rgba(232,25,44,0.13) 0%, transparent 60%)` }} />

      <motion.div
        className="relative w-full max-w-[420px] rounded-3xl p-9 border"
        style={{ zIndex: 2, background: '#161626', borderColor: 'rgba(255,255,255,0.09)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)' }}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div className="flex items-center gap-3 mb-7">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #e8192c 100%)', boxShadow: '0 0 32px rgba(124,58,237,0.45)' }}>
            <i className="fas fa-graduation-cap" />
          </div>
          <div>
            <div className="text-base font-bold text-white">Student Portal</div>
            <div className="text-xs tracking-widest uppercase mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Evaluation Dashboard</div>
          </div>
        </div>

        <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent)' }} />

        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Student ID</label>
          <div className="relative">
            <i className="fas fa-id-badge absolute left-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: 'rgba(255,255,255,0.2)' }} />
            <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleLogin()}
              placeholder="e.g. stu001" autoCapitalize="none" autoCorrect="off" style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#a855f7'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Password</label>
          <div className="relative">
            <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: 'rgba(255,255,255,0.2)' }} />
            <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleLogin()}
              placeholder="Enter your password" style={{ ...inputStyle, paddingRight: '44px' }}
              onFocus={e => { e.target.style.borderColor = '#a855f7'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
            <button type="button" onClick={() => setShowPass(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm"
              style={{ color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <i className={`fas fa-eye${showPass ? '-slash' : ''}`} />
            </button>
          </div>
        </div>

        <motion.button onClick={handleLogin} disabled={loading}
          className="w-full py-4 rounded-xl text-white font-bold text-sm relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #e8192c 100%)',
            boxShadow: '0 8px 24px rgba(124,58,237,0.35)', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
          whileHover={!loading ? { y: -2 } : {}} whileTap={!loading ? { scale: 0.98 } : {}}>
          <div className="relative flex items-center justify-center gap-2">
            {loading ? (
              <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /><span>Verifying…</span></>
            ) : (
              <><i className="fas fa-arrow-right" /><span>Enter Dashboard</span></>
            )}
          </div>
        </motion.button>

        <AnimatePresence>
          {error && (
            <motion.div key="err" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-3 p-3 rounded-xl text-sm flex items-start gap-2"
              style={{ background: 'rgba(232,25,44,0.1)', border: '1px solid rgba(232,25,44,0.25)', color: '#ff8088' }}>
              <i className="fas fa-exclamation-circle mt-0.5" /><span>{error}</span>
            </motion.div>
          )}
          {hint && (
            <motion.div key="hint" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-2 p-3 rounded-xl text-sm flex items-start gap-2"
              style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', color: '#a855f7' }}>
              <i className="fas fa-info-circle mt-0.5" /><span>{hint}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}