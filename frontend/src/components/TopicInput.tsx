import React, { useState } from 'react';
import LLMStatus from './LLMStatus';

interface TopicInputProps {
  onGenerateFromTopic: (topic: string) => void;
  isLoading: boolean;
}

const TopicInput: React.FC<TopicInputProps> = ({ onGenerateFromTopic, isLoading }) => {
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

  const llmProvider = process.env.REACT_APP_LLM_PROVIDER || 'mock';

  return (
    <div>
      <LLMStatus provider={llmProvider} />
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label 
            htmlFor="topicInput" 
            style={{ 
              display: 'block', 
              marginBottom: '5px',
              fontWeight: 'bold'
            }}
          >
            Enter a topic:
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
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          <div style={{ 
            fontSize: '12px', 
            color: '#666', 
            marginTop: '5px' 
          }}>
            AI will generate 30 crossword words related to your topic
          </div>
        </div>

        {error && (
          <div style={{
            color: '#d32f2f',
            marginBottom: '15px',
            padding: '8px',
            backgroundColor: '#ffebee',
            border: '1px solid #ffcdd2',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? 'Generating Topic Crossword...' : 'Generate from Topic'}
        </button>
      </form>

      <div style={{ marginTop: '25px' }}>
        <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>
          <strong>Popular topics to try:</strong>
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '8px' 
        }}>
          {exampleTopics.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setTopic(example)}
              disabled={isLoading}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                color: '#333',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
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