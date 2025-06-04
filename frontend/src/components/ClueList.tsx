import React from 'react';
import { WordPlacement, Direction } from '../types/crossword';

interface ClueListProps {
  wordPlacements: WordPlacement[];
}

const ClueList: React.FC<ClueListProps> = ({ wordPlacements }) => {
  const acrossWords = wordPlacements
    .filter(placement => placement.direction === Direction.HORIZONTAL)
    .sort((a, b) => (a.number || 0) - (b.number || 0));
    
  const downWords = wordPlacements
    .filter(placement => placement.direction === Direction.VERTICAL)
    .sort((a, b) => (a.number || 0) - (b.number || 0));

  return (
    <div className="clue-lists" style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
      <div className="across-clues">
        <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>Across</h3>
        <div style={{ minWidth: '200px' }}>
          {acrossWords.map((placement) => (
            <div 
              key={`across-${placement.number}`}
              style={{ 
                marginBottom: '8px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
              <span style={{ fontWeight: 'bold', marginRight: '8px', minWidth: '20px' }}>
                {placement.number}.
              </span>
              <span>{placement.word}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="down-clues">
        <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>Down</h3>
        <div style={{ minWidth: '200px' }}>
          {downWords.map((placement) => (
            <div 
              key={`down-${placement.number}`}
              style={{ 
                marginBottom: '8px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
              <span style={{ fontWeight: 'bold', marginRight: '8px', minWidth: '20px' }}>
                {placement.number}.
              </span>
              <span>{placement.word}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClueList;