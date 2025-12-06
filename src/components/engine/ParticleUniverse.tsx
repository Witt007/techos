'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Particle count based on device performance
const getParticleCount = (tier: string) => {
  switch (tier) {
    case 'ultra': return 15000;
    case 'high': return 8000;
    case 'medium': return 4000;
    case 'low': return 2000;
    default: return 3000;
  }
};

export interface ParticleFieldProps {
  count?: number;
  mouse: React.RefObject<{ x: number; y: number } | null>;
}

export function ParticleField({ count = 5000, mouse }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  // Generate particle positions
  const [positions, velocities] = useMemo(() => {
    let seed = 1;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread particles in a sphere
      const radius = random() * 15 + 5;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos((random() * 2) - 1);

      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi) - 10;

      // Random velocities
      vel[i3] = (random() - 0.5) * 0.01;
      vel[i3 + 1] = (random() - 0.5) * 0.01;
      vel[i3 + 2] = (random() - 0.5) * 0.01;
    }

    return [pos, vel];
  }, [count]);

  // Color gradient
  const colors = useMemo(() => {
    let seed = 2;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const cols = new Float32Array(count * 3);
    const cyan = new THREE.Color('#00fff5');
    const magenta = new THREE.Color('#ff00ff');
    const purple = new THREE.Color('#bf00ff');

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const t = random();
      let color: THREE.Color;

      if (t < 0.4) {
        color = cyan.clone().lerp(purple, t / 0.4);
      } else if (t < 0.7) {
        color = purple.clone().lerp(magenta, (t - 0.4) / 0.3);
      } else {
        color = magenta.clone().lerp(cyan, (t - 0.7) / 0.3);
      }

      cols[i3] = color.r;
      cols[i3 + 1] = color.g;
      cols[i3 + 2] = color.b;
    }

    return cols;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    const positionAttr = pointsRef.current.geometry.attributes.position;
    const posArray = positionAttr.array as Float32Array;

    // Mouse influence
    const mouseX = mouse.current ? (mouse.current.x * viewport.width) / 2 : 0;
    const mouseY = mouse.current ? (mouse.current.y * viewport.height) / 2 : 0;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Gentle floating motion
      posArray[i3] += velocities[i3] + Math.sin(time * 0.3 + i * 0.01) * 0.002;
      posArray[i3 + 1] += velocities[i3 + 1] + Math.cos(time * 0.2 + i * 0.01) * 0.002;
      posArray[i3 + 2] += velocities[i3 + 2] + Math.sin(time * 0.1 + i * 0.005) * 0.001;

      // Mouse repulsion
      const dx = posArray[i3] - mouseX;
      const dy = posArray[i3 + 1] - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 3) {
        const force = (3 - dist) * 0.02;
        posArray[i3] += (dx / dist) * force;
        posArray[i3 + 1] += (dy / dist) * force;
      }

      // Boundary check - wrap around
      const boundary = 20;
      if (Math.abs(posArray[i3]) > boundary) posArray[i3] *= -0.95;
      if (Math.abs(posArray[i3 + 1]) > boundary) posArray[i3 + 1] *= -0.95;
      if (posArray[i3 + 2] > 5 || posArray[i3 + 2] < -25) velocities[i3 + 2] *= -1;
    }

    positionAttr.needsUpdate = true;

    // Slow rotation
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors}>
      <PointMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  );
}

// Floating geometric shapes
export function FloatingGeometries() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    groupRef.current.children.forEach((child, i) => {
      child.rotation.x = time * 0.2 * (i % 2 ? 1 : -1);
      child.rotation.y = time * 0.3 * (i % 3 ? 1 : -1);
      child.position.y = Math.sin(time * 0.5 + i) * 0.5;
    });
  });

  return (
    <group ref={groupRef}>
      {/* Wireframe icosahedron */}
      <mesh position={[-8, 2, -15]}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial color="#00fff5" wireframe opacity={0.3} transparent />
      </mesh>

      {/* Wireframe octahedron */}
      <mesh position={[10, -3, -12]}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshBasicMaterial color="#ff00ff" wireframe opacity={0.3} transparent />
      </mesh>

      {/* Wireframe torus */}
      <mesh position={[6, 4, -18]}>
        <torusGeometry args={[1, 0.3, 8, 16]} />
        <meshBasicMaterial color="#bf00ff" wireframe opacity={0.2} transparent />
      </mesh>

      {/* Ring */}
      <mesh position={[-6, -4, -14]} rotation={[Math.PI / 4, 0, 0]}>
        <ringGeometry args={[1.5, 2, 32]} />
        <meshBasicMaterial color="#00fff5" wireframe opacity={0.2} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Grid floor
export function CyberGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (!gridRef.current) return;
    const time = state.clock.elapsedTime;
    (gridRef.current.material as THREE.Material).opacity = 0.85 + Math.sin(time * 0.5) * 0.305;
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[100, 50, 'rgba(61, 126, 163, 0.5)', 'rgba(61, 126, 163, 0.5)']}
      position={[0, -16, -20]}
      rotation={[0, 0, 0]}
    />
  );
}

interface ParticleUniverseProps {
  performanceTier?: 'ultra' | 'high' | 'medium' | 'low';
  className?: string;
}

export function ParticleUniverseScene({ performanceTier = 'high', mouseRef }: { performanceTier?: string, mouseRef: React.RefObject<{ x: number; y: number }> }) {
  const particleCount = getParticleCount(performanceTier);

  return (
    <>
      <color attach="background" args={['#030308']} />
      <fog attach="fog" args={['#030308', 10, 50]} />

      <ParticleField count={particleCount} mouse={mouseRef} />

      {performanceTier !== 'low' && <FloatingGeometries />}
      {performanceTier !== 'low' && <CyberGrid />}

      {/* Ambient light for subtle illumination */}
      <ambientLight intensity={0.1} />
    </>
  );
}

export default function ParticleUniverse({
  performanceTier = 'high',
  className = ''
}: ParticleUniverseProps) {
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isClient) {
    return (
      <div className={`particles-container ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--void-deepest)] via-[var(--void-base)] to-[var(--void-deepest)]" />
      </div>
    );
  }

  return (
    <div className={`particles-container ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, performanceTier === 'ultra' ? 2 : 1.5]}
        gl={{
          antialias: performanceTier !== 'low',
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{ background: 'transparent' }}
      >
        <ParticleUniverseScene performanceTier={performanceTier} mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}
