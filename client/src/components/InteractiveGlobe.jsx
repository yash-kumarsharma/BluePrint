import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const LiquidGlobe = () => {
  const meshRef = useRef();
  const materialRef = useRef();
  const [hovered, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotation based on pointer
      const targetX = state.pointer.x * 0.5;
      const targetY = state.pointer.y * 0.5;
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetX, 0.1);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -targetY, 0.1);

      // Scale lerping
      const targetScale = clicked ? 2.5 : hovered ? 2.2 : 2;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }

    if (materialRef.current) {
      // Distort lerping
      const targetDistort = clicked ? 0.8 : hovered ? 0.5 : 0.3;
      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, 0.1);
      
      // Speed lerping
      const targetSpeed = hovered ? 4 : 2;
      materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, targetSpeed, 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onPointerDown={() => setClicked(true)}
        onPointerUp={() => setClicked(false)}
      >
        <Sphere args={[1, 64, 64]}>
          <MeshDistortMaterial
            ref={materialRef}
            color={hovered ? "#312E81" : "#1E1B4B"}
            transparent
            opacity={0.9}
            distort={0.3}
            speed={2}
            roughness={0.1}
            metalness={0.8}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </Sphere>
      </mesh>
    </Float>
  );
};

export default function InteractiveGlobe() {
  return (
    <div style={{ height: '600px', width: '100%', position: 'relative', zIndex: 10, margin: '2rem 0', cursor: 'grab' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#D946EF" />
        <directionalLight position={[-5, 5, 5]} intensity={2} color="#3B82F6" />
        <LiquidGlobe />
      </Canvas>
    </div>
  );
}
