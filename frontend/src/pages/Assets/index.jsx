import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import assetService from "../../api/assetService";
import assetCategoryService from "../../api/assetCategoryService";
import locationService from "../../api/locationService";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import StatusTag from "../../components/ui/StatusTag";
import AssetCodeTag from "../../components/ui/AssetCodeTag";
import Pagination from "../../components/ui/Pagination";

function Assets() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Pagination states (Max 10 per page by default)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const initialForm = {
    asset_code: "",
    name: "",
    category_id: "",
    location_id: "",
    condition: "baik",
    purchase_date: "",
    purchase_price: "",
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
      category_id: categories[0]?.id || "",
      location_id: locations[0]?.id || "",
    });
    setModalOpen(true);
  };

  const openEdit = (asset) => {
    setEditing(asset);
    setForm({
      asset_code: asset.asset_code || "",
      name: asset.name || "",
      category_id: asset.category?.id || asset.category_id || "",
      location_id: asset.location?.id || asset.location_id || "",
      condition: asset.condition || "baik",
      purchase_date: asset.purchase_date || "",
      purchase_price: asset.purchase_price || "",
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
      alert("Gagal menyimpan data aset. Pastikan data valid.");
    }
  };

  const handleDelete = async (asset) => {
    if (!confirm(`Hapus aset "${asset.name}" (${asset.asset_code})?`)) return;
    try {
      await assetService.delete(asset.id);
      fetchData();
    } catch (err) {
      alert("Gagal menghapus aset.");
    }
  };

  const filteredAssets = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.asset_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.category?.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredAssets.length / pageSize) || 1;
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              Data Aset Inventaris
            </h1>
            <span className="rounded-full bg-blue-100 dark:bg-blue-950 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
              {assets.length} Aset
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Kelola daftar seluruh fisik aset Sarana & Prasarana FTI UKSW
          </p>
        </div>
        <Button onClick={openCreate} className="shadow-sm">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah Aset
        </Button>
      </div>

      {/* Table Card */}
      <Card className="overflow-hidden p-6 space-y-4">
        {/* Table Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Show
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-900 cursor-pointer"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              entries
            </span>
          </div>

          {/* Table Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search aset..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-48 sm:w-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 pl-8 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-blue-900 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-900"
            />
            <svg
              className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Memuat data aset...
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              Belum ada aset terdaftar
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Mulai daftarkan aset pertama Anda ke sistem
            </p>
            <Button onClick={openCreate} className="mt-4">
              + Tambah Aset
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3.5">Kode Aset</th>
                  <th className="px-6 py-3.5">Nama Aset</th>
                  <th className="px-6 py-3.5">Kategori</th>
                  <th className="px-6 py-3.5">Lokasi</th>
                  <th className="px-6 py-3.5">Kondisi</th>
                  <th className="px-6 py-3.5">Harga Beli</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <AssetCodeTag code={asset.asset_code} />
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      {asset.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      <span className="inline-block rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                        {asset.category?.name || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {asset.location
                        ? `${asset.location.building}${asset.location.room ? " - " + asset.location.room : ""}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusTag value={asset.condition} />
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-mono text-xs">
                      {asset.purchase_price
                        ? `Rp ${Number(asset.purchase_price).toLocaleString("id-ID")}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/assets/${asset.id}`}
                          className="p-1.5 text-slate-500 hover:text-blueprint hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors cursor-pointer"
                          title="Lihat Detail & QR"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </Link>
                        <button
                          onClick={() => openEdit(asset)}
                          className="p-1.5 text-slate-500 hover:text-blueprint hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Aset"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(asset)}
                          className="p-1.5 text-slate-500 hover:text-rust hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Aset"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
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

        {/* Pagination Bar (Max 10 Items per Page) */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          totalItems={filteredAssets.length}
          pageSize={pageSize}
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Data Aset" : "Tambah Aset Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              placeholder="misal: Proyektor Epson EB-X400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Kategori
              </span>
              <select
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white transition-all focus:border-blueprint focus:outline-none focus:ring-2 focus:ring-blueprint/20"
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
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
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Lokasi Penempatan
              </span>
              <select
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white transition-all focus:border-blueprint focus:outline-none focus:ring-2 focus:ring-blueprint/20"
                value={form.location_id}
                onChange={(e) =>
                  setForm({ ...form, location_id: e.target.value })
                }
                required
              >
                <option value="">Pilih Lokasi</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.building} {l.floor ? `Lt.${l.floor}` : ""}{" "}
                    {l.room ? `R.${l.room}` : ""}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Kondisi Aset
            </span>
            <select
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white transition-all focus:border-blueprint focus:outline-none focus:ring-2 focus:ring-blueprint/20"
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              required
            >
              <option value="baik">Baik (Berfungsi Normal)</option>
              <option value="rusak_ringan">
                Rusak Ringan (Perlu Servis Minor)
              </option>
              <option value="rusak_berat">Rusak Berat (Tidak Berfungsi)</option>
            </select>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tanggal Pembelian"
              type="date"
              value={form.purchase_date}
              onChange={(e) =>
                setForm({ ...form, purchase_date: e.target.value })
              }
            />
            <Input
              label="Harga Pembelian (Rp)"
              type="number"
              value={form.purchase_price}
              onChange={(e) =>
                setForm({ ...form, purchase_price: e.target.value })
              }
              placeholder="0"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit">Simpan Data</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Assets;
