import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

const SpiralGalaxy = () => {
  const pointsRef = useRef();
  const particlesCount = 10000; // Dense star field

  const { pos, colors } = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    
    // Core is Deep Indigo, Outer is Dark Magenta for Light Mode
    const colorInside = new THREE.Color('#312E81');
    const colorOutside = new THREE.Color('#BE185D'); 

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      
      // Galaxy Mathematics (Archimedean Spiral)
      const radius = Math.random() * 8; 
      const spinAngle = radius * 4; // Tightness of the spiral
      const branchAngle = (i % 3) * ((Math.PI * 2) / 3); // 3 spiral arms

      // Add controlled scatter (noise) so it isn't a perfect line
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.4 * (8 - radius);
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.4 * (8 - radius);
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.4 * (8 - radius);

      pos[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      pos[i3 + 1] = randomY; // Flattened Y axis scatter
      pos[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Color interpolation: Closer = Indigo, Further = Magenta
      const mixedColor = colorInside.clone().lerp(colorOutside, radius / 8);
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }
    return { pos, colors };
  }, [particlesCount]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05; // Slow ambient rotation
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particlesCount} array={pos} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particlesCount} array={colors} itemSize={3} />
      </bufferGeometry>
      {/* Normal Blending for Light Background */}
      <pointsMaterial size={0.03} vertexColors depthWrite={false} blending={THREE.NormalBlending} transparent opacity={0.8} />
    </points>
  );
};

export default function GalaxyBackground() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 8, 2], fov: 60 }}>
        {/* Allows user to drag the galaxy, but disables annoying scroll breaking */}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 3} />
        <ambientLight intensity={1} />
        <SpiralGalaxy />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
}
