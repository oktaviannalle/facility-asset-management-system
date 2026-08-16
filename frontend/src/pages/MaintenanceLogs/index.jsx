import { useEffect, useState } from 'react';
import maintenanceLogService from '../../api/maintenanceLogService';
import assetService from '../../api/assetService';
import maintenanceScheduleService from '../../api/maintenanceScheduleService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import AssetCodeTag from '../../components/ui/AssetCodeTag';
import Pagination from '../../components/ui/Pagination';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatRupiah } from '../../utils/formatters';

function MaintenanceLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [assets, setAssets] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const initialForm = {
    asset_id: '',
    schedule_id: '',
    technician_id: user?.id || '',
    action_taken: '',
    cost: '',
    maintenance_date: new Date().toISOString().split('T')[0],
  };
  const [form, setForm] = useState(initialForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [logRes, assetRes, schedRes] = await Promise.all([
        maintenanceLogService.getAll(),
        assetService.getAll(),
        maintenanceScheduleService.getAll(),
      ]);
      setLogs(logRes.data.data || []);
      setAssets(assetRes.data.data || []);
      setSchedules(schedRes.data.data || []);
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
      technician_id: user?.id || '',
    });
    setModalOpen(true);
  };

  const openEdit = (logItem) => {
    setEditing(logItem);
    setForm({
      asset_id: logItem.asset?.id || logItem.asset_id || '',
      schedule_id: logItem.schedule?.id || logItem.schedule_id || '',
      technician_id: logItem.technician?.id || logItem.technician_id || user?.id || '',
      action_taken: logItem.action_taken || '',
      cost: logItem.cost || '',
      maintenance_date: logItem.maintenance_date || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        schedule_id: form.schedule_id || null,
      };
      if (editing) {
        await maintenanceLogService.update(editing.id, payload);
      } else {
        await maintenanceLogService.create(payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Gagal menyimpan riwayat pemeliharaan.');
    }
  };

  const handleDelete = async (logItem) => {
    if (!confirm('Hapus catatan riwayat pemeliharaan ini?')) return;
    try {
      await maintenanceLogService.delete(logItem.id);
      fetchData();
    } catch (err) {
      alert('Gagal menghapus riwayat pemeliharaan.');
    }
  };

  const filteredLogs = logs.filter(
    (logItem) =>
      logItem.action_taken.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (logItem.asset?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (logItem.asset?.asset_code || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = filteredLogs.slice(
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
              Riwayat Pemeliharaan
            </h1>
            <span className="rounded-full bg-blue-100 dark:bg-blue-950/80 px-2.5 py-0.5 text-xs font-mono font-bold text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {logs.length} Catatan
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 font-medium">
            Histori dan catatan biaya pekerjaan perbaikan aset oleh teknisi FTI UKSW
          </p>
        </div>
        <Button onClick={openCreate} className="shadow-sm">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Catat Pemeliharaan
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
              placeholder="Search riwayat..."
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
          <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">Memuat riwayat pemeliharaan...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Belum ada riwayat pemeliharaan</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Catat aktivitas perawatan fisik aset yang telah dikerjakan</p>
            <Button onClick={openCreate} className="mt-4">
              + Catat Pemeliharaan
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/90 font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Tanggal</th>
                  <th className="px-4 py-3.5">Aset Target</th>
                  <th className="px-4 py-3.5">Tindakan Dilakukan</th>
                  <th className="px-4 py-3.5">Teknisi</th>
                  <th className="px-4 py-3.5">Biaya (Rp)</th>
                  <th className="px-4 py-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedLogs.map((logItem) => (
                  <tr key={logItem.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                      {formatDate(logItem.maintenance_date)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                        {logItem.asset?.asset_code && (
                          <AssetCodeTag code={logItem.asset.asset_code} />
                        )}
                        <span className="font-bold text-slate-900 dark:text-white">{logItem.asset?.name || '-'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200 font-medium leading-relaxed max-w-sm">
                      {logItem.action_taken}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <span>👨‍🔧</span>
                        <span>{logItem.technician?.name || 'Teknisi'}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {formatRupiah(logItem.cost)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEdit(logItem)}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit Catatan"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(logItem)}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Catatan"
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
          totalItems={filteredLogs.length}
          pageSize={pageSize}
        />
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Catatan Pemeliharaan' : 'Catat Pemeliharaan Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Aset</span>
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

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Jadwal Acuan (Opsional)</span>
            <select
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white transition-all focus:border-blueprint focus:outline-none focus:ring-2 focus:ring-blueprint/20"
              value={form.schedule_id}
              onChange={(e) => setForm({ ...form, schedule_id: e.target.value })}
            >
              <option value="">-- Tanpa Jadwal (Insidental) --</option>
              {schedules.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.maintenance_type} (Aset ID: {s.asset_id})
                </option>
              ))}
            </select>
          </label>

          <Input
            label="Tindakan Dilakukan"
            required
            value={form.action_taken}
            onChange={(e) => setForm({ ...form, action_taken: e.target.value })}
            placeholder="misal: Pembersihan filter AC, ganti freon R32"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Biaya Perbaikan (Rp)"
              type="number"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
              placeholder="0"
            />
            <Input
              label="Tanggal Pengerjaan"
              type="date"
              required
              value={form.maintenance_date}
              onChange={(e) => setForm({ ...form, maintenance_date: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit">Simpan Catatan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default MaintenanceLogs;
