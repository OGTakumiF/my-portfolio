import { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Text, Environment } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { CameraController } from '../utils/CameraController';
import { ArrowLeft, Maximize2, RotateCcw } from 'lucide-react';

interface RoomObject {
  id: string;
  position: [number, number, number];
  type: 'placeholder';
  label: string;
  color: string;
  size: [number, number, number];
}

const defaultObjects: RoomObject[] = [];

function Room({ objects }: { objects: RoomObject[] }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#2a2a2a"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      <mesh position={[0, 5, -10]} receiveShadow>
        <boxGeometry args={[20, 10, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      <mesh position={[-10, 5, 0]} receiveShadow>
        <boxGeometry args={[0.5, 10, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      <mesh position={[10, 5, 0]} receiveShadow>
        <boxGeometry args={[0.5, 10, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      <mesh position={[0, 10, 0]} receiveShadow>
        <boxGeometry args={[20, 0.5, 20]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.95} />
      </mesh>

      {objects.map((obj) => (
        <group key={obj.id} position={obj.position}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={obj.size} />
            <meshStandardMaterial
              color={obj.color}
              roughness={0.4}
              metalness={0.6}
            />
          </mesh>
          <Text
            position={[0, obj.size[1] / 2 + 0.5, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {obj.label}
          </Text>
        </group>
      ))}
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 15, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <pointLight position={[0, 8, 0]} intensity={0.5} color="#ffffff" />
      <spotLight
        position={[-5, 8, -5]}
        angle={0.4}
        penumbra={0.5}
        intensity={0.8}
        castShadow
        color="#4a90e2"
      />
      <spotLight
        position={[5, 8, 5]}
        angle={0.4}
        penumbra={0.5}
        intensity={0.8}
        castShadow
        color="#f39c12"
      />
      <hemisphereLight args={['#87ceeb', '#2a2a2a', 0.4]} />
    </>
  );
}

function CameraControlsComponent({
  controllerRef
}: {
  controllerRef: React.MutableRefObject<CameraController | null>
}) {
  const { camera, gl } = useThree();
  const clock = useRef(new THREE.Clock());

  useEffect(() => {
    const controller = new CameraController(camera, gl.domElement);
    controllerRef.current = controller;

    controller.controls.setPosition(8, 6, 8);
    controller.controls.setTarget(0, 2, 0);

    return () => {
      controller.dispose();
    };
  }, [camera, gl.domElement, controllerRef]);

  useFrame(() => {
    if (controllerRef.current) {
      const delta = clock.current.getDelta();
      controllerRef.current.update(delta);
    }
  });

  return null;
}

interface EnhancedRoom3DProps {
  onBack: () => void;
}

export default function EnhancedRoom3D({ onBack }: EnhancedRoom3DProps) {
  const [objects] = useState<RoomObject[]>(defaultObjects);
  const [loading, setLoading] = useState(false);
  const cameraControllerRef = useRef<CameraController | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleReset = () => {
    if (cameraControllerRef.current) {
      gsap.to(cameraControllerRef.current.controls, {
        duration: 1,
        onUpdate: () => {
          cameraControllerRef.current?.controls.setPosition(8, 6, 8);
          cameraControllerRef.current?.controls.setTarget(0, 2, 0);
        }
      });
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}

      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 hover:bg-gray-800 text-white rounded-lg transition-colors backdrop-blur-sm"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 hover:bg-gray-800 text-white rounded-lg transition-colors backdrop-blur-sm"
        >
          <RotateCcw size={20} />
          Reset View
        </button>
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 hover:bg-gray-800 text-white rounded-lg transition-colors backdrop-blur-sm"
        >
          <Maximize2 size={20} />
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-white/60 text-sm bg-gray-900/80 px-4 py-2 rounded-lg backdrop-blur-sm">
        Drag to rotate • Scroll to zoom • Right-click to pan
      </div>

      <Canvas
        shadows
        camera={{ position: [8, 6, 8], fov: 50 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1
        }}
      >
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 15, 35]} />

        <CameraControlsComponent controllerRef={cameraControllerRef} />

        <Lights />
        <Room objects={objects} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
