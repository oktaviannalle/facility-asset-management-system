import { useEffect, useState } from 'react';
import locationService from '../../api/locationService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

function Locations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ building: '', floor: '', room: '' });

  const fetchLocations = () => {
    setLoading(true);
    locationService
      .getAll()
      .then((response) => setLocations(response.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ building: '', floor: '', room: '' });
    setModalOpen(true);
  };

  const openEdit = (loc) => {
    setEditing(loc);
    setForm({
      building: loc.building || '',
      floor: loc.floor || '',
      room: loc.room || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await locationService.update(editing.id, form);
    } else {
      await locationService.create(form);
    }
    setModalOpen(false);
    fetchLocations();
  };

  const handleDelete = async (loc) => {
    const name = `${loc.building}${loc.floor ? ' Lt.' + loc.floor : ''}${loc.room ? ' R.' + loc.room : ''}`;
    if (!confirm(`Hapus lokasi "${name}"?`)) return;
    await locationService.delete(loc.id);
    fetchLocations();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-slate-900">Lokasi Aset</h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              {locations.length} Lokasi
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">Kelola lokasi gedung, lantai, dan ruangan penempatan aset</p>
        </div>
        <Button onClick={openCreate} className="shadow-sm">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Lokasi
        </Button>
      </div>

      {/* Table Card */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Memuat data lokasi...</div>
        ) : locations.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-900">Belum ada lokasi terdaftar</p>
            <p className="text-xs text-slate-500 mt-1">Tambahkan lokasi gedung/ruangan baru ke sistem</p>
            <Button onClick={openCreate} className="mt-4">
              + Tambah Lokasi
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Gedung</th>
                  <th className="px-6 py-3.5">Lantai</th>
                  <th className="px-6 py-3.5">Ruangan</th>
                  <th className="px-6 py-3.5">Jumlah Aset</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {locations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{loc.building}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono">{loc.floor ? `Lantai ${loc.floor}` : '-'}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono">{loc.room ? `Ruang ${loc.room}` : '-'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                        {loc.assets_count ?? 0} Unit
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(loc)}
                          className="p-1.5 text-slate-500 hover:text-blueprint hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Lokasi"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(loc)}
                          className="p-1.5 text-slate-500 hover:text-rust hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Lokasi"
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Lokasi' : 'Tambah Lokasi Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Gedung"
            required
            value={form.building}
            onChange={(e) => setForm({ ...form, building: e.target.value })}
            placeholder="misal: Gedung A, Gedung FTI, Rektorat"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Lantai (Opsional)"
              value={form.floor}
              onChange={(e) => setForm({ ...form, floor: e.target.value })}
              placeholder="misal: 1, 2, 3"
            />
            <Input
              label="Ruangan (Opsional)"
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
              placeholder="misal: Lab Komp 1, R.302"
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

export default Locations;
