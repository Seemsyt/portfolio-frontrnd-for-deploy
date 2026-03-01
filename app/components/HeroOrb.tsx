"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, PointMaterial, Points } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function createSeededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function createParticlePositions(count: number) {
  const data = new Float32Array(count * 3);
  const rand = createSeededRandom(20260301);
  const v = new THREE.Vector3();

  for (let i = 0; i < count; i += 1) {
    v
      .set(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1)
      .normalize()
      .multiplyScalar(2 + rand() * 1.2);
    const i3 = i * 3;
    data[i3] = v.x;
    data[i3 + 1] = v.y;
    data[i3 + 2] = v.z;
  }

  return data;
}

const PARTICLE_POSITIONS = createParticlePositions(1400);

function OrbScene() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const targetX = state.pointer.y * 0.28;
    const targetY = state.pointer.x * 0.34;

    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetX,
        3.5,
        delta
      );
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetY,
        3.5,
        delta
      );
    }

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.16;
      coreRef.current.rotation.x += delta * 0.08;
      coreRef.current.scale.setScalar(1 + Math.sin(t * 1.3) * 0.035);
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y -= delta * 0.08;
      particlesRef.current.rotation.x += delta * 0.03;
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.z += delta * 0.14;
      ringsRef.current.rotation.y = Math.sin(t * 0.45) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]} intensity={1.6} color="#7dd3fc" />
      <pointLight position={[-3, -2, 2]} intensity={1} color="#67e8f9" />

      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.1, 8]} />
        <meshPhysicalMaterial
          color="#67e8f9"
          roughness={0.1}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.7}
          thickness={0.7}
          emissive="#0ea5e9"
          emissiveIntensity={0.35}
        />
      </mesh>

      <mesh scale={1.38}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#8be9ff"
          transparent
          opacity={0.18}
          roughness={0.05}
          metalness={0.05}
          distort={0.22}
          speed={2}
        />
      </mesh>

      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 2.8, 0, 0]}>
          <torusGeometry args={[1.75, 0.03, 24, 240]} />
          <meshBasicMaterial
            color="#67e8f9"
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[Math.PI / 6, Math.PI / 2.5, 0]}>
          <torusGeometry args={[2.05, 0.024, 24, 240]} />
          <meshBasicMaterial
            color="#93c5fd"
            transparent
            opacity={0.42}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[Math.PI / 5, Math.PI / 6, 0]}>
          <torusGeometry args={[2.35, 0.018, 24, 240]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      <Points
        ref={particlesRef}
        positions={PARTICLE_POSITIONS}
        stride={3}
        frustumCulled
      >
        <PointMaterial
          transparent
          color="#d9faff"
          size={0.022}
          sizeAttenuation
          depthWrite={false}
          opacity={0.85}
        />
      </Points>
    </group>
  );
}

export default function HeroOrb() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-cyan-200/15 bg-slate-900/35 shadow-[0_0_70px_-20px_rgba(34,211,238,0.55)] backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(125,211,252,0.20),transparent_40%),radial-gradient(circle_at_80%_85%,rgba(34,211,238,0.17),transparent_35%)]" />
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 42 }}
        dpr={[1, 1.8]}
        className="h-full w-full"
      >
        <OrbScene />
      </Canvas>
    </div>
  );
}
