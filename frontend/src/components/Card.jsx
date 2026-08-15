function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
