import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export function Floor() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[50, 50, 20, 20]} />
        <meshStandardMaterial
          color="#0f3460"
          roughness={0.9}
          metalness={0.1}
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>
    </>
  );
}

export function Walls() {
  return (
    <group>
      <mesh position={[0, 5, -25]} receiveShadow castShadow>
        <boxGeometry args={[50, 10, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      <mesh position={[0, 5, 25]} receiveShadow castShadow>
        <boxGeometry args={[50, 10, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      <mesh position={[-25, 5, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.5, 10, 50]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      <mesh position={[25, 5, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.5, 10, 50]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      <mesh position={[0, 10, 0]} receiveShadow>
        <boxGeometry args={[50, 0.5, 50]} />
        <meshStandardMaterial color="#0f0f0f" />
      </mesh>
    </group>
  );
}

interface InfoStandProps {
  position: [number, number, number];
  title: string;
  color: string;
  onClick: () => void;
}

export function InfoStand({ position, title, color, onClick }: InfoStandProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.15;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = -state.clock.elapsedTime * 0.3;
      glowRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.15;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} onClick={onClick} castShadow>
        <boxGeometry args={[1.5, 2.5, 1.5]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      <mesh ref={glowRef} onClick={onClick}>
        <boxGeometry args={[1.8, 2.8, 1.8]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.2}
          emissive={color}
          emissiveIntensity={0.8}
        />
      </mesh>

      <Text
        position={[0, 3, 0]}
        fontSize={0.45}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {title}
      </Text>

      <pointLight position={[0, 1, 0]} color={color} intensity={3} distance={8} />
    </group>
  );
}

export function Decorations() {
  return (
    <group>
      <mesh position={[-20, 3, -20]} castShadow>
        <boxGeometry args={[3, 6, 3]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[-20, 6.5, -20]} castShadow>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial color="#228b22" emissive="#228b22" emissiveIntensity={0.2} />
      </mesh>

      <mesh position={[20, 1, -20]} castShadow>
        <cylinderGeometry args={[1, 1, 2, 32]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[20, 3, 20]} castShadow>
        <boxGeometry args={[4, 6, 1]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>
      <Text
        position={[20, 5, 20.6]}
        fontSize={0.8}
        color="#60a5fa"
        anchorX="center"
        anchorY="middle"
      >
        SEAN OGTA GOH
      </Text>

      <mesh position={[-20, 2, 20]} castShadow>
        <torusGeometry args={[2, 0.5, 16, 100]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <pointLight position={[0, 8, 0]} intensity={1} color="#60a5fa" />
      <spotLight
        position={[-15, 8, -15]}
        angle={0.3}
        penumbra={0.5}
        intensity={1.5}
        castShadow
        color="#10b981"
      />
      <spotLight
        position={[15, 8, 15]}
        angle={0.3}
        penumbra={0.5}
        intensity={1.5}
        castShadow
        color="#f59e0b"
      />
      <hemisphereLight args={['#0a4d68', '#1a1a2e', 0.3]} />
    </>
  );
}
