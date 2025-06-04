import React from 'react';
import { WordPlacement, Direction } from '../types/crossword';

interface Theme {
  colors: any;
  typography: any;
  spacing: any;
  borderRadius: any;
  shadow: any;
}

interface ClueListProps {
  wordPlacements: WordPlacement[];
  clues?: { [word: string]: string };
  theme: Theme;
}

const ClueList: React.FC<ClueListProps> = ({ wordPlacements, clues = {}, theme }) => {
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
    <div style={{
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xl,
      border: `1px solid ${theme.colors.border}`,
      boxShadow: theme.shadow.lg,
      overflow: 'hidden',
      minWidth: '400px'
    }}>
      {/* Header */}
      <div style={{
        padding: theme.spacing.lg,
        borderBottom: `1px solid ${theme.colors.borderLight}`,
        backgroundColor: theme.colors.surface
      }}>
        <h2 style={{
          margin: 0,
          fontSize: theme.typography.fontSize.xl,
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.text.primary
        }}>
          Clues
        </h2>
        <p style={{
          margin: `${theme.spacing.sm} 0 0 0`,
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.text.secondary
        }}>
          {hasClues ? 'AI-generated clues for your crossword' : 'Generate from topic to see clues'}
        </p>
      </div>

      {/* Clue Lists */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.xl,
        padding: theme.spacing.lg
      }}>
        {/* Across Clues */}
        <div className="across-clues">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            marginBottom: theme.spacing.md
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: theme.colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                color: theme.colors.text.inverse,
                fontSize: theme.typography.fontSize.xs,
                fontWeight: theme.typography.fontWeight.bold
              }}>
                →
              </span>
            </div>
            <h3 style={{ 
              margin: 0,
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary
            }}>
              Across
            </h3>
            <span style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary,
              backgroundColor: theme.colors.surface,
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              borderRadius: theme.borderRadius.sm
            }}>
              {acrossWords.length}
            </span>
          </div>
          
          <div style={{ 
            display: 'grid',
            gap: theme.spacing.sm
          }}>
            {acrossWords.map((placement) => (
              <div 
                key={`across-${placement.number}`}
                style={{ 
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: theme.spacing.md,
                  padding: theme.spacing.sm,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: hasClues && clues[placement.word] 
                    ? 'transparent' 
                    : theme.colors.surface,
                  border: hasClues && !clues[placement.word] 
                    ? `1px solid ${theme.colors.warning}20`
                    : 'none'
                }}
              >
                <span style={{ 
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.primary,
                  minWidth: '24px',
                  textAlign: 'right'
                }}>
                  {placement.number}.
                </span>
                <span style={{ 
                  fontSize: theme.typography.fontSize.sm,
                  color: hasClues 
                    ? (clues[placement.word] ? theme.colors.text.primary : theme.colors.warning)
                    : theme.colors.text.secondary,
                  fontStyle: hasClues ? 'normal' : 'italic',
                  lineHeight: '1.5',
                  flex: 1
                }}>
                  {renderClueText(placement)}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Down Clues */}
        <div className="down-clues">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            marginBottom: theme.spacing.md
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: theme.colors.secondary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                color: theme.colors.text.inverse,
                fontSize: theme.typography.fontSize.xs,
                fontWeight: theme.typography.fontWeight.bold
              }}>
                ↓
              </span>
            </div>
            <h3 style={{ 
              margin: 0,
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary
            }}>
              Down
            </h3>
            <span style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary,
              backgroundColor: theme.colors.surface,
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              borderRadius: theme.borderRadius.sm
            }}>
              {downWords.length}
            </span>
          </div>
          
          <div style={{ 
            display: 'grid',
            gap: theme.spacing.sm
          }}>
            {downWords.map((placement) => (
              <div 
                key={`down-${placement.number}`}
                style={{ 
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: theme.spacing.md,
                  padding: theme.spacing.sm,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: hasClues && clues[placement.word] 
                    ? 'transparent' 
                    : theme.colors.surface,
                  border: hasClues && !clues[placement.word] 
                    ? `1px solid ${theme.colors.warning}20`
                    : 'none'
                }}
              >
                <span style={{ 
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.secondary,
                  minWidth: '24px',
                  textAlign: 'right'
                }}>
                  {placement.number}.
                </span>
                <span style={{ 
                  fontSize: theme.typography.fontSize.sm,
                  color: hasClues 
                    ? (clues[placement.word] ? theme.colors.text.primary : theme.colors.warning)
                    : theme.colors.text.secondary,
                  fontStyle: hasClues ? 'normal' : 'italic',
                  lineHeight: '1.5',
                  flex: 1
                }}>
                  {renderClueText(placement)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClueList;