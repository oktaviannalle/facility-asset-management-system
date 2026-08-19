import { useEffect, useState } from 'react';
import dashboardService from '../../api/dashboardService';
import assetCategoryService from '../../api/assetCategoryService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';


function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kategori Aset state
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getStats();
      setDashboardData(res.data.data);
    } catch (err) {
      console.error('Gagal memuat statistik dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = () => {
    setCatLoading(true);
    assetCategoryService
      .getAll()
      .then((response) => setCategories(response.data.data))
      .finally(() => setCatLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
    fetchCategories();
  }, []);

  const stats = dashboardData || {
    total_assets: 0,
    condition_stats: { baik: 0, rusak_ringan: 0, rusak_berat: 0 },
    schedules_count: 0,
  };

  // Kategori handlers
  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '' });
    setModalOpen(true);
  };

  const openEdit = (category) => {
    setEditing(category);
    setForm({ name: category.name, description: category.description || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await assetCategoryService.update(editing.id, form);
    } else {
      await assetCategoryService.create(form);
    }
    setModalOpen(false);
    fetchCategories();
  };

  const handleDelete = async (category) => {
    if (!confirm(`Hapus kategori "${category.name}"?`)) return;
    await assetCategoryService.delete(category.id);
    fetchCategories();
  };

  const goodPercent =
    stats.total_assets > 0
      ? Math.round((stats.condition_stats.baik / stats.total_assets) * 100)
      : 0;

  return (
    <div className="space-y-6 font-sans">

      {/* ── 3 Stat Cards ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

        {/* Card 1: Semua Aset */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e3a5f 0%, #1a3a6e 50%, #1e4080 100%)',
            borderRadius: '16px',
            padding: '28px 24px',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(30,58,127,0.35)',
          }}
        >
          <div style={{
            position: 'absolute', right: -20, top: -20,
            width: 110, height: 110,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          }} />
          <div style={{
            position: 'absolute', right: 20, bottom: -30,
            width: 80, height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }} />
          <p style={{ fontSize: 13, fontWeight: 600, opacity: 0.75, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Semua Aset
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 52, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {loading ? '...' : stats.total_assets}
            </span>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#60a5fa' }} />
              <span style={{ opacity: 0.8 }}>Aset FTI UKSW</span>
              <span style={{ marginLeft: 'auto', fontWeight: 700, color: '#60a5fa' }}>100%</span>
            </div>
          </div>
        </div>

        {/* Card 2: Aset Baik */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e3a5f 0%, #1a3a6e 50%, #1e4080 100%)',
            borderRadius: '16px',
            padding: '28px 24px',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(30,58,127,0.35)',
          }}
        >
          <div style={{
            position: 'absolute', right: -20, top: -20,
            width: 110, height: 110,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          }} />
          <div style={{
            position: 'absolute', right: 20, bottom: -30,
            width: 80, height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }} />
          <p style={{ fontSize: 13, fontWeight: 600, opacity: 0.75, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Aset Baik
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 52, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {loading ? '...' : stats.condition_stats.baik}
            </span>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#34d399' }} />
              <span style={{ opacity: 0.8 }}>Kondisi Baik</span>
              <span style={{ marginLeft: 'auto', fontWeight: 700, color: '#34d399' }}>{goodPercent}%</span>
            </div>
          </div>
        </div>

        {/* Card 3: Pemeliharaan */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e3a5f 0%, #1a3a6e 50%, #1e4080 100%)',
            borderRadius: '16px',
            padding: '28px 24px',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(30,58,127,0.35)',
          }}
        >
          <div style={{
            position: 'absolute', right: -20, top: -20,
            width: 110, height: 110,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          }} />
          <div style={{
            position: 'absolute', right: 20, bottom: -30,
            width: 80, height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }} />
          <p style={{ fontSize: 13, fontWeight: 600, opacity: 0.75, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Pemeliharaan
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 52, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {loading ? '...' : (stats.schedules_count ?? 0)}
            </span>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#fbbf24' }} />
              <span style={{ opacity: 0.8 }}>Aset Terjadwal</span>
              <span style={{ marginLeft: 'auto', fontWeight: 700, color: '#fbbf24' }}>100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabel Kategori Aset ── */}
      <Card className="overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-xs">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Kategori Aset
              </h2>
              <span className="rounded-full bg-blue-100 dark:bg-blue-950 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                {categories.length} Total
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Kelola master kategori untuk klasifikasi barang dan aset
            </p>
          </div>
          <Button onClick={openCreate} className="shadow-sm">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Kategori
          </Button>
        </div>

        {/* Table */}
        {catLoading ? (
          <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Memuat data kategori...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Belum ada kategori aset</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tambahkan kategori pertama untuk mulai mengelompokkan aset
            </p>
            <Button onClick={openCreate} className="mt-4">+ Tambah Kategori</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3.5">Nama Kategori</th>
                  <th className="px-6 py-3.5">Deskripsi</th>
                  <th className="px-6 py-3.5">Jumlah Aset</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 max-w-md">
                      {category.description || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                        {category.assets_count ?? 0} Unit
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(category)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Kategori"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(category)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Kategori"
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

      {/* Modal Tambah / Edit Kategori */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Kategori' : 'Tambah Kategori Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Kategori"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="misal: Elektronik, Mebel, Kendaraan"
          />
          <Input
            label="Deskripsi Kategori"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Keterangan singkat mengenai kategori aset ini..."
          />
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

export default Dashboard;
