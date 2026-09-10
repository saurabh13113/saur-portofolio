const HEART =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='9'%3E%3Cpath fill='%23d13a2b' d='M1 1h2v1h1V1h2v1h1v3H7v1H6v1H5v1H4V7H3V6H2V5H1z'/%3E%3C/svg%3E";
const DRUM =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='9'%3E%3Cpath fill='%239c6b3f' d='M2 1h5v1h1v4H7v1H6v1H3V7H2V6H1V2h1z'/%3E%3C/svg%3E";

export default function StatusRow() {
  return (
    <div aria-hidden className="flex justify-between max-w-[420px]">
      <div className="flex gap-[3px]">
        {Array.from({ length: 10 }).map((_, i) => (
          <img key={i} src={HEART} alt="" width={16} height={16} />
        ))}
      </div>
      <div className="flex gap-[3px]">
        {Array.from({ length: 10 }).map((_, i) => (
          <img key={i} src={DRUM} alt="" width={16} height={16} />
        ))}
      </div>
    </div>
  );
}
