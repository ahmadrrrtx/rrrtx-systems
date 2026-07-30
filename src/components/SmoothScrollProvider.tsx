export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  // Native scrolling is faster, keyboard-safe, and respects user preferences.
  // The provider remains to preserve the existing component contract.
  return <>{children}</>;
}
