const STYLES = {
  baik: { label: 'Baik', bg: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-500' },
  rusak_ringan: { label: 'Rusak Ringan', bg: 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800', dot: 'bg-amber-500' },
  rusak_berat: { label: 'Rusak Berat', bg: 'bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800', dot: 'bg-red-500' },
  dalam_perbaikan: { label: 'Dalam Perbaikan', bg: 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800', dot: 'bg-blue-500' },
  perbaikan: { label: 'Dalam Perbaikan', bg: 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800', dot: 'bg-blue-500' },
  dilaporkan: { label: 'Dilaporkan', bg: 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800', dot: 'bg-amber-500' },
  diverifikasi: { label: 'Diverifikasi', bg: 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800', dot: 'bg-indigo-500' },
  dikerjakan: { label: 'Dikerjakan', bg: 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800', dot: 'bg-blue-500' },
  selesai: { label: 'Selesai', bg: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-500' },
};

function StatusTag({ value }) {
  const style = STYLES[value] ?? { label: value ? value.replace('_', ' ') : '-', bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700', dot: 'bg-slate-500' };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold capitalize ${style.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}

export default StatusTag;
