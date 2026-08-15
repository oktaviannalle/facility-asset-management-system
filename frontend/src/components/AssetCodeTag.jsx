function AssetCodeTag({ code }) {
  return (
    <span className="inline-flex items-center rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 tracking-wider">
      {code}
    </span>
  );
}

export default AssetCodeTag;
