import Image from "next/image";
import { PLATFORM_ICON_PATHS, PLATFORM_LABELS } from "@/lib/platform-icons";
import { NetworkInteractivity } from "./NetworkInteractivity";

/**
 * Connected-systems visualization for "Trusted Integrations & Platforms".
 *
 * Replaces the former text marquee (TrustBar) while keeping the same
 * `trusted_integrations` settings contract: the admin-managed list still
 * drives the graph — names that map to a known platform render at their
 * designed position; unknown names are appended as extra satellite nodes
 * so the dashboard never loses control of the content.
 *
 * The SVG is rendered on the server; NetworkInteractivity is a small
 * client island that only adds hover/focus highlighting and pulse dots.
 */

type Glow = "infra" | "ai" | "sat";

interface NodeDef {
  id: string;
  label: string;
  role: string;
  glow: Glow;
  x: number;
  y: number;
  r?: number;
  adj: string[];
}

const LEFT_FLANK: Array<[string, number, number]> = [
  ["github", 255, 140],
  ["vercel", 170, 221],
  ["cloudflare", 250, 310],
  ["turso", 160, 395],
  ["stripe", 250, 480],
  ["make", 165, 559],
];

const RIGHT_FLANK: Array<[string, number, number]> = [
  ["openai", 945, 140],
  ["claude", 1030, 221],
  ["googlegemini", 950, 310],
  ["perplexity", 1040, 395],
  ["codex", 950, 480],
  ["claudecode", 1035, 559],
];

const ROLES: Record<string, string> = {
  github: "Version control & CI",
  vercel: "Deployment & hosting",
  cloudflare: "Edge, DNS & security",
  turso: "Database",
  stripe: "Payments",
  make: "Workflow automation",
  openai: "Models & APIs",
  claude: "Reasoning & agents",
  googlegemini: "Multimodal AI",
  perplexity: "Answer & search APIs",
  codex: "AI engineering agent",
  claudecode: "AI engineering agent",
  javascript: "Core web language",
  typescript: "Typed engineering language",
  c: "Systems language",
  nextjs: "Framework",
  react: "UI library",
  python: "AI & scripting",
  n8n: "Workflow automation",
  googlecloud: "Cloud services",
  whatsapp: "Business messaging",
};

const SATELLITES: Array<[string, number, number, string]> = [
  // id, x, y, anchor-node
  ["nextjs", 80, 80, "github"],
  ["react", 1120, 80, "openai"],
  ["javascript", 62, 205, "vercel"],
  ["typescript", 1148, 197, "claude"],
  ["googlecloud", 70, 320, "turso"],
  ["n8n", 1130, 320, "perplexity"],
  ["c", 62, 470, "stripe"],
  ["python", 80, 580, "make"],
  ["whatsapp", 1120, 580, "claudecode"],
];

// Curved connectors that leave the hub tightly bunched, then fan out.
const CORE_LINKS: Array<[string, string]> = [
  ["github", "M508,312 C400,312 380,140 287,140"],
  ["vercel", "M506,318 C390,320 320,222 202,221"],
  ["cloudflare", "M505,325 C380,328 370,308 282,310"],
  ["turso", "M506,334 C390,336 320,395 192,395"],
  ["stripe", "M508,342 C400,344 380,480 282,480"],
  ["make", "M510,348 C390,350 330,560 197,559"],
  ["openai", "M692,312 C800,312 820,140 913,140"],
  ["claude", "M694,318 C810,320 880,222 998,221"],
  ["googlegemini", "M695,325 C820,328 830,308 918,310"],
  ["perplexity", "M694,334 C810,336 880,395 1008,395"],
  ["codex", "M692,342 C800,344 820,480 918,480"],
  ["claudecode", "M690,348 C810,350 870,560 999,559"],
];

const SATELLITE_LINKS: Array<[string, string, string]> = [
  // id, anchor, path
  ["nextjs", "github", "M105,92 Q170,96 226,132"],
  ["react", "openai", "M1095,92 Q1030,96 974,132"],
  ["googlecloud", "turso", "M92,322 Q130,340 168,378"],
  ["n8n", "perplexity", "M1108,322 Q1070,340 1032,378"],
  ["python", "make", "M105,568 Q170,564 226,528"],
  ["whatsapp", "claudecode", "M1095,568 Q1030,564 974,528"],
  ["javascript", "vercel", "M88,210 Q120,214 143,219"],
  ["typescript", "claude", "M1122,203 Q1085,210 1058,217"],
  ["c", "stripe", "M88,472 Q155,476 222,480"],
];

