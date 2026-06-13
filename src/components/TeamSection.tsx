import { getPublicTeam } from "@/lib/queries";
import { SectionWrapper } from "./SectionWrapper";
import { LinkedinIcon, XIcon } from "./SocialIcons";
import Link from "next/link";

export async function TeamSection() {
  // Safe fetch: returns [] on any error so build/site never crash.
  const team = await getPublicTeam();

  // Render nothing if there are no active team members (no empty section).
  if (team.length === 0) return null;

  return (
    <SectionWrapper id="team" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">The Team</p>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4">
            The People Behind the Systems.
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Engineers and operators who ship production-grade work.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {team.map((m) => (
            <div
              key={m.id}
              className="flex flex-col items-center text-center rounded-2xl p-8 bg-slate-950/40 border border-slate-800/50 hover:border-slate-600/80 transition-all duration-300"
            >
              {m.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.imageUrl}
                  alt={m.name}
                  className="w-20 h-20 rounded-full object-cover border border-slate-700 mb-4"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold mb-4">
                  {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
              )}
              <h3 className="text-base font-semibold text-white">{m.name}</h3>
              <p className="text-xs text-cyan-400 mb-3">{m.role}</p>
              {m.bio && <p className="text-sm text-slate-400 leading-relaxed mb-4">{m.bio}</p>}
              <div className="flex items-center gap-3 mt-auto">
                {m.linkedinUrl && (
                  <Link
                    href={m.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${m.name} on LinkedIn`}
                    className="text-slate-500 hover:text-cyan-400 transition-colors"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </Link>
                )}
                {m.twitterUrl && (
                  <Link
                    href={m.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${m.name} on X`}
                    className="text-slate-500 hover:text-cyan-400 transition-colors"
                  >
                    <XIcon className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
