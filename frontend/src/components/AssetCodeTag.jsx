function AssetCodeTag({ code }) {
  return (
    <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-800 tracking-wider">
      {code}
    </span>
  );
}

export default AssetCodeTag;
