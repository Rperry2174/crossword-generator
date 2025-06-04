import React, { useState, useEffect, useCallback } from 'react';
import { CrosswordGrid as CrosswordGridType, Direction, WordPlacement } from '../types/crossword';

interface Theme {
  colors: any;
  typography: any;
  spacing: any;
  borderRadius: any;
  shadow: any;
}

interface CrosswordGridProps {
  crossword: CrosswordGridType;
  theme: Theme;
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

const CrosswordGrid: React.FC<CrosswordGridProps> = ({ crossword, theme }) => {
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
    
    // Reset selection when crossword changes
    setActiveCell(null);
    setHighlightedWord(null);
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
    
    // Focus the crossword container to enable keyboard events
    const crosswordContainer = document.querySelector('.crossword-container') as HTMLElement;
    if (crosswordContainer) {
      crosswordContainer.focus();
    }

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
    // Only handle keyboard events if we have an active cell AND the crossword is focused
    if (!highlightedWord || !activeCell) return;
    
    // Don't capture keyboard events if user is typing in an input field
    const target = event.target as HTMLElement;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
      return;
    }

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
    <div 
      className="crossword-container"
      tabIndex={0}
      style={{ 
        outline: 'none',
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.xl,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadow.lg,
        padding: theme.spacing.lg
      }}
      onBlur={() => {
        // Clear selection when crossword loses focus
        setActiveCell(null);
        setHighlightedWord(null);
      }}
    >
      <div className="crossword-grid" style={{
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${crossword.width}, 48px)`,
          gap: '1px',
          backgroundColor: theme.colors.text.primary,
          padding: '1px',
          borderRadius: theme.borderRadius.md,
          boxShadow: theme.shadow.md
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
                    width: '48px',
                    height: '48px',
                    backgroundColor: cellInfo.isBlank 
                      ? (isActive 
                          ? theme.colors.primary
                          : isHighlighted 
                            ? `${theme.colors.primary}20`
                            : theme.colors.background)
                      : theme.colors.text.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: theme.typography.fontSize.lg,
                    fontWeight: theme.typography.fontWeight.bold,
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    cursor: cellInfo.isBlank ? 'pointer' : 'default',
                    position: 'relative',
                    transition: 'all 0.15s ease',
                    color: isActive 
                      ? theme.colors.text.inverse 
                      : theme.colors.text.primary,
                    textTransform: 'uppercase',
                    userSelect: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (cellInfo.isBlank && !isActive) {
                      e.currentTarget.style.backgroundColor = `${theme.colors.primary}10`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (cellInfo.isBlank && !isActive) {
                      e.currentTarget.style.backgroundColor = isHighlighted 
                        ? `${theme.colors.primary}20`
                        : theme.colors.background;
                    }
                  }}
                >
                  {cellInfo.number && (
                    <span style={{
                      position: 'absolute',
                      top: '3px',
                      left: '4px',
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: isActive 
                        ? theme.colors.text.inverse 
                        : theme.colors.text.secondary,
                      lineHeight: '1',
                      fontFamily: theme.typography.fontFamily
                    }}>
                      {cellInfo.number}
                    </span>
                  )}
                  <span style={{
                    marginTop: cellInfo.number ? '6px' : '0'
                  }}>
                    {cellInfo.isBlank && cellInfo.letter}
                  </span>
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