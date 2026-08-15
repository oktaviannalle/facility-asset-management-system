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
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Jadwal Pemeliharaan</h1>
          <p className="text-sm text-steel">Kelola jadwal pemeliharaan preventif per aset</p>
        </div>
        <Button onClick={openCreate}>+ Tambah Jadwal</Button>
      </div>

      <Card>
        {loading ? (
          <p className="p-6 text-sm text-steel">Memuat data...</p>
        ) : schedules.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-steel">Belum ada jadwal pemeliharaan</p>
            <Button onClick={openCreate} className="mt-4">
              + Tambah Jadwal
            </Button>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-canvas text-xs uppercase text-steel">
              <tr>
                <th className="px-6 py-3">Aset</th>
                <th className="px-6 py-3">Jenis Pemeliharaan</th>
                <th className="px-6 py-3">Frekuensi</th>
                <th className="px-6 py-3">Jatuh Tempo Berikutnya</th>
                <th className="px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {schedules.map((sched) => (
                <tr key={sched.id} className="hover:bg-canvas/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {sched.asset?.asset_code && (
                        <AssetCodeTag code={sched.asset.asset_code} />
                      )}
                      <span className="font-medium">{sched.asset?.name || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{sched.maintenance_type}</td>
                  <td className="px-6 py-4 text-steel font-mono">
                    Setiap {sched.frequency_months} Bulan
                  </td>
                  <td className="px-6 py-4 font-mono text-steel">
                    {sched.next_due_date || '-'}
                  </td>
                  <td className="space-x-2 px-6 py-4">
                    <button
                      onClick={() => openEdit(sched)}
                      className="text-blueprint hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sched)}
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Jadwal' : 'Tambah Jadwal'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-steel">Pilih Aset</span>
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
          <Input
            label="Jenis Pemeliharaan"
            required
            value={form.maintenance_type}
            onChange={(e) => setForm({ ...form, maintenance_type: e.target.value })}
            placeholder="misal: Servis AC berkala"
          />
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

export default MaintenanceSchedules;
