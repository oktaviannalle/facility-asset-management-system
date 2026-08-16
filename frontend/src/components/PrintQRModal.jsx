import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";

function PrintQRModal({ open, onClose, value, label, assetName, locationName }) {
  const printContentRef = useRef(null);

  const handlePrint = () => {
    const printContent = printContentRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cetak Label QR - ${label || "Aset"}</title>
          <style>
            body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #fff; }
            .label-card { border: 2px solid #000; padding: 16px; width: 260px; text-align: center; border-radius: 8px; box-sizing: border-box; }
            .header { font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; color: #111; }
            .sub-header { font-size: 9px; font-weight: 600; color: #555; margin-bottom: 12px; }
            .qr-wrapper { margin: 8px 0; display: inline-block; }
            .asset-code { font-family: monospace; font-size: 14px; font-weight: bold; margin-top: 6px; color: #000; letter-spacing: 1px; }
            .asset-name { font-size: 12px; font-weight: 700; margin-top: 4px; color: #222; }
            .location { font-size: 10px; color: #666; margin-top: 2px; }
            @media print {
              body { background: none; }
              .label-card { border: 2px solid #000; }
            }
          </style>
        </head>
        <body>
          <div class="label-card">
            <div class="header">SIMAFTI — FTI UKSW</div>
            <div class="sub-header">LABEL INVENTARIS ASET</div>
            <div class="qr-wrapper">
              ${printContent.querySelector("canvas") ? printContent.querySelector("canvas").outerHTML : ""}
            </div>
            <div class="asset-code">${label || ""}</div>
            <div class="asset-name">${assetName || ""}</div>
            <div class="location">${locationName || ""}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Modal open={open} onClose={onClose} title="Cetak Label QR Code Aset">
      <div className="flex flex-col items-center gap-6 py-2">
        <div
          ref={printContentRef}
          className="w-64 rounded-xl border-2 border-slate-900 bg-white p-5 text-center shadow-md text-slate-900"
        >
          <p className="text-[11px] font-extrabold tracking-wider text-slate-900 uppercase">SIMAFTI — FTI UKSW</p>
          <p className="text-[10px] text-slate-500 font-semibold mb-3">LABEL INVENTARIS ASET</p>
          <div className="inline-block p-2 border border-slate-200 rounded-lg bg-white shadow-xs">
            <QRCodeCanvas value={value || ""} size={140} bgColor="#ffffff" fgColor="#0F2138" level="M" />
          </div>
          <p className="mt-2 font-mono text-sm font-black tracking-widest text-slate-900">{label}</p>
          <p className="text-xs font-bold text-slate-800 line-clamp-1 mt-0.5">{assetName || "Nama Aset"}</p>
          <p className="text-[10px] text-slate-500 font-medium">{locationName || "Lokasi"}</p>
        </div>

        <div className="flex justify-end gap-3 w-full border-t border-slate-100 dark:border-slate-800 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="button" onClick={handlePrint}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Cetak Label Sekarang
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default PrintQRModal;
