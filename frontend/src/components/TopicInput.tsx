import React, { useState } from 'react';

interface Theme {
  colors: any;
  typography: any;
  spacing: any;
  borderRadius: any;
  shadow: any;
}

interface TopicInputProps {
  onGenerateFromTopic: (topic: string) => void;
  isLoading: boolean;
  theme: Theme;
}

const TopicInput: React.FC<TopicInputProps> = ({ onGenerateFromTopic, isLoading, theme }) => {
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    if (topic.trim().length < 3) {
      setError('Topic must be at least 3 characters long');
      return;
    }

    onGenerateFromTopic(topic.trim());
  };

  const exampleTopics = [
    'The Office',
    'World War II', 
    'Basketball',
    'Harry Potter',
    'Space Exploration',
    'Cooking',
    'Ancient Rome',
    'Rock Music'
  ];

  return (
    <div style={{ padding: theme.spacing.md }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: theme.spacing.lg }}>
          <label 
            htmlFor="topicInput" 
            style={{ 
              display: 'block', 
              marginBottom: theme.spacing.sm,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary
            }}
          >
            Enter a topic
          </label>
          <input
            id="topicInput"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., The Office, Basketball, World War II"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: theme.spacing.md,
              border: `2px solid ${error ? theme.colors.error : theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.base,
              backgroundColor: theme.colors.background,
              color: theme.colors.text.primary,
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              if (!error) {
                e.target.style.borderColor = theme.colors.primary;
                e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}15`;
              }
            }}
            onBlur={(e) => {
              if (!error) {
                e.target.style.borderColor = theme.colors.border;
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          <div style={{ 
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.tertiary,
            marginTop: theme.spacing.sm,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm
          }}>
            <span style={{ 
              display: 'inline-block',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: theme.colors.success
            }} />
            AI will generate 30 words with clues for your topic
          </div>
        </div>

        {error && (
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
              {error}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? theme.colors.secondary : theme.colors.success,
            color: theme.colors.text.inverse,
            border: 'none',
            padding: `${theme.spacing.md} ${theme.spacing.xl}`,
            borderRadius: theme.borderRadius.md,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: theme.typography.fontSize.base,
            fontWeight: theme.typography.fontWeight.semibold,
            transition: 'all 0.2s ease',
            boxShadow: theme.shadow.sm,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing.sm
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#047857';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = theme.shadow.md;
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = theme.colors.success;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = theme.shadow.sm;
            }
          }}
        >
          <span>✨</span>
          {isLoading ? 'Generating AI Crossword...' : 'Generate with AI'}
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
          Popular Topics
        </h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
          gap: theme.spacing.sm
        }}>
          {exampleTopics.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setTopic(example)}
              disabled={isLoading}
              style={{
                padding: theme.spacing.sm,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.sm,
                backgroundColor: theme.colors.background,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.secondary,
                transition: 'all 0.2s ease',
                textAlign: 'center',
                fontWeight: theme.typography.fontWeight.medium
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
                  e.currentTarget.style.borderColor = theme.colors.primary;
                  e.currentTarget.style.color = theme.colors.text.primary;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = theme.colors.background;
                  e.currentTarget.style.borderColor = theme.colors.border;
                  e.currentTarget.style.color = theme.colors.text.secondary;
                  e.currentTarget.style.transform = 'translateY(0)';
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
};

export default TopicInput;