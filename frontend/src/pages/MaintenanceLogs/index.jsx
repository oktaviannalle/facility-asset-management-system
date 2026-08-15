import { useEffect, useState } from 'react';
import maintenanceLogService from '../../api/maintenanceLogService';
import assetService from '../../api/assetService';
import maintenanceScheduleService from '../../api/maintenanceScheduleService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import AssetCodeTag from '../../components/ui/AssetCodeTag';
import { useAuth } from '../../context/AuthContext';

function MaintenanceLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [assets, setAssets] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

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

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-slate-900">Riwayat Pemeliharaan</h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              {logs.length} Catatan
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">Histori dan histori biaya pekerjaan perbaikan aset oleh teknisi</p>
        </div>
        <Button onClick={openCreate} className="shadow-sm">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Catat Pemeliharaan
        </Button>
      </div>

      {/* Table Card */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Memuat riwayat pemeliharaan...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-900">Belum ada riwayat pemeliharaan</p>
            <p className="text-xs text-slate-500 mt-1">Catat aktivitas perawatan fisik aset yang telah dikerjakan</p>
            <Button onClick={openCreate} className="mt-4">
              + Catat Pemeliharaan
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Tanggal</th>
                  <th className="px-6 py-3.5">Aset</th>
                  <th className="px-6 py-3.5">Tindakan Dilakukan</th>
                  <th className="px-6 py-3.5">Teknisi</th>
                  <th className="px-6 py-3.5">Biaya (Rp)</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((logItem) => (
                  <tr key={logItem.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">
                      {logItem.maintenance_date || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {logItem.asset?.asset_code && (
                          <AssetCodeTag code={logItem.asset.asset_code} />
                        )}
                        <span className="font-semibold text-slate-900">{logItem.asset?.name || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 max-w-sm">{logItem.action_taken}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                        👨‍🔧 {logItem.technician?.name || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-900">
                      {logItem.cost ? `Rp ${Number(logItem.cost).toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(logItem)}
                          className="p-1.5 text-slate-500 hover:text-blueprint hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Catatan"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(logItem)}
                          className="p-1.5 text-slate-500 hover:text-rust hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Catatan Pemeliharaan' : 'Catat Pemeliharaan Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">Aset</span>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all focus:border-blueprint focus:outline-none focus:ring-2 focus:ring-blueprint/20"
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
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">Jadwal Acuan (Opsional)</span>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all focus:border-blueprint focus:outline-none focus:ring-2 focus:ring-blueprint/20"
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

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
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
