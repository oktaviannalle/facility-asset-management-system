function Input({ label, error, className = '', labelClassName = '', dark = false, ...props }) {
  return (
    <label className="block text-left">
      {label && (
        <span className={`mb-1.5 block text-xs font-semibold uppercase tracking-wider ${dark ? 'text-slate-200' : 'text-slate-700'} ${labelClassName}`}>
          {label}
        </span>
      )}
      <input
        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blueprint/20 focus:border-blueprint ${
          dark
            ? 'bg-slate-900/90 border-slate-600 text-white placeholder-slate-400 focus:bg-slate-900'
            : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 hover:border-slate-400'
        } ${error ? 'border-rust focus:ring-rust/20 focus:border-rust' : ''} ${className}`}
        {...props}
      />
      {error && <span className="mt-1.5 block text-xs font-medium text-rust">{error}</span>}
    </label>
  );
}

export default Input;
