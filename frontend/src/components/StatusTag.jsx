const STYLES = {
  baik: { label: 'Baik', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  rusak_ringan: { label: 'Rusak Ringan', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  rusak_berat: { label: 'Rusak Berat', bg: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  perbaikan: { label: 'Dalam Perbaikan', bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  dilaporkan: { label: 'Dilaporkan', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  diverifikasi: { label: 'Diverifikasi', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
  dikerjakan: { label: 'Dikerjakan', bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  selesai: { label: 'Selesai', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
};

function StatusTag({ value }) {
  const style = STYLES[value] ?? { label: value, bg: 'bg-slate-50 text-slate-700 border-slate-200', dot: 'bg-slate-500' };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${style.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}

export default StatusTag;
