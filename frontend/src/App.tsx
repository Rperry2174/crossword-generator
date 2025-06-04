import React, { useState, useEffect } from 'react';
import CrosswordGrid from './components/CrosswordGrid';
import ClueList from './components/ClueList';
import WordInput from './components/WordInput';
import { CrosswordAPI } from './services/api';
import { stubGrid } from './data/stubGrid';
import { CrosswordGrid as CrosswordGridType } from './types/crossword';

const App: React.FC = () => {
  const [crossword, setCrossword] = useState<CrosswordGridType>(stubGrid);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [currentCrosswordId, setCurrentCrosswordId] = useState<string | null>(null);
  const [clues, setClues] = useState<{ [word: string]: string }>({});

  // Design system
  const theme = {
    colors: {
      primary: '#2563eb',
      primaryHover: '#1d4ed8',
      secondary: '#64748b',
      success: '#059669',
      error: '#dc2626',
      warning: '#d97706',
      background: '#ffffff',
      surface: '#f8fafc',
      surfaceHover: '#f1f5f9',
      border: '#e2e8f0',
      borderLight: '#f1f5f9',
      text: {
        primary: '#0f172a',
        secondary: '#475569',
        tertiary: '#94a3b8',
        inverse: '#ffffff'
      }
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px'
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px',
      '3xl': '64px'
    },
    borderRadius: {
      sm: '6px',
      md: '8px',
      lg: '12px',
      xl: '16px'
    },
    shadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
    }
  };

  // Check backend connectivity on component mount
  useEffect(() => {
    const checkBackend = async () => {
      const isConnected = await CrosswordAPI.healthCheck();
      setIsBackendConnected(isConnected);
    };
    checkBackend();
  }, []);

  const handleGenerateCrossword = async (words: string[], crosswordId?: string) => {
    setIsLoading(true);
    setError('');

    try {
      const newCrossword = await CrosswordAPI.generateCrossword(words);
      console.log('New crossword generated:', newCrossword.word_placements.length, 'words');
      console.log('Crossword ID provided:', crosswordId);
      
      setCrossword(newCrossword);
      setCurrentCrosswordId(crosswordId || null);
      
      // Always clear previous clues first
      console.log('Clearing previous clues...');
      setClues({});
      
      // Automatically load clues if crossword_id is available
      if (crosswordId) {
        console.log('Auto-loading clues for crossword ID:', crosswordId);
        try {
          const retrievedClues = await CrosswordAPI.getClues(crosswordId);
          console.log('Auto-loaded clues:', Object.keys(retrievedClues).length, 'clues');
          console.log('Clue sample:', Object.entries(retrievedClues).slice(0, 3));
          setClues(retrievedClues);
        } catch (clueError) {
          console.warn('Failed to auto-load clues:', clueError);
          // Ensure clues are empty if loading fails
          setClues({});
        }
      } else {
        console.log('No crossword ID provided, clues will remain empty');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate crossword');
      console.error('Crossword generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckPuzzle = async () => {
    if (!currentCrosswordId) {
      setError('No clues available. Please generate a crossword from a topic first.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const retrievedClues = await CrosswordAPI.getClues(currentCrosswordId);
      setClues(retrievedClues);
      console.log('Retrieved clues:', Object.keys(retrievedClues).length, 'clues');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve clues');
      console.error('Clue retrieval error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.background} 100%)`,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text.primary,
      lineHeight: '1.6'
    }}>
      {/* Header */}
      <header style={{
        borderBottom: `1px solid ${theme.colors.borderLight}`,
        backgroundColor: theme.colors.background,
        padding: `${theme.spacing.lg} 0`,
        marginBottom: theme.spacing['2xl']
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: `0 ${theme.spacing.lg}`
        }}>
          <h1 style={{ 
            fontSize: theme.typography.fontSize['3xl'],
            fontWeight: theme.typography.fontWeight.bold,
            margin: 0,
            marginBottom: theme.spacing.sm,
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Crossword Studio
          </h1>
          <p style={{ 
            fontSize: theme.typography.fontSize.lg,
            color: theme.colors.text.secondary,
            margin: 0,
            fontWeight: theme.typography.fontWeight.normal
          }}>
            Create intelligent crossword puzzles with AI-powered clues
          </p>
        </div>
      </header>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `0 ${theme.spacing.lg}`
      }}>
        {/* Backend Status - Redesigned */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm,
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          borderRadius: theme.borderRadius.md,
          marginBottom: theme.spacing.xl,
          backgroundColor: isBackendConnected ? '#f0fdf4' : '#fffbeb',
          border: `1px solid ${isBackendConnected ? '#bbf7d0' : '#fed7aa'}`,
          fontSize: theme.typography.fontSize.sm
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isBackendConnected ? theme.colors.success : theme.colors.warning
          }} />
          <span style={{ fontWeight: theme.typography.fontWeight.medium }}>
            {isBackendConnected ? 'Connected' : 'Offline Mode'}
          </span>
          <span style={{ color: theme.colors.text.tertiary }}>
            {isBackendConnected ? 'All features available' : 'Using sample data'}
          </span>
        </div>

        {/* Word Input Section */}
        <section style={{ marginBottom: theme.spacing['2xl'] }}>
          <WordInput 
            onGenerateCrossword={handleGenerateCrossword} 
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setError={setError}
            theme={theme}
          />
        </section>

        {/* Error Display - Redesigned */}
        {error && (
          <div style={{
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            marginBottom: theme.spacing.xl,
            backgroundColor: '#fef2f2',
            border: `1px solid #fecaca`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: theme.spacing.sm
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: theme.colors.error,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>!</span>
            </div>
            <div>
              <div style={{ 
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.error,
                marginBottom: '4px'
              }}>
                Error
              </div>
              <div style={{ color: '#991b1b', fontSize: theme.typography.fontSize.sm }}>
                {error}
              </div>
            </div>
          </div>
        )}

        {/* Loading State - Redesigned */}
        {isLoading && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: theme.spacing['2xl'],
            gap: theme.spacing.md
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: `3px solid ${theme.colors.borderLight}`,
              borderTop: `3px solid ${theme.colors.primary}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ 
              color: theme.colors.text.secondary,
              fontSize: theme.typography.fontSize.lg,
              margin: 0,
              fontWeight: theme.typography.fontWeight.medium
            }}>
              Generating your crossword puzzle...
            </p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* Crossword Display */}
        {!isLoading && (
          <section>
            {/* Action Bar */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: theme.spacing.lg,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.background,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.border}`,
              boxShadow: theme.shadow.sm
            }}>
              <p style={{ 
                margin: 0, 
                color: theme.colors.text.secondary,
                fontSize: theme.typography.fontSize.sm
              }}>
                Click any square to start solving • Press Tab to change direction
              </p>
              
              {currentCrosswordId && Object.keys(clues).length === 0 && (
                <button
                  onClick={handleCheckPuzzle}
                  disabled={isLoading}
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.text.inverse,
                    border: 'none',
                    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                    borderRadius: theme.borderRadius.md,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.semibold,
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.sm,
                    transition: 'all 0.2s ease',
                    boxShadow: theme.shadow.sm
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = theme.shadow.md;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = theme.colors.primary;
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = theme.shadow.sm;
                    }
                  }}
                >
                  <span>🔍</span>
                  Load Clues
                </button>
              )}
            </div>
            
            {/* Main Content Grid */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: theme.spacing['2xl'],
              alignItems: 'flex-start'
            }}>
              <CrosswordGrid 
                key={`crossword-${crossword.word_placements.map(w => w.word).join('-')}`}
                crossword={crossword}
                theme={theme}
              />
              <ClueList 
                key={`clues-${crossword.word_placements.map(w => w.word).join('-')}-${Object.keys(clues).length}-${currentCrosswordId || 'no-id'}`}
                wordPlacements={crossword.word_placements}
                clues={clues}
                theme={theme}
              />
            </div>
            
            {/* Stats Card */}
            <div style={{ 
              marginTop: theme.spacing.xl,
              padding: theme.spacing.lg,
              backgroundColor: theme.colors.background,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.border}`,
              boxShadow: theme.shadow.sm
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing['2xl'],
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: theme.colors.primary
                  }} />
                  <span><strong>{crossword.word_placements.length}</strong> words placed</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                  <span>→</span>
                  <span><strong>{crossword.word_placements.filter(w => w.direction?.toString() === 'horizontal').length}</strong> across</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                  <span>↓</span>
                  <span><strong>{crossword.word_placements.filter(w => w.direction?.toString() === 'vertical').length}</strong> down</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default App;