"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Lock, CheckCircle, HelpCircle, Plus, Trash, Eye, Settings, Heart, Laptop, Award, Flame, Star, Bot, Activity, DollarSign, RefreshCw, ShoppingCart, MessageSquare, Shield, Sparkles, AlertTriangle } from "lucide-react";

const availableIcons = {
  Rocket: "Rocket",
  Users: "Users",
  TrendingUp: "TrendingUp",
  Clock: "Clock",
  Globe: "Globe",
  Heart: "Heart",
  Laptop: "Laptop",
  Award: "Award",
  Flame: "Flame",
  Star: "Star",
  Bot: "Bot",
  Activity: "Activity",
  DollarSign: "DollarSign",
  Shield: "Shield",
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"security" | "general" | "homepage" | "integrations" | "stats" | "chatbot" | "techstack" | "about">("general");
  
  // Tab 1: Security (Password Change)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  // Tab 2: General & Socials
  const [contactEmail, setContactEmail] = useState("admin@rrrtx.com");
  const [socials, setSocials] = useState<{ platform: string; url: string }[]>([]);
  const [newPlatform, setNewPlatform] = useState("LinkedIn");
  const [newSocialUrl, setNewSocialUrl] = useState("");

  // Tab 3: Homepage Copy
  const [heroTitleLines, setHeroTitleLines] = useState<string>(""); // comma or line separated
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroCtaText, setHeroCtaText] = useState("");
  const [heroCtaLink, setHeroCtaLink] = useState("");
  const [problemSectionTitle, setProblemSectionTitle] = useState("");
  const [problemSectionDesc, setProblemSectionDesc] = useState("");
  const [problemBullets, setProblemBullets] = useState<string[]>([]);
  const [newProblemBullet, setNewProblemBullet] = useState("");

  // Tab 4: Trusted Integrations
  const [integrations, setIntegrations] = useState<string[]>([]);
  const availableIntegrations = ["Next.js", "React", "Node.js", "Python", "Three.js", "Vercel", "Google Cloud", "Stripe", "Supabase", "SQLite", "WhatsApp", "Make", "GitHub", "Turso", "Cloudflare", "TypeScript", "Tailwind"];

  // Tab 5: Stats & Counters
  const [statsList, setStatsList] = useState<{ icon: string; value: number; suffix: string; label: string }[]>([]);
  const [newStat, setNewStat] = useState({ icon: "Rocket", value: 10, suffix: "+", label: "" });

  // Tab 6: Tech Stack
  const [techStack, setTechStack] = useState<{ name: string; category: string }[]>([]);
  const [newTech, setNewTech] = useState({ name: "", category: "" });

  // Tab 7: About Section
  const [aboutHeading, setAboutHeading] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");

  // Tab 8: Chatbot Settings
  const [chatbotEnabled, setChatbotEnabled] = useState(true);
  const [chatbotName, setChatbotName] = useState("RRRTX Guide");
  const [chatbotWelcome, setChatbotWelcome] = useState("");
  const [chatbotAbout, setChatbotAbout] = useState("");
  const [chatbotContactCta, setChatbotContactCta] = useState("Book a Free Call");

  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        
        if (data.contact_email) setContactEmail(data.contact_email);
        
        if (data.social_profiles) {
          try { setSocials(JSON.parse(data.social_profiles)); } catch {}
        } else {
          setSocials([
            { platform: "LinkedIn", url: "https://www.linkedin.com/company/133734086" },
            { platform: "GitHub", url: "https://github.com/ahmadrrrtx" }
          ]);
        }

        if (data.hero_title) setHeroTitleLines(data.hero_title);
        else setHeroTitleLines("We Build,Systems That,Attract Leads,Close Sales & Scale,Your Business");

        if (data.hero_subtitle) setHeroSubtitle(data.hero_subtitle);
        else setHeroSubtitle("Custom ecommerce websites and AI systems built to convert. We build premium sites from scratch with dashboards, automations, and AI tools that help your brand sell better, work faster, and scale globally.");

        if (data.hero_cta_text) setHeroCtaText(data.hero_cta_text);
        else setHeroCtaText("Get Your Free Strategy Call");

        if (data.hero_cta_link) setHeroCtaLink(data.hero_cta_link);
        else setHeroCtaLink("/contact");

        if (data.problem_title) setProblemSectionTitle(data.problem_title);
        else setProblemSectionTitle("Templates Aren't Systems.");

        if (data.problem_desc) setProblemSectionDesc(data.problem_desc);
        else setProblemSectionDesc("Most agencies sell you a prettier template and call it custom. When you need to scale, integrate, or automate, you hit the same wall every time. You don't need a new theme. You need a system built around your business logic.");

        if (data.problem_bullets) {
          try { setProblemBullets(JSON.parse(data.problem_bullets)); } catch {}
        } else {
          setProblemBullets([
            "Your Shopify theme looks like every other store in your niche.",
            "AI chatbots were installed, but they don't actually convert visitors.",
            "Your 'automation' is a mess of Zapier spaghetti that breaks weekly.",
            "You paid for a 'custom' site and got a template with different colors."
          ]);
        }

        if (data.trusted_integrations) {
          try { setIntegrations(JSON.parse(data.trusted_integrations)); } catch {}
        } else {
          setIntegrations(["Next.js", "React", "Node.js", "Python", "Three.js", "Vercel", "Google Cloud", "Stripe", "Supabase", "SQLite", "WhatsApp", "Make", "GitHub", "Turso", "Cloudflare", "TypeScript", "Tailwind"]);
        }

        if (data.homepage_stats) {
          try { setStatsList(JSON.parse(data.homepage_stats)); } catch {}
        } else {
          setStatsList([
            { icon: "Rocket", value: 15, suffix: "+", label: "Projects Delivered" },
            { icon: "Users", value: 12, suffix: "+", label: "Happy Clients" },
            { icon: "TrendingUp", value: 18, suffix: "%", label: "Avg. ROI Lift" },
            { icon: "Clock", value: 24, suffix: "/7", label: "Systems Running" },
            { icon: "Globe", value: 5, suffix: "+", label: "Countries Served" }
          ]);
        }

        if (data.tech_stack) {
          try { setTechStack(JSON.parse(data.tech_stack)); } catch {}
        } else {
          setTechStack([
            { name: "Next.js", category: "Framework" },
            { name: "React", category: "Frontend" },
            { name: "TypeScript", category: "Language" },
            { name: "Tailwind CSS", category: "Styling" },
            { name: "Framer Motion", category: "Animation" },
            { name: "Node.js", category: "Runtime" },
            { name: "Python", category: "AI & Scripts" },
            { name: "Turso", category: "Database" },
            { name: "Drizzle ORM", category: "ORM" },
            { name: "PostgreSQL", category: "Database" },
            { name: "Vercel", category: "Hosting" },
            { name: "Cloudflare", category: "CDN" },
            { name: "GitHub", category: "Version Control" },
            { name: "Stripe", category: "Payments" },
            { name: "WhatsApp API", category: "Messaging" },
          ]);
        }

        if (data.about_heading) setAboutHeading(data.about_heading);
        else setAboutHeading("We Build Systems. Not Websites.");

        if (data.about_description) setAboutDescription(data.about_description);
        else setAboutDescription("RRRTX SYSTEMS is an engineering-first product studio that builds custom ecommerce platforms and AI automation systems from scratch. No templates, no vendor lock-in, no borrowed themes — just clean architecture, real business logic, and full ownership of everything we deliver.");

        if (data.chatbot_enabled) setChatbotEnabled(data.chatbot_enabled === "true");
        else setChatbotEnabled(true);

        if (data.chatbot_name) setChatbotName(data.chatbot_name);
        else setChatbotName("RRRTX Guide");

        if (data.chatbot_welcome) setChatbotWelcome(data.chatbot_welcome);
        else setChatbotWelcome("Hi there! I am your RRRTX Systems guide. Ask me anything about our custom ecommerce, AI automations, pricing, or how we build systems that scale!");

        if (data.chatbot_about) setChatbotAbout(data.chatbot_about);
        else setChatbotAbout("RRRTX SYSTEMS builds custom ecommerce websites and AI automation systems from scratch for brands that outgrew templates.");

        if (data.chatbot_contact_cta) setChatbotContactCta(data.chatbot_contact_cta);
        else setChatbotContactCta("Book a Free Call");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(""); setPasswordErr("");
    if (newPassword.length < 6) { setPasswordErr("New password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { setPasswordErr("Passwords do not match."); return; }
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMsg("Password updated successfully.");
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      } else {
        setPasswordErr(data.error || "Failed to update password.");
      }
    } catch {
      setPasswordErr("Something went wrong.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaveMessage(""); setSaveError("");
    try {
      const payload = {
        contact_email: contactEmail,
        social_profiles: JSON.stringify(socials),
        hero_title: heroTitleLines,
        hero_subtitle: heroSubtitle,
        hero_cta_text: heroCtaText,
        hero_cta_link: heroCtaLink,
        problem_title: problemSectionTitle,
        problem_desc: problemSectionDesc,
        problem_bullets: JSON.stringify(problemBullets),
        trusted_integrations: JSON.stringify(integrations),
        homepage_stats: JSON.stringify(statsList),
        tech_stack: JSON.stringify(techStack),
        about_heading: aboutHeading,
        about_description: aboutDescription,
        chatbot_enabled: chatbotEnabled ? "true" : "false",
        chatbot_name: chatbotName,
        chatbot_welcome: chatbotWelcome,
        chatbot_about: chatbotAbout,
        chatbot_contact_cta: chatbotContactCta,
      };

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveMessage("Settings saved successfully and published to live site.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSaveError("Failed to save settings.");
      }
    } catch {
      setSaveError("Something went wrong while saving settings.");
    }
  };

  const addSocial = () => {
    if (!newSocialUrl) return;
    setSocials([...socials, { platform: newPlatform, url: newSocialUrl }]);
    setNewSocialUrl("");
  };

  const removeSocial = (idx: number) => {
    setSocials(socials.filter((_, i) => i !== idx));
  };

  const addProblemBullet = () => {
    if (!newProblemBullet) return;
    setProblemBullets([...problemBullets, newProblemBullet]);
    setNewProblemBullet("");
  };

  const removeProblemBullet = (idx: number) => {
    setProblemBullets(problemBullets.filter((_, i) => i !== idx));
  };

  const toggleIntegration = (name: string) => {
    if (integrations.includes(name)) {
      setIntegrations(integrations.filter((x) => x !== name));
    } else {
      setIntegrations([...integrations, name]);
    }
  };

  const addStat = () => {
    if (!newStat.label) return;
    setStatsList([...statsList, { ...newStat }]);
    setNewStat({ icon: "Rocket", value: 10, suffix: "+", label: "" });
  };

  const removeStat = (idx: number) => {
    setStatsList(statsList.filter((_, i) => i !== idx));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 text-sm text-slate-500">Loading settings...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Global Site Control</h1>
            <p className="text-sm text-slate-400">Control homepage copywriting, trusted integrations, stats, socials, and security.</p>
          </div>
          {activeTab !== "security" && (
            <button
              onClick={handleSaveSettings}
              className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg"
            >
              Save & Publish Changes
            </button>
          )}
        </div>

        {saveMessage && (
          <div className="px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-400 flex items-center gap-2">
            <CheckCircle className="w-4.5 h-4.5" />
            {saveMessage}
          </div>
        )}

        {saveError && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {saveError}
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800/60 overflow-x-auto gap-2">
          {[
            { id: "general", label: "General & Socials" },
            { id: "homepage", label: "Homepage Copy" },
            { id: "integrations", label: "Trusted Integrations" },
            { id: "stats", label: "Stats & Counters" },
            { id: "techstack", label: "Tech Stack" },
            { id: "about", label: "About Section" },
            { id: "chatbot", label: "Chatbot Assistant" },
            { id: "security", label: "Password & Security" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "border-cyan-500 text-cyan-400 bg-cyan-500/5"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content: General Settings */}
        {activeTab === "general" && (
          <div className="p-6 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">General & Contact Channels</h2>
            
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Inquiry Contact Email</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Social Profiles</label>
              
              <div className="rounded-lg border border-slate-800/50 divide-y divide-slate-800/50 bg-slate-950/30">
                {socials.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3">
                    <div>
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider mr-3">{s.platform}:</span>
                      <span className="text-sm text-slate-300">{s.url}</span>
                    </div>
                    <button
                      onClick={() => removeSocial(idx)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 items-end">
                <div className="w-1/3">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Platform</label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="GitHub">GitHub</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Twitter/X">Twitter/X</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Custom Portfolio">Custom Portfolio</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newSocialUrl}
                    onChange={(e) => setNewSocialUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <button
                  type="button"
                  onClick={addSocial}
                  className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-lg transition-all inline-flex items-center gap-1.5 h-9.5"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Homepage copy */}
        {activeTab === "homepage" && (
          <div className="p-6 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">Hero Section Content</h2>
            
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Hero Title Lines (Comma-separated for line-breaks)
              </label>
              <textarea
                required
                rows={3}
                value={heroTitleLines}
                onChange={(e) => setHeroTitleLines(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                placeholder="We Build,Systems That,Attract Leads,Close Sales & Scale,Your Business"
              />
              <p className="text-[10px] text-slate-500 mt-1">Separate the title with commas where you want line-breaks to occur (e.g., We Build, Systems That...)</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Hero Subtitle</label>
              <textarea
                required
                rows={3}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">CTA Button Text</label>
                <input
                  required
                  value={heroCtaText}
                  onChange={(e) => setHeroCtaText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">CTA Link Destination</label>
                <input
                  required
                  value={heroCtaLink}
                  onChange={(e) => setHeroCtaLink(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <h2 className="text-sm font-bold text-white uppercase tracking-wider mt-8 mb-2 border-b border-slate-800 pb-2">The Real Problem Copy</h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Problem Section Title</label>
                <input
                  required
                  value={problemSectionTitle}
                  onChange={(e) => setProblemSectionTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Problem Section Description</label>
                <textarea
                  required
                  rows={2}
                  value={problemSectionDesc}
                  onChange={(e) => setProblemSectionDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-y"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Problem Bullets</label>
              <div className="rounded-lg border border-slate-800/50 divide-y divide-slate-800/50 bg-slate-950/30">
                {problemBullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 gap-4">
                    <p className="text-sm text-slate-300 leading-relaxed">{bullet}</p>
                    <button
                      onClick={() => removeProblemBullet(idx)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  placeholder="Add another hardcoded problem bullet..."
                  value={newProblemBullet}
                  onChange={(e) => setNewProblemBullet(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
                <button
                  type="button"
                  onClick={addProblemBullet}
                  className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-lg transition-all"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Trusted Integrations */}
        {activeTab === "integrations" && (
          <div className="p-6 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-6">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Trusted Integrations & Platforms</h2>
              <p className="text-xs text-slate-400 mb-4">Toggle which brand logos appear on the homepage scrolling marquee.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableIntegrations.map((brand) => {
                const isSelected = integrations.includes(brand);
                return (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => toggleIntegration(brand)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                      isSelected
                        ? "bg-cyan-500/10 border-cyan-500/40 text-white shadow-lg shadow-cyan-950/25"
                        : "bg-slate-900 border-slate-800/80 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-sm font-semibold">{brand}</span>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                      isSelected ? "bg-cyan-500 border-cyan-400 text-[#020617]" : "border-slate-700 bg-slate-950"
                    }`}>
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 fill-current" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content: Stats & Counters */}
        {activeTab === "stats" && (
          <div className="p-6 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-6">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Homepage Stats & Counters</h2>
              <p className="text-xs text-slate-400 mb-4">Manage statistics displayed on the homepage stats ticker bar.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {statsList.map((stat, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Icon: {stat.icon}</span>
                      <button
                        onClick={() => removeStat(idx)}
                        className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}{stat.suffix}</div>
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800/50 pt-4 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Add New Stat Counter</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Label / Title</label>
                  <input
                    placeholder="Happy Clients"
                    value={newStat.label}
                    onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Numeric Target</label>
                  <input
                    type="number"
                    value={newStat.value}
                    onChange={(e) => setNewStat({ ...newStat, value: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Suffix (e.g. +, %)</label>
                  <input
                    placeholder="+"
                    value={newStat.suffix}
                    onChange={(e) => setNewStat({ ...newStat, suffix: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Lucide Icon</label>
                  <select
                    value={newStat.icon}
                    onChange={(e) => setNewStat({ ...newStat, icon: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
                  >
                    {Object.keys(availableIcons).map((iconKey) => (
                      <option key={iconKey} value={iconKey}>{iconKey}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={addStat}
                disabled={!newStat.label}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 border border-slate-800 hover:border-slate-600 disabled:opacity-50 rounded transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-4.5 h-4.5" /> Add Stat Counter
              </button>
            </div>
          </div>
        )}

        {/* Tab Content: Chatbot Settings */}
        {/* Tab Content: Tech Stack */}
        {activeTab === "techstack" && (
          <div className="p-6 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-6">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Tech Stack Section</h2>
              <p className="text-xs text-slate-400">Manage the technologies displayed in the &quot;Our Stack&quot; section on the homepage.</p>
            </div>

            {/* Current items */}
            <div className="space-y-2">
              {techStack.map((tech, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800/60">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-sm font-medium text-white truncate">{tech.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">{tech.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (idx > 0) {
                          const updated = [...techStack];
                          [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
                          setTechStack(updated);
                        }
                      }}
                      disabled={idx === 0}
                      className="text-slate-400 hover:text-white disabled:opacity-30 text-xs"
                    >↑</button>
                    <button
                      onClick={() => {
                        if (idx < techStack.length - 1) {
                          const updated = [...techStack];
                          [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
                          setTechStack(updated);
                        }
                      }}
                      disabled={idx === techStack.length - 1}
                      className="text-slate-400 hover:text-white disabled:opacity-30 text-xs"
                    >↓</button>
                    <button
                      onClick={() => setTechStack(techStack.filter((_, i) => i !== idx))}
                      className="text-red-400/60 hover:text-red-400 transition-colors"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new */}
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Technology Name</label>
                <input
                  placeholder="e.g. Next.js"
                  value={newTech.name}
                  onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Category</label>
                <input
                  placeholder="e.g. Framework"
                  value={newTech.category}
                  onChange={(e) => setNewTech({ ...newTech, category: e.target.value })}
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!newTech.name) return;
                    setTechStack([...techStack, { name: newTech.name, category: newTech.category || "Tool" }]);
                    setNewTech({ name: "", category: "" });
                  }}
                  disabled={!newTech.name}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 border border-slate-800 hover:border-slate-600 disabled:opacity-50 rounded transition-all inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: About Section */}
        {activeTab === "about" && (
          <div className="p-6 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-6">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1">About Section (Homepage)</h2>
              <p className="text-xs text-slate-400">Edit the about preview section shown on the homepage. This is SEO/AEO-critical content.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Heading</label>
              <input
                placeholder="We Build Systems. Not Websites."
                value={aboutHeading}
                onChange={(e) => setAboutHeading(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
              <p className="text-[10px] text-slate-600 mt-1">Tip: Use a period to split into gradient styling (e.g. &quot;We Build Systems. Not Websites.&quot;)</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
              <textarea
                rows={4}
                placeholder="RRRTX SYSTEMS is an engineering-first..."
                value={aboutDescription}
                onChange={(e) => setAboutDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-y"
              />
              <p className="text-[10px] text-slate-600 mt-1">Keep this concise, credible, and conversion-focused. This appears on the homepage before pricing.</p>
            </div>
          </div>
        )}

        {activeTab === "chatbot" && (
          <div className="p-6 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-6">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Chatbot Assistant Configuration</h2>
              <p className="text-xs text-slate-400">Customize your virtual agency helper, welcome greetings, knowledge base defaults, and call-to-actions.</p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800/80">
              <div>
                <span className="text-sm font-semibold text-white block">Enable Floating Chatbot Widget</span>
                <span className="text-xs text-slate-500">Toggle whether the chatbot widget is visible across the public website.</span>
              </div>
              <button
                type="button"
                onClick={() => setChatbotEnabled(!chatbotEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  chatbotEnabled ? "bg-cyan-500" : "bg-slate-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                    chatbotEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Bot Name / Avatar Name</label>
                <input
                  required
                  placeholder="e.g. RRRTX Guide"
                  value={chatbotName}
                  onChange={(e) => setChatbotName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Inquiry/Contact CTA Button Text</label>
                <input
                  required
                  placeholder="e.g. Book a Free Call"
                  value={chatbotContactCta}
                  onChange={(e) => setChatbotContactCta(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Welcome Greeting Message</label>
              <textarea
                required
                rows={3}
                placeholder="Write the initial greeting message..."
                value={chatbotWelcome}
                onChange={(e) => setChatbotWelcome(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Predefined Agency Description (Fallback Knowledge Base)</label>
              <textarea
                required
                rows={3}
                placeholder="Give a short summary of your company for users asking 'about'..."
                value={chatbotAbout}
                onChange={(e) => setChatbotAbout(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-y"
              />
            </div>
          </div>
        )}

        {/* Tab Content: Password & Security */}
        {activeTab === "security" && (
          <div className="p-6 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                <Lock className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Change Password</h2>
                <p className="text-xs text-slate-400">Update your admin login password.</p>
              </div>
            </div>
            
            {passwordMsg && (
              <div className="px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {passwordMsg}
              </div>
            )}
            
            {passwordErr && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                {passwordErr}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  placeholder="Min 6 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  placeholder="Repeat new password"
                />
              </div>
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50"
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
