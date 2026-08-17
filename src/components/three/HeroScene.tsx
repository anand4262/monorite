"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Icosahedron, Sphere, Line } from "@react-three/drei";
import * as THREE from "three";
import ParticleField from "./ParticleField";

const NODE_COUNT = 7;
const NODE_RADIUS = 1.9;
const CYCLE_SECONDS = 2.6;

type ThemeColors = {
  accent: string;
  accentSoft: string;
  mint: string;
  ink: string;
};

const FALLBACK_COLORS: ThemeColors = {
  accent: "#7C5CFF",
  accentSoft: "#A996FF",
  mint: "#3FE8B8",
  ink: "#F5F4F0",
};

function tripletToHex(raw: string, fallback: string) {
  const parts = raw.trim().split(/\s+/).map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return fallback;
  return `#${parts.map((n) => Math.min(255, Math.max(0, n)).toString(16).padStart(2, "0")).join("")}`;
}

function readThemeColors(): ThemeColors {
  if (typeof window === "undefined") return FALLBACK_COLORS;
  const styles = getComputedStyle(document.documentElement);
  return {
    accent: tripletToHex(styles.getPropertyValue("--color-accent"), FALLBACK_COLORS.accent),
    accentSoft: tripletToHex(styles.getPropertyValue("--color-accent-soft"), FALLBACK_COLORS.accentSoft),
    mint: tripletToHex(styles.getPropertyValue("--color-mint"), FALLBACK_COLORS.mint),
    ink: tripletToHex(styles.getPropertyValue("--color-ink"), FALLBACK_COLORS.ink),
  };
}

/**
 * Reads the live theme's accent/mint/ink colors from the CSS custom
 * properties in globals.css (rather than hardcoding hex values) so the 3D
 * scene re-colors itself the instant the light/dark toggle flips
 * data-theme on <html>, instead of staying frozen on dark-theme purple even
 * when the rest of the page has switched to light.
 */
function useThemeColors(): ThemeColors {
  const [colors, setColors] = useState<ThemeColors>(readThemeColors);

  useEffect(() => {
    setColors(readThemeColors());
    const observer = new MutationObserver(() => setColors(readThemeColors()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return colors;
}

/**
 * Evenly distributes NODE_COUNT points on a sphere via the golden-angle
 * spiral method — each point represents one of the outside systems an
 * automation agency connects a client's business to (calls, bookings,
 * CRM, invoicing, reviews...).
 */
function useNodePositions() {
  return useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < NODE_COUNT; i++) {
      const y = 1 - (i / (NODE_COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      positions.push(new THREE.Vector3(x, y, z).multiplyScalar(NODE_RADIUS));
    }
    return positions;
  }, []);
}

/** A small bright dot that travels from the core out to a node and back,
 * looping on a staggered delay — reads as data/automation flowing through
 * the connections rather than a static diagram. */
function Pulse({ target, delay, color }: { target: THREE.Vector3; delay: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const origin = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame(({ clock }) => {
    const t = ((clock.getElapsedTime() + delay) % CYCLE_SECONDS) / CYCLE_SECONDS;
    if (ref.current) {
      ref.current.position.lerpVectors(origin, target, t);
    }
    if (materialRef.current) {
      const fadeIn = Math.min(t / 0.12, 1);
      const fadeOut = Math.min((1 - t) / 0.12, 1);
      materialRef.current.opacity = Math.min(fadeIn, fadeOut);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.035, 12, 12]} />
      <meshBasicMaterial ref={materialRef} color={color} transparent opacity={0} toneMapped={false} />
    </mesh>
  );
}

/**
 * The signature hero visual: a central "AI core" (a layered icosahedron —
 * solid inner shell plus a wireframe outer shell) with satellite nodes
 * orbiting it, each connected by a thin line with a pulse of light
 * traveling along it. This is meant to read as what the agency actually
 * does — an AI core connected to, and automating, the outside systems a
 * service business already runs on — rather than an abstract decorative
 * blob.
 */
function NetworkCore({ colors }: { colors: ThemeColors }) {
  const tiltRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  const nodePositions = useNodePositions();

  useFrame((_, delta) => {
    if (spinRef.current) {
      spinRef.current.rotation.y += delta * 0.16;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.3;
      coreRef.current.rotation.x += delta * 0.08;
    }
    if (tiltRef.current) {
      const targetX = pointer.y * 0.22;
      const targetZ = -pointer.x * 0.22;
      tiltRef.current.rotation.x = THREE.MathUtils.lerp(tiltRef.current.rotation.x, targetX, 0.04);
      tiltRef.current.rotation.z = THREE.MathUtils.lerp(tiltRef.current.rotation.z, targetZ, 0.04);
    }
  });

  return (
    <group ref={tiltRef}>
      <group ref={spinRef}>
        {/* Core: solid inner shell + wireframe outer shell */}
        <Icosahedron ref={coreRef} args={[0.85, 1]}>
          <meshStandardMaterial
            color={colors.accent}
            transparent
            opacity={0.38}
            roughness={0.25}
            metalness={0.2}
          />
        </Icosahedron>
        <Icosahedron args={[1.05, 1]}>
          <meshStandardMaterial color={colors.accentSoft} wireframe transparent opacity={0.5} />
        </Icosahedron>

        {/* Satellite nodes + their connections back to the core */}
        {nodePositions.map((pos, i) => (
          <group key={i}>
            <Line
              points={[[0, 0, 0], [pos.x, pos.y, pos.z]]}
              color={colors.accent}
              transparent
              opacity={0.25}
              lineWidth={1}
            />
            <Sphere position={pos} args={[0.07, 16, 16]}>
              <meshStandardMaterial
                color={colors.mint}
                emissive={colors.mint}
                emissiveIntensity={0.6}
                roughness={0.4}
              />
            </Sphere>
            <Pulse target={pos} delay={(i / NODE_COUNT) * CYCLE_SECONDS} color={colors.mint} />
          </group>
        ))}
      </group>
    </group>
  );
}

export default function HeroScene() {
  const colors = useThemeColors();

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Fully procedural lighting — no external HDR/env map is fetched here
          on purpose, since that would require relaxing connect-src/img-src
          in next.config.mjs's CSP to allow a third-party CDN. Everything in
          this scene renders from local geometry and lights only. */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 3, 4]} intensity={1.4} color={colors.ink} />
      <pointLight position={[-4, -2, -3]} intensity={1.1} color={colors.mint} />
      <pointLight position={[2, -3, 2]} intensity={0.6} color={colors.accentSoft} />
      <Suspense fallback={null}>
        <NetworkCore colors={colors} />
        <ParticleField color={colors.accentSoft} />
      </Suspense>
    </Canvas>
  );
}
