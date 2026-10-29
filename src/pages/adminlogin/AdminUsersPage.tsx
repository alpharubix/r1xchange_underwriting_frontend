import { useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import AdminSidebar from './sidebarpage';
import AdminAnchorsPage from './AdminAnchorsPage';
import AdminCustomersPage from './AdminCustomersPage';
import AdminLogsPage from './AdminLogsPage';
import PaymentDashboard from './payments/PaymentDashboard';

export default function AdminDashboardPage() {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();

  const activeTab = useMemo<
    'anchors' | 'customers' | 'logs' | 'payments'
  >(() => {
    const t = tab?.toLowerCase();
    if (t === 'anchor' || t === 'anchors') return 'anchors';
    if (t === 'customer' || t === 'customers') return 'customers';
    if (t === 'logs' || t === 'log') return 'logs';
    if (t === 'payments' || t === 'payment') return 'payments';
    return 'anchors';
  }, [tab]);

  useEffect(() => {
    const t = tab?.toLowerCase();
    const isCapital = window.location.pathname.startsWith('/Admins');
    const prefix = isCapital ? '/Admins' : '/admins';

    if (
      !t ||
      t === 'user' ||
      t === 'users' ||
      t === 'dashboard' ||
      t === 'admin' ||
      t === 'admins' ||
      (t !== 'anchor' &&
        t !== 'anchors' &&
        t !== 'customer' &&
        t !== 'customers' &&
        t !== 'logs' &&
        t !== 'log' &&
        t !== 'payments' &&
        t !== 'payment')
    ) {
      navigate(`${prefix}/anchors`, { replace: true });
    }
  }, [tab, navigate]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="admin-portal flex h-screen w-screen overflow-hidden bg-[#f4f6f9] text-slate-800 antialiased font-sans">
        <AdminSidebar />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            className="flex min-w-0 flex-1"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{
              opacity: { duration: 0.22, ease: 'easeInOut' },
              y: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
              scale: { type: 'spring', stiffness: 240, damping: 24, mass: 0.8 },
            }}
          >
            {activeTab === 'customers' ? (
              <AdminCustomersPage />
            ) : activeTab === 'logs' ? (
              <AdminLogsPage />
            ) : activeTab === 'payments' ? (
              <PaymentDashboard />
            ) : (
              <AdminAnchorsPage />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
