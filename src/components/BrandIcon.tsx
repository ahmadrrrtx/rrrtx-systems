/**
 * Renders an official platform mark from the Simple Icons path data in
 * `src/lib/platform-icons.ts`. Server-compatible (no hooks, no state).
 */
export function BrandIcon({
  paths,
  className = "h-6 w-6",
  label,
}: {
  paths: readonly string[] | undefined;
  className?: string;
  label?: string;
}) {
  if (!paths?.length) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/** Product-name → registry-slug map for CMS-managed stack entries. */
export const STACK_NAME_TO_SLUG: Record<string, string> = {
  "next.js": "nextdotjs",
  nextjs: "nextdotjs",
  react: "react",
  typescript: "typescript",
  "tailwind css": "tailwindcss",
  tailwind: "tailwindcss",
  "node.js": "nodedotjs",
  nodejs: "nodedotjs",
  python: "python",
  turso: "turso",
  "drizzle orm": "drizzle",
  drizzle: "drizzle",
  postgresql: "postgresql",
  "postgres": "postgresql",
  cloudflare: "cloudflare",
  vercel: "vercel",
  github: "github",
  stripe: "stripe",
  "whatsapp api": "whatsapp",
  whatsapp: "whatsapp",
  make: "make",
  "make.com": "make",
  n8n: "n8n",
  openai: "openai",
  claude: "claude",
  "claude code": "claude",
  codex: "openai",
  gemini: "googlegemini",
  "google gemini": "googlegemini",
  "google cloud": "googlecloud",
  perplexity: "perplexity",
  "framer motion": "framer",
  framer: "framer",
  figma: "figma",
  "vs code": "visualstudiocode",
  "visual studio code": "visualstudiocode",
};
