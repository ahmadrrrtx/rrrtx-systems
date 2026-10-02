import { SectionWrapper } from "./SectionWrapper";
import { BrandIcon } from "./BrandIcon";
import { PLATFORM_ICON_PATHS } from "@/lib/platform-icons";

/**
 * AI Development Assistance — the agentic engineering toolkit.
 * Static, server-rendered; movement is CSS-only (floating tiles, seek
 * pulse + travelling dots) and fully disabled under prefers-reduced-motion.
 */

const TILE_FLOATS = [
  { d: "5.4s", delay: "-.4s" },
  { d: "6.2s", delay: "-1.3s" },
  { d: "5.7s", delay: "-2.2s" },
  { d: "6.5s", delay: "-.9s" },
  { d: "5.2s", delay: "-3.1s" },
  { d: "6.1s", delay: "-1.8s" },
];

export function AIToolkit() {
  const tools = [
    { name: "Claude Code", note: "Agent CLI for deep refactors & features", paths: PLATFORM_ICON_PATHS.claude },
    { name: "Codex", note: "Autonomous coding agent", paths: PLATFORM_ICON_PATHS.openai },
    { name: "OpenCode", note: "Open-source coding agent", glyph: "OC" },
    { name: "Antigravity", note: "Agentic IDE", glyph: "AG" },
    { name: "VS Code", note: "Daily engineering environment", paths: PLATFORM_ICON_PATHS.visualstudiocode },
    { name: "Figma", note: "Design systems & handoff", paths: PLATFORM_ICON_PATHS.figma },
  ];

  return (
    <SectionWrapper className="relative py-16 lg:py-20" ariaLabel="AI development assistance">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="ait-band p-7 sm:p-9">
          <div className="relative mb-6 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-300">AI Development Assistance</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white lg:text-3xl">
                Built with AI agents. <span className="text-gradient-strong">Verified by engineers.</span>
              </h2>
            </div>
            <p className="max-w-sm text-[13px] leading-relaxed text-slate-400">
              We engineer with the current generation of AI coding tools — every output reviewed, tested and owned by a human before it ships.
            </p>
          </div>

          <ul className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {tools.map((tool, i) => (
              <li
                key={tool.name}
                className="ait-tile"
                style={{ "--i": i } as React.CSSProperties}
              >
                <span
                  className="ait-float"
                  style={{
                    "--float-duration": TILE_FLOATS[i].d,
                    "--float-delay": TILE_FLOATS[i].delay,
                  } as React.CSSProperties}
                >
                  {tool.paths ? (
                    <BrandIcon paths={tool.paths} className="ait-glyph" />
                  ) : (
                    <span className="ait-glyph flex items-center justify-center font-mono text-[11px] font-bold text-slate-200" aria-hidden="true">
                      {tool.glyph}
                    </span>
                  )}
                  <b className="text-[12px] font-semibold text-slate-100">{tool.name}</b>
                  <small className="text-[9.5px] leading-snug text-slate-400">{tool.note}</small>
                </span>
              </li>
            ))}
          </ul>

          <div className="ait-seek" aria-hidden="true">
            <span className="ait-seek-dot" style={{ "--dot-duration": "5.5s", "--dot-delay": "0s" } as React.CSSProperties} />
            <span className="ait-seek-dot ait-seek-dot--cyan" style={{ "--dot-duration": "7.5s", "--dot-delay": "-3.2s" } as React.CSSProperties} />
          </div>
          <p className="relative mt-4 font-mono text-[10.5px] tracking-wide text-slate-500">
            {"// AI accelerates delivery; humans own the architecture, the review and the outcome."}
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
