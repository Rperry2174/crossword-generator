import React, { useState, useEffect } from 'react';

interface Theme {
  colors: any;
  typography: any;
  spacing: any;
  borderRadius: any;
  shadow: any;
}

interface LLMStatusProps {
  provider: string;
  theme: Theme;
}

const LLMStatus: React.FC<LLMStatusProps> = ({ provider, theme }) => {
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
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
      backgroundColor: status === 'connected' ? '#f0fdf4' : status === 'disconnected' ? '#fef2f2' : '#fffbeb',
      border: `1px solid ${status === 'connected' ? '#bbf7d0' : status === 'disconnected' ? '#fecaca' : '#fed7aa'}`,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      fontSize: theme.typography.fontSize.xs
    }}>
      <div style={{
        fontSize: theme.typography.fontSize.sm
      }}>
        {getStatusIcon()}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontWeight: theme.typography.fontWeight.semibold,
          marginBottom: '2px',
          color: theme.colors.text.primary,
          fontSize: theme.typography.fontSize.xs
        }}>
          {provider.toUpperCase()} Provider
        </div>
        <div style={{ 
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.text.tertiary 
        }}>
          {details}
        </div>
        {status === 'disconnected' && (
          <div style={{ 
            fontSize: '10px',
            color: theme.colors.text.tertiary,
            marginTop: '2px'
          }}>
            Set API key in .env or use mock mode
          </div>
        )}
      </div>
    </div>
  );
};

export default LLMStatus;