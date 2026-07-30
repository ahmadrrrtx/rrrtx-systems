import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Scale, Server, Bot, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = createMetadata({
  title: "Open Source Engineering",
  description: "Explore open-source systems and implementation notes published by RRRTX Systems, including the Gemma RSS Intelligence Monitor.",
  path: "/open-source",
});

export default function OpenSourcePage() {
  const repository = "https://github.com/ahmadrrrtx/Gemma-4-RSS-Intelligence-Monitor";
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Gemma RSS Intelligence Monitor",
    codeRepository: repository,
    programmingLanguage: "Python",
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    author: { "@id": "https://rrrtx-systems.com/#organization" },
    description: "An open-source RSS monitoring and classification workflow built around a locally operated language model.",
  };

  return (
    <main className="min-h-screen bg-[#020617]">
      <JsonLd id="schema-open-source-project" data={schema} />
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="max-w-3xl mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">Open engineering</p>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-5">Systems you can inspect, run, and extend.</h1>
            <p className="text-lg text-slate-300 leading-relaxed">We publish selected engineering work when the code, licensing, and documentation are ready for responsible reuse. Production client systems remain private unless a client explicitly approves publication.</p>
          </header>

          <article className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-gradient-to-br from-slate-900/90 to-slate-950/70 p-7 sm:p-10">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl" aria-hidden="true" />
            <div className="relative grid lg:grid-cols-[1fr_280px] gap-10">
              <div>
                <div className="flex items-center gap-3 mb-5"><div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"><Bot className="w-5 h-5 text-cyan-400" aria-hidden="true" /></div><div><p className="text-xs text-purple-400 uppercase tracking-wider">Python · Local LLM · RSS</p><h2 className="text-2xl font-bold text-white">Gemma RSS Intelligence Monitor</h2></div></div>
                <p className="text-slate-300 leading-relaxed mb-7">A self-hosted workflow that collects RSS items, classifies signal versus noise, and sends structured digests to Slack. The repository includes installation guidance and is published under Apache License 2.0.</p>
                <div className="flex flex-wrap gap-3">
                  <a href={repository} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white text-slate-950 text-sm font-semibold"><GithubIcon className="w-4 h-4" aria-hidden="true" />View repository <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /></a>
                  <Link href="/blog/operational-workflow-automation" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-700 text-slate-300 text-sm font-semibold hover:text-white">Read the workflow guide <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
                </div>
              </div>
              <dl className="grid gap-4 content-start">
                <div className="rounded-xl border border-slate-800 bg-black/20 p-4"><dt className="flex items-center gap-2 text-xs text-slate-400 mb-1"><Scale className="w-4 h-4 text-cyan-400" aria-hidden="true" />License</dt><dd className="text-sm font-semibold text-white">Apache-2.0</dd></div>
                <div className="rounded-xl border border-slate-800 bg-black/20 p-4"><dt className="flex items-center gap-2 text-xs text-slate-400 mb-1"><Server className="w-4 h-4 text-cyan-400" aria-hidden="true" />Operation</dt><dd className="text-sm font-semibold text-white">Self-hosted</dd></div>
                <div className="rounded-xl border border-slate-800 bg-black/20 p-4"><dt className="flex items-center gap-2 text-xs text-slate-400 mb-1"><GithubIcon className="w-4 h-4 text-cyan-400" aria-hidden="true" />Source</dt><dd className="text-sm font-semibold text-white">Public repository</dd></div>
              </dl>
            </div>
          </article>

          <div className="mt-10 rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6 text-sm text-slate-400 leading-relaxed">
            <strong className="text-white">About the website repository:</strong> Public source visibility does not by itself create an open-source license. The RRRTX Systems production website should not be represented as open source unless an explicit license is added after an intellectual-property and security review.
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
