// src/App.tsx

import { useState } from 'react';
import LandingChoice from './components/LandingChoice';
import StandardPortfolio from './components/StandardPortfolio';
import Playground3D from './components/Playground3D';
import ScrollPortfolio from './components/ScrollPortfolio'; // <-- 1. Import the new component

// 2. Add 'scroll' to the list of possible modes
type Mode = 'choice' | 'standard' | '3d' | 'scroll';

function App() {
  const [mode, setMode] = useState<Mode>('choice');

  return (
    <>
      {mode === 'choice' && <LandingChoice onChoose={(selectedMode) => setMode(selectedMode)} />}
      {mode === 'standard' && <StandardPortfolio onBack={() => setMode('choice')} />}
      {mode === '3d' && <Playground3D onBack={() => setMode('choice')} />}
      
      {/* 3. Add the logic to render the new component */}
      {mode === 'scroll' && <ScrollPortfolio onBack={() => setMode('choice')} />}
    </>
  );
}

export default App;
