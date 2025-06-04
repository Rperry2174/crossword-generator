import React from 'react';
import { CrosswordGrid as CrosswordGridType } from '../types/crossword';

interface CrosswordGridProps {
  crossword: CrosswordGridType;
}

const CrosswordGrid: React.FC<CrosswordGridProps> = ({ crossword }) => {
  return (
    <div className="crossword-grid">
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${crossword.width}, 30px)`,
        gap: '1px',
        backgroundColor: '#000',
        padding: '1px'
      }}>
        {crossword.grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: cell ? '#fff' : '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              {cell || ''}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CrosswordGrid;