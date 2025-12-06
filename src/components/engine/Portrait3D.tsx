'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader, Vector2, ShaderMaterial, Points } from 'three';

// Vertex Shader
const vertexShader = `
uniform float uTime;
uniform float uAudioLevel;
uniform vec2 uMouse;
uniform vec2 uResolution;

varying vec2 vUv;
varying float vAlpha;

void main() {
  vUv = uv;
  
  vec3 pos = position;
  
  // Simple sine wave displacement instead of complex noise
  float displacement = sin(pos.x * 5.0 + uTime) * sin(pos.y * 5.0 + uTime) * 0.1;
  float audioStrength = smoothstep(0.1, 0.8, uAudioLevel);
  
  pos.z += displacement * audioStrength * 5.0;
  
  // Mouse repulsion
  float dist = distance(uMouse, pos.xy);
  float repulsionRadius = 1.5;
  float repulsionStrength = smoothstep(repulsionRadius, 0.0, dist);
  
  vec3 mouseDisp = pos - vec3(uMouse, 0.0);
  mouseDisp = normalize(mouseDisp) * repulsionStrength * 2.0;
  
  pos += mouseDisp;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  
  // Point size
  float size = 6.0;
  size += audioStrength * 5.0;
  size *= (1.0 - dist * 0.2); 
  
  // Safeguard
  float w = gl_Position.w;
  if (w < 0.00001) w = 0.00001;
  
  gl_PointSize = size * (10.0 / w);
  
  vAlpha = 1.0 - repulsionStrength * 0.5;
}
`;

// Fragment Shader
const fragmentShader = `
uniform sampler2D uTexture;
varying vec2 vUv;
varying float vAlpha;

void main() {
  vec4 texColor = texture2D(uTexture, vUv);

    if (texColor.a < 0.01) discard;

  // Circular particles
  vec2 coord = gl_PointCoord - vec2(0.5);
    if (length(coord) > 0.5) discard;

    gl_FragColor = vec4(texColor.rg, texColor.b+length(coord), texColor.a * vAlpha);
}
`;

interface Portrait3DProps {
    imageUrl?: string;
    analyser?: AnalyserNode | null;
}

export default function PortraitScene({ imageUrl = '/portrait-placeholder.jpg', analyser }: Portrait3DProps) {
    const pointsRef = useRef<Points>(null);
    const materialRef = useRef<ShaderMaterial>(null);
    const { viewport } = useThree();

    const texture = useLoader(TextureLoader, imageUrl);

    // Generate particles based on image aspect ratio
    const { positions, uvs } = useMemo(() => {
        const width = 128; // Grid resolution
        const height = 128;
        const count = width * height;

        const positions = new Float32Array(count * 3);
        const uvs = new Float32Array(count * 2);

        // Aspect ratio correction
        const aspect = 4 / 5;
        const scale = 15.0;

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const index = i * height + j;

                // UV coordinates (0 to 1)
                const u = i / (width - 1);
                const v = j / (height - 1);

                uvs[index * 2] = u;
                uvs[index * 2 + 1] = v;

                // Position centered at 0
                positions[index * 3] = (u - 0.5) * scale * aspect;
                positions[index * 3 + 1] = (v - 0.5) * scale;
                positions[index * 3 + 2] = 0;
            }
        }

        return { positions, uvs };
    }, []);

    const uniforms = useMemo(
        () => ({
            uTexture: { value: texture },
            uTime: { value: 0 },
            uAudioLevel: { value: 0 },
            uMouse: { value: new Vector2(9999, 9999) }, // Start off-screen
            uResolution: { value: new Vector2(viewport.width, viewport.height) }
        }),
        [texture, viewport]
    );

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();

            // Update mouse position (projected to world plane at z=0)
            const vector = new Vector2(state.pointer.x * viewport.width / 2, state.pointer.y * viewport.height / 2);
            materialRef.current.uniforms.uMouse.value.lerp(vector, 0.1);

            // Update audio level
            if (analyser) {
                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(dataArray);

                // Calculate average volume
                let sum = 0;
                const range = Math.floor(dataArray.length / 4); // Bass/Mids
                for (let i = 0; i < range; i++) {
                    sum += dataArray[i];
                }
                const average = sum / range;
                const normalizedVolume = average / 255;

                // Smoothly interpolate audio level
                const currentLevel = materialRef.current.uniforms.uAudioLevel.value;
                materialRef.current.uniforms.uAudioLevel.value = currentLevel + (normalizedVolume - currentLevel) * 0.2;
            } else {
                materialRef.current.uniforms.uAudioLevel.value *= 0.95;
            }
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                {/* @ts-ignore */}
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                {/* @ts-ignore */}
                <bufferAttribute
                    attach="attributes-aUv"
                    args={[uvs, 2]}
                />
            </bufferGeometry>
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
            />
        </points>
    );
}
