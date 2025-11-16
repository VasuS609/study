import React from "react";

export function Drawer({ open, onOpenChange, children }) {
  return (
    <>
      {children[0]}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => onOpenChange(false)} />
      )}
      {open && <div className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-xl z-50">{children[1]}</div>}
    </>
  );
}

export function DrawerTrigger({ children }) {
  return children;
}

export function DrawerContent({ children, className = "" }) {
  return <div className={`h-full ${className}`}>{children}</div>;
}

export function DrawerHeader({ children }) {
  return <div className="border-b p-4">{children}</div>;
}

export function DrawerTitle({ children }) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}
