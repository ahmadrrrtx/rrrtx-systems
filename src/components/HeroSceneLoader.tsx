"use client";

import { useEffect, useState } from "react";
import type { HeroScene as HeroSceneComponent } from "./HeroScene";

type SceneComponent = typeof HeroSceneComponent;

export function HeroSceneLoader() {
  const [Scene, setScene] = useState<SceneComponent | null>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!desktop.matches || reducedMotion.matches) return;
    let active = true;
    const timer = window.setTimeout(async () => {
      const sceneModule = await import("./HeroScene");
      if (active) setScene(() => sceneModule.HeroScene);
    }, 350);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, []);

  return Scene ? <Scene /> : <div className="hero-scene hidden lg:block" aria-hidden="true" />;
}
