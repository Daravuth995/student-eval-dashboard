import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { POINTS_BACKEND_URL } from '../config';

export default function SendPointsModal({ open, onClose, student }) {
  const [receiverId, setReceiverId] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [histLoading, setHistLoading] = useState(false);

  useEffect(() => {
    if (open) loadHistory();
  }, [open]);

  async function loadHistory() {
    if (!student) return;
    setHistLoading(true);
    try {
      const params = new URLSearchParams({ action: 'getRecentTransfers', id: student.StudentID });
      const r = await fetch(`${POINTS_BACKEND_URL}?${params}`);
      const d = await r.json();
      if (d.success && d.history) setHistory(d.history);
    } catch {}
    setHistLoading(false);
  }

  async function handleSend() {
    if (!receiverId.trim() || !amount || isNaN(parseInt(amount)) || parseInt(amount) <= 0) {
      setMsg({ type: 'error', text: 'Please enter a valid receiver ID and amount.' });
      return;
    }
    if (receiverId.trim() === student?.StudentID) {
      setMsg({ type: 'error', text: 'You cannot send points to yourself.' });
      return;
    }
    setSending(true);
    setMsg(null);
    try {
      const params = new URLSearchParams({
        action: 'sendPoints',
        id: student.StudentID,
        password: student.Password,
        receiverId: receiverId.trim(),
        amount: parseInt(amount),
      });
      const r = await fetch(`${POINTS_BACKEND_URL}?${params}`, { method: 'POST' });
      const d = await r.json();
      if (d.success) {
        setMsg({ type: 'success', text: `Sent ${amount} points to ${receiverId} ✓` });
        setReceiverId('');
        setAmount('');
        loadHistory();
      } else {
        setMsg({ type: 'error', text: d.msg || 'Failed to send points.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error. Please try again.' });
    }
    setSending(false);
  }

  function handleClose() {
    setReceiverId('');
    setAmount('');
    setMsg(null);
    setHistoryOpen(false);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[500] flex items-end justify-center p-5"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={e => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            className="w-full max-w-[480px] rounded-3xl overflow-hidden border"
            style={{ background: '#161626', borderColor: 'rgba(255,255,255,0.09)' }}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Handle */}
            <div className="w-9 h-1 rounded-full mx-auto mt-3 mb-0" style={{ background: 'rgba(255,255,255,0.1)' }} />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.09)' }}>
              <div className="flex items-center gap-2 font-bold text-base">
                <i className="fas fa-paper-plane" style={{ color: '#a855f7' }} />
                <span>Send Points</span>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-xs transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.5)' }}
              >
                <i className="fas fa-times" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Receiver Student ID</label>
                <input
                  type="text"
                  value={receiverId}
                  onChange={e => setReceiverId(e.target.value)}
                  placeholder="e.g. stu002"
                  autoCapitalize="none"
                  className="w-full px-3.5 py-3 rounded-xl text-white text-sm outline-none"
                  style={{ background: '#1e1e30', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Syne, sans-serif' }}
                  onFocus={e => e.target.style.borderColor = '#a855f7'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Points to send"
                  min="1"
                  className="w-full px-3.5 py-3 rounded-xl text-white text-sm outline-none"
                  style={{ background: '#1e1e30', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Syne, sans-serif' }}
                  onFocus={e => e.target.style.borderColor = '#a855f7'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>

              {/* Send button */}
              <motion.button
                onClick={handleSend}
                disabled={sending}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #ff6b2b, #ea580c)', opacity: sending ? 0.6 : 1 }}
                whileHover={!sending ? { opacity: 0.9 } : {}}
                whileTap={!sending ? { scale: 0.98 } : {}}
              >
                {sending ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Sending…
                  </span>
                ) : (
                  <span><i className="fas fa-paper-plane mr-2" />Send Points</span>
                )}
              </motion.button>

              {msg && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl text-sm"
                  style={msg.type === 'success'
                    ? { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' }
                    : { background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }
                  }
                >
                  {msg.text}
                </motion.div>
              )}

              {/* History toggle */}
              <button
                onClick={() => setHistoryOpen(v => !v)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.5)' }}
              >
                <i className={`fas fa-chevron-${historyOpen ? 'up' : 'down'}`} />
                {historyOpen ? 'Hide History' : 'Transaction History'}
              </button>

              <AnimatePresence>
                {historyOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="max-h-60 overflow-y-auto space-y-0">
                      {histLoading ? (
                        <div className="text-center py-4 text-white/30 text-sm"><i className="fas fa-spinner fa-spin mr-2" />Loading…</div>
                      ) : history.length === 0 ? (
                        <div className="text-center py-4 text-white/30 text-sm">No transactions yet</div>
                      ) : history.map((item, i) => (
                        <div key={i} className="flex justify-between items-start py-2.5 border-b last:border-0 text-sm" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                          <div>
                            <span style={{ color: item.direction === 'sent' ? '#f87171' : '#34d399' }}>
                              {item.direction === 'sent' ? '↑ Sent to' : '↓ From'}
                            </span>
                            <span className="font-mono text-xs ml-1 text-white/60"> {item.direction === 'sent' ? item.to : item.from}</span>
                            <div className="text-xs mt-0.5 text-white/20">{new Date(item.date).toLocaleString()}</div>
                          </div>
                          <div className="font-bold font-mono" style={{ color: item.direction === 'sent' ? '#f87171' : '#34d399' }}>
                            {item.direction === 'sent' ? '-' : '+'}{item.amount}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
