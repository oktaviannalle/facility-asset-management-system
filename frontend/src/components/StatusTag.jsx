const STYLES = {
  baik: { label: "Baik", bg: "bg-moss-light", text: "text-moss" },
  rusak_ringan: {
    label: "Rusak Ringan",
    bg: "bg-amber-light",
    text: "text-amber",
  },
  rusak_berat: { label: "Rusak Berat", bg: "bg-rust-light", text: "text-rust" },
  perbaikan: {
    label: "Dalam Perbaikan",
    bg: "bg-blueprint-light",
    text: "text-blueprint",
  },
  dilaporkan: { label: "Dilaporkan", bg: "bg-amber-light", text: "text-amber" },
  diverifikasi: {
    label: "Diverifikasi",
    bg: "bg-blueprint-light",
    text: "text-blueprint",
  },
  dikerjakan: {
    label: "Dikerjakan",
    bg: "bg-blueprint-light",
    text: "text-blueprint",
  },
  selesai: { label: "Selesai", bg: "bg-moss-light", text: "text-moss" },
};

function StatusTag({ value }) {
  const style = STYLES[value] ?? {
    label: value,
    bg: "bg-border",
    text: "text-steel",
  };
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}

export default StatusTag;
