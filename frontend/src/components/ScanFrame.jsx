function ScanFrame({ children, className = '' }) {
  return (
    <div className={`relative p-2 ${className}`}>
      <span className="absolute top-0 left-0 h-5 w-5 border-t-2 border-l-2 border-blue-600 dark:border-blue-400 rounded-tl-md pointer-events-none shadow-xs" />
      <span className="absolute top-0 right-0 h-5 w-5 border-t-2 border-r-2 border-blue-600 dark:border-blue-400 rounded-tr-md pointer-events-none shadow-xs" />
      <span className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-blue-600 dark:border-blue-400 rounded-bl-md pointer-events-none shadow-xs" />
      <span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-blue-600 dark:border-blue-400 rounded-br-md pointer-events-none shadow-xs" />
      {children}
    </div>
  );
}

export default ScanFrame;
