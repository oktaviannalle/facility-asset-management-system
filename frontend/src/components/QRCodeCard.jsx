import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Button from "./ui/Button";
import ScanFrame from "./ScanFrame";
import PrintQRModal from "./PrintQRModal";

function QRCodeCard({ value, label, assetName, locationName }) {
  const wrapperRef = useRef(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const handleDownload = () => {
    const canvas = wrapperRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `qr-${label ?? "aset"}.png`;
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm text-center">
      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold text-sm">
        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
        <span>Label QR Code</span>
      </div>

      <ScanFrame className="bg-white p-3 rounded-lg shadow-xs">
        <div ref={wrapperRef}>
          <QRCodeCanvas
            value={value || ""}
            size={160}
            bgColor="#ffffff"
            fgColor="#0F2138"
            level="M"
          />
        </div>
      </ScanFrame>

      {label && (
        <div>
          <p className="font-mono text-xs font-bold text-slate-900 dark:text-white tracking-wider">{label}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Scan untuk melihat detail aset</p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2 w-full pt-2 border-t border-slate-100 dark:border-slate-800">
        <Button variant="outline" onClick={handleDownload} className="text-xs py-2 px-3">
          <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Unduh PNG
        </Button>
        <Button onClick={() => setPrintModalOpen(true)} className="text-xs py-2 px-3">
          <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Cetak Label
        </Button>
      </div>

      <PrintQRModal
        open={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        value={value}
        label={label}
        assetName={assetName}
        locationName={locationName}
      />
    </div>
  );
}

export default QRCodeCard;
