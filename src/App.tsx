// src/App.tsx

import { useState } from 'react';
import LandingChoice from './components/LandingChoice';
import StandardPortfolio from './components/StandardPortfolio';
import Playground3D from './components/Playground3D';
import ScrollPortfolio from './components/ScrollPortfolio';
import EnhancedRoom3D from './components/EnhancedRoom3D';

type Mode = 'choice' | 'standard' | '3d' | 'scroll' | 'room';

function App() {
  const [mode, setMode] = useState<Mode>('choice');

  return (
    <>
      {mode === 'choice' && <LandingChoice onChoose={(selectedMode) => setMode(selectedMode)} />}
      {mode === 'standard' && <StandardPortfolio onBack={() => setMode('choice')} />}
      {mode === '3d' && <Playground3D onBack={() => setMode('choice')} />}
      {mode === 'scroll' && <ScrollPortfolio onBack={() => setMode('choice')} />}
      {mode === 'room' && <EnhancedRoom3D onBack={() => setMode('choice')} />}
    </>
  );
}

export default App;
