import { useState, Suspense, useRef } from 'react'; // <-- Import useRef
import { Canvas, useFrame } from '@react-three/fiber'; // <-- Import useFrame
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Info, Trophy, Music, Zap, Target, Heart, X, Car as CarIcon } from 'lucide-react';
import * as THREE from 'three';
import { AE86Car } from './AE86Car';
import { Floor, Walls, InfoStand, Decorations, Lighting } from './Room3D';

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

export default function Playground3D({ onBack }: Playground3DProps) {
  const [selectedInfo, setSelectedInfo] = useState<InfoData | null>(null);
  const [discoveredPoints, setDiscoveredPoints] = useState<Set<string>>(new Set());
  const [showControls, setShowControls] = useState(true);
  
  // --- REMOVED STATE ---
  // const [carPosition, setCarPosition] = useState(new THREE.Vector3(0, 0, 0));
  // const [carRotation, setCarRotation] = useState(new THREE.Euler(0, 0, 0));
  
  // --- ADDED REF ---
  const carRef = useRef<THREE.Group>(null!);

  const [cameraMode, setCameraMode] = useState<'third-person' | 'free'>('third-person');

  const infoPoints: InfoData[] = [
    // ... (infoPoints array remains the same)
    {
      id: '1',
      position: [-15, 1, -15],
      title: 'Railway Engineering',
      icon: Zap,
      color: '#06b6d4',
      content: 'Specializing in Sustainable Infrastructure Engineering (Land) with expertise in railway systems, track design, signaling, and modern transport solutions.',
      category: 'Engineering'
    },
    {
      id: '2',
      position: [15, 1, -15],
      title: 'Power Systems',
      icon: Zap,
      color: '#f59e0b',
      content: 'Diploma in Electrical Engineering with Power Engineering specialization. Expert in electrical systems design, power distribution, and control systems.',
      category: 'Engineering'
    },
    {
      id: '3',
      position: [-15, 1, 15],
      title: 'Music & Performance',
      icon: Music,
      color: '#a855f7',
      content: 'Trained violinist with vocal capabilities and voice-over experience. Music provides creative balance and interdisciplinary perspective to technical work.',
      category: 'Creative'
    },
    {
      id: '4',
      position: [15, 1, 15],
      title: 'Psychology & Advisory',
      icon: Heart,
      color: '#ef4444',
      content: 'Passionate about psychology and helping others. Regularly advise friends, family, and anyone seeking guidance on personal and professional matters.',
      category: 'Personal'
    },
    {
      id: '5',
      position: [0, 1, -18],
      title: 'Motorsports',
      icon: CarIcon,
      color: '#dc2626',
      content: 'Deep interest in motorsports, combining technical engineering knowledge with high-performance vehicle dynamics and racing strategy. Hence the AE86!',
      category: 'Interests'
    },
    {
      id: '6',
      position: [-18, 1, 0],
      title: 'Archery',
      icon: Target,
      color: '#10b981',
      content: 'Practice archery for focus, discipline, and precision. The mental discipline translates well into engineering problem-solving.',
      category: 'Interests'
    },
    {
      id: '7',
      position: [18, 1, 0],
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

  const handleCarUpdate = (pos: THREE.Vector3, rot: THREE.Euler) => {
    // --- REMOVED STATE UPDATES ---
    // setCarPosition(pos);
    // setCarRotation(rot);

    // Keep the collision detection logic
    infoPoints.forEach(point => {
      const distance = pos.distanceTo(new THREE.Vector3(...point.position));
      if (distance < 5 && !discoveredPoints.has(point.id)) {
        setDiscoveredPoints(prev => new Set(prev).add(point.id));
        setSelectedInfo(point);
      }
    });
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* ... (UI elements remain the same) ... */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-white hover:text-cyan-400 transition-colors font-semibold"
          >
            ← Back to Choice
          </button>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setCameraMode(prev => prev === 'third-person' ? 'free' : 'third-person')}
              className="text-white hover:text-cyan-400 transition-colors text-sm"
            >
              {cameraMode === 'third-person' ? '3rd Person' : 'Free Cam'}
            </button>
            <div className="text-white text-sm">
              <span className="text-cyan-400 font-semibold">{discoveredPoints.size}</span>
              <span className="text-slate-400"> / {infoPoints.length} Discovered</span>
            </div>
            <button
              onClick={() => setShowControls(!showControls)}
              className="text-white hover:text-cyan-400 transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {showControls && (
        <div className="fixed top-20 left-4 z-30 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-lg p-4 text-white max-w-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">Controls</h3>
            <button onClick={() => setShowControls(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 text-sm text-slate-300">
            <p><strong>W / ↑</strong> - Accelerate</p>
            <p><strong>S / ↓</strong> - Brake / Reverse</p>
            <p><strong>A / ←</strong> - Turn Left</p>
            <p><strong>D / →</strong> - Turn Right</p>
            <p><strong>Click Camera Button</strong> - Switch View</p>
            <p className="text-cyan-400 text-xs mt-3">Drive your AE86 near markers to discover information!</p>
          </div>
        </div>
      )}

      <div className="w-full h-screen">
        <Canvas shadows>
          <Suspense fallback={null}>
            <Lighting />
            <Floor />
            <Walls />
            <Decorations />

            {infoPoints.map(point => (
              <InfoStand
                key={point.id}
                position={point.position}
                title={point.title}
                color={point.color}
                onClick={() => handleInfoClick(point)}
              />
            ))}

            <AE86Car
              ref={carRef} // <-- Pass the ref here
              position={new THREE.Vector3(0, 0, 0)}
              rotation={new THREE.Euler(0, 0, 0)}
              onUpdate={handleCarUpdate}
            />

            {cameraMode === 'third-person' ? (
              // --- Pass the carRef to the camera ---
              <ThirdPersonCamera carRef={carRef} />
            ) : (
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                maxPolarAngle={Math.PI / 2}
                minDistance={5}
                maxDistance={40}
              />
            )}
          </Suspense>
        </Canvas>
      </div>

      {/* ... (Modal UI remains the same) ... */}
      {selectedInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedInfo(null)}>
          <div className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full border border-slate-700 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: selectedInfo.color }}>
                  <selectedInfo.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{selectedInfo.title}</h2>
                  <span className="text-sm text-cyan-400">{selectedInfo.category}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedInfo(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed">
              {selectedInfo.content}
            </p>
            {discoveredPoints.has(selectedInfo.id) && (
              <div className="mt-6 flex items-center text-emerald-400 text-sm">
                <Trophy className="w-4 h-4 mr-2" />
                <span>Discovered!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- UPDATED ThirdPersonCamera Component ---
function ThirdPersonCamera({ carRef }: { carRef: React.RefObject<THREE.Group> }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

  useFrame(() => {
    if (carRef.current && cameraRef.current) {
      const car = carRef.current;
      const camera = cameraRef.current;
      
      // Target position (10 units behind, 5 units up)
      const camPos = new THREE.Vector3(
        car.position.x - Math.sin(car.rotation.y) * 10,
        car.position.y + 5,
        car.position.z - Math.cos(car.rotation.y) * 10
      );
      
      // Target rotation
      const targetEuler = new THREE.Euler(-0.3, car.rotation.y, 0);
      const targetQuaternion = new THREE.Quaternion().setFromEuler(targetEuler);

      // Smoothly interpolate position (lerp)
      camera.position.lerp(camPos, 0.1);
      
      // Smoothly interpolate rotation (slerp)
      camera.quaternion.slerp(targetQuaternion, 0.1);
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={75}
      position={[0, 5, 10]} // Initial position
    />
  );
}
