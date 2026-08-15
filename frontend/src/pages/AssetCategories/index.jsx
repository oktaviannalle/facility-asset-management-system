import { useEffect, useState } from 'react';
import assetCategoryService from '../../api/assetCategoryService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

function AssetCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchCategories = () => {
    setLoading(true);
    assetCategoryService
      .getAll()
      .then((response) => setCategories(response.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Kategori Aset</h1>
          <p className="text-sm text-steel">Kelola kategori aset sarana & prasarana</p>
        </div>
        <Button onClick={openCreate}>+ Tambah Kategori</Button>
      </div>

      <Card>
        {loading ? (
          <p className="p-6 text-sm text-steel">Memuat data...</p>
        ) : categories.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-steel">Belum ada kategori aset</p>
            <Button onClick={openCreate} className="mt-4">
              + Tambah Kategori
            </Button>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-canvas text-xs uppercase text-steel">
              <tr>
                <th className="px-6 py-3">Nama</th>
                <th className="px-6 py-3">Deskripsi</th>
                <th className="px-6 py-3">Jumlah Aset</th>
                <th className="px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-canvas/50">
                  <td className="px-6 py-4 font-medium">{category.name}</td>
                  <td className="px-6 py-4 text-steel">{category.description || '-'}</td>
                  <td className="px-6 py-4">{category.assets_count ?? 0}</td>
                  <td className="space-x-2 px-6 py-4">
                    <button
                      onClick={() => openEdit(category)}
                      className="text-blueprint hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Kategori' : 'Tambah Kategori'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Deskripsi"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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

export default AssetCategories;
