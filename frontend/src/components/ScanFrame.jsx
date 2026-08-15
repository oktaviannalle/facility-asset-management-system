function ScanFrame({ children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute -top-2.5 -left-2.5 h-6 w-6 border-t-2 border-l-2 border-blue-500 rounded-tl-sm pointer-events-none shadow-xs" />
      <span className="absolute -top-2.5 -right-2.5 h-6 w-6 border-t-2 border-r-2 border-blue-500 rounded-tr-sm pointer-events-none shadow-xs" />
      <span className="absolute -bottom-2.5 -left-2.5 h-6 w-6 border-b-2 border-l-2 border-blue-500 rounded-bl-sm pointer-events-none shadow-xs" />
      <span className="absolute -bottom-2.5 -right-2.5 h-6 w-6 border-b-2 border-r-2 border-blue-500 rounded-br-sm pointer-events-none shadow-xs" />
      {children}
    </div>
  );
}

export default ScanFrame;
