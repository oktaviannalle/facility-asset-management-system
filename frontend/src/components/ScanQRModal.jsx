import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import Input from "./ui/Input";
import ScanFrame from "./ScanFrame";
import assetService from "../api/assetService";

function ScanQRModal({ open, onClose }) {
  const [inputCode, setInputCode] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setSearching(true);
    setError("");

    try {
      const response = await assetService.getAll();
      const assets = response.data.data || [];

      // Search by ID or asset_code
      const found = assets.find(
        (a) =>
          String(a.id) === inputCode.trim() ||
          a.asset_code.toLowerCase() === inputCode.trim().toLowerCase()
      );

      if (found) {
        onClose();
        setInputCode("");
        navigate(`/assets/${found.id}`);
      } else {
        setError(`Aset dengan kode / ID "${inputCode}" tidak ditemukan.`);
      }
    } catch (err) {
      setError("Gagal menghubungkan ke server.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Scan / Cari QR Code Aset">
      <div className="space-y-6">
        <div className="text-center">
          <ScanFrame className="mx-auto w-48 h-48 bg-slate-900 rounded-xl flex flex-col items-center justify-center text-slate-300 shadow-inner p-4 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 animate-pulse" />
            <svg className="w-12 h-12 text-blue-400 mb-2 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <p className="text-xs font-semibold text-slate-200">Area Scanner QR Code</p>
            <p className="text-[10px] text-slate-400 mt-1">Arahkan kamera / scanner ke label QR Aset</p>
          </ScanFrame>
        </div>

        <form onSubmit={handleSearch} className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Input
            label="Input Kode Aset atau ID Manual"
            placeholder="misal: AST-001 atau ID Aset"
            value={inputCode}
            onChange={(e) => {
              setInputCode(e.target.value);
              setError("");
            }}
          />

          {error && (
            <p className="text-xs text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-950/50 p-2.5 rounded-lg border border-red-200 dark:border-red-900">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" loading={searching}>
              Buka Detail Aset
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default ScanQRModal;
