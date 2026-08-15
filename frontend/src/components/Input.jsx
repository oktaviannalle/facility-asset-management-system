function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </span>
      )}
      <input
        className={`w-full rounded-md border px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-blueprint focus:ring-1 focus:ring-blueprint ${error ? "border-rust" : "border-border"} ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-rust">{error}</span>}
    </label>
  );
}

export default Input;
