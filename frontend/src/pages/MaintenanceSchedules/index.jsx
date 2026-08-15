import { useEffect, useState } from 'react';
import maintenanceScheduleService from '../../api/maintenanceScheduleService';
import assetService from '../../api/assetService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import AssetCodeTag from '../../components/ui/AssetCodeTag';
import Pagination from '../../components/ui/Pagination';

function MaintenanceSchedules() {
  const [schedules, setSchedules] = useState([]);
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
    maintenance_type: '',
    frequency_months: 3,
    next_due_date: '',
  };
  const [form, setForm] = useState(initialForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [schedRes, assetRes] = await Promise.all([
        maintenanceScheduleService.getAll(),
        assetService.getAll(),
      ]);
      setSchedules(schedRes.data.data || []);
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
    });
    setModalOpen(true);
  };

  const openEdit = (sched) => {
    setEditing(sched);
    setForm({
      asset_id: sched.asset?.id || sched.asset_id || '',
      maintenance_type: sched.maintenance_type || '',
      frequency_months: sched.frequency_months || 3,
      next_due_date: sched.next_due_date || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await maintenanceScheduleService.update(editing.id, form);
      } else {
        await maintenanceScheduleService.create(form);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Gagal menyimpan jadwal pemeliharaan.');
    }
  };

  const handleDelete = async (sched) => {
    if (!confirm(`Hapus jadwal "${sched.maintenance_type}"?`)) return;
    try {
      await maintenanceScheduleService.delete(sched.id);
      fetchData();
    } catch (err) {
      alert('Gagal menghapus jadwal pemeliharaan.');
    }
  };

  const filteredSchedules = schedules.filter(
    (sched) =>
      sched.maintenance_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sched.asset?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sched.asset?.asset_code || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSchedules.length / pageSize) || 1;
  const paginatedSchedules = filteredSchedules.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Jadwal Pemeliharaan</h1>
            <span className="rounded-full bg-blue-100 dark:bg-blue-950 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
              {schedules.length} Jadwal
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Kelola jadwal pemeliharaan berkala dan perbaikan preventif per aset FTI UKSW</p>
        </div>
        <Button onClick={openCreate} className="shadow-sm">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Jadwal
        </Button>
      </div>

      {/* Table Card */}
      <Card className="overflow-hidden p-6 space-y-4">
        {/* Table Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-900 cursor-pointer"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">entries</span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search jadwal..."
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
          <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">Memuat data jadwal pemeliharaan...</div>
        ) : filteredSchedules.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Belum ada jadwal pemeliharaan</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Buat jadwal pemeliharaan berkala untuk menjaga kondisi aset</p>
            <Button onClick={openCreate} className="mt-4">
              + Tambah Jadwal
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3.5">Aset Target</th>
                  <th className="px-6 py-3.5">Jenis Pemeliharaan</th>
                  <th className="px-6 py-3.5">Frekuensi</th>
                  <th className="px-6 py-3.5">Jatuh Tempo Berikutnya</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedSchedules.map((sched) => (
                  <tr key={sched.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {sched.asset?.asset_code && (
                          <AssetCodeTag code={sched.asset.asset_code} />
                        )}
                        <span className="font-semibold text-slate-900 dark:text-white">{sched.asset?.name || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{sched.maintenance_type}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 text-xs font-mono font-semibold text-blue-700 dark:text-blue-300">
                        Setiap {sched.frequency_months} Bulan
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                      {sched.next_due_date || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(sched)}
                          className="p-1.5 text-slate-500 hover:text-blueprint hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Jadwal"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(sched)}
                          className="p-1.5 text-slate-500 hover:text-rust hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Jadwal"
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
          totalItems={filteredSchedules.length}
          pageSize={pageSize}
        />
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Jadwal Pemeliharaan' : 'Tambah Jadwal Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Pilih Aset Target</span>
            <select
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white transition-all focus:border-blueprint focus:outline-none focus:ring-2 focus:ring-blueprint/20"
              value={form.asset_id}
              onChange={(e) => setForm({ ...form, asset_id: e.target.value })}
              required
            >
              <option value="">Pilih Aset Target</option>
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  [{a.asset_code}] {a.name}
                </option>
              ))}
            </select>
          </label>

          <Input
            label="Jenis Pemeliharaan"
            required
            value={form.maintenance_type}
            onChange={(e) => setForm({ ...form, maintenance_type: e.target.value })}
            placeholder="misal: Servis AC berkala, Pengecekan jaringan, Kalibrasi"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Frekuensi (Bulan)"
              type="number"
              min="1"
              required
              value={form.frequency_months}
              onChange={(e) => setForm({ ...form, frequency_months: e.target.value })}
            />
            <Input
              label="Jatuh Tempo Berikutnya"
              type="date"
              required
              value={form.next_due_date}
              onChange={(e) => setForm({ ...form, next_due_date: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit">Simpan Data</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default MaintenanceSchedules;
