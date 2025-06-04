import React, { useState, useEffect } from 'react';

interface LLMStatusProps {
  provider: string;
}

const LLMStatus: React.FC<LLMStatusProps> = ({ provider }) => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [details, setDetails] = useState('');

  useEffect(() => {
    checkLLMStatus();
  }, [provider]);

  const checkLLMStatus = () => {
    setStatus('checking');
    
    // Check if API keys are configured
    const hasOpenAIKey = !!process.env.REACT_APP_OPENAI_API_KEY;
    const hasAnthropicKey = !!process.env.REACT_APP_ANTHROPIC_API_KEY;
    const ollamaUrl = process.env.REACT_APP_OLLAMA_BASE_URL || 'http://localhost:11434';
    
    switch (provider) {
      case 'openai':
        if (hasOpenAIKey) {
          setStatus('connected');
          setDetails('OpenAI API configured');
        } else {
          setStatus('disconnected');
          setDetails('OpenAI API key not found in environment');
        }
        break;
        
      case 'anthropic':
        if (hasAnthropicKey) {
          setStatus('connected');
          setDetails('Anthropic API configured');
        } else {
          setStatus('disconnected');
          setDetails('Anthropic API key not found in environment');
        }
        break;
        
      case 'ollama':
        setStatus('connected');
        setDetails(`Ollama configured at ${ollamaUrl}`);
        break;
        
      case 'mock':
      default:
        setStatus('connected');
        setDetails('Using mock LLM data (no API calls)');
        break;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return '#4caf50';
      case 'disconnected': return '#f44336';
      case 'checking': return '#ff9800';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected': return '✅';
      case 'disconnected': return '❌';
      case 'checking': return '⏳';
    }
  };

  return (
    <div style={{
      padding: '8px 12px',
      borderRadius: '4px',
      marginBottom: '15px',
      backgroundColor: status === 'connected' ? '#e8f5e8' : status === 'disconnected' ? '#ffebee' : '#fff3e0',
      border: `1px solid ${getStatusColor()}`,
      fontSize: '14px'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        {getStatusIcon()} LLM Provider: {provider.toUpperCase()}
      </div>
      <div style={{ fontSize: '12px', color: '#666' }}>
        {details}
      </div>
      {status === 'disconnected' && (
        <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
          Create a .env file with your API key or set REACT_APP_LLM_PROVIDER=mock
        </div>
      )}
    </div>
  );
};

export default LLMStatus;