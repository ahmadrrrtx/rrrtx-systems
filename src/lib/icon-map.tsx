import {
  ShoppingCart,
  Bot,
  Target,
  RefreshCw,
  MessageSquare,
  Search,
  Code2,
  Zap,
  Globe,
  Server,
  Sparkles,
  Layers,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps icon names stored in the database (services.iconName) to Lucide icons.
 * Falls back to a sensible default so an unknown/empty name never crashes UI.
 */
const ICONS: Record<string, LucideIcon> = {
  ShoppingCart,
  Bot,
  Target,
  RefreshCw,
  MessageSquare,
  Search,
  Code2,
  Zap,
  Globe,
  Server,
  Sparkles,
  Layers,
};

export function getIcon(name?: string | null): LucideIcon {
  if (name && ICONS[name]) return ICONS[name];
  return Sparkles;
}
