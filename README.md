# Crossword Studio

A professional AI-powered crossword puzzle generator with interactive solving features. Generate topic-based puzzles, solve them with real-time validation, and enjoy a polished user experience comparable to premium puzzle applications.

## ✨ Features

### 🎯 **Smart Puzzle Generation**
- **Topic-Based Creation**: Enter any topic (e.g., "The Office", "Basketball") and get AI-generated crosswords
- **Multiple LLM Providers**: OpenAI, Anthropic Claude, Ollama (local), or mock data
- **Intelligent Word Placement**: Advanced algorithm ensures valid crossword structure

### 🎮 **Interactive Solving Experience**
- **Click-to-Type Interface**: Professional crossword solving with keyboard navigation
- **Real-Time Validation**: Check puzzle progress with error highlighting
- **Progressive Assistance**: Check answers or reveal complete solution
- **Visual Feedback**: Completion percentage and professional error states

### 🎨 **Professional UI/UX**
- **Commercial-Grade Design**: Modern interface with consistent design system
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Accessibility Features**: WCAG AA compliant with proper contrast and focus management

## 🚀 Quick Start

### Option 1: Docker (Recommended)

The easiest way to run the entire application:

```bash
# 1. Clone the repository
git clone https://github.com/Rperry2174/crossword-generator.git
cd crossword-generator

# 2. Set up environment variables
cp .env.template .env
nano .env  # Add your API keys (see configuration below)

# 3. Start with Docker Compose
docker-compose up -d

# 4. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Development Setup

For development with hot reloading:

```bash
# Backend
cd backend
pipenv install
cp .env.template .env  # Add your API keys
pipenv run python start_server.py

# Frontend (in separate terminal)
cd frontend
npm install
npm start
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the **root directory** (same level as docker-compose.yml):

#### OpenAI (Recommended)
```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
```

#### Anthropic Claude
```env
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here
```

#### Local Ollama
```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
```

#### Mock Mode (No API Keys Required)
```env
LLM_PROVIDER=mock
```

### Docker Compose Files

- **`docker-compose.yml`**: Main configuration for all environments
- **`docker-compose.override.yml`**: Development overrides (hot reloading, debug mode)
- **`docker-compose.prod.yml`**: Production optimizations (multi-worker, resource limits)

#### Development Mode (Default)
```bash
docker-compose up  # Uses main + override files automatically
```

#### Production Mode
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🎯 How It Works

### 1. **Topic Input → AI Processing**

**User Input:**
```
Topic: "The Office"
```

**AI Generation:**
- Sends topic to configured LLM provider
- Generates 30 topic-related words with clues
- Returns structured data for crossword creation

**Example Output:**
```
Words: DWIGHT,JIM,PAM,MICHAEL,ANGELA,KEVIN,OSCAR,STANLEY...
Clues: "Dwight" → "Beet farmer and assistant manager"
```

### 2. **Crossword Generation**
- Advanced placement algorithm creates 15x15 grid
- Ensures proper word intersections and connectivity
- Validates no invalid word formations
- Assigns numbers for across/down clues

### 3. **Interactive Solving**
- Professional crossword interface with click-to-type
- Real-time validation with error highlighting
- Progressive assistance (check → reveal)
- Completion tracking and statistics

## 🏗️ Architecture

### **Frontend (React + TypeScript)**
```
src/
├── components/
│   ├── CrosswordGrid.tsx    # Interactive puzzle interface
│   ├── ClueList.tsx         # Professional clue display
│   ├── WordInput.tsx        # Topic/custom word input
│   └── TopicInput.tsx       # AI topic generation
├── services/
│   └── api.ts              # Backend API client
└── types/
    └── crossword.ts        # TypeScript interfaces
```

### **Backend (Python + FastAPI)**
```
src/
├── api.py                  # REST API endpoints
├── crossword_generator.py  # Core crossword algorithm
├── llm_service.py         # AI provider integration
└── models.py              # Data structures
```

### **Docker Architecture**
```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│   (React/Nginx) │◄──►│   (FastAPI)     │
│   Port: 3000    │    │   Port: 8000    │
└─────────────────┘    └─────────────────┘
```

## 🎮 Usage Examples

### **Popular Topics to Try:**
- **TV Shows**: "The Office", "Friends", "Breaking Bad", "Game of Thrones"
- **Sports**: "Basketball", "Soccer", "Olympics", "Tennis"  
- **Movies**: "Harry Potter", "Star Wars", "Marvel", "Disney"
- **History**: "World War II", "Ancient Rome", "Space Exploration"
- **Science**: "Chemistry", "Biology", "Physics", "Astronomy"

### **Interactive Features:**
1. **Generate**: Enter topic → Get AI-powered crossword
2. **Solve**: Click cells → Type letters → Navigate with Tab/Arrow keys
3. **Check**: Validate progress → See completion percentage → Highlight errors
4. **Reveal**: Get complete solution when stuck

### **Custom Word Lists:**
Switch to "Custom Words" tab for manual entry:
```
REACT,DOCKER,PYTHON,TYPESCRIPT,FASTAPI,NGINX,CONTAINER
```

## 🛠️ Development

### **Project Structure**
```
crossword-generator/
├── frontend/              # React application
│   ├── src/components/    # UI components
│   ├── Dockerfile         # Frontend container
│   └── nginx.conf         # Production web server
├── backend/               # Python API
│   ├── src/              # Application code
│   ├── Dockerfile        # Backend container
│   └── .env              # Backend environment
├── docker-compose.yml    # Container orchestration
├── .env.template         # Environment template
└── prompts/              # Development documentation
```

### **Running Tests**
```bash
# Backend tests
cd backend && pipenv run pytest tests/ -v

# Frontend development server
cd frontend && npm start

# Docker development mode
docker-compose up  # Includes hot reloading
```

### **Development Workflow**
1. **Hot Reloading**: Code changes automatically reload in Docker
2. **Debug Mode**: Backend runs with detailed logging
3. **Development Volumes**: Source code mounted for instant updates

## 🚀 Deployment

### **Docker Commands**
```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### **Environment Requirements**
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **API Keys**: OpenAI or Anthropic (or use mock mode)

### **Production Considerations**
- **Security**: API keys in environment variables only
- **Scaling**: Multi-worker backend configuration available
- **Monitoring**: Built-in health checks for all services
- **Performance**: Nginx optimization with caching and compression

## 📚 Documentation

### **Detailed Guides**
- **[DOCKER.md](./DOCKER.md)**: Complete containerization guide
- **[prompts/](./prompts/)**: Development documentation and implementation details

### **API Documentation**
- **Interactive Docs**: http://localhost:8000/docs (when running)
- **Health Check**: http://localhost:8000/health

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes with tests
4. Run the test suite
5. Submit pull request

### **Development Setup**
```bash
git clone https://github.com/Rperry2174/crossword-generator.git
cd crossword-generator
cp .env.template .env  # Configure with your API keys
docker-compose up      # Start development environment
```

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details.

## 🏆 Achievements

This project demonstrates:
- ✅ **Commercial-grade UI/UX** comparable to professional puzzle applications
- ✅ **Modern containerization** with Docker best practices
- ✅ **AI integration** with multiple LLM providers
- ✅ **Interactive puzzle solving** with real-time validation
- ✅ **Professional architecture** with clean separation of concerns
- ✅ **Production-ready deployment** with scaling and monitoring

---

🧩 **Crossword Studio** - Where AI meets classic puzzle-solving fun!

Built with modern development practices and AI-assisted programming.