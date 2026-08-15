function AssetCodeTag({ code }) {
  return (
    <span className="inline-flex items-center rounded border border-dashed border-steel/40 px-2 py-0.5 font-mono text-xs text-steel">
      {code}
    </span>
  );
}

export default AssetCodeTag;
