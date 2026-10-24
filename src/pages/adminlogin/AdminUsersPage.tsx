import { useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from './sidebarpage';
import AdminAnchorsPage from './AdminAnchorsPage';
import AdminCustomersPage from './AdminCustomersPage';
import AdminLogsPage from './AdminLogsPage';

export default function AdminDashboardPage() {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();

  const activeTab = useMemo<'anchors' | 'customers' | 'logs'>(() => {
    const t = tab?.toLowerCase();
    if (t === 'anchor' || t === 'anchors') return 'anchors';
    if (t === 'customer' || t === 'customers') return 'customers';
    if (t === 'logs' || t === 'log') return 'logs';
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
      (t !== 'anchor' && t !== 'anchors' && t !== 'customer' && t !== 'customers' && t !== 'logs' && t !== 'log')
    ) {
      navigate(`${prefix}/anchors`, { replace: true });
    }
  }, [tab, navigate]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f4f6f9] text-slate-800 antialiased font-sans">
      <AdminSidebar />

      {activeTab === 'customers' ? (
        <AdminCustomersPage />
      ) : activeTab === 'logs' ? (
        <AdminLogsPage />
      ) : (
        <AdminAnchorsPage />
      )}
    </div>
  );
}
