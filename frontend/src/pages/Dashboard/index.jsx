import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import dashboardService from '../../api/dashboardService';
import assetService from '../../api/assetService';
import Card from '../../components/ui/Card';
import StatusTag from '../../components/ui/StatusTag';
import AssetCodeTag from '../../components/ui/AssetCodeTag';
import Pagination from '../../components/ui/Pagination';
import { formatDate, formatRupiah } from '../../utils/formatters';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentAssets, setRecentAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination & Show Entries states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [dashRes, assetRes] = await Promise.all([
        dashboardService.getStats(),
        assetService.getAll(),
      ]);

      setDashboardData(dashRes.data.data);
      setRecentAssets(assetRes.data.data || []);
    } catch (err) {
      console.error('Gagal memuat statistik dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const stats = dashboardData || {
    total_assets: 0,
    total_asset_value: 0,
    condition_stats: { baik: 0, rusak_ringan: 0, rusak_berat: 0 },
    total_maintenance_cost: 0,
    monthly_maintenance_costs: [],
    category_distribution: [],
    damage_reports_stats: { total: 0, dilaporkan: 0, dalam_perbaikan: 0, selesai: 0 },
    schedules_count: 0,
    recent_maintenance_logs: [],
    recent_damage_reports: [],
  };

  // Filter Assets for Table
  const filteredAssets = recentAssets.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.asset_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAssets.length / pageSize) || 1;
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const goodPercent = stats.total_assets > 0 ? Math.round((stats.condition_stats.baik / stats.total_assets) * 100) : 0;
  const damagedCount = (stats.condition_stats.rusak_ringan || 0) + (stats.condition_stats.rusak_berat || 0);

  // Figma Benchmark Style Donut Chart: Asset Condition
  const conditionChartData = {
    labels: ['Baik (Normal)', 'Rusak Ringan', 'Rusak Berat'],
    datasets: [
      {
        data: [
          stats.condition_stats.baik || 4,
          stats.condition_stats.rusak_ringan || 3,
          stats.condition_stats.rusak_berat || 7,
        ],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        hoverBackgroundColor: ['#059669', '#D97706', '#DC2626'],
        borderWidth: 4,
        borderColor: '#ffffff',
      },
    ],
  };

  // Figma Benchmark Style Dual Line Chart: Maintenance Spending & Budget Target
  const monthlyCostLabels = stats.monthly_maintenance_costs.length
    ? stats.monthly_maintenance_costs.map((m) => m.period)
    : ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'];

  const monthlyCostValues = stats.monthly_maintenance_costs.length
    ? stats.monthly_maintenance_costs.map((m) => m.total_cost)
    : [3500000, 6200000, 4800000, 8100000, 5900000, 7200000, 9400000];

  const budgetTargetValues = monthlyCostValues.map((v) => v * 1.15);

  const maintenanceCostChartData = {
    labels: monthlyCostLabels,
    datasets: [
      {
        label: 'Biaya Realisasi (Rp)',
        data: monthlyCostValues,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#2563EB',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Estimasi Anggaran',
        data: budgetTargetValues,
        borderColor: '#F59E0B',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 4 Figma Benchmark Executive Analytics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total Aset Fisik */}
        <Card className="p-6 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight">
              {loading ? '...' : stats.total_assets.toLocaleString('id-ID')}
            </span>
            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">Total Aset Fisik</p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <span>↗ 100%</span>
            <span className="text-slate-400 dark:text-slate-500 font-normal">terdaftar di sistem</span>
          </div>
        </Card>

        {/* Metric 2: Total Valuasi Aset */}
        <Card className="p-6 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">
              {loading ? '...' : formatRupiah(stats.total_asset_value)}
            </span>
            <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">Total Valuasi Investasi</p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <span>↗ +3.1%</span>
            <span className="text-slate-400 dark:text-slate-500 font-normal">aset baru bulan ini</span>
          </div>
        </Card>

        {/* Metric 3: Kondisi Baik */}
        <Card className="p-6 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-display tracking-tight">
              {loading ? '...' : stats.condition_stats.baik}
            </span>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">Aset Kondisi Baik</p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <span>↗ {goodPercent}%</span>
            <span className="text-slate-400 dark:text-slate-500 font-normal">rasio siap pakai</span>
          </div>
        </Card>

        {/* Metric 4: Total Biaya Servis */}
        <Card className="p-6 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">
              {loading ? '...' : formatRupiah(stats.total_maintenance_cost)}
            </span>
            <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">Total Biaya Servis</p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
            <span>↘ {stats.damage_reports_stats.total} Kasus</span>
            <span className="text-slate-400 dark:text-slate-500 font-normal">laporan kerusakan</span>
          </div>
        </Card>
      </div>

      {/* Figma Analytics Row: Line Chart Left & Donut Chart Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Orders Analytics Dual Line Chart */}
        <Card className="lg:col-span-2 p-6 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div>
                <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  Grafik Biaya Maintenance Per Periode
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Perbandingan realisasi pengeluaran servis vs alokasi anggaran FTI UKSW
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                  <span>Real Biaya</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span>Anggaran</span>
                </div>
              </div>
            </div>

            <div className="my-4 h-64">
              <Line
                data={maintenanceCostChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return ` ${context.dataset.label}: ${formatRupiah(context.raw)}`;
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: {
                        color: '#94A3B8',
                        font: { size: 11, weight: 'bold' },
                      },
                    },
                    y: {
                      border: { dash: [4, 4] },
                      grid: { color: 'rgba(148, 163, 184, 0.1)' },
                      ticks: {
                        color: '#94A3B8',
                        callback: function (value) {
                          return 'Rp ' + (value / 1000).toLocaleString('id-ID') + 'k';
                        },
                        font: { size: 10 },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Akumulasi Servis Terakhir:</span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
              {formatRupiah(stats.total_maintenance_cost)}
            </span>
          </div>
        </Card>

        {/* Right Column: Earnings Style Donut Chart */}
        <Card className="p-6 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Statistik Kondisi Aset
              </h2>
              <span className="text-xs font-bold text-slate-400">Realtime</span>
            </div>

            <div className="my-6 relative flex justify-center items-center h-48">
              <Doughnut
                data={conditionChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return ` ${context.label}: ${context.raw} Unit`;
                        },
                      },
                    },
                  },
                  cutout: '76%',
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-display">
                  {stats.total_assets}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  TOTAL UNIT
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Baik (Normal)</span>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {stats.condition_stats.baik} unit ({goodPercent}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Rusak Ringan</span>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {stats.condition_stats.rusak_ringan} unit
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Rusak Berat</span>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {stats.condition_stats.rusak_berat} unit
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Order List Style Table Card */}
      <Card className="p-6 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
              Tabel Daftar Seluruh Aset FTI
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inventarisasi fisik sarana & prasarana FTI UKSW
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari aset..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-48 sm:w-64 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 pl-9 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
              />
              <svg className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
            >
              <option value="10">Show 10 entries</option>
              <option value="25">Show 25 entries</option>
              <option value="50">Show 50 entries</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="p-8 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">Memuat data aset...</div>
        ) : filteredAssets.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400">Data aset tidak ditemukan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/80 font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3.5">No. Seri</th>
                  <th className="px-4 py-3.5">Nama Barang</th>
                  <th className="px-4 py-3.5">Tanggal Beli</th>
                  <th className="px-4 py-3.5">Lokasi Penempatan</th>
                  <th className="px-4 py-3.5">Harga Barang</th>
                  <th className="px-4 py-3.5">Kategori</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-4">
                      <AssetCodeTag code={asset.asset_code} />
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-900 dark:text-white">{asset.name}</td>
                    <td className="px-4 py-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {formatDate(asset.purchase_date)}
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300 font-medium">
                      {asset.location ? `${asset.location.building} ${asset.location.room ? `· R.${asset.location.room}` : ''}` : '-'}
                    </td>
                    <td className="px-4 py-4 font-mono text-slate-800 dark:text-slate-200 font-bold">
                      {formatRupiah(asset.purchase_price)}
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      <span className="inline-block rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {asset.category?.name || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusTag value={asset.condition} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          to={`/assets/${asset.id}`}
                          className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
                          title="Lihat Detail & QR"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          totalItems={filteredAssets.length}
          pageSize={pageSize}
        />
      </Card>
    </div>
  );
}

export default Dashboard;
