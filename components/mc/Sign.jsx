export default function Sign({ className = "", children }) {
  return (
    <div
      className={`inline-block mc-bevel tex-plank px-6 py-3 font-mc text-2xl text-[#f4e4c1] shadow-[0_6px_0_rgba(0,0,0,0.4)] ${className}`}
    >
      {children}
    </div>
  );
}
