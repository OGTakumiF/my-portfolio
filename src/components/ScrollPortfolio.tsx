import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, Html, PerspectiveCamera } from '@react-three/drei'; // <-- Added PerspectiveCamera import
import { AE86Car } from './AE86Car';
import { Lighting } from './Room3D';
import * as THREE from 'three';

interface ScrollPortfolioProps {
  onBack: () => void;
}

/**
 * 3D Scene Component
 */
function Scene() {
  const scroll = useScroll();
  const carRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const offset = scroll.offset;

    state.camera.position.x = Math.sin(offset * Math.PI) * 5;
    state.camera.position.y = 3 + offset * 3;
    state.camera.position.z = 15 - offset * 30;
    state.camera.lookAt(0, -offset * 3, -offset * 10);

    if (carRef.current) {
      carRef.current.position.y = -1 - offset * 8;
      carRef.current.rotation.x = offset * 0.3;
      carRef.current.rotation.y = offset * Math.PI * 2;
    }
  });

  return (
    <>
      <Lighting />
      {/* Ensure the onUpdate prop exists, even if empty */}
      <AE86Car
        ref={carRef}
        position={new THREE.Vector3(0, -1, 0)}
        rotation={new THREE.Euler(0, 0, 0)}
        onUpdate={() => {}}
      />
      {/* Add a default camera */}
      <PerspectiveCamera makeDefault fov={60} position={[0, 0, 10]} />
    </>
  );
}

/**
 * HTML Content Component
 */
function HtmlContent({ onBack }: { onBack: () => void }) {
  return (
    <div className="absolute top-0 left-0 w-full text-white pointer-events-none">
      <button
        onClick={onBack}
        className="fixed top-4 left-4 z-50 text-white hover:text-cyan-400 transition-colors font-semibold bg-slate-900/80 backdrop-blur-md p-3 rounded-lg border border-slate-700 hover:border-cyan-500 pointer-events-auto shadow-xl"
      >
        ← Back to Choice
      </button>

      {/* Section 1 */}
      <div className="flex h-screen flex-col justify-center items-center">
        <div className="bg-slate-900/50 backdrop-blur-md p-12 rounded-2xl border border-slate-700">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 text-center">
            Sean Ogta Goh
          </h1>
          <p className="text-xl text-cyan-300 mb-4 text-center">
            Engineer • Musician • Advisor
          </p>
          <p className="text-lg text-slate-400 text-center">
            Scroll down to begin the journey...
          </p>
        </div>
      </div>

      {/* Section 2 - About */}
      <div className="h-screen flex justify-center items-center">
        <div className="max-w-3xl p-10 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-emerald-500/30 shadow-2xl">
          <h2 className="text-5xl font-bold mb-6 text-emerald-300">About Me</h2>
          <p className="text-xl text-slate-200 leading-relaxed">
            With a diploma in Electrical Engineering (Power Engineering) and a degree in
            Sustainable Infrastructure Engineering (Land), I specialize in railway systems
            and sustainable infrastructure solutions.
          </p>
        </div>
      </div>

      {/* Section 3 - Skills */}
      <div className="h-screen flex justify-center items-center">
        <div className="max-w-3xl p-10 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-orange-500/30 shadow-2xl text-right">
          <h2 className="text-5xl font-bold mb-6 text-orange-300">Skills & Passions</h2>
          <p className="text-xl text-slate-200 leading-relaxed">
            Beyond engineering, I'm a trained violinist with vocal and voice-over capabilities.
            This creative balance allows me to approach problems from multiple perspectives.
          </p>
        </div>
      </div>

      {/* Section 4 - Contact */}
      <div className="h-screen flex justify-center items-center">
        <div className="max-w-3xl p-10 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-cyan-500/30 shadow-2xl text-center">
          <h2 className="text-5xl font-bold mb-6 text-cyan-300">Let's Connect</h2>
          <p className="text-xl text-slate-200 leading-relaxed">
            I'm always open to discussing new projects, opportunities, or just having a chat.
          </p>
        </div>
      </div>
    </div>
  );
}


/**
 * Main Component
 */
export default function ScrollPortfolio({ onBack }: ScrollPortfolioProps) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-slate-900">
      <ScrollControls pages={4} damping={0.1}>
        {/* Removed camera prop from Canvas */}
        <Canvas shadows>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>

        {/* Ensure Html component uses fullscreen */}
        <Html fullscreen style={{ pointerEvents: 'none' }}> {/* Added pointer-events: none style */}
          <HtmlContent onBack={onBack} />
        </Html>
      </ScrollControls>
    </div>
  );
}
