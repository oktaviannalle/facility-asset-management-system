function ScanFrame({ children, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute -top-2 -left-2 h-5 w-5 border-t-2 border-l-2 border-blueprint" />
      <span className="absolute -top-2 -right-2 h-5 w-5 border-t-2 border-r-2 border-blueprint" />
      <span className="absolute -bottom-2 -left-2 h-5 w-5 border-b-2 border-l-2 border-blueprint" />
      <span className="absolute -bottom-2 -right-2 h-5 w-5 border-b-2 border-r-2 border-blueprint" />
      {children}
    </div>
  );
}

export default ScanFrame;
