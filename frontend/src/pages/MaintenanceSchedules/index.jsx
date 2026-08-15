import { useEffect, useState } from 'react';
import maintenanceScheduleService from '../../api/maintenanceScheduleService';
import assetService from '../../api/assetService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import AssetCodeTag from '../../components/ui/AssetCodeTag';

function MaintenanceSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

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

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-slate-900">Jadwal Pemeliharaan</h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              {schedules.length} Jadwal
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">Kelola jadwal pemeliharaan berkala dan perbaikan preventif per aset</p>
        </div>
        <Button onClick={openCreate} className="shadow-sm">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Jadwal
        </Button>
      </div>

      {/* Table Card */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Memuat data jadwal pemeliharaan...</div>
        ) : schedules.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-900">Belum ada jadwal pemeliharaan</p>
            <p className="text-xs text-slate-500 mt-1">Buat jadwal pemeliharaan berkala untuk menjaga kondisi aset</p>
            <Button onClick={openCreate} className="mt-4">
              + Tambah Jadwal
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Aset Target</th>
                  <th className="px-6 py-3.5">Jenis Pemeliharaan</th>
                  <th className="px-6 py-3.5">Frekuensi</th>
                  <th className="px-6 py-3.5">Jatuh Tempo Berikutnya</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schedules.map((sched) => (
                  <tr key={sched.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {sched.asset?.asset_code && (
                          <AssetCodeTag code={sched.asset.asset_code} />
                        )}
                        <span className="font-semibold text-slate-900">{sched.asset?.name || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{sched.maintenance_type}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-mono font-semibold text-blue-700">
                        Setiap {sched.frequency_months} Bulan
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">
                      {sched.next_due_date || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(sched)}
                          className="p-1.5 text-slate-500 hover:text-blueprint hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Jadwal"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(sched)}
                          className="p-1.5 text-slate-500 hover:text-rust hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Jadwal Pemeliharaan' : 'Tambah Jadwal Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">Pilih Aset Target</span>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all focus:border-blueprint focus:outline-none focus:ring-2 focus:ring-blueprint/20"
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

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
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