function buildNodes(extraNames: string[]): NodeDef[] {
  const nodes: NodeDef[] = [];
  for (const [id, x, y] of LEFT_FLANK) {
    nodes.push({ id, label: PLATFORM_LABELS[id], role: ROLES[id] ?? "", glow: "infra", x, y, adj: ["center", ...SATELLITES.filter(([, , , a]) => a === id).map(([sid]) => sid)] });
  }
  for (const [id, x, y] of RIGHT_FLANK) {
    nodes.push({ id, label: PLATFORM_LABELS[id], role: ROLES[id] ?? "", glow: "ai", x, y, adj: ["center", ...SATELLITES.filter(([, , , a]) => a === id).map(([sid]) => sid)] });
  }
  for (const [id, x, y, anchor] of SATELLITES) {
    nodes.push({ id, label: PLATFORM_LABELS[id], role: ROLES[id] ?? "", glow: "sat", x, y, r: 25, adj: [anchor] });
  }
  // Admin-managed extras (unknown to the graph) become generic satellites along the top arc.
  const extraSlots: Array<[number, number]> = [[400, 88], [800, 88], [330, 570], [870, 570]];
  extraNames.slice(0, extraSlots.length).forEach((name, i) => {
    const [x, y] = extraSlots[i];
    const id = `extra-${i}`;
    const anchor = x < 600 ? "github" : "openai";
    nodes.push({ id, label: name, role: "Integration", glow: "sat", x, y, r: 25, adj: [anchor] });
  });
  return nodes;
}

function Glyph({ id, x, y, r = 30 }: { id: string; x: number; y: number; r?: number }) {
  const paths = PLATFORM_ICON_PATHS[id];
  if (!paths) {
    // Generic mark for admin-added custom entries: first letter in a dot.
    return (
      <text x={x} y={y + 4} textAnchor="middle" style={{ fontSize: 12, fontWeight: 700, fill: "#cbd5e1" }}>
        {(PLATFORM_LABELS[id] ?? "?").slice(0, 1)}
      </text>
    );
  }
  const scale = (r * 2 * 0.58) / 24;
  const offset = 24 * scale / 2;
  return (
    <g className="net-glyph" transform={`translate(${x - offset} ${y - offset}) scale(${scale})`}>
      {paths.map((d, i) => <path key={i} d={d} fill="currentColor" />)}
    </g>
  );
}

function MobileCell({ id, label }: { id: string; label: string }) {
  const paths = PLATFORM_ICON_PATHS[id];
  return (
    <div className="net-mobile-cell">
      {paths ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {paths.map((d, i) => <path key={i} d={d} fill="currentColor" />)}
        </svg>
      ) : (
        <b aria-hidden="true" style={{ fontSize: 12 }}>{label.slice(0, 1)}</b>
      )}
      <b>{label}</b>
    </div>
  );
}

