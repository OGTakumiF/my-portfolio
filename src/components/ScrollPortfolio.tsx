import { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import { X } from 'lucide-react';
import * as THREE from 'three';

interface ScrollPortfolioProps {
  onBack: () => void;
}

interface InteractiveObject {
  id: string;
  position: [number, number, number];
  title: string;
  description: string;
  emoji: string;
  color: string;
}

function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2d2d44" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 5, -10]} receiveShadow>
        <boxGeometry args={[20, 10, 0.5]} />
        <meshStandardMaterial color="#3d3d5c" />
      </mesh>
      <mesh position={[-10, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[20, 10, 0.5]} />
        <meshStandardMaterial color="#3d3d5c" />
      </mesh>
      <mesh position={[10, 5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[20, 10, 0.5]} />
        <meshStandardMaterial color="#3d3d5c" />
      </mesh>

      {/* Desk */}
      <group position={[0, 0, -6]}>
        <mesh position={[0, 2, 0]} castShadow>
          <boxGeometry args={[6, 0.2, 3]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {[[-2.7, 1, -1.3], [2.7, 1, -1.3], [-2.7, 1, 1.3], [2.7, 1, 1.3]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow>
            <boxGeometry args={[0.3, 2, 0.3]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
        ))}
      </group>

      {/* Laptop */}
      <mesh position={[0, 2.2, -6]} castShadow>
        <boxGeometry args={[1.5, 0.1, 1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0, 2.8, -6.3]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 1, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" emissive="#00ffff" emissiveIntensity={0.3} />
      </mesh>

      {/* Violin Case */}
      <mesh position={[-7, 1, -8]} rotation={[0, 0, 0.2]} castShadow>
        <boxGeometry args={[0.5, 2, 0.8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Bookshelf */}
      <mesh position={[-7, 2.5, 0]} castShadow>
        <boxGeometry args={[4, 5, 1]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      {/* Books */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          position={[-7.3, 1.5 + Math.floor(i / 4) * 1.5, -0.2 + (i % 4) * 0.4]}
          castShadow
        >
          <boxGeometry args={[0.3, 0.8, 0.5]} />
          <meshStandardMaterial color={`hsl(${i * 45}, 70%, 50%)`} />
        </mesh>
      ))}

      {/* Racing Helmet */}
      <mesh position={[-7, 4.5, 0]} castShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#ff0000" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Guitar */}
      <group position={[7, 3, -8]}>
        <mesh castShadow>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshStandardMaterial color="#cd853f" />
        </mesh>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[0.2, 2, 0.1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>

      {/* Archery Target */}
      <mesh position={[7, 3, 5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[1, 1, 0.3, 32]} />
        <meshStandardMaterial color="#ffff00" />
      </mesh>
      {/* Arrows */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[7.5, 3 + (i - 1) * 0.3, 5 + (i - 1) * 0.2]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.05, 0.05, 1.5, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      ))}

      {/* Brain Model */}
      <mesh position={[1.5, 2.3, -6]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#ffb6c1" />
      </mesh>

      {/* Posters */}
      <mesh position={[-3, 5, -9.9]}>
        <planeGeometry args={[2, 3]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>
      <mesh position={[3, 5, -9.9]}>
        <planeGeometry args={[2, 3]} />
        <meshStandardMaterial color="#e94b3c" />
      </mesh>
    </group>
  );
}

function InteractiveMarker({ object, onClick }: { object: InteractiveObject; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group position={object.position}>
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={object.color}
          emissive={object.color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {object.emoji}
      </Text>
      <pointLight position={[0, 0, 0]} color={object.color} intensity={2} distance={5} />
    </group>
  );
}

export default function ScrollPortfolio({ onBack }: ScrollPortfolioProps) {
  const [selectedObject, setSelectedObject] = useState<InteractiveObject | null>(null);

  const objects: InteractiveObject[] = [
    {
      id: '1',
      position: [0, 2.5, -6],
      title: 'Engineering Workspace',
      description: 'My desk where I work on railway and power engineering projects. Currently developing sustainable infrastructure solutions.',
      emoji: '💻',
      color: '#06b6d4'
    },
    {
      id: '2',
      position: [-7, 2, -8],
      title: 'Violin',
      description: 'My musical passion. Classical violin performance helps me maintain creativity and balance in my technical work.',
      emoji: '🎻',
      color: '#a855f7'
    },
    {
      id: '3',
      position: [-7, 4.5, 0],
      title: 'Racing Helmet',
      description: 'Motorsports enthusiast! I love the engineering behind high-performance vehicles and racing dynamics.',
      emoji: '🏎️',
      color: '#ef4444'
    },
    {
      id: '4',
      position: [7, 3, 5],
      title: 'Archery Target',
      description: 'Practicing archery teaches discipline, focus, and precision - skills that translate to engineering problem-solving.',
      emoji: '🎯',
      color: '#10b981'
    },
    {
      id: '5',
      position: [1.5, 2.3, -6],
      title: 'Psychology',
      description: 'Understanding people is as important as understanding systems. I regularly advise friends and family on personal matters.',
      emoji: '🧠',
      color: '#ec4899'
    },
    {
      id: '6',
      position: [-7, 2.5, 0],
      title: 'Knowledge Library',
      description: 'Continuous learning across engineering, music, psychology, and more. These books represent my interdisciplinary approach.',
      emoji: '📚',
      color: '#f59e0b'
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900">
      <button
        onClick={onBack}
        className="fixed top-6 left-6 z-50 text-white hover:text-cyan-400 transition-colors font-semibold bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-lg border border-slate-700 hover:border-cyan-500 shadow-xl"
      >
        ← Back to Choice
      </button>

      <div className="fixed top-6 right-6 z-40 bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-lg border border-slate-700 text-white text-sm">
        💡 Click on glowing orbs to learn more
      </div>

      <Canvas shadows camera={{ position: [0, 5, 15], fov: 60 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 20, 10]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[0, 10, 0]} intensity={0.5} color="#60a5fa" />
          <pointLight position={[-5, 3, -5]} intensity={0.5} color="#ff00ff" />
          <pointLight position={[5, 3, -5]} intensity={0.5} color="#00ffff" />

          <Room />
          
          {objects.map((obj) => (
            <InteractiveMarker
              key={obj.id}
              object={obj}
              onClick={() => setSelectedObject(obj)}
            />
          ))}

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={3}
            maxDistance={25}
            target={[0, 2, 0]}
          />
        </Suspense>
      </Canvas>

      {selectedObject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setSelectedObject(null)}
        >
          <div
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full border border-slate-600 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl shadow-lg"
                  style={{ backgroundColor: selectedObject.color }}
                >
                  {selectedObject.emoji}
                </div>
                <h2 className="text-4xl font-bold text-white">{selectedObject.title}</h2>
              </div>
              <button
                onClick={() => setSelectedObject(null)}
                className="text-slate-400 hover:text-white transition-colors bg-slate-700/50 p-2 rounded-lg hover:bg-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-slate-200 text-lg leading-relaxed">{selectedObject.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
