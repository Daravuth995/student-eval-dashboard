import { useState, useEffect } from 'react';
import ParticleCanvas from './components/ParticleCanvas';
import LoadingScreen from './components/LoadingScreen';
import EntrySplash from './components/EntrySplash';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import FloatingActionButton from './components/FloatingActionButton';
import SendPointsModal from './components/SendPointsModal';
import Toast from './components/Toast';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [splash, setSplash] = useState(false);
  const [student, setStudent] = useState(null);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  function showToast(message) {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  }

  function handleLogin(studentData) {
    setStudent(studentData);
    setSplash(true);
    showToast('Login successful!');
    // Show splash for 2.5s then hide
    setTimeout(() => setSplash(false), 2500);
  }

  function handleLogout() {
    setStudent(null);
    setSendModalOpen(false);
    setSplash(false);
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(to bottom right, #000000, #0f172a, #1a0533)' }}
    >
      <ParticleCanvas />
      <LoadingScreen visible={loading} />
      <EntrySplash
        visible={splash}
        studentName={student?.Name || student?.StudentName || ''}
      />

      {/* Payment banner */}
      {student && student.PaymentStatus === 'unpaid' && (
        <div
          className="fixed top-0 left-0 right-0 z-[200] text-center text-sm font-semibold py-2.5 px-5"
          style={{ background: 'linear-gradient(90deg, #c44a15, #ff6b2b)' }}
        >
          <i className="fas fa-exclamation-circle mr-2" />
          Your next payment is due soon!{' '}
          <button
            onClick={() => setSendModalOpen(true)}
            className="underline ml-1 text-white"
          >
            Pay now
          </button>
        </div>
      )}

      {/* Render based on state */}
      {!student ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        !splash && (
          <Dashboard
            student={student}
            onLogout={handleLogout}
            onSendPoints={() => setSendModalOpen(true)}
          />
        )
      )}

      <FloatingActionButton
        visible={!!student && !splash}
        onClick={() => setSendModalOpen(true)}
      />

      <SendPointsModal
        open={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
        student={student}
      />

      <Toast visible={toast.visible} message={toast.message} />
    </div>
  );
}
