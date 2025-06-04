# Dynamic Crossword Generator

An AI-powered crossword puzzle generator that creates interactive puzzles from any topic using LLM technology.

## Features

- **Topic-Based Generation**: Enter any topic (e.g., "Basketball", "The Office") and get 30 related crossword words
- **Multiple LLM Providers**: Supports OpenAI, Anthropic Claude, Ollama (local), and mock data
- **Interactive Crosswords**: Click-to-type interface with direction switching
- **Custom Word Lists**: Manual word input for advanced users
- **Robust Validation**: Algorithm ensures valid crossword structure with proper word intersections
- **Real-time Generation**: See crosswords created live from your topics

## Quick Start

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API keys (see LLM Configuration below)
npm start
```

### Backend Setup
```bash
cd backend
pipenv install
pipenv run python start_server.py
```

## LLM Configuration

Create a `.env` file in the `frontend` directory:

### Option 1: OpenAI (Recommended)
```env
REACT_APP_LLM_PROVIDER=openai
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_OPENAI_MODEL=gpt-3.5-turbo
```

### Option 2: Anthropic Claude
```env
REACT_APP_LLM_PROVIDER=anthropic
REACT_APP_ANTHROPIC_API_KEY=your_anthropic_api_key_here
REACT_APP_ANTHROPIC_MODEL=claude-3-haiku-20240307
```

### Option 3: Local Ollama
```env
REACT_APP_LLM_PROVIDER=ollama
REACT_APP_OLLAMA_BASE_URL=http://localhost:11434
REACT_APP_OLLAMA_MODEL=llama2
```

### Option 4: Mock Data (No API Key Required)
```env
REACT_APP_LLM_PROVIDER=mock
```

## How It Works

### 1. Topic Input → LLM Processing
**Input Example:**
```
Topic: "Basketball"
```

**LLM Prompt Template:**
```
You are helping create a crossword puzzle. Generate exactly 30 words related to the topic "Basketball".

Requirements:
- Words should be 3-15 letters long
- Use common English words that most people would know
- Choose words with good crossword potential (mix of vowels and consonants)
- Avoid proper nouns, acronyms, or very technical terms
- Return ONLY the words in uppercase, separated by commas
- No explanations, just the comma-separated word list

Example Output: BASKETBALL,PLAYER,COURT,HOOP,DUNK,SCORE,TEAM,COACH,REFEREE,FOUL,TIMEOUT,QUARTER,POINT,GUARD,FORWARD,CENTER,REBOUND,ASSIST,STEAL,BLOCK,SHOT,LAYUP,JERSEY,ARENA,PLAYOFFS,CHAMPIONSHIP,LEAGUE,DRAFT,ROOKIE,VETERAN
```

### 2. Word Validation → Crossword Generation
- Backend receives comma-separated word list
- Crossword algorithm creates valid 15x15 grid
- Words placed with proper intersections and no conflicts
- Returns grid data with word positions and numbers

### 3. Interactive Puzzle Display
- Real-time crossword rendering
- Click-to-type functionality
- Direction switching (across/down)
- Numbered clue lists

## Architecture

### Frontend (React + TypeScript)
- **Components**: Tabbed interface, LLM status indicators, interactive grid
- **Services**: LLM API integration, crossword API client
- **State Management**: Real-time crossword updates, loading states

### Backend (Python + FastAPI)
- **Crossword Algorithm**: Robust word placement with validation
- **API Endpoints**: Word list processing, crossword generation
- **Validation**: Prevents invalid word formations and ensures connectivity

### LLM Integration
- **Multi-Provider Support**: OpenAI, Anthropic, Ollama, Mock
- **Robust Parsing**: Extracts words from various LLM response formats
- **Fallback Strategy**: Mock data if API calls fail
- **Secure Configuration**: Environment variable API key management

## Example Workflows

### Popular Topics Ready to Try:
- **TV Shows**: "The Office", "Friends", "Breaking Bad"
- **Sports**: "Basketball", "Soccer", "Olympics"  
- **History**: "World War II", "Ancient Rome", "Space Exploration"
- **Entertainment**: "Harry Potter", "Star Wars", "Marvel"

### Custom Word Lists:
Switch to "Custom Words" tab for manual word entry like:
```
PYTHON,CODE,TEST,GRID,WORD,PLACE,CROSS
```

## Development

### Project Structure
```
crossword-generator/
├── frontend/          # React TypeScript app
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── services/      # API integration
│   │   └── types/         # TypeScript interfaces
├── backend/           # Python FastAPI server
│   ├── src/
│   │   ├── api.py        # REST endpoints
│   │   ├── crossword_generator.py  # Core algorithm
│   │   └── models.py     # Data structures
└── prompts/           # Development documentation
```

### Testing
```bash
# Backend tests
cd backend && pipenv run pytest tests/ -v

# Frontend development
cd frontend && npm start

# Test LLM integration
# Set REACT_APP_LLM_PROVIDER=mock for testing without API keys
```

## Deployment

### Environment Variables
- `REACT_APP_LLM_PROVIDER`: LLM service to use
- `REACT_APP_OPENAI_API_KEY`: OpenAI API key
- `REACT_APP_ANTHROPIC_API_KEY`: Anthropic API key
- `REACT_APP_OLLAMA_BASE_URL`: Ollama server URL

### Production Notes
- Store API keys securely
- Configure CORS for production domains
- Consider rate limiting for LLM API calls
- Cache common topic results

## Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit pull request

## License

MIT License - See LICENSE file for details

---

🧩 **Built with Claude Code** - Demonstrating the power of AI-assisted development