import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import Card from "../../components/ui/Card";
import StatusTag from "../../components/ui/StatusTag";
import AssetCodeTag from "../../components/ui/AssetCodeTag";
import QRCodeCard from "../../components/QRCodeCard";

function AssetDetail() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/assets/${id}`)
      .then((response) => setAsset(response.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
        Memuat detail aset...
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">
          Aset tidak ditemukan.
        </p>
        <Link
          to="/assets"
          className="mt-4 inline-block text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Kembali ke daftar aset
        </Link>
      </div>
    );
  }

  const scanUrl = `${window.location.origin}/assets/${asset.id}`;
  const locationText = asset.location
    ? `${asset.location.building}${asset.location.room ? ` · R.${asset.location.room}` : ""}`
    : "-";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/assets"
          className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Daftar Aset
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <AssetCodeTag code={asset.asset_code} />
              <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {asset.name}
              </h1>
            </div>
            <StatusTag value={asset.condition} />
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Kategori
              </dt>
              <dd className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                {asset.category?.name || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Lokasi Penempatan
              </dt>
              <dd className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                {locationText}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Tanggal Pembelian
              </dt>
              <dd className="mt-1 font-mono font-medium text-slate-800 dark:text-slate-200">
                {asset.purchase_date || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Harga Pembelian
              </dt>
              <dd className="mt-1 font-mono font-semibold text-slate-800 dark:text-slate-200">
                {asset.purchase_price
                  ? `Rp ${Number(asset.purchase_price).toLocaleString("id-ID")}`
                  : "-"}
              </dd>
            </div>
          </dl>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Riwayat Pemeliharaan
            </h2>
            {asset.maintenance_logs?.length ? (
              <ul className="mt-4 space-y-2">
                {asset.maintenance_logs.map((log) => (
                  <li
                    key={log.id}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3.5 text-sm"
                  >
                    <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {log.maintenance_date}
                    </span>{" "}
                    — <span className="font-medium text-slate-800 dark:text-slate-200">{log.action_taken}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Belum ada riwayat pemeliharaan tercatat untuk aset ini.
              </p>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Laporan Kerusakan
            </h2>
            {asset.damage_reports?.length ? (
              <ul className="mt-4 space-y-2">
                {asset.damage_reports.map((report) => (
                  <li
                    key={report.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3.5 text-sm"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200">{report.description}</span>
                    <StatusTag value={report.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Belum ada laporan kerusakan untuk aset ini.
              </p>
            )}
          </div>
        </Card>

        <div>
          <QRCodeCard
            value={scanUrl}
            label={asset.asset_code}
            assetName={asset.name}
            locationName={locationText}
          />
        </div>
      </div>
    </div>
  );
}

export default AssetDetail;
