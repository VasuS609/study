export function Card({ className = "", children }) {
  return <div className={`rounded-lg border bg-white shadow ${className}`}>{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="border-b p-4">{children}</div>;
}

export function CardTitle({ children }) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}

export function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}
