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
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Lokasi Aset</h1>
          <p className="text-sm text-steel">Kelola lokasi gedung, lantai, dan ruangan aset</p>
        </div>
        <Button onClick={openCreate}>+ Tambah Lokasi</Button>
      </div>

      <Card>
        {loading ? (
          <p className="p-6 text-sm text-steel">Memuat data...</p>
        ) : locations.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-steel">Belum ada data lokasi</p>
            <Button onClick={openCreate} className="mt-4">
              + Tambah Lokasi
            </Button>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-canvas text-xs uppercase text-steel">
              <tr>
                <th className="px-6 py-3">Gedung</th>
                <th className="px-6 py-3">Lantai</th>
                <th className="px-6 py-3">Ruangan</th>
                <th className="px-6 py-3">Jumlah Aset</th>
                <th className="px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {locations.map((loc) => (
                <tr key={loc.id} className="hover:bg-canvas/50">
                  <td className="px-6 py-4 font-medium">{loc.building}</td>
                  <td className="px-6 py-4 text-steel">{loc.floor || '-'}</td>
                  <td className="px-6 py-4 text-steel">{loc.room || '-'}</td>
                  <td className="px-6 py-4">{loc.assets_count ?? 0}</td>
                  <td className="space-x-2 px-6 py-4">
                    <button
                      onClick={() => openEdit(loc)}
                      className="text-blueprint hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(loc)}
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Lokasi' : 'Tambah Lokasi'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Gedung"
            required
            value={form.building}
            onChange={(e) => setForm({ ...form, building: e.target.value })}
          />
          <Input
            label="Lantai"
            value={form.floor}
            onChange={(e) => setForm({ ...form, floor: e.target.value })}
          />
          <Input
            label="Ruangan"
            value={form.room}
            onChange={(e) => setForm({ ...form, room: e.target.value })}
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

export default Locations;
