import Link from "next/link";
import { ArrowRight, Code2, Zap, Globe, Server } from "lucide-react";
import { SectionWrapper } from "./SectionWrapper";
import { getPublicTeam } from "@/lib/queries";
import { LinkedinIcon, XIcon } from "./SocialIcons";

/**
 * People Behind the System — the About story and the real team in one
 * section. Reads the same `about_heading` / `about_description` settings
 * keys and the same `team_members` table as the previous AboutPreview +
 * TeamSection components. No invented people, no invented facts: if the
 * database has no team entries, only the verified status card renders.
 */

const pillars = [
  {
    icon: Code2,
    title: "Engineering-First",
    description:
      "We write clean, maintainable code built to scale. Every system is yours — source, data, and infrastructure.",
  },
  {
    icon: Zap,
    title: "Conversion-Obsessed",
    description:
      "Design is measurable. If it doesn't improve revenue, leads, or efficiency, it doesn't ship.",
  },
  {
    icon: Globe,
    title: "Global by Default",
    description:
      "Edge-deployed, monitored, and designed for reliable delivery across time zones. Built for real traffic, not demos.",
  },
  {
    icon: Server,
    title: "Full Ownership",
    // "Zero surprises" was removed: no delivery process can promise zero
    // surprises, and an absolute guarantee of that kind is not defensible.
    description:
      "Source code, database, assets, deployment — everything is yours, with no vendor lock-in.",
  },
];

const pillarAccents = ["text-cyan-300", "text-blue-300", "text-violet-300", "text-purple-300"];

export async function PeopleSection({
  heading,
  description,
}: {
  heading?: string;
  description?: string;
}) {
  const shouldReadTeam = Boolean(process.env.TURSO_DATABASE_URL) || process.env.NODE_ENV !== "production";
  const team = shouldReadTeam ? await getPublicTeam() : [];

  const activeHeading = heading || "We Build Systems. Not Websites.";
  const activeDescription =
    description ||
    "RRRTX SYSTEMS is an engineering-first product studio that builds custom ecommerce platforms and AI automation systems from scratch. We don't resell themes or rebrand templates — we architect production-grade systems with real business logic, clean databases, and edge deployments that you own completely. We partner with founders, operators, and scaling brands who need infrastructure that converts, automates, and grows with them.";

  return (
    <SectionWrapper id="about" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-blue-500/[0.02] rounded-full blur-[100px]" aria-hidden="true" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-14 items-start">
          {/* Story + pillars */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">About RRRTX Systems</p>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-white mb-5 leading-tight">{activeHeading}</h2>
            <p className="text-base lg:text-lg text-slate-400 leading-relaxed max-w-2xl">{activeDescription}</p>

            <div className="mt-8 grid gap-3">
              {pillars.map((pillar, i) => (
                <div
                  key={pillar.title}
                  className="pillar-card group flex items-start gap-4 rounded-2xl border border-slate-800/50 bg-slate-950/40 px-[18px] py-[15px] transition-all duration-300 hover:border-cyan-500/35 hover:bg-slate-900/50 hover:shadow-[0_0_36px_-14px_rgba(34,211,238,.35)] hover:-translate-y-0.5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/[0.07]">
                    <pillar.icon className={`h-4 w-4 ${pillarAccents[i % pillarAccents.length]}`} aria-hidden="true" />
                  </span>
                  <div>
                    <b className="block text-sm font-semibold text-white">{pillar.title}</b>
                    <span className="text-[13px] leading-relaxed text-slate-400">{pillar.description}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/[0.06] px-3.5 py-1.5 font-mono text-[10.5px] tracking-wide text-emerald-300">
                <span className="h-[7px] w-[7px] rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" aria-hidden="true" />
                Currently accepting new engagements
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400"><Globe className="h-3.5 w-3.5 text-cyan-400/80" aria-hidden="true" />Working globally · async-first</span>
            </div>
          </div>

          {/* Team card(s) — real records only */}
          <div>
            <div className="premium-surface rounded-3xl p-7 sm:p-8 text-center relative overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_50px_-20px_rgba(34,211,238,.4)]">
              <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300 mb-6">The Team</p>

              {team.length === 0 ? (
                <p className="text-sm leading-relaxed text-slate-400">
                  Engineering-first studio. Builds and ships production systems end to end.
                </p>
              ) : (
                <div className="grid gap-8">
                  {team.slice(0, 3).map((member) => (
                    <div key={member.id} className="flex flex-col items-center">
                      {member.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="mb-4 h-24 w-24 rounded-full border border-cyan-500/30 object-cover shadow-[0_0_28px_-8px_rgba(34,211,238,.5)]"
                        />
                      ) : (
                        <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-cyan-500/30 bg-gradient-to-br from-cyan-900 to-slate-900 shadow-[0_0_28px_-8px_rgba(34,211,238,.5)]">
                          <span className="text-2xl font-extrabold text-white">{member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</span>
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-white">{member.name}</h3>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-cyan-300">{member.role}</p>
                      {member.bio && <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-slate-400">{member.bio}</p>}
                      {(member.linkedinUrl || member.twitterUrl) && (
                        <div className="mt-4 flex items-center gap-3">
                          {member.linkedinUrl && (
                            <Link
                              prefetch={false}
                              href={member.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${member.name} on LinkedIn`}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
                            >
                              LinkedIn <LinkedinIcon className="h-3.5 w-3.5" />
                            </Link>
                          )}
                          {member.twitterUrl && (
                            <Link
                              prefetch={false}
                              href={member.twitterUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${member.name} on X`}
                              className="text-slate-500 transition-colors hover:text-cyan-300"
                            >
                              <XIcon className="h-4 w-4" />
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-7 border-t border-white/[0.06] pt-6">
                <Link
                  prefetch={false}
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-200 transition-colors hover:text-cyan-300"
                >
                  Learn more about us <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
