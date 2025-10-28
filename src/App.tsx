import { useState } from 'react';
import LandingChoice from './components/LandingChoice';
import StandardPortfolio from './components/StandardPortfolio';
import Playground3D from './components/Playground3D';

type Mode = 'choice' | 'standard' | '3d';

function App() {
  const [mode, setMode] = useState<Mode>('choice');

  return (
    <>
      {mode === 'choice' && <LandingChoice onChoose={(selectedMode) => setMode(selectedMode)} />}
      {mode === 'standard' && <StandardPortfolio onBack={() => setMode('choice')} />}
      {mode === '3d' && <Playground3D onBack={() => setMode('choice')} />}
    </>
  );
}

export default App;
