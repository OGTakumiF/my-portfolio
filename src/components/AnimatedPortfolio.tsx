import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Stars, MeshDistortMaterial, OrbitControls, Environment } from '@react-three/drei';
import {
  Menu, X, Github, Linkedin, Mail, ChevronDown,
  Zap, Music, Heart, Target, Trophy, Briefcase
} from 'lucide-react';
import * as THREE from 'three';
import gsap from 'gsap';

interface Section {
  id: string;
  title: string;
  position: [number, number, number];
  color: string;
  icon: any;
  content: {
    heading: string;
    description: string;
    details: string[];
  };
}

const sections: Section[] = [
  {
    id: 'engineering',
    title: 'Engineering',
    position: [0, 0, 0],
    color: '#06b6d4',
    icon: Zap,
    content: {
      heading: 'Sustainable Infrastructure Engineer',
      description: 'Specialized in Railway Engineering & Power Systems',
      details: [
        'Bachelor in Sustainable Infrastructure Engineering (Land)',
        'Diploma in Electrical Engineering (Power)',
        'Railway systems, track design, and signaling expertise',
        'Power distribution and control systems',
        'Sustainable transport solutions'
      ]
    }
  },
  {
    id: 'music',
    title: 'Music',
    position: [8, 0, -8],
    color: '#a855f7',
    icon: Music,
    content: {
      heading: 'Musician & Performer',
      description: 'Trained violinist with vocal capabilities',
      details: [
        'Classical violin performance',
        'Vocal training and performance',
        'Voice-over work for media projects',
        'Music provides creative balance',
        'Interdisciplinary perspective'
      ]
    }
  },
  {
    id: 'psychology',
    title: 'Psychology',
    position: [-8, 0, -8],
    color: '#ef4444',
    icon: Heart,
    content: {
      heading: 'Psychology & Advisory',
      description: 'Passionate about helping others',
      details: [
        'Regular advisor for friends and family',
        'Community support and guidance',
        'Understanding human behavior',
        'Empathetic problem-solving',
        'Personal development focus'
      ]
    }
  },
  {
    id: 'motorsports',
    title: 'Motorsports',
    position: [8, 0, 8],
    color: '#f59e0b',
    icon: Briefcase,
    content: {
      heading: 'Motorsports Enthusiast',
      description: 'Speed, precision, and engineering excellence',
      details: [
        'Deep interest in vehicle dynamics',
        'Racing strategy and analytics',
        'High-performance engineering',
        'Motorsports technology',
        'Competitive spirit'
      ]
    }
  },
  {
    id: 'archery',
    title: 'Archery',
    position: [-8, 0, 8],
    color: '#10b981',
    icon: Target,
    content: {
      heading: 'Archery Practice',
      description: 'Focus, discipline, and precision',
      details: [
        'Regular archery practice',
        'Mental discipline training',
        'Precision and accuracy',
        'Focus development',
        'Translates to engineering mindset'
      ]
    }
  },
  {
    id: 'achievements',
    title: 'Achievements',
    position: [0, 0, -12],
    color: '#eab308',
    icon: Trophy,
    content: {
      heading: 'Multi-Disciplinary Excellence',
      description: 'Combining technical expertise with creative passion',
      details: [
        'Dual engineering qualifications',
        'Active community involvement',
        'Award-winning musician',
        'Technical leadership',
        'Continuous learner'
      ]
    }
  }
];

function FloatingOrb({ section, onClick, isActive }: {
  section: Section;
  onClick: () => void;
  isActive: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;

      const scale = hovered || isActive ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = -state.clock.elapsedTime * 0.5;
      const glowScale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      glowRef.current.scale.set(glowScale, glowScale, glowScale);
    }
  });

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group position={section.position}>
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <icosahedronGeometry args={[1.5, 1]} />
          <MeshDistortMaterial
            color={section.color}
            emissive={section.color}
            emissiveIntensity={isActive ? 0.8 : 0.4}
            roughness={0.2}
            metalness={0.8}
            distort={0.4}
            speed={2}
          />
        </mesh>

        <mesh ref={glowRef}>
          <icosahedronGeometry args={[2, 1]} />
          <meshBasicMaterial
            color={section.color}
            transparent
            opacity={isActive ? 0.3 : 0.15}
            wireframe
          />
        </mesh>

        <Text
          position={[0, 2.5, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {section.title}
        </Text>

        <pointLight
          position={[0, 0, 0]}
          color={section.color}
          intensity={isActive ? 3 : 1.5}
          distance={10}
        />
      </group>
    </Float>
  );
}

