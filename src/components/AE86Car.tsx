import { useRef, useEffect, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AE86CarProps {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  onUpdate: (pos: THREE.Vector3, rot: THREE.Euler) => void;
}

// Wrap the component with forwardRef
export const AE86Car = forwardRef<THREE.Group, AE86CarProps>(
  ({ position, rotation, onUpdate }, ref) => {
    // This line is the key: it uses the 'ref' from the parent component.
    const carRef = (ref as React.MutableRefObject<THREE.Group>) || useRef<THREE.Group>(null!);
    const velocity = useRef(new THREE.Vector3());
    const angularVelocity = useRef(0);
    const keys = useRef<Set<string>>(new Set());

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        keys.current.add(e.key.toLowerCase());
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        keys.current.delete(e.key.toLowerCase());
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, []);

    useFrame((_state, delta) => {
      if (!carRef.current) return;

      const speed = 0.15;
      const turnSpeed = 0.05;
      const friction = 0.92;
      const angularFriction = 0.85;

      const currentKeys = keys.current;
      let accelerating = false;

      if (currentKeys.has('w') || currentKeys.has('arrowup')) {
        velocity.current.z += speed * delta * 60;
        accelerating = true;
      }
      if (currentKeys.has('s') || currentKeys.has('arrowdown')) {
        velocity.current.z -= speed * 0.6 * delta * 60;
        accelerating = true;
      }

      if (Math.abs(velocity.current.z) > 0.01) {
        if (currentKeys.has('a') || currentKeys.has('arrowleft')) {
          angularVelocity.current += turnSpeed * Math.sign(velocity.current.z) * delta * 60;
        }
        if (currentKeys.has('d') || currentKeys.has('arrowright')) {
          angularVelocity.current -= turnSpeed * Math.sign(velocity.current.z) * delta * 60;
        }
      }

      if (!accelerating) {
        velocity.current.multiplyScalar(friction);
      }

      angularVelocity.current *= angularFriction;

      carRef.current.rotation.y += angularVelocity.current * delta * 60;

      const moveDirection = new THREE.Vector3(0, 0, velocity.current.z);
      moveDirection.applyEuler(carRef.current.rotation);
      carRef.current.position.add(moveDirection.multiplyScalar(delta * 60));

      const bounds = 70;
      carRef.current.position.x = Math.max(-bounds, Math.min(bounds, carRef.current.position.x));
      carRef.current.position.z = Math.max(-bounds, Math.min(bounds, carRef.current.position.z));

      // This call is still used by Playground3D for info-point collision
      onUpdate(carRef.current.position.clone(), carRef.current.rotation.clone());
    });

    return (
      // Pass the ref to the group
      <group ref={carRef} position={position} rotation={rotation}>
        <group position={[0, 0.5, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.6, 0.8, 3.5]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.7} />
          </mesh>

          <mesh position={[0, 0.5, -0.3]} castShadow>
            <boxGeometry args={[1.4, 0.6, 1.8]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.7} />
          </mesh>

          <mesh position={[0, 0.5, -0.3]}>
            <boxGeometry args={[1.35, 0.5, 1.2]} />
            <meshStandardMaterial
              color="#1a1a1a"
              transparent
              opacity={0.3}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>

          <mesh position={[0, -0.1, 0.8]} castShadow>
            <boxGeometry args={[1.5, 0.3, 0.8]} />
            <meshStandardMaterial color="#e74c3c" emissive="#e74c3c" emissiveIntensity={0.5} />
          </mesh>

          <mesh position={[0, 0.1, -1.5]} castShadow>
            <boxGeometry args={[1.3, 0.25, 0.6]} />
            <meshStandardMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={0.8} />
          </mesh>

          <Wheel position={[0.7, -0.4, 1]} />
          <Wheel position={[-0.7, -0.4, 1]} />
          <Wheel position={[0.7, -0.4, -1]} />
          <Wheel position={[-0.7, -0.4, -1]} />

          <mesh position={[-0.9, 0, 1.3]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.9, 0, 1.3]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
          </mesh>

          <mesh position={[0, 0.3, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.3, 0.08, 8, 16]} />
            <meshStandardMaterial color="#000000" />
          </mesh>

          <spotLight
            position={[0, 0.2, -1.8]}
            angle={0.6}
            penumbra={0.5}
            intensity={1.5}
            distance={15}
            color="#ffeb3b"
            castShadow
          />
        </group>
      </group>
    );
  }
);

function Wheel({ position }: { position: [number, number, number] }) {
  const wheelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (wheelRef.current) {
      wheelRef.current.rotation.x += 0.1;
    }
  });

  return (
    <group ref={wheelRef} position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.32, 5]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}
