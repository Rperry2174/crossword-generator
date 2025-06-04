import React, { useState, useEffect, useCallback } from 'react';
import { CrosswordGrid as CrosswordGridType, Direction, WordPlacement } from '../types/crossword';

interface CrosswordGridProps {
  crossword: CrosswordGridType;
}

interface CellInfo {
  isBlank: boolean;
  number?: number;
  letter: string;
}

interface HighlightedWord {
  positions: { row: number; col: number }[];
  direction: Direction;
  wordIndex: number;
}

const CrosswordGrid: React.FC<CrosswordGridProps> = ({ crossword }) => {
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [highlightedWord, setHighlightedWord] = useState<HighlightedWord | null>(null);
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
  const [currentDirection, setCurrentDirection] = useState<Direction>(Direction.HORIZONTAL);

  // Initialize user grid with empty strings for fillable cells
  useEffect(() => {
    const newUserGrid = crossword.grid.map(row => 
      row.map(cell => cell !== null ? '' : null)
    );
    setUserGrid(newUserGrid as string[][]);
  }, [crossword]);

  // Create cell info with numbers
  const getCellInfo = (row: number, col: number): CellInfo => {
    const isBlank = crossword.grid[row][col] !== null;
    let number: number | undefined;
    
    // Find if this cell is the start of any word
    const wordAtPosition = crossword.word_placements.find(placement => 
      placement.start_row === row && placement.start_col === col
    );
    
    if (wordAtPosition) {
      number = wordAtPosition.number;
    }

    return {
      isBlank,
      number,
      letter: isBlank ? userGrid[row]?.[col] || '' : ''
    };
  };

  // Find word at a given position
  const findWordAtPosition = (row: number, col: number, direction: Direction): WordPlacement | null => {
    return crossword.word_placements.find(placement => {
      if (placement.direction !== direction) return false;
      
      if (direction === Direction.HORIZONTAL) {
        return placement.start_row === row && 
               col >= placement.start_col && 
               col < placement.start_col + placement.word.length;
      } else {
        return placement.start_col === col && 
               row >= placement.start_row && 
               row < placement.start_row + placement.word.length;
      }
    }) || null;
  };

  // Get all positions for a word
  const getWordPositions = (placement: WordPlacement): { row: number; col: number }[] => {
    const positions = [];
    for (let i = 0; i < placement.word.length; i++) {
      if (placement.direction === Direction.HORIZONTAL) {
        positions.push({ row: placement.start_row, col: placement.start_col + i });
      } else {
        positions.push({ row: placement.start_row + i, col: placement.start_col });
      }
    }
    return positions;
  };

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    const cellInfo = getCellInfo(row, col);
    if (!cellInfo.isBlank) return; // Can't click on black cells

    // If clicking the same cell, toggle direction
    if (activeCell && activeCell.row === row && activeCell.col === col) {
      const newDirection = currentDirection === Direction.HORIZONTAL ? Direction.VERTICAL : Direction.HORIZONTAL;
      const wordInNewDirection = findWordAtPosition(row, col, newDirection);
      if (wordInNewDirection) {
        setCurrentDirection(newDirection);
        const positions = getWordPositions(wordInNewDirection);
        const wordIndex = crossword.word_placements.indexOf(wordInNewDirection);
        setHighlightedWord({ positions, direction: newDirection, wordIndex });
      }
    } else {
      // New cell clicked
      setActiveCell({ row, col });
      
      // Try to find word in current direction, fallback to other direction
      let word = findWordAtPosition(row, col, currentDirection);
      let direction = currentDirection;
      
      if (!word) {
        direction = currentDirection === Direction.HORIZONTAL ? Direction.VERTICAL : Direction.HORIZONTAL;
        word = findWordAtPosition(row, col, direction);
        if (word) {
          setCurrentDirection(direction);
        }
      }
      
      if (word) {
        const positions = getWordPositions(word);
        const wordIndex = crossword.word_placements.indexOf(word);
        setHighlightedWord({ positions, direction, wordIndex });
      } else {
        setHighlightedWord(null);
      }
    }
  };

  // Handle keyboard input
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!highlightedWord || !activeCell) return;

    if (event.key === 'Backspace') {
      event.preventDefault();
      
      // Find current position in the highlighted word
      const currentIndex = highlightedWord.positions.findIndex(
        pos => pos.row === activeCell.row && pos.col === activeCell.col
      );
      
      if (currentIndex >= 0) {
        const newUserGrid = [...userGrid];
        newUserGrid[activeCell.row][activeCell.col] = '';
        setUserGrid(newUserGrid);
        
        // Move to previous cell if possible
        if (currentIndex > 0) {
          const prevPos = highlightedWord.positions[currentIndex - 1];
          setActiveCell({ row: prevPos.row, col: prevPos.col });
        }
      }
    } else if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
      event.preventDefault();
      
      // Find current position in the highlighted word
      const currentIndex = highlightedWord.positions.findIndex(
        pos => pos.row === activeCell.row && pos.col === activeCell.col
      );
      
      if (currentIndex >= 0) {
        const newUserGrid = [...userGrid];
        newUserGrid[activeCell.row][activeCell.col] = event.key.toUpperCase();
        setUserGrid(newUserGrid);
        
        // Move to next cell if possible
        if (currentIndex < highlightedWord.positions.length - 1) {
          const nextPos = highlightedWord.positions[currentIndex + 1];
          setActiveCell({ row: nextPos.row, col: nextPos.col });
        }
      }
    }
  }, [highlightedWord, activeCell, userGrid]);

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Check if cell is highlighted
  const isCellHighlighted = (row: number, col: number): boolean => {
    if (!highlightedWord) return false;
    return highlightedWord.positions.some(pos => pos.row === row && pos.col === col);
  };

  // Check if cell is active
  const isCellActive = (row: number, col: number): boolean => {
    if (!activeCell) return false;
    return activeCell.row === row && activeCell.col === col;
  };

  return (
    <div className="crossword-container">
      <div className="crossword-grid">
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${crossword.width}, 40px)`,
          gap: '2px',
          backgroundColor: '#000',
          padding: '2px'
        }}>
          {crossword.grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const cellInfo = getCellInfo(rowIndex, colIndex);
              const isHighlighted = isCellHighlighted(rowIndex, colIndex);
              const isActive = isCellActive(rowIndex, colIndex);
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: cellInfo.isBlank 
                      ? (isActive ? '#4CAF50' : isHighlighted ? '#E3F2FD' : '#fff')
                      : '#000',
                    border: cellInfo.isBlank ? '1px solid #ccc' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: cellInfo.isBlank ? 'pointer' : 'default',
                    position: 'relative'
                  }}
                >
                  {cellInfo.number && (
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      left: '2px',
                      fontSize: '10px',
                      fontWeight: 'normal',
                      color: '#666'
                    }}>
                      {cellInfo.number}
                    </span>
                  )}
                  {cellInfo.isBlank && cellInfo.letter}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CrosswordGrid;