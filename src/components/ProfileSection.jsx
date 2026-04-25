import { motion } from 'framer-motion';
import RedemptionPanel from './RedemptionPanel';

function getInitials(name) {
  if (!name) return 'ST';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function PaymentChip({ status }) {
  const map = {
    paid:    { label: 'PAID',    color: '#34d399', icon: 'check-circle',        bg: 'rgba(52,211,153,0.1)' },
    pending: { label: 'PENDING', color: '#fbbf24', icon: 'exclamation-circle',  bg: 'rgba(251,191,36,0.1)' },
    unpaid:  { label: 'UNPAID',  color: '#f87171', icon: 'times-circle',        bg: 'rgba(248,113,113,0.1)' },
  };
  const cfg = map[status?.toLowerCase()] || map.pending;
  return (
    <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color: cfg.color }}>
      <i className={`fas fa-${cfg.icon}`} />
      {cfg.label}
    </div>
  );
}

export default function ProfileSection({ student, points, onSendPoints, delay = 0 }) {
  if (!student) return null;
  const initials = getInitials(student.Name || student.StudentName);
  const payStatus = student.PaymentStatus || 'pending';
  const paymentAmount = student.PaymentAmount || 200;

  return (
    <motion.div
      className="rounded-2xl border overflow-hidden mb-4"
      style={{ background: '#161626', borderColor: 'rgba(255,255,255,0.09)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      {/* Subtle purple glow top-right */}
      <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 60% at 80% 0%, rgba(124,58,237,0.18) 0%, transparent 70%)'
      }} />

      <div className="p-5 relative">
        {/* Profile row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold leading-tight">{student.Name || student.StudentName || 'Student'}</h2>
            <div className="text-xs mt-0.5 font-mono tracking-wide" style={{ color: 'rgba(255,255,255,0.35)' }}>
              ID: {student.StudentID}
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-lg flex-shrink-0"
            style={{ border: '2px solid rgba(124,58,237,0.4)', background: '#4c1d95', fontSize: '1.2rem' }}>
            {initials}
          </div>
        </div>

        {/* Separator */}
        <div className="h-px mb-4" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent)' }} />

        {/* Meta chips */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {/* Payment */}
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Payment <span className="khmer">ការបង់ថ្លៃ</span>
            </div>
            <PaymentChip status={payStatus} />
            <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
              {student.NextDue ? `Next due: ${student.NextDue}` : 'Contact teacher'}
            </div>
          </div>

          {/* Points */}
          <motion.div
            className="rounded-xl p-3 cursor-pointer"
            style={{ background: 'rgba(255,107,43,0.06)', border: '1px solid rgba(255,107,43,0.15)' }}
            onClick={onSendPoints}
            whileTap={{ scale: 0.97 }}
            whileHover={{ borderColor: 'rgba(255,107,43,0.3)' }}
          >
            <div className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Points <span className="khmer">ពិន្ទុ</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color: '#ff6b2b' }}>
              <i className="fas fa-star" />
              <span>{points ?? '—'}</span>
            </div>
            <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>Tap to send →</div>
          </motion.div>
        </div>

        {/* Redemption Panel (native, embedded) */}
        <RedemptionPanel student={student} paymentAmount={paymentAmount} />
      </div>
    </motion.div>
  );
}
