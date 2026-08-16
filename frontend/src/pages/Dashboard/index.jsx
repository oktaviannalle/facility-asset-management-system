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
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import dashboardService from '../../api/dashboardService';
import assetService from '../../api/assetService';
import Card from '../../components/ui/Card';
import StatusTag from '../../components/ui/StatusTag';
import AssetCodeTag from '../../components/ui/AssetCodeTag';
import Pagination from '../../components/ui/Pagination';

// Register Chart.js components
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
  const damagedPercent = stats.total_assets > 0 ? Math.round((damagedCount / stats.total_assets) * 100) : 0;

  // Chart Data: Condition Distribution (Doughnut)
  const conditionChartData = {
    labels: ['Baik (Normal)', 'Rusak Ringan (Minor)', 'Rusak Berat (Mayor)'],
    datasets: [
      {
        data: [
          stats.condition_stats.baik || 0,
          stats.condition_stats.rusak_ringan || 0,
          stats.condition_stats.rusak_berat || 0,
        ],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        hoverBackgroundColor: ['#059669', '#D97706', '#DC2626'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // Chart Data: Maintenance Costs per Period (Line)
  const monthlyCostLabels = stats.monthly_maintenance_costs.length
    ? stats.monthly_maintenance_costs.map((m) => m.period)
    : ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026'];
  const monthlyCostValues = stats.monthly_maintenance_costs.length
    ? stats.monthly_maintenance_costs.map((m) => m.total_cost)
    : [0, 0, 0, 0];

  const maintenanceCostChartData = {
    labels: monthlyCostLabels,
    datasets: [
      {
        label: 'Biaya Maintenance (Rp)',
        data: monthlyCostValues,
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.12)',
        borderWidth: 3,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#1D4ED8',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Chart Data: Asset Category Breakdown (Bar)
  const categoryLabels = stats.category_distribution.map((c) => c.name);
  const categoryValues = stats.category_distribution.map((c) => c.assets_count);

  const categoryChartData = {
    labels: categoryLabels.length ? categoryLabels : ['Komputer', 'Proyektor', 'AC'],
    datasets: [
      {
        label: 'Jumlah Aset',
        data: categoryValues.length ? categoryValues : [0, 0, 0],
        backgroundColor: 'rgba(30, 58, 138, 0.85)',
        hoverBackgroundColor: 'rgba(30, 58, 138, 1)',
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Subtitle Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Dashboard Statistik & Analisis Aset
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Monitoring kondisi fisik aset, estimasi investasi, serta riwayat pemeliharaan SIMAFTI FTI UKSW
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchAllData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>
      </div>

      {/* 4 Executive Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Aset & Valuasi */}
        <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Aset Fisik
            </span>
            <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white font-display">
            {loading ? '...' : stats.total_assets}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Total Valuasi:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              Rp {Number(stats.total_asset_value).toLocaleString('id-ID')}
            </span>
          </div>
        </Card>

        {/* Card 2: Kondisi Baik */}
        <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Kondisi Baik
            </span>
            <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-emerald-600 dark:text-emerald-400 font-display">
            {loading ? '...' : stats.condition_stats.baik}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Rasio Operasional:</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {goodPercent}% Berfungsi
            </span>
          </div>
        </Card>

        {/* Card 3: Aset Rusak / Perlu Perbaikan */}
        <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Perlu Perbaikan
            </span>
            <div className="h-9 w-9 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-amber-600 dark:text-amber-400 font-display">
            {loading ? '...' : damagedCount}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Laporan Kerusakan:</span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
              {stats.damage_reports_stats.total} Kasus
            </span>
          </div>
        </Card>

        {/* Card 4: Total Biaya Maintenance */}
        <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Biaya Servis
            </span>
            <div className="h-9 w-9 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white font-display">
            Rp {loading ? '...' : Number(stats.total_maintenance_cost).toLocaleString('id-ID')}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Jadwal Aktif:</span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
              {stats.schedules_count} Agenda
            </span>
          </div>
        </Card>
      </div>

      {/* Chart Section 1: Condition Doughnut & Monthly Maintenance Cost Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doughnut Chart: Asset Condition Breakdown */}
        <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                </svg>
                Statistik Kondisi Aset
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Kondisi Realtime</span>
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
                  cutout: '72%',
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-display">
                  {stats.total_assets}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total Unit
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
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

        {/* Line Chart: Monthly Maintenance Cost */}
        <Card className="lg:col-span-2 p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Grafik Biaya Maintenance Per Periode
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Akumulasi Pengeluaran</span>
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
                          return ` Biaya: Rp ${Number(context.raw).toLocaleString('id-ID')}`;
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { font: { size: 11 } },
                    },
                    y: {
                      border: { dash: [4, 4] },
                      ticks: {
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
            <span className="text-slate-500 dark:text-slate-400">Total Akumulasi Biaya Perbaikan:</span>
            <span className="font-mono font-bold text-blue-700 dark:text-blue-300">
              Rp {Number(stats.total_maintenance_cost).toLocaleString('id-ID')}
            </span>
          </div>
        </Card>
      </div>

      {/* Chart Section 2: Asset Categories Bar Chart & Recent Damage Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Bar Chart */}
        <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Distribusi Aset Per Kategori
            </h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Kategori FTI</span>
          </div>
          <div className="my-4 h-56">
            <Bar
              data={categoryChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  x: { grid: { display: false } },
                  y: { ticks: { precision: 0 } },
                },
              }}
            />
          </div>
        </Card>

        {/* Recent Maintenance & Damage Activity Widget */}
        <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Laporan Kerusakan Terbaru
            </h2>
            <Link to="/damage-reports" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Lihat Semua →
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {stats.recent_damage_reports.length ? (
              stats.recent_damage_reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{report.asset_name}</p>
                    <p className="text-slate-500 dark:text-slate-400 truncate mt-0.5">{report.description}</p>
                  </div>
                  <StatusTag value={report.status} />
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">
                Belum ada laporan kerusakan tercatat.
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Main Assets Table Card */}
      <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
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
                className="w-48 sm:w-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 pl-8 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-blue-900 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
              <svg className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-900 cursor-pointer"
            >
              <option value="10">10 entries</option>
              <option value="25">25 entries</option>
              <option value="50">50 entries</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">Memuat statistik dan data aset...</div>
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
                {paginatedAssets.map((asset) => (
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
                        ? `Rp${Number(asset.purchase_price).toLocaleString('id-ID')}`
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
                          to={`/assets/${asset.id}`}
                          className="p-1 text-slate-400 hover:text-blue-900 dark:hover:text-blue-400 rounded transition-colors"
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
