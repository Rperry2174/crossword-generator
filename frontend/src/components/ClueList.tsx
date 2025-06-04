import React from 'react';
import { WordPlacement, Direction } from '../types/crossword';

interface ClueListProps {
  wordPlacements: WordPlacement[];
  clues?: { [word: string]: string };
}

const ClueList: React.FC<ClueListProps> = ({ wordPlacements, clues = {} }) => {
  console.log('ClueList received word placements:', wordPlacements.length, 'words');
  console.log('ClueList received clues:', Object.keys(clues).length, 'clues');
  
  const hasClues = Object.keys(clues).length > 0;
  
  const acrossWords = wordPlacements
    .filter(placement => placement.direction === Direction.HORIZONTAL)
    .sort((a, b) => (a.number || 0) - (b.number || 0));
    
  const downWords = wordPlacements
    .filter(placement => placement.direction === Direction.VERTICAL)
    .sort((a, b) => (a.number || 0) - (b.number || 0));
    
  console.log('Across words:', acrossWords.length, 'Down words:', downWords.length);

  const renderClueText = (placement: any) => {
    if (hasClues && clues[placement.word]) {
      return clues[placement.word];
    }
    
    if (hasClues) {
      return `[No clue available for ${placement.word}]`;
    }
    
    // When no clues are loaded, show the word (for custom word lists) or hint about topics
    return `${placement.word} (generate from topic for clues)`;
  };

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
              <span style={{ 
                color: hasClues ? (clues[placement.word] ? '#000' : '#d32f2f') : '#666',
                fontStyle: hasClues ? 'normal' : 'italic'
              }}>
                {renderClueText(placement)}
              </span>
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
              <span style={{ 
                color: hasClues ? (clues[placement.word] ? '#000' : '#d32f2f') : '#666',
                fontStyle: hasClues ? 'normal' : 'italic'
              }}>
                {renderClueText(placement)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClueList;