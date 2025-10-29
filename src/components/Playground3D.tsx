import { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
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

// This component smoothly controls the camera
function CameraRig({ carRef }: { carRef: React.RefObject<THREE.Group> }) {
  useFrame((state) => {
    if (!carRef.current) {
      return;
    }
    const car = carRef.current;
    const camPos = new THREE.Vector3(
      car.position.x - Math.sin(car.rotation.y) * 10,
      car.position.y + 5,
      car.position.z - Math.cos(car.rotation.y) * 10
    );
    state.camera.position.lerp(camPos, 0.1);
    state.camera.lookAt(car.position);
  });
  return null;
}


export default function Playground3D({ onBack }: Playground3DProps) {
  const [selectedInfo, setSelectedInfo] = useState<InfoData | null>(null);
  const [discoveredPoints, setDiscoveredPoints] = useState<Set<string>>(new Set());
  const [showControls, setShowControls] = useState(true);
  
  // This ref is for the car itself
  const carRef = useRef<THREE.Group>(null);
  
  // We no longer use useState for carPosition or carRotation
  const [cameraMode, setCameraMode] = useState<'third-person' | 'free'>('third-person');

  const infoPoints: InfoData[] = [
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

  // This function is still used for collision detection
  const handleCarUpdate = (pos: THREE.Vector3) => {
    infoPoints.forEach(point => {
      const distance = pos.distanceTo(new THREE.Vector3(...point.position));
      if (distance < 5 && !discoveredPoints.has(point.id)) {
        setDiscoveredPoints(prev => new Set(prev).add(point.id));
        setSelectedInfo(point);
      }
    });
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
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setCameraMode(prev => prev === 'third-person' ? 'free' : 'third-person')}
              className="text-white hover:text-emerald-400 transition-all duration-300 text-sm bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700 hover:border-emerald-500"
            >
              {cameraMode === 'third-person' ? '🎮 3rd Person' : '🎥 Free Cam'}
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
            <h3 className="font-bold text-lg flex items-center space-x-2">
              <span>🎮</span>
              <span>Controls</span>
            </h3>
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
            <p className="text-emerald-400 text-xs leading-relaxed bg-emerald-500/10 p-2 rounded">Drive your AE86 near the glowing markers to discover information!</p>
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
              ref={carRef}
              position={new THREE.Vector3(0, 0, 0)}
              rotation={new THREE.Euler(0, 0, 0)}
              onUpdate={handleCarUpdate}
            />
            
            {/* This is the new camera setup */}
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
                maxDistance={40}
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
