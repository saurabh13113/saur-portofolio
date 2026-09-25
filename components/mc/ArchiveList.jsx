import { techIcon } from "@/components/mc/icons";

export default function ArchiveList({ projects }) {
  if (projects.length === 0) return null;

  return (
    <div className="mt-8 mc-bevel tex-stone overflow-x-auto">
      <table className="w-full text-sm font-primary text-[#f4e4c1] min-w-[480px]">
        <thead>
          <tr className="text-left text-white/60 font-mc text-[10px] uppercase">
            <th className="p-3">Project</th>
            <th className="p-3 hidden sm:table-cell">Stack</th>
            <th className="p-3">Link</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.slug} className="border-t border-white/10">
              <td className="p-3">
                <div className="font-mc text-xs">{p.title}</div>
                <div className="text-white/60 text-xs mt-0.5">{p.blurb}</div>
              </td>
              <td className="p-3 hidden sm:table-cell">
                <div className="flex flex-wrap gap-2">
                  {p.stack.map((s) => {
                    const Ic = techIcon(s);
                    return (
                      <span key={s} className="inline-flex items-center gap-1 text-xs text-white/70">
                        {Ic ? <Ic aria-hidden="true" /> : null}
                        {s}
                      </span>
                    );
                  })}
                </div>
              </td>
              <td className="p-3">
                <a href={p.links.github} target="_blank" rel="noreferrer" className="underline text-emerald text-xs">
                  GitHub
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
