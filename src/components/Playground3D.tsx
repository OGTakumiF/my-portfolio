import { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Float, MeshReflectorMaterial, Sky, Stars } from '@react-three/drei';
import { Info, Trophy, Music, Zap, Target, Heart, X, Car as CarIcon, Maximize2 } from 'lucide-react';
import * as THREE from 'three';
import { AE86Car } from './AE86Car';

interface Playground3DProps {
  onBack: () => void;
}

interface InfoData {
  id: string;
  position: [number, number, number];
  title: string;
  icon: any;
  color: string;
  content: string;
  category: string;
}

function CameraRig({ carRef }: { carRef: React.RefObject<THREE.Group> }) {
  useFrame((state) => {
    if (!carRef.current) return;
    const car = carRef.current;
    const camPos = new THREE.Vector3(
      car.position.x - Math.sin(car.rotation.y) * 15,
      car.position.y + 8,
      car.position.z - Math.cos(car.rotation.y) * 15
    );
    state.camera.position.lerp(camPos, 0.08);
    state.camera.lookAt(car.position.x, car.position.y + 1, car.position.z);
  });
  return null;
}

function EnhancedFloor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[150, 150]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.5}
          mirror={0}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[150, 150, 30, 30]} />
        <meshStandardMaterial
          color="#0a4d68"
          roughness={0.9}
          metalness={0.1}
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

function FloatingIsland({ position, size = [8, 2, 8], color = '#2d3748' }: {
  position: [number, number, number];
  size?: [number, number, number];
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          metalness={0.3}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  );
}

function Ramp({ position, rotation = [0, 0, 0], color = '#4a5568' }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[10, 0.5, 15]} />
      <meshStandardMaterial
        color={color}
        roughness={0.8}
        emissive={color}
        emissiveIntensity={0.05}
      />
    </mesh>
  );
}

