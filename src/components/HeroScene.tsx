"use client";

import { useEffect, useRef } from "react";
import type { BufferGeometry, Material, Object3D } from "three";

export function HeroScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1024px)");
    const device = navigator as Navigator & { deviceMemory?: number };
    if (!host || motion.matches || !desktop.matches || (device.deviceMemory && device.deviceMemory < 2)) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;
    const timer = window.setTimeout(async () => {
      try {
        const THREE = await import("three");
        if (disposed || !hostRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 40);
        camera.position.set(0, 0, 9.4);

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
          powerPreference: "low-power",
          precision: "mediump",
        });
        renderer.setClearAlpha(0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.setAttribute("aria-hidden", "true");
        renderer.domElement.style.pointerEvents = "none";
        host.appendChild(renderer.domElement);

        const root = new THREE.Group();
        root.position.x = 1.25;
        scene.add(root);

        scene.add(new THREE.AmbientLight(0x8ba7d8, 0.55));
        const cyanLight = new THREE.PointLight(0x22d3ee, 8, 15, 2);
        cyanLight.position.set(4, 3, 5);
        scene.add(cyanLight);
        const violetLight = new THREE.PointLight(0x8b5cf6, 7, 14, 2);
        violetLight.position.set(-4, -2, 4);
        scene.add(violetLight);

        const geometries: BufferGeometry[] = [
          new THREE.IcosahedronGeometry(0.64, 1),
          new THREE.OctahedronGeometry(0.55, 0),
          new THREE.TorusGeometry(0.48, 0.11, 8, 22),
        ];
        const palette = [0x22d3ee, 0x60a5fa, 0xa78bfa];
        const materials: Material[] = palette.map((color) => new THREE.MeshPhongMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.28,
          transparent: true,
          opacity: 0.12,
          wireframe: true,
          shininess: 80,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }));
        const nodePositions: Array<[number, number, number]> = [
          [-4.5, 2.15, -1.6], [-2.7, -2.35, -2.2], [-0.2, 2.8, -2.8],
          [2.35, 1.65, -1.3], [4.55, -1.7, -2.5], [1.05, -2.9, -3.1],
        ];
        const nodes: Object3D[] = nodePositions.map((position, index) => {
          const mesh = new THREE.Mesh(geometries[index % geometries.length], materials[index % materials.length]);
          mesh.position.set(...position);
          mesh.rotation.set(index * 0.37, index * 0.22, index * 0.13);
          mesh.userData = {
            baseY: position[1],
            phase: index * 0.9,
            speed: 0.18 + (index % 3) * 0.035,
          };
          root.add(mesh);
          return mesh;
        });

        const connectionPairs = [[0, 2], [2, 3], [3, 4], [1, 2], [1, 5], [5, 4], [2, 5]];
        const connectionPoints: number[] = [];
        connectionPairs.forEach(([from, to]) => {
          connectionPoints.push(...nodePositions[from], ...nodePositions[to]);
        });
        const connectionGeometry = new THREE.BufferGeometry();
        connectionGeometry.setAttribute("position", new THREE.Float32BufferAttribute(connectionPoints, 3));
        const connectionMaterial = new THREE.LineBasicMaterial({
          color: 0x60a5fa,
          transparent: true,
          opacity: 0.075,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const connections = new THREE.LineSegments(connectionGeometry, connectionMaterial);
        root.add(connections);
        geometries.push(connectionGeometry);
        materials.push(connectionMaterial);

        const particleCount = 72;
        const particlePositions = new Float32Array(particleCount * 3);
        for (let index = 0; index < particleCount; index += 1) {
          const angle = index * 2.399963;
          const radius = 1.8 + ((index * 17) % 53) / 10;
          particlePositions[index * 3] = Math.cos(angle) * radius;
          particlePositions[index * 3 + 1] = Math.sin(angle * 1.17) * 3.4;
          particlePositions[index * 3 + 2] = -2.8 - ((index * 13) % 30) / 10;
        }
        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
        const particleMaterial = new THREE.PointsMaterial({
          color: 0x93c5fd,
          size: 0.035,
          transparent: true,
          opacity: 0.28,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        root.add(particles);
        geometries.push(particleGeometry);
        materials.push(particleMaterial);

        const pointer = { x: 0, y: 0 };
        const onPointerMove = (event: PointerEvent) => {
          pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.16;
          pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.1;
        };
        window.addEventListener("pointermove", onPointerMove, { passive: true });

        const resize = () => {
          if (!hostRef.current) return;
          const { clientWidth, clientHeight } = hostRef.current;
          renderer.setSize(clientWidth, clientHeight, false);
          camera.aspect = Math.max(clientWidth / Math.max(clientHeight, 1), 0.1);
          camera.updateProjectionMatrix();
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);
        resize();

        let active = true;
        const intersectionObserver = new IntersectionObserver(([entry]) => {
          active = entry.isIntersecting;
        }, { threshold: 0.01 });
        intersectionObserver.observe(host);
        const onVisibility = () => { active = document.visibilityState === "visible"; };
        document.addEventListener("visibilitychange", onVisibility);

        const clock = new THREE.Clock();
        let frame = 0;
        let previous = 0;
        const render = (time: number) => {
          frame = window.requestAnimationFrame(render);
          if (!active || time - previous < 33) return;
          previous = time;
          const elapsed = clock.getElapsedTime();
          root.rotation.y += (pointer.x - root.rotation.y) * 0.025;
          root.rotation.x += (-pointer.y - root.rotation.x) * 0.025;
          nodes.forEach((node, index) => {
            const data = node.userData as { baseY: number; phase: number; speed: number };
            node.position.y = data.baseY + Math.sin(elapsed * data.speed + data.phase) * 0.13;
            node.rotation.x += 0.0012 + index * 0.00008;
            node.rotation.y += 0.0017 + index * 0.00006;
          });
          particles.rotation.z = elapsed * 0.006;
          connections.rotation.z = Math.sin(elapsed * 0.08) * 0.01;
          renderer.render(scene, camera);
        };
        frame = window.requestAnimationFrame(render);

        cleanup = () => {
          window.cancelAnimationFrame(frame);
          window.removeEventListener("pointermove", onPointerMove);
          document.removeEventListener("visibilitychange", onVisibility);
          resizeObserver.disconnect();
          intersectionObserver.disconnect();
          geometries.forEach((geometry) => geometry.dispose());
          materials.forEach((material) => material.dispose());
          renderer.dispose();
          renderer.forceContextLoss();
          renderer.domElement.remove();
        };
      } catch {
        // Decorative enhancement: the static hero remains complete without WebGL.
      }
    }, 600);

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      cleanup?.();
    };
  }, []);

  return <div ref={hostRef} className="hero-scene hidden lg:block" aria-hidden="true" />;
}
