"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import type { ChatbotWidget as ChatbotWidgetType } from "./ChatbotWidget";

type WidgetComponent = typeof ChatbotWidgetType;

export function LazyChatbot() {
  const [Widget, setWidget] = useState<WidgetComponent | null>(null);

  const activate = async () => {
    const chatbotModule = await import("./ChatbotWidget");
    setWidget(() => chatbotModule.ChatbotWidget);
  };

  if (Widget) return <Widget initiallyOpen />;
  return (
    <button type="button" onClick={() => { void activate(); }} className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-900/40" aria-label="Open automated site guide">
      <MessageSquare className="w-6 h-6" aria-hidden="true" />
      <span className="absolute top-0.5 right-0.5 h-3 w-3 rounded-full bg-cyan-400" aria-hidden="true" />
    </button>
  );
}