function Scene3D({
  activeSection,
  onSectionClick
}: {
  activeSection: Section | null;
  onSectionClick: (section: Section) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#60a5fa" />

      {sections.map((section) => (
        <FloatingOrb
          key={section.id}
          section={section}
          onClick={() => onSectionClick(section)}
          isActive={activeSection?.id === section.id}
        />
      ))}

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Environment preset="night" />
    </>
  );
}

function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-xl">Loading Experience...</p>
      </div>
    </div>
  );
}

export default function AnimatedPortfolio() {
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      gsap.to('.welcome-screen', {
        opacity: 0,
        duration: 1,
        onComplete: () => setShowWelcome(false)
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleSectionClick = (section: Section) => {
    setActiveSection(section);
    setShowMenu(false);

    if (controlsRef.current) {
      gsap.to(controlsRef.current.object.position, {
        x: section.position[0],
        y: section.position[1] + 5,
        z: section.position[2] + 10,
        duration: 1.5,
        ease: 'power2.inOut'
      });
    }
  };

  const resetView = () => {
    setActiveSection(null);
    if (controlsRef.current) {
      gsap.to(controlsRef.current.object.position, {
        x: 0,
        y: 8,
        z: 20,
        duration: 1.5,
        ease: 'power2.inOut'
      });
    }
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
      {showWelcome && (
        <div className="welcome-screen absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="text-center animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
              Sean Ogta Goh
            </h1>
            <p className="text-2xl md:text-3xl text-cyan-400 mb-6">
              Engineer • Musician • Advisor
            </p>
            <div className="flex items-center justify-center text-slate-400 animate-pulse">
              <ChevronDown className="w-8 h-8" />
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-slate-950/90 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <button
            onClick={resetView}
            className="text-white hover:text-cyan-400 transition-all duration-300 font-bold text-xl"
          >
            Sean Ogta Goh
          </button>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-white hover:text-cyan-400 transition-colors p-2"
          >
            {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {showMenu && (
        <div className="absolute top-20 right-4 z-40 bg-slate-900/95 backdrop-blur-md rounded-2xl p-6 border border-slate-700 shadow-2xl">
          <h3 className="text-white font-bold text-lg mb-4">Explore</h3>
          <div className="space-y-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section)}
                className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-lg transition-all hover:bg-slate-800 group"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: section.color + '20' }}
                >
                  <section.icon className="w-5 h-5" style={{ color: section.color }} />
                </div>
                <span className="text-white group-hover:text-cyan-400 transition-colors">
                  {section.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 text-center">
        <p className="text-white/80 text-sm bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-slate-700">
          Click on orbs to explore • Drag to rotate • Scroll to zoom
        </p>
      </div>

      <Canvas
        camera={{ position: [0, 8, 20], fov: 60 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#0a0a15']} />
          <fog attach="fog" args={['#0a0a15', 15, 50]} />

          <Scene3D activeSection={activeSection} onSectionClick={handleSectionClick} />

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            maxDistance={35}
            minDistance={8}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>

      {activeSection && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setActiveSection(null)}
        >
          <div
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 max-w-3xl w-full border-2 shadow-2xl transform transition-all animate-fade-in"
            style={{ borderColor: activeSection.color }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl"
                  style={{ backgroundColor: activeSection.color }}
                >
                  <activeSection.icon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {activeSection.content.heading}
                  </h2>
                  <p className="text-xl text-slate-300">{activeSection.content.description}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveSection(null)}
                className="text-slate-400 hover:text-white transition-colors bg-slate-700/50 p-3 rounded-xl hover:bg-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3 mb-8">
              {activeSection.content.details.map((detail, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 text-slate-200 text-lg"
                >
                  <div
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: activeSection.color }}
                  ></div>
                  <p>{detail}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center space-x-4 pt-6 border-t border-slate-700">
              <a
                href="https://www.linkedin.com/in/sean-ogta-goh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-all hover:scale-105"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-all hover:scale-105"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a
                href="mailto:your.email@example.com"
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-all hover:scale-105"
              >
                <Mail className="w-5 h-5" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
