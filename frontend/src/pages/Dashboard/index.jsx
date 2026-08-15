import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import assetService from '../../api/assetService';
import assetCategoryService from '../../api/assetCategoryService';
import maintenanceScheduleService from '../../api/maintenanceScheduleService';
import damageReportService from '../../api/damageReportService';
import Card from '../../components/ui/Card';
import StatusTag from '../../components/ui/StatusTag';
import AssetCodeTag from '../../components/ui/AssetCodeTag';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalCategories: 0,
    totalSchedules: 0,
    totalReports: 0,
  });
  const [recentAssets, setRecentAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [assetRes, catRes, schedRes, reportRes] = await Promise.all([
          assetService.getAll(),
          assetCategoryService.getAll(),
          maintenanceScheduleService.getAll(),
          damageReportService.getAll(),
        ]);

        const assets = assetRes.data.data || [];
        setStats({
          totalAssets: assets.length,
          totalCategories: (catRes.data.data || []).length,
          totalSchedules: (schedRes.data.data || []).length,
          totalReports: (reportRes.data.data || []).length,
        });
        setRecentAssets(assets.slice(0, 5));
      } catch (err) {
        console.error('Gagal memuat data dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Aset',
      value: stats.totalAssets,
      label: 'Unit aset terdata',
      link: '/assets',
      color: 'from-blue-600 to-blue-700',
      bgLight: 'bg-blue-50 text-blue-600',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      title: 'Kategori Aset',
      value: stats.totalCategories,
      label: 'Kategori master',
      link: '/asset-categories',
      color: 'from-emerald-600 to-emerald-700',
      bgLight: 'bg-emerald-50 text-emerald-600',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
    },
    {
      title: 'Jadwal Pemeliharaan',
      value: stats.totalSchedules,
      label: 'Jadwal preventif aktif',
      link: '/maintenance-schedules',
      color: 'from-indigo-600 to-indigo-700',
      bgLight: 'bg-indigo-50 text-indigo-600',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Laporan Kerusakan',
      value: stats.totalReports,
      label: 'Laporan tercatat',
      link: '/damage-reports',
      color: 'from-amber-600 to-amber-700',
      bgLight: 'bg-amber-50 text-amber-600',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-mono font-semibold text-blue-300 backdrop-blur-md mb-3 border border-blue-500/30">
            <span>SISTEM MANAJEMEN ASET SARPRAS</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Selamat Datang, {user?.name || 'User'}! 👋
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
            Kelola data inventaris aset sarana & prasarana, pantau jadwal perawatan preventif, serta tangani laporan kerusakan secara efisien.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, idx) => (
          <Card key={idx} className="p-5 flex flex-col justify-between hover:-translate-y-1 transition-all duration-200">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl ${card.bgLight}`}>{card.icon}</div>
              </div>
              <p className="mt-4 font-display text-3xl font-bold text-slate-900">
                {loading ? '-' : card.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{card.label}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link
                to={card.link}
                className="font-semibold text-blueprint hover:text-blueprint-hover inline-flex items-center gap-1 group"
              >
                <span>Kelola Data</span>
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Assets Table */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Assets List */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900">Aset Terbaru</h3>
                <p className="text-xs text-slate-500">Daftar aset inventaris yang baru ditambahkan</p>
              </div>
              <Link
                to="/assets"
                className="text-xs font-semibold text-blueprint hover:underline"
              >
                Lihat Semua &rarr;
              </Link>
            </div>

            {loading ? (
              <p className="py-8 text-center text-sm text-slate-500">Memuat data aset...</p>
            ) : recentAssets.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">Belum ada aset terdaftar.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Kode Aset</th>
                      <th className="px-4 py-3">Nama</th>
                      <th className="px-4 py-3">Kategori</th>
                      <th className="px-4 py-3">Kondisi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentAssets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5">
                          <AssetCodeTag code={asset.asset_code} />
                        </td>
                        <td className="px-4 py-3.5 font-medium text-slate-900">{asset.name}</td>
                        <td className="px-4 py-3.5 text-slate-500">{asset.category?.name || '-'}</td>
                        <td className="px-4 py-3.5">
                          <StatusTag value={asset.condition} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Shortcuts / Quick Links */}
        <div>
          <Card className="p-6">
            <h3 className="font-display text-base font-bold text-slate-900 mb-1">Aksi Cepat</h3>
            <p className="text-xs text-slate-500 mb-5">Pintasan navigasi untuk tugas harian</p>

            <div className="space-y-3">
              <Link
                to="/assets"
                className="flex items-center gap-3.5 rounded-xl border border-slate-200 p-3.5 hover:border-blueprint hover:bg-blue-50/50 transition-all group"
              >
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Input Data Aset</p>
                  <p className="text-xs text-slate-500">Tambah aset fisik baru ke sistem</p>
                </div>
              </Link>

              <Link
                to="/damage-reports"
                className="flex items-center gap-3.5 rounded-xl border border-slate-200 p-3.5 hover:border-amber-500 hover:bg-amber-50/50 transition-all group"
              >
                <div className="p-2 rounded-lg bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Lapor Kerusakan</p>
                  <p className="text-xs text-slate-500">Buat laporan kerusakan aset baru</p>
                </div>
              </Link>

              <Link
                to="/maintenance-logs"
                className="flex items-center gap-3.5 rounded-xl border border-slate-200 p-3.5 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group"
              >
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Catat Perbaikan</p>
                  <p className="text-xs text-slate-500">Simpan riwayat perawatan teknisi</p>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
