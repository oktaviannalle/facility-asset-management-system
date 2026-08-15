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
    if (!confirm('Hapus riwayat pemeliharaan ini?')) return;
    try {
      await maintenanceLogService.delete(logItem.id);
      fetchData();
    } catch (err) {
      alert('Gagal menghapus riwayat pemeliharaan.');
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Riwayat Pemeliharaan</h1>
          <p className="text-sm text-steel">Catatan kegiatan pemeliharaan dan perbaikan aset</p>
        </div>
        <Button onClick={openCreate}>+ Catat Pemeliharaan</Button>
      </div>

      <Card>
        {loading ? (
          <p className="p-6 text-sm text-steel">Memuat data...</p>
        ) : logs.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-steel">Belum ada riwayat pemeliharaan</p>
            <Button onClick={openCreate} className="mt-4">
              + Catat Pemeliharaan
            </Button>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-canvas text-xs uppercase text-steel">
              <tr>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Aset</th>
                <th className="px-6 py-3">Tindakan</th>
                <th className="px-6 py-3">Teknisi</th>
                <th className="px-6 py-3">Biaya</th>
                <th className="px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((logItem) => (
                <tr key={logItem.id} className="hover:bg-canvas/50">
                  <td className="px-6 py-4 font-mono text-steel">
                    {logItem.maintenance_date || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {logItem.asset?.asset_code && (
                        <AssetCodeTag code={logItem.asset.asset_code} />
                      )}
                      <span className="font-medium">{logItem.asset?.name || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-steel">{logItem.action_taken}</td>
                  <td className="px-6 py-4 text-steel">{logItem.technician?.name || '-'}</td>
                  <td className="px-6 py-4 font-mono text-steel">
                    {logItem.cost ? `Rp ${Number(logItem.cost).toLocaleString('id-ID')}` : '-'}
                  </td>
                  <td className="space-x-2 px-6 py-4">
                    <button
                      onClick={() => openEdit(logItem)}
                      className="text-blueprint hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(logItem)}
                      className="text-rust hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Catatan Pemeliharaan' : 'Catat Pemeliharaan'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-steel">Aset</span>
            <select
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-blueprint focus:outline-none"
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
            <span className="mb-1.5 block text-xs font-medium text-steel">Jadwal Acuan (Opsional)</span>
            <select
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-blueprint focus:outline-none"
              value={form.schedule_id}
              onChange={(e) => setForm({ ...form, schedule_id: e.target.value })}
            >
              <option value="">-- Tanpa Jadwal --</option>
              {schedules.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.maintenance_type} (Aset ID: {s.asset_id})
                </option>
              ))}
            </select>
          </label>

          <Input
            label="Tindakan / Pekerjaan Yang Dilakukan"
            required
            value={form.action_taken}
            onChange={(e) => setForm({ ...form, action_taken: e.target.value })}
            placeholder="misal: Pembersihan filter dan penggantian freon"
          />

          <Input
            label="Biaya (Rp)"
            type="number"
            value={form.cost}
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
          />

          <Input
            label="Tanggal Pemeliharaan"
            type="date"
            required
            value={form.maintenance_date}
            onChange={(e) => setForm({ ...form, maintenance_date: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default MaintenanceLogs;
