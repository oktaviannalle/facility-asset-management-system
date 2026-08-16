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
    axiosClient
      .get(`/assets/${id}`)
      .then((response) => setAsset(response.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-sm text-steel">Memuat...</p>;
  if (!asset) return <p className="text-sm text-rust">Aset tidak ditemukan.</p>;

  const scanUrl = `${window.location.origin}/assets/${asset.id}`;

  return (
    <div>
      <Link to="/assets" className="text-sm text-blueprint hover:underline">
        ← Kembali ke daftar aset
      </Link>

      <div className="mt-4 grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-6">
          <div className="flex items-start justify-between">
            <div>
              <AssetCodeTag code={asset.asset_code} />
              <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                {asset.name}
              </h1>
            </div>
            <StatusTag value={asset.condition} />
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-steel">Kategori</dt>
              <dd className="font-medium text-ink">{asset.category?.name}</dd>
            </div>
            <div>
              <dt className="text-steel">Lokasi</dt>
              <dd className="font-medium text-ink">
                {asset.location?.building} · {asset.location?.room}
              </dd>
            </div>
            <div>
              <dt className="text-steel">Tanggal beli</dt>
              <dd className="font-mono text-ink">{asset.purchase_date}</dd>
            </div>
            <div>
              <dt className="text-steel">Harga beli</dt>
              <dd className="font-mono text-ink">
                Rp {Number(asset.purchase_price).toLocaleString("id-ID")}
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-ink">
              Riwayat Pemeliharaan
            </h2>
            {asset.maintenance_logs?.length ? (
              <ul className="mt-3 space-y-2">
                {asset.maintenance_logs.map((log) => (
                  <li
                    key={log.id}
                    className="rounded border border-border p-3 text-sm"
                  >
                    <span className="font-mono text-steel">
                      {log.maintenance_date}
                    </span>{" "}
                    — {log.action_taken}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-steel">
                Belum ada riwayat pemeliharaan.
              </p>
            )}
          </div>

          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-ink">
              Laporan Kerusakan
            </h2>
            {asset.damage_reports?.length ? (
              <ul className="mt-3 space-y-2">
                {asset.damage_reports.map((report) => (
                  <li
                    key={report.id}
                    className="flex items-center justify-between rounded border border-border p-3 text-sm"
                  >
                    <span>{report.description}</span>
                    <StatusTag value={report.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-steel">
                Belum ada laporan kerusakan.
              </p>
            )}
          </div>
        </Card>

        <div>
          <QRCodeCard value={scanUrl} label={asset.asset_code} />
        </div>
      </div>
    </div>
  );
}

export default AssetDetail;
