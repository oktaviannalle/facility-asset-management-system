import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Button from "./ui/Button";

function QRCodeCard({ value, label }) {
  const wrapperRef = useRef(null);

  const handleDownload = () => {
    const canvas = wrapperRef.current.querySelector("canvas");
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `qr-${label ?? "aset"}.png`;
    link.click();
  };

  return (
    <div className="inline-flex flex-col items-center gap-3 rounded-lg border border-border bg-white p-5">
      <div ref={wrapperRef}>
        <QRCodeCanvas
          value={value}
          size={160}
          bgColor="#ffffff"
          fgColor="#0F2138"
          level="M"
        />
      </div>
      {label && <p className="font-mono text-xs text-steel">{label}</p>}
      <Button variant="outline" onClick={handleDownload}>
        Unduh QR
      </Button>
    </div>
  );
}

export default QRCodeCard;
