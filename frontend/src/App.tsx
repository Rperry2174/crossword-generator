import React from 'react';
import CrosswordGrid from './components/CrosswordGrid';
import { CrosswordGrid as CrosswordGridType, Direction } from './types/crossword';

const App: React.FC = () => {
  // Sample crossword data for demonstration
  const sampleCrossword: CrosswordGridType = {
    grid: Array(15).fill(null).map(() => Array(15).fill(null)),
    width: 15,
    height: 15,
    word_placements: []
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>Crossword Puzzle Generator</h1>
      <p>Phase 1: Basic crossword algorithm demonstration</p>
      <CrosswordGrid crossword={sampleCrossword} />
    </div>
  );
};

export default App;