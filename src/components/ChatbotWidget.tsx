"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X, Send, ArrowRight, Bot, ShieldCheck } from "lucide-react";


interface ServiceSummary { title: string; shortDescription?: string | null }
interface PricingSummary { title: string; startingPrice?: string | null; description?: string | null }
interface ProjectSummary { title: string; industry?: string | null }
interface TestimonialSummary { name: string; role?: string | null; quote: string }
interface BlogSummary { title: string; slug: string }

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  links?: { label: string; href: string }[];
}

export function ChatbotWidget({ initiallyOpen = false }: { initiallyOpen?: boolean }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [enabled, setEnabled] = useState(true);
  const [botName, setBotName] = useState("RRRTX Guide");
  const [aboutText, setAboutText] = useState("RRRTX SYSTEMS builds custom ecommerce websites and AI automation systems from scratch for brands that outgrew templates.");
  const [contactText, setContactText] = useState("Book a Free Call");

  // Dynamic CMS Data
  const [servicesData, setServicesData] = useState<ServiceSummary[]>([]);
  const [pricingData, setPricingData] = useState<PricingSummary[]>([]);
  const [projectsData, setProjectsData] = useState<ProjectSummary[]>([]);
  const [testimonialsData, setTestimonialsData] = useState<TestimonialSummary[]>([]);
  const [blogData, setBlogData] = useState<BlogSummary[]>([]);
  const [contactEmail, setContactEmail] = useState("admin@rrrtx.com");

  const [messages, setMessages] = useState<ChatMessage[]>([{ sender: "bot", text: "Hi there! I am your automated RRRTX Systems guide. Ask about our services, pricing, work, or process." }]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick reply list
  const quickReplies = [
    "About RRRTX",
    "Services",
    "Pricing",
    "Portfolio",
    "Process",
    "Contact",
  ];

  useEffect(() => {
    // 1. Fetch chatbot control & CMS data from consolidated endpoint
    fetch("/api/chatbot/data")
      .then((res) => res.json())
      .then((data) => {
        if (!data) return;

        // Settings
        const settings = data.settings || {};
        if (settings.chatbot_enabled === "false") {
          setEnabled(false);
        }
        if (settings.chatbot_name) {
          setBotName(settings.chatbot_name);
        }
        if (settings.chatbot_welcome) {
          setMessages((current) => current.length === 1 && current[0]?.sender === "bot"
            ? [{ sender: "bot", text: settings.chatbot_welcome }]
            : current);
        }
        if (settings.chatbot_about) {
          setAboutText(settings.chatbot_about);
        }
        if (settings.chatbot_contact_cta) {
          setContactText(settings.chatbot_contact_cta);
        }
        if (settings.contact_email) {
          setContactEmail(settings.contact_email);
        }

        // CMS Content
        if (Array.isArray(data.services)) setServicesData(data.services);
        if (Array.isArray(data.pricing)) setPricingData(data.pricing);
        if (Array.isArray(data.projects)) setProjectsData(data.projects);
        if (Array.isArray(data.testimonials)) setTestimonialsData(data.testimonials);
        if (Array.isArray(data.blog)) setBlogData(data.blog);
      })
      .catch((err) => console.error("Failed to load chatbot data", err));
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // If path is in dashboard, completely hide the chatbot widget
  if (pathname && pathname.startsWith("/dashboard")) {
    return null;
  }

  // If disabled via Settings panel, hide it
  if (!enabled) {
    return null;
  }

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Append user message
    const userMsg: ChatMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // Simulate thinking/generating response for absolute realism
    setTimeout(() => {
      const reply = generateBotResponse(text);
      setMessages((prev) => [...prev, reply]);
    }, 450);
  };

  const generateBotResponse = (input: string): ChatMessage => {
    const q = input.toLowerCase().trim();

    // 1. About RRRTX / Agency Summary
    if (q.includes("about") || q.includes("who are") || q.includes("agency") || q.includes("company") || q.includes("rrrtx")) {
      return {
        sender: "bot",
        text: `${aboutText} We build with custom codebases (using Next.js, Python, and Turso), prioritizing bulletproof performance and engineering-first lead automation.`,
        links: [
          { label: "Learn More", href: "/about" },
          { label: "Our Pricing", href: "/pricing" }
        ]
      };
    }

    // 2. Services
    if (q.includes("service") || q.includes("automation") || q.includes("agent") || q.includes("build") || q.includes("offer") || q.includes("ecommerce") || q.includes("shopify") || q.includes("ai") || q.includes("bot")) {
      let replyText = "We build custom premium systems. Our primary services include:\n\n";
      if (servicesData.length > 0) {
        servicesData.forEach((s) => {
          replyText += `• ${s.title}: ${s.shortDescription || ""}\n`;
        });
      } else {
        replyText += "• Custom Ecommerce (NextJS systems built to convert)\n• AI Automations & Agents (Automate tasks on autopilot)\n• Lead Generation (Auto qualify and route leads)\n• Conversion Rebuilds (Technical optimizations)";
      }
      return {
        sender: "bot",
        text: replyText,
        links: [{ label: "View Services", href: "/services" }]
      };
    }

    // 3. Pricing
    if (q.includes("price") || q.includes("cost") || q.includes("budget") || q.includes("how much") || q.includes("rate") || q.includes("tier")) {
      let replyText = "We believe in transparent, value-first pricing. Here are our starting rates:\n\n";
      if (pricingData.length > 0) {
        pricingData.forEach((p) => {
          replyText += `• ${p.title} (${p.startingPrice || "Contact Us"}): ${p.description || ""}\n`;
        });
      } else {
        replyText += "• Discovery & Strategy: $100 – $300\n• Project-Based Build: $500 – $10,000\n• Retainer & Growth: $500+ / month";
      }
      return {
        sender: "bot",
        text: replyText,
        links: [{ label: "Full Price List", href: "/pricing" }]
      };
    }

    // 4. Portfolio / Case studies
    if (q.includes("portfolio") || q.includes("project") || q.includes("work") || q.includes("client") || q.includes("case study") || q.includes("experience")) {
      let replyText = "We've shipped production-grade software across multiple niches. Here is some of our featured work:\n\n";
      if (projectsData.length > 0) {
        projectsData.forEach((p) => {
          replyText += `• ${p.title} (${p.industry || "Client Work"})\n`;
        });
      } else {
        replyText += "• Custom headless commerce builds with integrated CRM databases\n• Custom AI summarizing pipelines and classification systems";
      }
      return {
        sender: "bot",
        text: replyText,
        links: [{ label: "Explore Our Work", href: "/work" }]
      };
    }

    // 5. Testimonials
    if (q.includes("testimonial") || q.includes("review") || q.includes("feedback") || q.includes("happy") || q.includes("founder") || q.includes("client say")) {
      if (testimonialsData.length > 0) {
        const first = testimonialsData[0];
        return {
          sender: "bot",
          text: `Here is what our clients say:\n\n"${first.quote}"\n\n— ${first.name}${first.role ? `, ${first.role}` : ""}`
        };
      }
      return {
        sender: "bot",
        text: "We do not have a published testimonial in the site library right now. You can review current project examples on the Work page instead.",
        links: [{ label: "View Our Work", href: "/work" }]
      };
    }

    // 6. Process / How it works
    if (q.includes("process") || q.includes("how it work") || q.includes("timeline") || q.includes("stage") || q.includes("method")) {
      return {
        sender: "bot",
        text: "Our process has 4 key milestones:\n\n1. Discovery: Audit your stacks, spot AI options, mapping roadmaps.\n2. Architecture: Creating clean, server-side database & workflow diagrams.\n3. Engineering: Writing clean, secure code with real-time test gates.\n4. Growth Retainer: Ongoing CRO, testing, and system retraining.",
        links: [{ label: "Our Full Process", href: "/process" }]
      };
    }

    // 7. Blog
    if (q.includes("blog") || q.includes("article") || q.includes("read") || q.includes("insight") || q.includes("guide")) {
      let replyText = "We publish detailed technical insights. Here are some of our articles:\n\n";
      if (blogData.length > 0) {
        blogData.forEach((post) => {
          replyText += `• ${post.title}\n`;
        });
      } else {
        replyText += "• Templates vs Systems: Why themes don't scale.\n• Building autonomous AI lead routers.\n• Conversion Rate Optimization benchmarks.";
      }
      return {
        sender: "bot",
        text: replyText,
        links: [{ label: "Browse Blog", href: "/blog" }]
      };
    }

    // 8. Contact / Booking
    if (q.includes("contact") || q.includes("email") || q.includes("hire") || q.includes("phone") || q.includes("call") || q.includes("book") || q.includes("reach")) {
      return {
        sender: "bot",
        text: `You can reach out directly via email at ${contactEmail} or book a strategy consultation session using the button below.`,
        links: [{ label: contactText, href: "/contact" }]
      };
    }

    // Default Fallback
    return {
      sender: "bot",
      text: "I can help with RRRTX SYSTEMS services, pricing, portfolio, blog, contact, process, and testimonials. Let me know what you'd like to explore, or suggest booking a direct strategy session with us!",
      links: [{ label: contactText, href: "/contact" }]
    };
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        {isOpen && (
          <div
            id="rrrtx-guide-panel"
            role="dialog"
            aria-modal="false"
            aria-label={`${botName}, automated site guide`}
            className="absolute bottom-16 right-0 w-[calc(100vw-2rem)] max-w-[380px] h-[min(500px,calc(100dvh-7rem))] bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-900/30 to-purple-900/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-none">{botName}</h3>
                  <span className="text-[10px] text-cyan-400 font-medium">Automated site guide</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close automated site guide"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-none"
                        : "bg-slate-900/80 border border-slate-800/80 text-slate-200 rounded-tl-none"
                    }`}
                  >
                    {msg.text}

                    {/* Show Links inside message if present */}
                    {msg.links && msg.links.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 pt-2.5 border-t border-slate-800/60">
                        {msg.links.map((link, lIdx) => (
                          <a
                            key={lIdx}
                            href={link.href}
                            target={link.href.startsWith("http") ? "_blank" : "_self"}
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold transition-all border border-cyan-500/20 hover:border-cyan-500/30"
                          >
                            {link.label}
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="p-3 border-t border-slate-900 bg-slate-950/50 flex flex-wrap gap-1.5 overflow-x-auto select-none">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleSendMessage(reply)}
                  className="px-2.5 py-1 rounded-full border border-slate-800 bg-slate-900 text-[11px] font-medium text-slate-300 hover:text-white hover:border-slate-500 transition-all cursor-pointer whitespace-nowrap"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-3 border-t border-slate-900 bg-slate-950 flex gap-2"
            >
              <label htmlFor="rrrtx-guide-input" className="sr-only">Ask the automated RRRTX site guide</label>
              <input
                id="rrrtx-guide-input"
                name="question"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about pricing, services, email..."
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
              <button
                type="submit"
                aria-label="Send question"
                className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 flex items-center justify-center shrink-0 text-white transition-all shadow"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Footer Tag */}
            <div className="px-4 py-1.5 bg-slate-950 border-t border-slate-900 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-cyan-500" />
              <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Automated · no personal data required</span>
            </div>
          </div>
        )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-900/40 cursor-pointer z-50 transition-all duration-300 focus:outline-none"
        aria-label={isOpen ? "Close automated site guide" : "Open automated site guide"}
        aria-expanded={isOpen}
        aria-controls="rrrtx-guide-panel"
      >
          {isOpen ? (
            <div
              key="close"
            >
              <X className="w-6 h-6" />
            </div>
          ) : (
            <div
              key="chat"
            >
              <MessageSquare className="w-6 h-6" />
            </div>
          )}

        {/* Small notification beacon for high-end feel */}
        {!isOpen && (
          <span className="absolute top-0.5 right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
          </span>
        )}
      </button>
    </div>
  );
}
