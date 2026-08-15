import { useEffect, useState } from 'react';
import damageReportService from '../../api/damageReportService';
import assetService from '../../api/assetService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import StatusTag from '../../components/ui/StatusTag';
import AssetCodeTag from '../../components/ui/AssetCodeTag';
import Pagination from '../../components/ui/Pagination';
import { useAuth } from '../../context/AuthContext';

function DamageReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const initialForm = {
    asset_id: '',
    reporter_id: user?.id || '',
    description: '',
    status: 'dilaporkan',
  };
  const [form, setForm] = useState(initialForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [repRes, assetRes] = await Promise.all([
        damageReportService.getAll(),
        assetService.getAll(),
      ]);
      setReports(repRes.data.data || []);
      setAssets(assetRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...initialForm,
      asset_id: assets[0]?.id || '',
      reporter_id: user?.id || '',
    });
    setModalOpen(true);
  };

  const openEdit = (report) => {
    setEditing(report);
    setForm({
      asset_id: report.asset?.id || report.asset_id || '',
      reporter_id: report.reporter?.id || report.reporter_id || user?.id || '',
      description: report.description || '',
      status: report.status || 'dilaporkan',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await damageReportService.update(editing.id, form);
      } else {
        await damageReportService.create(form);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Gagal menyimpan laporan kerusakan.');
    }
  };

  const handleDelete = async (report) => {
    if (!confirm('Hapus laporan kerusakan ini?')) return;
    try {
      await damageReportService.delete(report.id);
      fetchData();
    } catch (err) {
      alert('Gagal menghapus laporan kerusakan.');
    }
  };

  const filteredReports = reports.filter(
    (rep) =>
      rep.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rep.asset?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rep.asset?.asset_code || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReports.length / pageSize) || 1;
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Laporan Kerusakan
            </h1>
            <span className="rounded-full bg-amber-100 dark:bg-amber-950/80 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {reports.length} Laporan
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 font-medium">
            Kelola dan pantau status laporan kerusakan dari staff hingga penanganan selesai
          </p>
        </div>
        <Button onClick={openCreate} className="shadow-sm">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Buat Laporan Baru
        </Button>
      </div>

      {/* Table Card */}
      <Card className="overflow-hidden p-6 space-y-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        {/* Table Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-900 cursor-pointer"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">entries</span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search laporan..."
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
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">Memuat laporan kerusakan...</div>
        ) : filteredReports.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Tidak ada laporan kerusakan</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Semua sarana dan prasarana dalam kondisi baik</p>
            <Button onClick={openCreate} className="mt-4">
              + Buat Laporan Kerusakan
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/90 font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Aset Rusak</th>
                  <th className="px-4 py-3.5">Deskripsi Kendala</th>
                  <th className="px-4 py-3.5">Pelapor</th>
                  <th className="px-4 py-3.5">Status Penanganan</th>
                  <th className="px-4 py-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                        {report.asset?.asset_code && (
                          <AssetCodeTag code={report.asset.asset_code} />
                        )}
                        <span className="font-bold text-slate-900 dark:text-white">{report.asset?.name || '-'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200 font-medium leading-relaxed max-w-sm">
                      {report.description}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <span>👤</span>
                        <span>{report.reporter?.name || 'Admin'}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusTag value={report.status} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEdit(report)}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit Laporan"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(report)}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Laporan"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          totalItems={filteredReports.length}
          pageSize={pageSize}
        />
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Laporan Kerusakan' : 'Buat Laporan Kerusakan Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Pilih Aset Bermasalah</span>
            <select
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white transition-all focus:border-blueprint focus:outline-none focus:ring-2 focus:ring-blueprint/20"
              value={form.asset_id}
              onChange={(e) => setForm({ ...form, asset_id: e.target.value })}
              required
            >
              <option value="">Pilih Aset</option>
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  [{a.asset_code}] {a.name}
                </option>
              ))}
            </select>
          </label>

          <Input
            label="Deskripsi Indikasi Kerusakan"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="misal: Proyektor mati total saat dinyalakan, lampu indikator merah berkedip"
          />

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Status Penanganan</span>
            <select
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white transition-all focus:border-blueprint focus:outline-none focus:ring-2 focus:ring-blueprint/20"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              required
            >
              <option value="dilaporkan">Dilaporkan (Menunggu Respon Teknisi)</option>
              <option value="diverifikasi">Diverifikasi (Sudah Dilihat Teknisi)</option>
              <option value="dikerjakan">Dalam Pengerjaan Perbaikan</option>
              <option value="selesai">Selesai (Aset Normal Kembali)</option>
            </select>
          </label>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit">Kirim Laporan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default DamageReports;
