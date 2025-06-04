import React from 'react';
import CrosswordGrid from './components/CrosswordGrid';
import ClueList from './components/ClueList';
import { stubGrid } from './data/stubGrid';

const App: React.FC = () => {
  return (
    <div className="App" style={{ 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{ marginBottom: '10px' }}>Interactive Crossword Puzzle</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        Click on a square to start typing. Click again to switch between across and down.
      </p>
      
      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        <CrosswordGrid crossword={stubGrid} />
        <ClueList wordPlacements={stubGrid.word_placements} />
      </div>
    </div>
  );
};

export default App;