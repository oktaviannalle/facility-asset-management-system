import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard' },
  { to: '/asset-categories', label: 'Kategori Aset' },
  { to: '/locations', label: 'Lokasi' },
  { to: '/assets', label: 'Aset' },
  { to: '/maintenance-schedules', label: 'Jadwal Pemeliharaan' },
  { to: '/maintenance-logs', label: 'Riwayat Pemeliharaan' },
  { to: '/damage-reports', label: 'Laporan Kerusakan' },
];

function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className="flex w-64 flex-shrink-0 flex-col bg-ink text-white">
        <div className="border-b border-white/10 p-6">
          <p className="font-mono text-[10px] uppercase tracking-wider text-steel">
            FTI UKSW / SARPRAS
          </p>
          <p className="mt-1 font-display text-lg font-bold">
            Sistem Manajemen Aset
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blueprint text-white'
                    : 'text-steel hover:bg-ink-light hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="font-mono text-xs text-steel">{user?.role}</p>
          <button
            onClick={logout}
            className="mt-3 text-xs text-steel hover:text-white"
          >
            Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
