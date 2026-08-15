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
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-slate-900">Laporan Kerusakan</h1>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
              {reports.length} Laporan
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">Kelola dan pantau status laporan kerusakan dari staff hingga penanganan selesai</p>
        </div>
        <Button onClick={openCreate} className="shadow-sm">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Buat Laporan Baru
        </Button>
      </div>

      {/* Table Card */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Memuat laporan kerusakan...</div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-900">Belum ada laporan kerusakan</p>
            <p className="text-xs text-slate-500 mt-1">Jika ada fasilitas yang rusak, buat laporan baru untuk diproses teknisi</p>
            <Button onClick={openCreate} className="mt-4">
              + Buat Laporan
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Aset Rusak</th>
                  <th className="px-6 py-3.5">Deskripsi Kendala</th>
                  <th className="px-6 py-3.5">Pelapor</th>
                  <th className="px-6 py-3.5">Status Penanganan</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {report.asset?.asset_code && (
                          <AssetCodeTag code={report.asset.asset_code} />
                        )}
                        <span className="font-semibold text-slate-900">{report.asset?.name || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 max-w-sm">{report.description}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                        👤 {report.reporter?.name || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusTag value={report.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(report)}
                          className="p-1.5 text-slate-500 hover:text-blueprint hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit / Update Status"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(report)}
                          className="p-1.5 text-slate-500 hover:text-rust hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Update Laporan Kerusakan' : 'Buat Laporan Kerusakan'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">Aset Yang Rusak</span>
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

          <Input
            label="Deskripsi Kendala / Kerusakan"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Jelaskan secara detail kerusakan yang dialami..."
          />

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">Status Penanganan</span>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all focus:border-blueprint focus:outline-none focus:ring-2 focus:ring-blueprint/20"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              required
            >
              <option value="dilaporkan">1. Dilaporkan (Menunggu Verifikasi)</option>
              <option value="diverifikasi">2. Diverifikasi (Telah Disetujui)</option>
              <option value="dikerjakan">3. Dikerjakan (Sedang Diperbaiki)</option>
              <option value="selesai">4. Selesai (Perbaikan Tuntas)</option>
            </select>
          </label>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit">Simpan Laporan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default DamageReports;
