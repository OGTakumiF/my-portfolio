// src/components/ScrollPortfolio.tsx

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, Html } from '@react-three/drei';
import { AE86Car } from './AE86Car'; // We'll re-use your car
import { Lighting } from './Room3D'; // Re-use the lighting
import * as THREE from 'three';

interface ScrollPortfolioProps {
  onBack: () => void;
}

/**
 * 3D Scene Component
 * This is what will be in the background
 */
function Scene() {
  const scroll = useScroll(); // This hook gives us scroll progress
  const carRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    // scroll.offset is the scroll progress from 0 (top) to 1 (bottom)
    const offset = scroll.offset;

    // Move the camera back as we scroll
    state.camera.position.z = 10 - offset * 40;

    // Move the car up and down
    if (carRef.current) {
      carRef.current.position.y = -1 - offset * 5;
      carRef.current.rotation.x = offset * 0.5;
      carRef.current.rotation.y = offset * Math.PI;
    }
    
    // Animate the camera's rotation
    state.camera.rotation.x = -0.2 - offset * 0.3;
    state.camera.rotation.y = offset * 0.1;
  });

  return (
    <>
      <Lighting />
      <AE86Car 
        ref={carRef}
        position={new THREE.Vector3(0, -1, 0)} 
        rotation={new THREE.Euler(0, 0, 0)} 
        onUpdate={() => {}} 
      />
    </>
  );
}

/**
 * HTML Content Component
 * This is the text overlay
 */
function HtmlContent({ onBack }: { onBack: () => void }) {
  return (
    <div className="absolute top-0 left-0 w-full text-white">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="fixed top-4 left-4 z-50 text-white hover:text-cyan-400 transition-colors font-semibold bg-slate-900/50 backdrop-blur-sm p-3 rounded-lg"
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
 * This combines the 3D and HTML
 */
export default function ScrollPortfolio({ onBack }: ScrollPortfolioProps) {
  return (
    // This div ensures the component is fixed and covers the screen
    <div className="fixed top-0 left-0 w-full h-full bg-slate-900">
      {/* pages={4} means the scrollable area is 4 screens tall.
        damping={0.1} adds a smooth "lag" to the scroll
      */}
      <ScrollControls pages={4} damping={0.1}>
        {/* Canvas for 3D content */}
        <Canvas shadows camera={{ position: [0, 0, 10], fov: 60 }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>

        {/* The <Html> component lets us layer HTML on top */}
        <Html fullscreen>
          <HtmlContent onBack={onBack} />
        </Html>
      </ScrollControls>
    </div>
  );
}
