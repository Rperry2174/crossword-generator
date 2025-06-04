// LLM Service for generating crossword words from topics

export interface TopicWordsResponse {
  words: string[];
  topic: string;
  success: boolean;
  message: string;
}

export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'ollama' | 'mock';
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

export class LLMService {
  
  private static getConfig(): LLMConfig {
    return {
      provider: (process.env.REACT_APP_LLM_PROVIDER as any) || 'mock',
      apiKey: process.env.REACT_APP_OPENAI_API_KEY || process.env.REACT_APP_ANTHROPIC_API_KEY,
      model: process.env.REACT_APP_OPENAI_MODEL || process.env.REACT_APP_ANTHROPIC_MODEL || 'gpt-3.5-turbo',
      baseUrl: process.env.REACT_APP_OLLAMA_BASE_URL || process.env.REACT_APP_CUSTOM_LLM_URL
    };
  }

  private static createPrompt(topic: string): string {
    return `You are helping create a crossword puzzle. Generate exactly 30 words related to the topic "${topic}".

Requirements:
- Words should be 3-15 letters long
- Use common English words that most people would know
- Choose words with good crossword potential (mix of vowels and consonants)
- Avoid proper nouns, acronyms, or very technical terms
- Return ONLY the words in uppercase, separated by commas
- No explanations, just the comma-separated word list

Topic: ${topic}

Example Input: "Basketball"
Example Output: BASKETBALL,PLAYER,COURT,HOOP,DUNK,SCORE,TEAM,COACH,REFEREE,FOUL,TIMEOUT,QUARTER,POINT,GUARD,FORWARD,CENTER,REBOUND,ASSIST,STEAL,BLOCK,SHOT,LAYUP,JERSEY,ARENA,PLAYOFFS,CHAMPIONSHIP,LEAGUE,DRAFT,ROOKIE,VETERAN

Now generate 30 words for the topic: "${topic}"`;
  }

  static async generateWordsFromTopic(topic: string): Promise<string[]> {
    const config = this.getConfig();
    
    console.log(`LLM Service: Using provider "${config.provider}" for topic "${topic}"`);
    
    try {
      let result: string[];
      switch (config.provider) {
        case 'openai':
          console.log('Calling OpenAI API...');
          result = await this.callOpenAI(topic, config);
          break;
        case 'anthropic':
          console.log('Calling Anthropic API...');
          result = await this.callAnthropic(topic, config);
          break;
        case 'ollama':
          console.log('Calling Ollama API...');
          result = await this.callOllama(topic, config);
          break;
        case 'mock':
        default:
          console.log('Using mock data...');
          result = await this.getMockWordsForTopic(topic.toLowerCase());
          break;
      }
      console.log('LLM generated words:', result.slice(0, 5), '... (showing first 5)');
      return result;
    } catch (error) {
      console.error('LLM API failed, falling back to mock data:', error);
      const fallbackWords = await this.getMockWordsForTopic(topic.toLowerCase());
      console.log('Fallback words:', fallbackWords.slice(0, 5), '... (showing first 5)');
      return fallbackWords;
    }
  }

