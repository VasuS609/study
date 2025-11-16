export function Progress({ value }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-black transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
