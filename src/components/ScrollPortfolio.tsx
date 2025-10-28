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

    // We modify the default camera directly via state.camera
    state.camera.position.z = 10 - offset * 40;
    state.camera.rotation.x = -0.2 - offset * 0.3;
    state.camera.rotation.y = offset * 0.1;
    // Ensure the camera looks generally forward, slightly down
    state.camera.lookAt(0, -2 - offset * 5, -10 - offset * 20);


    if (carRef.current) {
      carRef.current.position.y = -1 - offset * 5;
      carRef.current.rotation.x = offset * 0.5;
      carRef.current.rotation.y = offset * Math.PI;
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
    <div className="absolute top-0 left-0 w-full text-white pointer-events-none"> {/* Added pointer-events-none */}
      {/* Back Button - Allow pointer events */}
      <button
        onClick={onBack}
        className="fixed top-4 left-4 z-50 text-white hover:text-cyan-400 transition-colors font-semibold bg-slate-900/50 backdrop-blur-sm p-3 rounded-lg pointer-events-auto" // Added pointer-events-auto
      >
        ← Back to Choice
      </button>

      {/* Section 1 */}
      <div className="flex h-screen flex-col justify-center items-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Sean Ogta Goh
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto text-center">
          Scroll down to begin the journey...
        </p>
      </div>

      {/* Section 2 - About */}
      <div className="h-screen flex justify-center items-center">
        <div className="max-w-2xl p-8">
          <h2 className="text-4xl font-bold mb-4">About Me</h2>
          <p className="text-xl text-slate-300">
            With a diploma in Electrical Engineering (Power Engineering) and a degree in
            Sustainable Infrastructure Engineering (Land), I specialize in railway systems
            and sustainable infrastructure solutions.
          </p>
        </div>
      </div>

      {/* Section 3 - Skills */}
      <div className="h-screen flex justify-center items-center">
        <div className="max-w-2xl p-8 text-right">
          <h2 className="text-4xl font-bold mb-4">Skills & Passions</h2>
          <p className="text-xl text-slate-300">
            Beyond engineering, I'm a trained violinist with vocal and voice-over capabilities.
            This creative balance allows me to approach problems from multiple perspectives.
          </p>
        </div>
      </div>

      {/* Section 4 - Contact */}
      <div className="h-screen flex justify-center items-center">
        <div className="max-w-2xl p-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Let's Connect</h2>
          <p className="text-xl text-slate-300">
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
