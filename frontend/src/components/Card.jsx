function Card({ className = "", children }) {
  return (
    <div className={`rounded-lg border border-border bg-white ${className}`}>
      {children}
    </div>
  );
}

export default Card;
