// Page title, with a small glowing square echoing the desk lamp in the room.
export default function Sign({ className = "", children, ...rest }) {
  return (
    <h1 className={`inline-flex items-center gap-3 font-mc text-3xl text-[#f4e4c1] ${className}`} {...rest}>
      <span aria-hidden="true" className="w-3 h-3 bg-[#f4d27a] shadow-[0_0_14px_4px_rgba(244,210,122,0.45)]" />
      {children}
    </h1>
  );
}
