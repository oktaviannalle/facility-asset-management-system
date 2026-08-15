function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-xl border border-slate-200/90 bg-white shadow-xs transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