function Pillar({ position, height = 15, color = '#1a365d' }: {
  position: [number, number, number];
  height?: number;
  color?: string;
}) {
  return (
    <mesh position={[position[0], position[1] + height / 2, position[2]]} castShadow receiveShadow>
      <boxGeometry args={[2, height, 2]} />
      <meshStandardMaterial
        color={color}
        roughness={0.6}
        metalness={0.4}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

function EnhancedInfoStand({ position, title, color, onClick, discovered }: {
  position: [number, number, number];
  title: string;
  color: string;
  onClick: () => void;
  discovered: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.8;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = -state.clock.elapsedTime * 0.5;
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          castShadow
        >
          <octahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial
            color={discovered ? '#10b981' : color}
            emissive={discovered ? '#10b981' : color}
            emissiveIntensity={hovered ? 1 : 0.6}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        <mesh ref={glowRef}>
          <octahedronGeometry args={[2, 0]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.2}
            emissive={color}
            emissiveIntensity={0.8}
          />
        </mesh>

        <Text
          position={[0, 3.5, 0]}
          fontSize={0.7}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor="#000000"
          font="/fonts/bold.woff"
        >
          {title}
        </Text>
      </Float>

      <pointLight
        position={[0, 2, 0]}
        color={color}
        intensity={hovered ? 5 : 3}
        distance={15}
      />

      {discovered && (
        <mesh position={[0, 4, 0]}>
          <ringGeometry args={[0.5, 0.7, 32]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}

function WorldEnvironment() {
  return (
    <>
      <FloatingIsland position={[-40, 8, -40]} size={[12, 3, 12]} color="#2c5282" />
      <FloatingIsland position={[45, 10, -45]} size={[10, 2.5, 10]} color="#434190" />
      <FloatingIsland position={[-50, 12, 50]} size={[15, 3, 15]} color="#285e61" />
      <FloatingIsland position={[50, 9, 45]} size={[11, 2, 11]} color="#744210" />

      <Ramp position={[-30, 0.8, 0]} rotation={[0, 0, 0.15]} color="#2d3748" />
      <Ramp position={[35, 0.8, 20]} rotation={[0, Math.PI / 4, 0.12]} color="#2d3748" />
      <Ramp position={[0, 0.8, -35]} rotation={[0, Math.PI / 2, 0.18]} color="#2d3748" />

      <Pillar position={[-55, 0, -55]} height={20} color="#1a365d" />
      <Pillar position={[60, 0, -60]} height={25} color="#2c7a7b" />
      <Pillar position={[-60, 0, 60]} height={22} color="#6b46c1" />
      <Pillar position={[55, 0, 55]} height={18} color="#c05621" />

      <group position={[0, 0, 0]}>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 65;
          return (
            <Pillar
              key={i}
              position={[
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
              ]}
              height={15 + Math.sin(i) * 5}
              color="#1e3a8a"
            />
          );
        })}
      </group>
    </>
  );
}

function EnhancedLighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[20, 30, 20]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
      />

      <pointLight position={[-40, 15, -40]} intensity={2} color="#3b82f6" distance={40} />
      <pointLight position={[45, 15, -45]} intensity={2} color="#8b5cf6" distance={40} />
      <pointLight position={[-50, 15, 50]} intensity={2} color="#10b981" distance={40} />
      <pointLight position={[50, 15, 45]} intensity={2} color="#f59e0b" distance={40} />

      <hemisphereLight args={['#3b82f6', '#0a4d68', 0.4]} />

      <spotLight
        position={[0, 40, 0]}
        angle={0.6}
        penumbra={0.5}
        intensity={1}
        castShadow
        color="#ffffff"
      />
    </>
  );
}

export default function Playground3D({ onBack }: Playground3DProps) {
  const [selectedInfo, setSelectedInfo] = useState<InfoData | null>(null);
  const [discoveredPoints, setDiscoveredPoints] = useState<Set<string>>(new Set());
  const [showControls, setShowControls] = useState(true);
  const carRef = useRef<THREE.Group>(null);
  const [cameraMode, setCameraMode] = useState<'third-person' | 'free'>('third-person');

  const infoPoints: InfoData[] = [
    {
      id: '1',
      position: [-30, 1, -30],
      title: 'Railway Engineering',
      icon: Zap,
      color: '#06b6d4',
      content: 'Specializing in Sustainable Infrastructure Engineering (Land) with expertise in railway systems, track design, signaling, and modern transport solutions.',
      category: 'Engineering'
    },
    {
      id: '2',
      position: [35, 1, -35],
      title: 'Power Systems',
      icon: Zap,
      color: '#f59e0b',
      content: 'Diploma in Electrical Engineering with Power Engineering specialization. Expert in electrical systems design, power distribution, and control systems.',
      category: 'Engineering'
    },
    {
      id: '3',
      position: [-35, 1, 35],
      title: 'Music & Performance',
      icon: Music,
      color: '#a855f7',
      content: 'Trained violinist with vocal capabilities and voice-over experience. Music provides creative balance and interdisciplinary perspective to technical work.',
      category: 'Creative'
    },
    {
      id: '4',
      position: [30, 1, 30],
      title: 'Psychology & Advisory',
      icon: Heart,
      color: '#ef4444',
      content: 'Passionate about psychology and helping others. Regularly advise friends, family, and anyone seeking guidance on personal and professional matters.',
      category: 'Personal'
    },
    {
      id: '5',
      position: [0, 1, -45],
      title: 'Motorsports',
      icon: CarIcon,
      color: '#dc2626',
      content: 'Deep interest in motorsports, combining technical engineering knowledge with high-performance vehicle dynamics and racing strategy. Hence the AE86!',
      category: 'Interests'
    },
    {
      id: '6',
      position: [-45, 1, 0],
      title: 'Archery',
      icon: Target,
      color: '#10b981',
      content: 'Practice archery for focus, discipline, and precision. The mental discipline translates well into engineering problem-solving.',
      category: 'Interests'
    },
    {
      id: '7',
      position: [45, 1, 0],
      title: 'Achievements',
      icon: Trophy,
      color: '#eab308',
      content: 'Multi-disciplinary engineer with dual qualifications in Electrical and Sustainable Infrastructure Engineering. Active musician and community advisor.',
      category: 'About'
    }
  ];

  const handleInfoClick = (info: InfoData) => {
    setSelectedInfo(info);
    if (!discoveredPoints.has(info.id)) {
      setDiscoveredPoints(prev => new Set(prev).add(info.id));
    }
  };

  const handleCarUpdate = (pos: THREE.Vector3) => {
    infoPoints.forEach(point => {
      const distance = pos.distanceTo(new THREE.Vector3(...point.position));
      if (distance < 6 && !discoveredPoints.has(point.id)) {
        setDiscoveredPoints(prev => new Set(prev).add(point.id));
        setSelectedInfo(point);
      }
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-white hover:text-cyan-400 transition-all duration-300 font-semibold flex items-center space-x-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700 hover:border-cyan-500"
          >
            <span>←</span>
            <span>Back to Choice</span>
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCameraMode(prev => prev === 'third-person' ? 'free' : 'third-person')}
              className="text-white hover:text-emerald-400 transition-all duration-300 text-sm bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700 hover:border-emerald-500"
            >
              {cameraMode === 'third-person' ? '3rd Person' : 'Free Cam'}
            </button>
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-purple-400 transition-all duration-300 bg-slate-800/50 p-2 rounded-lg border border-slate-700 hover:border-purple-500"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            <div className="text-white text-sm bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
              <span className="text-cyan-400 font-semibold">{discoveredPoints.size}</span>
              <span className="text-slate-400"> / {infoPoints.length} Discovered</span>
            </div>
            <button
              onClick={() => setShowControls(!showControls)}
              className="text-white hover:text-orange-400 transition-all duration-300 bg-slate-800/50 p-2 rounded-lg border border-slate-700 hover:border-orange-500"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {showControls && (
        <div className="fixed top-24 left-4 z-30 bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-xl p-5 text-white max-w-xs shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Controls</h3>
            <button onClick={() => setShowControls(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-2.5 text-sm text-slate-300">
            <p className="flex items-center space-x-2"><strong className="text-cyan-400 w-20">W / ↑</strong> <span>Accelerate</span></p>
            <p className="flex items-center space-x-2"><strong className="text-cyan-400 w-20">S / ↓</strong> <span>Brake / Reverse</span></p>
            <p className="flex items-center space-x-2"><strong className="text-cyan-400 w-20">A / ←</strong> <span>Turn Left</span></p>
            <p className="flex items-center space-x-2"><strong className="text-cyan-400 w-20">D / →</strong> <span>Turn Right</span></p>
            <div className="border-t border-slate-700 my-3"></div>
            <p className="text-emerald-400 text-xs leading-relaxed bg-emerald-500/10 p-2 rounded">
              Drive your AE86 around this vast world! Explore floating islands, drive over ramps, and discover glowing markers to learn more about me.
            </p>
          </div>
        </div>
      )}

      <div className="w-full h-screen">
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 75 }}>
          <Suspense fallback={null}>
            <Sky sunPosition={[100, 20, 100]} />
            <Stars radius={300} depth={60} count={1000} factor={7} saturation={0} fade speed={1} />
            <fog attach="fog" args={['#0a192f', 60, 150]} />

            <EnhancedLighting />
            <EnhancedFloor />
            <WorldEnvironment />

            {infoPoints.map(point => (
              <EnhancedInfoStand
                key={point.id}
                position={point.position}
                title={point.title}
                color={point.color}
                onClick={() => handleInfoClick(point)}
                discovered={discoveredPoints.has(point.id)}
              />
            ))}

            <AE86Car
              ref={carRef}
              position={new THREE.Vector3(0, 0, 0)}
              rotation={new THREE.Euler(0, 0, 0)}
              onUpdate={handleCarUpdate}
            />

            <PerspectiveCamera makeDefault fov={75} position={[0, 5, 10]} />
            {cameraMode === 'third-person' ? (
              <CameraRig carRef={carRef} />
            ) : (
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                maxPolarAngle={Math.PI / 2}
                minDistance={5}
                maxDistance={80}
              />
            )}
          </Suspense>
        </Canvas>
      </div>

      {selectedInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setSelectedInfo(null)}>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full border border-slate-600 shadow-2xl transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: selectedInfo.color }}>
                  <selectedInfo.icon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-white mb-1">{selectedInfo.title}</h2>
                  <span className="text-sm text-cyan-400 font-semibold px-3 py-1 bg-cyan-500/20 rounded-full">{selectedInfo.category}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedInfo(null)}
                className="text-slate-400 hover:text-white transition-colors bg-slate-700/50 p-2 rounded-lg hover:bg-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-slate-200 text-lg leading-relaxed mb-6">
              {selectedInfo.content}
            </p>
            {discoveredPoints.has(selectedInfo.id) && (
              <div className="mt-6 flex items-center text-emerald-400 text-sm bg-emerald-500/20 px-4 py-2 rounded-lg">
                <Trophy className="w-5 h-5 mr-2" />
                <span className="font-semibold">Discovered!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
