import React, { useState } from 'react';
import TabContainer from './TabContainer';
import TopicInput from './TopicInput';
import { CrosswordAPI } from '../services/api';

interface WordInputProps {
  onGenerateCrossword: (words: string[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string) => void;
}

const WordInput: React.FC<WordInputProps> = ({ onGenerateCrossword, isLoading, setIsLoading, setError }) => {
  const [wordInput, setWordInput] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!wordInput.trim()) {
      setLocalError('Please enter some words');
      return;
    }

    // Parse comma-separated words
    const words = wordInput
      .split(',')
      .map(word => word.trim().toUpperCase())
      .filter(word => word.length > 0);

    // Validate words
    if (words.length < 2) {
      setLocalError('Please enter at least 2 words');
      return;
    }

    // Check for invalid characters
    const invalidWords = words.filter(word => !/^[A-Z]+$/.test(word));
    if (invalidWords.length > 0) {
      setLocalError(`Invalid words (only letters allowed): ${invalidWords.join(', ')}`);
      return;
    }

    // Check for short words
    const shortWords = words.filter(word => word.length < 2);
    if (shortWords.length > 0) {
      setLocalError(`Words too short (minimum 2 letters): ${shortWords.join(', ')}`);
      return;
    }

    onGenerateCrossword(words);
  };

  const handleTopicGeneration = async (topic: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const words = await CrosswordAPI.generateWordsFromTopic(topic);
      onGenerateCrossword(words);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate words from topic');
    } finally {
      setIsLoading(false);
    }
  };

  const exampleWords = [
    'PYTHON,CODE,TEST,GRID,WORD,PLACE,CROSS',
    'HELLO,WORLD,TIME,LOVE,PEACE',
    'CAR,BIKE,TRAIN,PLANE,BOAT',
    'RED,BLUE,GREEN,YELLOW,PURPLE'
  ];

  // Custom words tab content
  const customWordsTab = (
    <>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label 
            htmlFor="wordInput" 
            style={{ 
              display: 'block', 
              marginBottom: '5px',
              fontWeight: 'bold'
            }}
          >
            Enter words (comma-separated):
          </label>
          <input
            id="wordInput"
            type="text"
            value={wordInput}
            onChange={(e) => setWordInput(e.target.value)}
            placeholder="e.g., PYTHON,CODE,TEST,GRID,WORD"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
              fontFamily: 'monospace'
            }}
          />
        </div>

        {localError && (
          <div style={{
            color: '#d32f2f',
            marginBottom: '15px',
            padding: '8px',
            backgroundColor: '#ffebee',
            border: '1px solid #ffcdd2',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {localError}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? '#ccc' : '#2196F3',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? 'Generating...' : 'Generate Crossword'}
        </button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
          <strong>Examples to try:</strong>
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {exampleWords.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setWordInput(example)}
              disabled={isLoading}
              style={{
                textAlign: 'left',
                padding: '5px 8px',
                border: '1px solid #ddd',
                borderRadius: '3px',
                backgroundColor: 'white',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: '#333'
              }}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div style={{
      marginBottom: '30px',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Generate Crossword Puzzle</h3>
      
      <TabContainer
        defaultTab="topic"
        tabs={[
          {
            id: 'topic',
            label: '🎯 From Topic',
            content: (
              <TopicInput 
                onGenerateFromTopic={handleTopicGeneration}
                isLoading={isLoading}
              />
            )
          },
          {
            id: 'custom',
            label: '✏️ Custom Words',
            content: customWordsTab
          }
        ]}
      />
    </div>
  );
};

export default WordInput;