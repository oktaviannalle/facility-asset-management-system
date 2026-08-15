import { useEffect, useState } from 'react';
import damageReportService from '../../api/damageReportService';
import assetService from '../../api/assetService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import StatusTag from '../../components/ui/StatusTag';
import AssetCodeTag from '../../components/ui/AssetCodeTag';
import { useAuth } from '../../context/AuthContext';

function DamageReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const initialForm = {
    asset_id: '',
    reported_by: user?.id || '',
    description: '',
    status: 'dilaporkan',
  };
  const [form, setForm] = useState(initialForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reportRes, assetRes] = await Promise.all([
        damageReportService.getAll(),
        assetService.getAll(),
      ]);
      setReports(reportRes.data.data || []);
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
      reported_by: user?.id || '',
    });
    setModalOpen(true);
  };

  const openEdit = (report) => {
    setEditing(report);
    setForm({
      asset_id: report.asset?.id || report.asset_id || '',
      reported_by: report.reporter?.id || report.reported_by || user?.id || '',
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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Laporan Kerusakan</h1>
          <p className="text-sm text-steel">Kelola dan pantau laporan kerusakan aset dari staff</p>
        </div>
        <Button onClick={openCreate}>+ Buat Laporan</Button>
      </div>

      <Card>
        {loading ? (
          <p className="p-6 text-sm text-steel">Memuat data...</p>
        ) : reports.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-steel">Belum ada laporan kerusakan</p>
            <Button onClick={openCreate} className="mt-4">
              + Buat Laporan
            </Button>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-canvas text-xs uppercase text-steel">
              <tr>
                <th className="px-6 py-3">Aset</th>
                <th className="px-6 py-3">Deskripsi Kerusakan</th>
                <th className="px-6 py-3">Pelapor</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-canvas/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {report.asset?.asset_code && (
                        <AssetCodeTag code={report.asset.asset_code} />
                      )}
                      <span className="font-medium">{report.asset?.name || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-steel">{report.description}</td>
                  <td className="px-6 py-4 text-steel">{report.reporter?.name || '-'}</td>
                  <td className="px-6 py-4">
                    <StatusTag value={report.status} />
                  </td>
                  <td className="space-x-2 px-6 py-4">
                    <button
                      onClick={() => openEdit(report)}
                      className="text-blueprint hover:underline"
                    >
                      Edit Status
                    </button>
                    <button
                      onClick={() => handleDelete(report)}
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Laporan Kerusakan' : 'Buat Laporan Kerusakan'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-steel">Aset Yang Rusak</span>
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
            label="Deskripsi Kerusakan"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Jelaskan kendala atau kerusakan yang terjadi..."
          />

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-steel">Status Laporan</span>
            <select
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-blueprint focus:outline-none"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              required
            >
              <option value="dilaporkan">Dilaporkan</option>
              <option value="diverifikasi">Diverifikasi</option>
              <option value="dikerjakan">Dikerjakan</option>
              <option value="selesai">Selesai</option>
            </select>
          </label>

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

export default DamageReports;