  private static async callOpenAI(topic: string, config: LLMConfig): Promise<string[]> {
    if (!config.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: this.createPrompt(topic)
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    return this.parseWordsFromResponse(content, topic);
  }

  private static async callAnthropic(topic: string, config: LLMConfig): Promise<string[]> {
    if (!config.apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: config.model || 'claude-3-haiku-20240307',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: this.createPrompt(topic)
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0]?.text || '';
    
    return this.parseWordsFromResponse(content, topic);
  }

  private static async callOllama(topic: string, config: LLMConfig): Promise<string[]> {
    const baseUrl = config.baseUrl || 'http://localhost:11434';
    
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.model || 'llama2',
        prompt: this.createPrompt(topic),
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.response || '';
    
    return this.parseWordsFromResponse(content, topic);
  }

  private static parseWordsFromResponse(content: string, topic: string): string[] {
    // Extract words from the response
    // Look for comma-separated words in uppercase
    const lines = content.split('\n');
    let wordLine = '';
    
    // Find the line with comma-separated words
    for (const line of lines) {
      if (line.includes(',') && line.split(',').length > 10) {
        wordLine = line.trim();
        break;
      }
    }
    
    if (!wordLine) {
      // Try to extract words from the entire content
      const matches = content.match(/[A-Z]{3,15}/g);
      if (matches && matches.length > 10) {
        wordLine = matches.slice(0, 30).join(',');
      }
    }
    
    if (!wordLine) {
      throw new Error('Could not parse words from LLM response');
    }
    
    // Parse and validate words
    const words = wordLine
      .split(',')
      .map(word => word.trim().toUpperCase())
      .filter(word => /^[A-Z]{3,15}$/.test(word))
      .slice(0, 30);
    
    if (words.length < 10) {
      throw new Error(`LLM returned too few valid words: ${words.length}`);
    }
    
    return words;
  }

  // Fallback mock service
  private static async getMockWordsForTopic(topic: string): Promise<string[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock word database
    const wordSets: { [key: string]: string[] } = {
      'the office': [
        'DWIGHT', 'JIM', 'PAM', 'MICHAEL', 'ANGELA', 'KEVIN', 'OSCAR', 'STANLEY',
        'PHYLLIS', 'CREED', 'MEREDITH', 'KELLY', 'RYAN', 'TOBY', 'ERIN', 'HOLLY',
        'SCRANTON', 'DUNDIES', 'BEARS', 'BEETS', 'BATTLESTAR', 'PAPER', 'SALES',
        'MANAGER', 'RECEPTIONIST', 'ACCOUNTING', 'WAREHOUSE', 'ANNEX', 'CONFERENCE', 'PARTY'
      ],
      'basketball': [
        'BASKETBALL', 'PLAYER', 'COURT', 'HOOP', 'DUNK', 'SCORE', 'TEAM', 'COACH',
        'REFEREE', 'FOUL', 'TIMEOUT', 'QUARTER', 'POINT', 'GUARD', 'FORWARD', 'CENTER',
        'REBOUND', 'ASSIST', 'STEAL', 'BLOCK', 'SHOT', 'LAYUP', 'JERSEY', 'ARENA',
        'PLAYOFFS', 'CHAMPIONSHIP', 'LEAGUE', 'DRAFT', 'ROOKIE', 'VETERAN'
      ],
      'world war ii': [
        'ALLIES', 'AXIS', 'HITLER', 'ROOSEVELT', 'CHURCHILL', 'STALIN', 'NORMANDY', 'DDAY',
        'PEARL', 'HARBOR', 'PACIFIC', 'EUROPE', 'BATTLE', 'VICTORY', 'DEFEAT', 'TROOPS',
        'NAVY', 'ARMY', 'AIRFORCE', 'BOMBER', 'FIGHTER', 'TANK', 'SUBMARINE', 'RADAR',
        'BLITZ', 'HOLOCAUST', 'LIBERATION', 'SURRENDER', 'ATOMIC', 'BOMB'
      ],
      'harry potter': [
        'HARRY', 'HERMIONE', 'RON', 'HOGWARTS', 'WIZARD', 'MAGIC', 'WAND', 'SPELL',
        'QUIDDITCH', 'GRYFFINDOR', 'SLYTHERIN', 'HUFFLEPUFF', 'RAVENCLAW', 'DUMBLEDORE', 'SNAPE', 'VOLDEMORT',
        'MUGGLE', 'POTION', 'CHARM', 'CURSE', 'DRAGON', 'PHOENIX', 'UNICORN', 'CENTAUR',
        'BROOM', 'CLOAK', 'MIRROR', 'STONE', 'CHAMBER', 'SECRETS'
      ],
      'space': [
        'SPACE', 'ROCKET', 'PLANET', 'STAR', 'GALAXY', 'UNIVERSE', 'ASTRONAUT', 'ORBIT',
        'MOON', 'EARTH', 'MARS', 'VENUS', 'JUPITER', 'SATURN', 'NEPTUNE', 'URANUS',
        'TELESCOPE', 'SATELLITE', 'COMET', 'ASTEROID', 'METEOR', 'SOLAR', 'SYSTEM', 'MISSION',
        'LAUNCH', 'LANDING', 'SPACECRAFT', 'STATION', 'GRAVITY', 'VACUUM'
      ],
      'cooking': [
        'COOKING', 'RECIPE', 'KITCHEN', 'CHEF', 'INGREDIENTS', 'FLAVOR', 'TASTE', 'SPICE',
        'HERB', 'SALT', 'PEPPER', 'GARLIC', 'ONION', 'TOMATO', 'CARROT', 'POTATO',
        'MEAT', 'CHICKEN', 'BEEF', 'FISH', 'VEGETABLE', 'FRUIT', 'BREAD', 'PASTA',
        'SAUCE', 'SOUP', 'SALAD', 'DESSERT', 'BAKING', 'ROASTING'
      ]
    };
    
    // Try exact match first
    if (wordSets[topic]) {
      return wordSets[topic].slice(0, 30);
    }
    
    // Try partial matches
    for (const [key, words] of Object.entries(wordSets)) {
      if (topic.includes(key) || key.includes(topic)) {
        return words.slice(0, 30);
      }
    }
    
    // Fallback: general words
    return [
      'WORD', 'LETTER', 'PUZZLE', 'GAME', 'PLAY', 'FUN', 'BRAIN', 'THINK',
      'SOLVE', 'CROSS', 'DOWN', 'ACROSS', 'CLUE', 'ANSWER', 'GRID', 'BOX',
      'LINE', 'SQUARE', 'BLACK', 'WHITE', 'NUMBER', 'COUNT', 'TOTAL', 'SUM',
      'ADD', 'MAKE', 'CREATE', 'BUILD', 'FORM', 'SHAPE'
    ];
  }
  
  // Future: Replace with actual LLM API call
  /*
  static async generateWordsFromTopicWithAPI(topic: string): Promise<string[]> {
    const prompt = `Generate 30 words related to "${topic}" that would be good for a crossword puzzle. 
                   Words should be 3-15 letters long, commonly known, and have good crossword potential with common letters.
                   Return only the words separated by commas, no explanations.`;
    
    const response = await fetch('/api/llm/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    
    const data = await response.json();
    return data.words.split(',').map((w: string) => w.trim().toUpperCase());
  }
  */
}