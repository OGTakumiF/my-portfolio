import { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Text, Environment, Sky, ContactShadows, Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { CameraController } from '../utils/CameraController';
import { ArrowLeft, Maximize2, RotateCcw, Info, X } from 'lucide-react';

interface RoomObject {
  id: string;
  position: [number, number, number];
  type: 'box' | 'sphere' | 'torus';
  label: string;
  color: string;
  size: [number, number, number];
  description: string;
}

const portfolioObjects: RoomObject[] = [
  {
    id: '1',
    position: [-6, 1.5, -7],
    type: 'box',
    label: 'Engineering',
    color: '#06b6d4',
    size: [2, 3, 1],
    description: 'Sustainable Infrastructure & Electrical Power Engineering with railway expertise'
  },
  {
    id: '2',
    position: [6, 1.5, -7],
    type: 'box',
    label: 'Music',
    color: '#a855f7',
    size: [2, 3, 1],
    description: 'Trained violinist with vocal capabilities and voice-over experience'
  },
  {
    id: '3',
    position: [-7, 1, 0],
    type: 'sphere',
    label: 'Psychology',
    color: '#ef4444',
    size: [1.5, 1.5, 1.5],
    description: 'Passionate advisor helping friends, family, and community'
  },
  {
    id: '4',
    position: [7, 1, 0],
    type: 'sphere',
    label: 'Motorsports',
    color: '#dc2626',
    size: [1.5, 1.5, 1.5],
    description: 'Deep interest in motorsports, vehicle dynamics, and racing strategy'
  },
  {
    id: '5',
    position: [0, 2, -8],
    type: 'torus',
    label: 'Archery',
    color: '#10b981',
    size: [1, 0.4, 16],
    description: 'Practice archery for focus, discipline, and precision'
  },
  {
    id: '6',
    position: [0, 1.5, 7],
    type: 'box',
    label: 'Achievements',
    color: '#eab308',
    size: [3, 3, 1],
    description: 'Multi-disciplinary engineer with dual qualifications and active community involvement'
  }
];

function InteractiveObject({ obj, onClick }: { obj: RoomObject; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (hovered) {
        meshRef.current.position.y = obj.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  return (
    <group position={obj.position}>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {obj.type === 'box' && <boxGeometry args={obj.size} />}
        {obj.type === 'sphere' && <sphereGeometry args={[obj.size[0], 32, 32]} />}
        {obj.type === 'torus' && <torusGeometry args={[obj.size[0], obj.size[1], 16, obj.size[2]]} />}
        <meshStandardMaterial
          color={obj.color}
          roughness={0.3}
          metalness={0.7}
          emissive={obj.color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>
      <Text
        position={[0, obj.type === 'box' ? obj.size[1] / 2 + 0.8 : obj.size[0] + 1, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {obj.label}
      </Text>
      {hovered && (
        <pointLight
          position={[0, 2, 0]}
          intensity={2}
          distance={5}
          color={obj.color}
        />
      )}
    </group>
  );
}

function Room({ objects, onObjectClick }: { objects: RoomObject[]; onObjectClick: (obj: RoomObject) => void }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      <mesh position={[0, 7, -15]} receiveShadow>
        <boxGeometry args={[30, 14, 0.5]} />
        <meshStandardMaterial color="#0f0f1e" roughness={0.9} />
      </mesh>

      <mesh position={[-15, 7, 0]} receiveShadow>
        <boxGeometry args={[0.5, 14, 30]} />
        <meshStandardMaterial color="#0f0f1e" roughness={0.9} />
      </mesh>

      <mesh position={[15, 7, 0]} receiveShadow>
        <boxGeometry args={[0.5, 14, 30]} />
        <meshStandardMaterial color="#0f0f1e" roughness={0.9} />
      </mesh>

      <mesh position={[0, 7, 15]} receiveShadow>
        <boxGeometry args={[30, 14, 0.5]} />
        <meshStandardMaterial color="#0f0f1e" roughness={0.9} />
      </mesh>

      <mesh position={[0, 14, 0]} receiveShadow>
        <boxGeometry args={[30, 0.5, 30]} />
        <meshStandardMaterial color="#0a0a1a" roughness={0.95} />
      </mesh>

      {objects.map((obj) => (
        <InteractiveObject key={obj.id} obj={obj} onClick={() => onObjectClick(obj)} />
      ))}

      <Box position={[-5, 0.5, 5]} args={[2, 1, 2]} castShadow receiveShadow>
        <meshStandardMaterial color="#3a3a4e" roughness={0.8} />
      </Box>
      <Box position={[5, 0.5, 5]} args={[2, 1, 2]} castShadow receiveShadow>
        <meshStandardMaterial color="#3a3a4e" roughness={0.8} />
      </Box>

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.5}
        scale={20}
        blur={2}
        far={10}
      />
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[0, 10, 0]} intensity={0.8} color="#ffffff" />
      <spotLight
        position={[-8, 12, -8]}
        angle={0.5}
        penumbra={0.5}
        intensity={1.5}
        castShadow
        color="#06b6d4"
      />
      <spotLight
        position={[8, 12, 8]}
        angle={0.5}
        penumbra={0.5}
        intensity={1.5}
        castShadow
        color="#a855f7"
      />
      <hemisphereLight args={['#4a5568', '#1a1a2e', 0.5]} />
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

    controller.controls.setPosition(10, 8, 10);
    controller.controls.setTarget(0, 3, 0);

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
  const [objects] = useState<RoomObject[]>(portfolioObjects);
  const [selectedObject, setSelectedObject] = useState<RoomObject | null>(null);
  const [showInfo, setShowInfo] = useState(true);
  const cameraControllerRef = useRef<CameraController | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleReset = () => {
    if (cameraControllerRef.current) {
      gsap.to(cameraControllerRef.current.controls, {
        duration: 1,
        onUpdate: () => {
          cameraControllerRef.current?.controls.setPosition(10, 8, 10);
          cameraControllerRef.current?.controls.setTarget(0, 3, 0);
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
    <div className="relative w-full h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-800 text-white rounded-lg transition-all backdrop-blur-md border border-slate-700 hover:border-cyan-500"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-800 text-white rounded-lg transition-all backdrop-blur-md border border-slate-700 hover:border-emerald-500"
        >
          <RotateCcw size={20} />
          Reset View
        </button>
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-800 text-white rounded-lg transition-all backdrop-blur-md border border-slate-700 hover:border-purple-500"
        >
          <Maximize2 size={20} />
          {isFullscreen ? 'Exit' : 'Fullscreen'}
        </button>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-800 text-white rounded-lg transition-all backdrop-blur-md border border-slate-700 hover:border-orange-500"
        >
          <Info size={20} />
          {showInfo ? 'Hide' : 'Show'} Info
        </button>
      </div>

      {showInfo && (
        <div className="absolute top-4 right-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-4 text-white max-w-xs">
          <h3 className="font-bold text-lg mb-2 text-cyan-400">Explore My Room</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Click on any floating object to learn more about my skills, interests, and achievements. Use your mouse to rotate, zoom, and pan around the room.
          </p>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-white/80 text-sm bg-slate-900/90 px-6 py-3 rounded-lg backdrop-blur-md border border-slate-700">
        <span className="font-semibold">Drag</span> to rotate • <span className="font-semibold">Scroll</span> to zoom • <span className="font-semibold">Right-click</span> to pan • <span className="font-semibold">Click</span> objects to explore
      </div>

      <Canvas
        shadows
        camera={{ position: [10, 8, 10], fov: 60 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <color attach="background" args={['#0a0a15']} />
        <fog attach="fog" args={['#0a0a15', 20, 40]} />

        <CameraControlsComponent controllerRef={cameraControllerRef} />

        <Lights />
        <Room objects={objects} onObjectClick={setSelectedObject} />
        <Environment preset="night" />
      </Canvas>

      {selectedObject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setSelectedObject(null)}
        >
          <div
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full border border-slate-600 shadow-2xl transform transition-all"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div
                  className="w-20 h-20 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: selectedObject.color }}
                >
                  <span className="text-4xl">✨</span>
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-white mb-1">{selectedObject.label}</h2>
                  <span className="text-sm text-cyan-400 font-semibold px-3 py-1 bg-cyan-500/20 rounded-full">
                    {selectedObject.type.toUpperCase()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedObject(null)}
                className="text-slate-400 hover:text-white transition-colors bg-slate-700/50 p-2 rounded-lg hover:bg-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-slate-200 text-lg leading-relaxed">
              {selectedObject.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
