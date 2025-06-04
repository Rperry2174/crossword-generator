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
      setCrossword(newCrossword);
      setCurrentCrosswordId(crosswordId || null);
      setClues({}); // Clear previous clues
      
      // Automatically load clues if crossword_id is available
      if (crosswordId) {
        try {
          const retrievedClues = await CrosswordAPI.getClues(crosswordId);
          setClues(retrievedClues);
          console.log('Auto-loaded clues:', Object.keys(retrievedClues).length, 'clues');
        } catch (clueError) {
          console.warn('Failed to auto-load clues:', clueError);
          // Don't set error here, just continue without clues
        }
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
    <div className="App" style={{ 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{ marginBottom: '10px' }}>Dynamic Crossword Generator</h1>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Enter your own words to generate a custom crossword puzzle, or try the examples below.
      </p>

      {/* Backend status indicator */}
      <div style={{
        padding: '8px 12px',
        borderRadius: '4px',
        marginBottom: '20px',
        backgroundColor: isBackendConnected ? '#e8f5e8' : '#fff3e0',
        border: `1px solid ${isBackendConnected ? '#4caf50' : '#ff9800'}`,
        fontSize: '14px'
      }}>
        Backend Status: {isBackendConnected ? '✅ Connected' : '⚠️ Disconnected (using sample data)'}
        {!isBackendConnected && (
          <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
            To use custom words, start the backend server: <code>cd backend && pipenv run python src/api.py</code>
          </div>
        )}
      </div>

      {/* Word input form */}
      <WordInput 
        onGenerateCrossword={handleGenerateCrossword} 
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setError={setError}
      />

      {/* Error display */}
      {error && (
        <div style={{
          color: '#d32f2f',
          marginBottom: '20px',
          padding: '12px',
          backgroundColor: '#ffebee',
          border: '1px solid #ffcdd2',
          borderRadius: '4px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          fontSize: '16px',
          color: '#666'
        }}>
          🧩 Generating your crossword puzzle...
        </div>
      )}

      {/* Crossword display */}
      {!isLoading && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Click on a square to start typing. Click again to switch between across and down.
            </p>
            
            {currentCrosswordId && Object.keys(clues).length === 0 && (
              <button
                onClick={handleCheckPuzzle}
                disabled={isLoading}
                style={{
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                🔍 Check Puzzle
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
            <CrosswordGrid 
              key={`crossword-${crossword.word_placements.map(w => w.word).join('-')}`}
              crossword={crossword} 
            />
            <ClueList 
              key={`clues-${crossword.word_placements.map(w => w.word).join('-')}`}
              wordPlacements={crossword.word_placements}
              clues={clues}
            />
          </div>
          
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#666'
          }}>
            <strong>Crossword Stats:</strong> {crossword.word_placements.length} words placed, 
            using {crossword.word_placements.filter(w => w.direction?.toString() === 'horizontal').length} across 
            and {crossword.word_placements.filter(w => w.direction?.toString() === 'vertical').length} down
          </div>
        </>
      )}
    </div>
  );
};

export default App;