export function IntegrationNetwork({ integrations }: { integrations?: string[] }) {
  const adminList = (Array.isArray(integrations) ? integrations : []).map((s) => String(s).trim()).filter(Boolean);
  const knownIds = new Set([
    ...LEFT_FLANK.map(([id]) => id),
    ...RIGHT_FLANK.map(([id]) => id),
    ...SATELLITES.map(([id]) => id),
  ]);
  // Defaults cover the standard admin list; only custom extras become satellites.
  const aliases: Record<string, string> = { "next.js": "nextjs", "google cloud": "googlecloud", "claude code": "claudecode" };
  const missing: string[] = [];
  for (const name of adminList) {
    const key = name.toLowerCase();
    if (!knownIds.has(key) && !Object.keys(aliases).includes(key) && !Object.values(aliases).includes(key)) missing.push(name);
    if (Object.keys(aliases).includes(key) && !knownIds.has(aliases[key])) missing.push(name);
  }
  const nodes = buildNodes(missing);
  // Cap extras to the 4 rendered satellite slots — lists longer than the
  // slot pool must never index past it during prerender.
  const extraDefs = missing.slice(0, 4).map((name, i) => {
    const id = `extra-${i}`;
    const [x, y] = [[400, 88], [800, 88], [330, 570], [870, 570]][i];
    const anchor = x < 600 ? "github" : "openai";
    return { id, x, y, anchor } as const;
  });

  return (
    <section className="relative py-14 lg:py-20" aria-label="Platforms and AI systems RRRTX builds on">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">Trusted Integrations &amp; Platforms</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white lg:text-4xl">
              Everything connects <span className="text-gradient-strong">back to the core.</span>
            </h2>
          </div>
          <p className="max-w-sm text-[13.5px] leading-relaxed text-slate-400">
            Engineering infrastructure and AI systems wired into the platforms we ship — selected per project, every connection real. Hover a node to trace it.
          </p>
        </div>

        <div className="net-stage">
          <NetworkInteractivity>
            <svg className="net-svg" viewBox="0 0 1200 660" role="img" aria-label="Diagram: the RRRTX Systems logo at the center, connected to engineering platforms on the left — GitHub, Vercel, Cloudflare, Turso, Stripe and Make — and AI systems on the right — OpenAI, Claude, Gemini, Perplexity, Codex and Claude Code — with satellites Next.js, React, JavaScript, TypeScript, C, Google Cloud, n8n, Python and WhatsApp.">
              <defs>
                <radialGradient id="net-hub-halo-grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="rgba(34,211,238,.28)" />
                  <stop offset=".6" stopColor="rgba(59,130,246,.12)" />
                  <stop offset="1" stopColor="transparent" />
                </radialGradient>
                <linearGradient id="net-hub-hex-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#22d3ee" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>

              {CORE_LINKS.map(([id, d]) => (
                <path key={`core-${id}`} className="net-link" data-kind="core" data-a={id} data-b="center" d={d}
                  stroke={nodes.find((n) => n.id === id)?.glow === "ai" ? "rgba(139,92,246,.5)" : id === "stripe" || id === "make" ? "rgba(139,92,246,.5)" : "rgba(34,211,238,.5)"} />
              ))}
              {SATELLITE_LINKS.map(([id, anchor, d]) => (
                <path key={`sat-${id}`} className="net-link" data-kind="satellite" data-a={id} data-b={anchor} d={d} />
              ))}
              {extraDefs.map(({ id, x, y, anchor }) => {
                const edgeX = x + (x < 600 ? 30 : -30);
                return (
                  <path key={`extra-${id}`} className="net-link" data-kind="satellite" data-a={id} data-b={anchor}
                    d={`M${x + (x < 600 ? -25 : 25)},${y} Q${(x + edgeX) / 2},${y} ${x < 600 ? 287 : 913},140`} />
                );
              })}

              {/* Hub */}
              <circle cx="600" cy="330" r="170" fill="url(#net-hub-halo-grad)" className="net-hub-halo" aria-hidden="true" />
              <circle cx="600" cy="330" r="132" fill="none" stroke="rgba(34,211,238,.16)" strokeDasharray="3 9" className="net-hub-orbit" aria-hidden="true" />
              <polygon points="600,242 674,286 674,374 600,418 526,374 526,286" fill="rgba(10,16,36,.94)" stroke="url(#net-hub-hex-grad)" strokeWidth="2"
                style={{ filter: "drop-shadow(0 0 24px rgba(34,211,238,.35))" }} />
              <g className="net-hub-logo">
                <image href="/assets/rrrtx-logo.png" x="532" y="316" width="136" height="53" />
              </g>
              <text x="600" y="452" textAnchor="middle" fill="#f8fafc" style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".22em" }}>RRRTX SYSTEMS</text>
              <text x="600" y="470" textAnchor="middle" fill="#94a3b8" style={{ fontSize: 9.5, letterSpacing: ".18em" }}>THE CORE SYSTEM</text>
              <g className="net-node" data-node="center" data-name="RRRTX SYSTEMS" data-role="The core system" data-glow="infra"
                data-adj={nodes.filter((n) => n.adj.includes("center")).map((n) => n.id).join(" ")}
                tabIndex={0} role="img" aria-label="RRRTX Systems — the core system" style={{ cursor: "pointer" }}>
                <circle className="net-chip" cx="600" cy="330" r="96" fill="transparent" stroke="none" />
              </g>

              {/* Flank + satellite nodes */}
              {nodes.map((n) => (
                <g key={n.id} className="net-node" data-node={n.id} data-name={n.label} data-role={n.role} data-glow={n.glow}
                  data-adj={n.adj.join(" ")} tabIndex={0} role="img" aria-label={`${n.label} — ${n.role}`}>
                  <title>{`${n.label} — ${n.role}`}</title>
                  <circle className="net-chip" cx={n.x} cy={n.y} r={n.r ?? 30} />
                  <Glyph id={n.id} x={n.x} y={n.y} r={n.r ?? 30} />
                </g>
              ))}
            </svg>

            <div className="net-pill" aria-hidden="true" data-net-pill />
          </NetworkInteractivity>

          {/* Intentional mobile composition (no squeezed graph) */}
          <div className="net-mobile-grid">
            <div className="net-mobile-core">
              <Image src="/assets/rrrtx-logo.png" alt="RRRTX Systems" width={120} height={47} className="h-[30px] w-auto" />
              <small>RRRTX CORE</small>
            </div>
            <div className="net-mobile-cat">Build &amp; infrastructure</div>
            {["github", "vercel", "cloudflare", "turso", "stripe", "make", "nextjs", "react", "python"].map((id) => (
              <MobileCell key={id} id={id} label={PLATFORM_LABELS[id]} />
            ))}
            <div className="net-mobile-cat">AI systems</div>
            {["openai", "claude", "googlegemini", "perplexity", "codex", "claudecode", "n8n"].map((id) => (
              <MobileCell key={id} id={id} label={PLATFORM_LABELS[id]} />
            ))}
            <div className="net-mobile-cat">Business</div>
            {["googlecloud", "whatsapp", ...missing.map((_, i) => `extra-${i}`)].map((id) => (
              <MobileCell key={id} id={id} label={id.startsWith("extra-") ? missing[Number(id.slice(6))] : PLATFORM_LABELS[id]} />
            ))}
          </div>
        </div>

        <p className="mt-3.5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 font-mono text-[10.5px] text-slate-500">
          <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-gradient-to-r from-cyan-400 to-blue-500" aria-hidden="true" /> build &amp; infrastructure</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-gradient-to-r from-blue-500 to-violet-500" aria-hidden="true" /> AI systems</span>
          <span className="opacity-70">pulses flow toward the core · hover or focus pauses them</span>
        </p>
      </div>
    </section>
  );
}
