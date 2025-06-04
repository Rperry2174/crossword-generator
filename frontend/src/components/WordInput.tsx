import React, { useState } from 'react';
import TabContainer from './TabContainer';
import TopicInput from './TopicInput';
import { CrosswordAPI } from '../services/api';

interface Theme {
  colors: any;
  typography: any;
  spacing: any;
  borderRadius: any;
  shadow: any;
}

interface WordInputProps {
  onGenerateCrossword: (words: string[], crosswordId?: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  theme: Theme;
}

const WordInput: React.FC<WordInputProps> = ({ onGenerateCrossword, isLoading, setIsLoading, setError, theme }) => {
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
      const result = await CrosswordAPI.generateWordsFromTopic(topic);
      onGenerateCrossword(result.words, result.crosswordId);
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
    <div style={{ padding: theme.spacing.md }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: theme.spacing.lg }}>
          <label 
            htmlFor="wordInput" 
            style={{ 
              display: 'block', 
              marginBottom: theme.spacing.sm,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary
            }}
          >
            Enter words (comma-separated)
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
              padding: theme.spacing.md,
              border: `2px solid ${localError ? theme.colors.error : theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.base,
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              backgroundColor: theme.colors.background,
              color: theme.colors.text.primary,
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              if (!localError) {
                e.target.style.borderColor = theme.colors.primary;
                e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}15`;
              }
            }}
            onBlur={(e) => {
              if (!localError) {
                e.target.style.borderColor = theme.colors.border;
                e.target.style.boxShadow = 'none';
              }
            }}
          />
        </div>

        {localError && (
          <div style={{
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            marginBottom: theme.spacing.lg,
            backgroundColor: '#fef2f2',
            border: `1px solid #fecaca`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: theme.spacing.sm
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: theme.colors.error,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              <span style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>!</span>
            </div>
            <div style={{ 
              fontSize: theme.typography.fontSize.sm,
              color: '#991b1b'
            }}>
              {localError}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? theme.colors.secondary : theme.colors.primary,
            color: theme.colors.text.inverse,
            border: 'none',
            padding: `${theme.spacing.md} ${theme.spacing.xl}`,
            borderRadius: theme.borderRadius.md,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: theme.typography.fontSize.base,
            fontWeight: theme.typography.fontWeight.semibold,
            transition: 'all 0.2s ease',
            boxShadow: theme.shadow.sm,
            width: '100%'
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
          {isLoading ? 'Generating...' : 'Generate Crossword'}
        </button>
      </form>

      <div style={{ marginTop: theme.spacing.xl }}>
        <h4 style={{ 
          margin: `0 0 ${theme.spacing.md} 0`, 
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.text.secondary,
          fontWeight: theme.typography.fontWeight.semibold,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Quick Examples
        </h4>
        <div style={{ 
          display: 'grid',
          gap: theme.spacing.sm
        }}>
          {exampleWords.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setWordInput(example)}
              disabled={isLoading}
              style={{
                textAlign: 'left',
                padding: theme.spacing.sm,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.sm,
                backgroundColor: theme.colors.background,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: theme.typography.fontSize.xs,
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                color: theme.colors.text.secondary,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
                  e.currentTarget.style.borderColor = theme.colors.primary;
                  e.currentTarget.style.color = theme.colors.text.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = theme.colors.background;
                  e.currentTarget.style.borderColor = theme.colors.border;
                  e.currentTarget.style.color = theme.colors.text.secondary;
                }
              }}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xl,
      border: `1px solid ${theme.colors.border}`,
      boxShadow: theme.shadow.lg,
      overflow: 'hidden'
    }}>
      <div style={{
        padding: theme.spacing.lg,
        borderBottom: `1px solid ${theme.colors.borderLight}`
      }}>
        <h2 style={{ 
          margin: 0,
          fontSize: theme.typography.fontSize.xl,
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.text.primary
        }}>
          Create Your Crossword
        </h2>
        <p style={{
          margin: `${theme.spacing.sm} 0 0 0`,
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.text.secondary,
          lineHeight: '1.5'
        }}>
          Generate from a topic with AI clues, or input your own words
        </p>
      </div>
      
      <TabContainer
        defaultTab="topic"
        theme={theme}
        tabs={[
          {
            id: 'topic',
            label: 'From Topic',
            icon: '🎯',
            content: (
              <TopicInput 
                onGenerateFromTopic={handleTopicGeneration}
                isLoading={isLoading}
                theme={theme}
              />
            )
          },
          {
            id: 'custom',
            label: 'Custom Words',
            icon: '✏️',
            content: customWordsTab
          }
        ]}
      />
    </div>
  );
};

export default WordInput;