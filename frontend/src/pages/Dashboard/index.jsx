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
    goodCondition: 0,
    needMaintenance: 0,
    damageReports: 0,
  });
  const [recentAssets, setRecentAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
        const good = assets.filter((a) => a.condition === 'baik').length;
        const maintenance = (schedRes.data.data || []).length;
        const reports = (reportRes.data.data || []).length;

        setStats({
          totalAssets: assets.length,
          goodCondition: good,
          needMaintenance: maintenance,
          damageReports: reports,
        });
        setRecentAssets(assets);
      } catch (err) {
        console.error('Gagal memuat data dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const filteredAssets = recentAssets.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.asset_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const goodPercent = stats.totalAssets > 0 ? Math.round((stats.goodCondition / stats.totalAssets) * 100) : 0;
  const maintenancePercent = stats.totalAssets > 0 ? Math.round((stats.needMaintenance / stats.totalAssets) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Subtitle Banner */}
      <div className="flex flex-col gap-1 border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="font-display text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Dashboard Manajemen Aset (SIMAFTI)
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Portal internal untuk pencatatan dan pemantauan aset FTI UKSW
        </p>
      </div>

      {/* 3 Metric Cards matching Figma SIMAFTI Style */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Card 1: Semua Aset */}
        <Card className="overflow-hidden p-0 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="p-4 bg-white dark:bg-slate-900 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white font-display">
                {loading ? '-' : stats.totalAssets}
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Semua Aset
            </span>
          </div>
          <div className="bg-gradient-to-r from-blue-950 to-blue-900 p-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              <span className="text-xs font-bold">Aset FTI UKSW</span>
            </div>
            <span className="rounded bg-blue-900/80 px-2 py-0.5 text-xs font-mono font-bold text-blue-200">
              100%
            </span>
          </div>
        </Card>

        {/* Card 2: Kondisi Baik */}
        <Card className="overflow-hidden p-0 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="p-4 bg-white dark:bg-slate-900 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white font-display">
                {loading ? '-' : stats.goodCondition}
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Aset Baik
            </span>
          </div>
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold">Kondisi Baik</span>
            </div>
            <span className="rounded bg-blue-950/80 px-2 py-0.5 text-xs font-mono font-bold text-emerald-300">
              {goodPercent}%
            </span>
          </div>
        </Card>

        {/* Card 3: Pemeliharaan */}
        <Card className="overflow-hidden p-0 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="p-4 bg-white dark:bg-slate-900 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white font-display">
                {loading ? '-' : stats.needMaintenance}
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pemeliharaan
            </span>
          </div>
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 p-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-xs font-bold">Aset Terjadwal</span>
            </div>
            <span className="rounded bg-blue-950/80 px-2 py-0.5 text-xs font-mono font-bold text-amber-300">
              {maintenancePercent}%
            </span>
          </div>
        </Card>
      </div>

      {/* Main SIMAFTI Table Card */}
      <Card className="p-6 border border-slate-200 dark:border-slate-800">
        {/* Table Toolbar */}
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Show</span>
            <select className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-900">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">entries</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Table Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 sm:w-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 pl-8 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-blue-900 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
              <svg className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500">Record History</span>
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">Memuat data aset...</div>
        ) : filteredAssets.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400">Data aset tidak ditemukan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3">No. Seri</th>
                  <th className="px-4 py-3">Nama Barang</th>
                  <th className="px-4 py-3">Tanggal Beli</th>
                  <th className="px-4 py-3">Lokasi</th>
                  <th className="px-4 py-3">Harga Barang</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3.5">
                      <AssetCodeTag code={asset.asset_code} />
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">{asset.name}</td>
                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 font-mono">
                      {asset.purchase_date || '-'}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                      {asset.location ? `${asset.location.building} ${asset.location.room || ''}` : '-'}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-800 dark:text-slate-200 font-semibold">
                      {asset.purchase_price
                        ? `Rp${Number(asset.purchase_price).toLocaleString('id-ID')}.00`
                        : '-'}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                      {asset.category?.name || '-'}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusTag value={asset.condition} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          to="/assets"
                          className="p-1 text-slate-400 hover:text-blue-900 dark:hover:text-blue-400 rounded transition-colors"
                          title="Lihat Detail"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          to="/assets"
                          className="p-1 text-slate-400 hover:text-blue-900 dark:hover:text-blue-400 rounded transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Dashboard;
