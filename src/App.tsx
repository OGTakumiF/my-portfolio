import { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, Html } from '@react-three/drei';
import { AE86Car } from './components/AE86Car'; // Your 3D car
import { StandardPortfolio } from './components/StandardPortfolio'; // Your HTML content

// This scene will read the scroll position
function Scene() {
  const scroll = useScroll(); // Get scroll data

  useFrame((state) => {
    // scroll.offset is the current scroll position (0 to 1)
    // We can move the camera based on this value
    const scrollOffset = scroll.offset;
    
    // Example: Move camera backward as we scroll down
    state.camera.position.z = 10 - scrollOffset * 50; 
    
    // Example: Rotate the car
    // carRef.current.rotation.y = scrollOffset * Math.PI * 2;
  });

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 10]} intensity={2} />
      {/* You can place your 3D models here */}
      <AE86Car position={[0, -1, 0]} rotation={[0, 0, 0]} onUpdate={() => {}} />
    </>
  );
}

// This is just a regular React component
function HtmlContent() {
  return (
    <div style={{ color: 'white' }}>
      <h1 style={{ position: 'absolute', top: '10vh', left: '10vw', fontSize: '3rem' }}>
        Sean Ogta Goh
      </h1>
      <p style={{ position: 'absolute', top: '100vh', left: '20vw', fontSize: '2rem' }}>
        About Me
      </p>
      <p style={{ position: 'absolute', top: '200vh', right: '20vw', fontSize: '2rem' }}>
        My Projects
      </p>
      <p style={{ position: 'absolute', top: '300vh', left: '10vw', fontSize: '2rem' }}>
        Contact
      </p>
    </div>
  );
}

function App() {
  // Your logic for 'mode' is great. You'd just add this as a new 'mode'.
  // For this example, I'll just show the scroll page.

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
      {/* pages={4} means the scrollable area is 4 screens tall
        damping={0.1} adds a smooth "lag" to the scroll
      */}
      <ScrollControls pages={4} damping={0.1}>
        {/* Canvas for 3D content */}
        <Canvas shadows>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>

        {/* The <Html> component from drei lets you place HTML *over* the canvas.
          It will be synced with the <ScrollControls>.
        */}
        <Html style={{ width: '100%', top: 0, left: 0 }}>
          <HtmlContent />
          {/* You could even put your <StandardPortfolio /> component here,
              but you would need to remove its internal scrolling and 
              re-style it with absolute positioning based on scroll sections.
          */}
        </Html>
      </ScrollControls>
    </div>
  );
}

export default App;
