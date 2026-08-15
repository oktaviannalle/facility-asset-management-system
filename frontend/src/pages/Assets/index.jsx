import { useEffect, useState } from 'react';
import assetService from '../../api/assetService';
import assetCategoryService from '../../api/assetCategoryService';
import locationService from '../../api/locationService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import StatusTag from '../../components/ui/StatusTag';
import AssetCodeTag from '../../components/ui/AssetCodeTag';

function Assets() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const initialForm = {
    asset_code: '',
    name: '',
    category_id: '',
    location_id: '',
    condition: 'baik',
    purchase_date: '',
    purchase_price: '',
  };
  const [form, setForm] = useState(initialForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assetRes, catRes, locRes] = await Promise.all([
        assetService.getAll(),
        assetCategoryService.getAll(),
        locationService.getAll(),
      ]);
      setAssets(assetRes.data.data || []);
      setCategories(catRes.data.data || []);
      setLocations(locRes.data.data || []);
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
      category_id: categories[0]?.id || '',
      location_id: locations[0]?.id || '',
    });
    setModalOpen(true);
  };

  const openEdit = (asset) => {
    setEditing(asset);
    setForm({
      asset_code: asset.asset_code || '',
      name: asset.name || '',
      category_id: asset.category?.id || asset.category_id || '',
      location_id: asset.location?.id || asset.location_id || '',
      condition: asset.condition || 'baik',
      purchase_date: asset.purchase_date || '',
      purchase_price: asset.purchase_price || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await assetService.update(editing.id, form);
      } else {
        await assetService.create(form);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Gagal menyimpan data aset. Pastikan data valid.');
    }
  };

  const handleDelete = async (asset) => {
    if (!confirm(`Hapus aset "${asset.name}" (${asset.asset_code})?`)) return;
    try {
      await assetService.delete(asset.id);
      fetchData();
    } catch (err) {
      alert('Gagal menghapus aset.');
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Data Aset</h1>
          <p className="text-sm text-steel">Kelola daftar inventaris aset Sarana & Prasarana</p>
        </div>
        <Button onClick={openCreate}>+ Tambah Aset</Button>
      </div>

      <Card>
        {loading ? (
          <p className="p-6 text-sm text-steel">Memuat data...</p>
        ) : assets.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-steel">Belum ada data aset</p>
            <Button onClick={openCreate} className="mt-4">
              + Tambah Aset
            </Button>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-canvas text-xs uppercase text-steel">
              <tr>
                <th className="px-6 py-3">Kode Aset</th>
                <th className="px-6 py-3">Nama</th>
                <th className="px-6 py-3">Kategori</th>
                <th className="px-6 py-3">Lokasi</th>
                <th className="px-6 py-3">Kondisi</th>
                <th className="px-6 py-3">Harga Beli</th>
                <th className="px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-canvas/50">
                  <td className="px-6 py-4">
                    <AssetCodeTag code={asset.asset_code} />
                  </td>
                  <td className="px-6 py-4 font-medium">{asset.name}</td>
                  <td className="px-6 py-4 text-steel">{asset.category?.name || '-'}</td>
                  <td className="px-6 py-4 text-steel">
                    {asset.location
                      ? `${asset.location.building}${asset.location.room ? ' - ' + asset.location.room : ''}`
                      : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <StatusTag value={asset.condition} />
                  </td>
                  <td className="px-6 py-4 text-steel font-mono">
                    {asset.purchase_price
                      ? `Rp ${Number(asset.purchase_price).toLocaleString('id-ID')}`
                      : '-'}
                  </td>
                  <td className="space-x-2 px-6 py-4">
                    <button
                      onClick={() => openEdit(asset)}
                      className="text-blueprint hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(asset)}
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Aset' : 'Tambah Aset'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Kode Aset"
            required
            value={form.asset_code}
            onChange={(e) => setForm({ ...form, asset_code: e.target.value })}
            placeholder="misal: AST-001"
          />
          <Input
            label="Nama Aset"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-steel">Kategori</span>
            <select
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-blueprint focus:outline-none"
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              required
            >
              <option value="">Pilih Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-steel">Lokasi</span>
            <select
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-blueprint focus:outline-none"
              value={form.location_id}
              onChange={(e) => setForm({ ...form, location_id: e.target.value })}
              required
            >
              <option value="">Pilih Lokasi</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.building} {l.floor ? `Lt.${l.floor}` : ''} {l.room ? `R.${l.room}` : ''}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-steel">Kondisi</span>
            <select
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-blueprint focus:outline-none"
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              required
            >
              <option value="baik">Baik</option>
              <option value="rusak_ringan">Rusak Ringan</option>
              <option value="rusak_berat">Rusak Berat</option>
            </select>
          </label>
          <Input
            label="Tanggal Pembelian"
            type="date"
            value={form.purchase_date}
            onChange={(e) => setForm({ ...form, purchase_date: e.target.value })}
          />
          <Input
            label="Harga Pembelian (Rp)"
            type="number"
            value={form.purchase_price}
            onChange={(e) => setForm({ ...form, purchase_price: e.target.value })}
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

export default Assets;
