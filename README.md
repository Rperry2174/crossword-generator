# Crossword Puzzle Generator

An AI-powered crossword puzzle generator built to demonstrate LLM capabilities for creating interactive puzzles.

## Project Overview

This project aims to create a web application where users can input topics they know well (e.g., "The Office", "World War II", "New Girl") and receive a playable crossword puzzle based on that topic. The final product will be shareable with friends and demonstrate how easy it is to build cool projects with LLMs.

## Current Status: Phase 1

Phase 1 focuses on creating a basic crossword algorithm that takes a predefined list of 5-10 words and generates a valid crossword grid with proper intersections.

## Technology Stack

- **Backend**: Python with pipenv for package management
- **Frontend**: React with TypeScript and npm for package management  
- **Testing**: pytest for Python backend tests
- **Architecture**: Separate backend/frontend to enable future website/app deployment

## Project Structure

```
crossword-generator/
├── backend/
│   ├── Pipfile
│   ├── src/
│   │   ├── __init__.py
│   │   ├── crossword_generator.py
│   │   └── models.py
│   └── tests/
│       ├── __init__.py
│       └── test_crossword_generator.py
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   └── CrosswordGrid.tsx
│   │   └── types/
│   │       └── crossword.ts
│   └── public/
├── prompts/
│   └── phase-1-development-prompt.md
└── README.md
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies with pipenv:
   ```bash
   pipenv install pytest
   ```

3. Run tests:
   ```bash
   pipenv run pytest tests/ -v
   ```

4. Run visual test:
   ```bash
   pipenv run python -c "from src.crossword_generator import CrosswordGenerator; gen = CrosswordGenerator(['PYTHON', 'CODE', 'TEST', 'GRID', 'WORD', 'PLACE', 'CROSS']); print(gen.create_visual_test_output())"
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

## Phase 1 Features

- **Core Algorithm**: Generates crossword grids with proper word intersections
- **Test Suite**: Comprehensive tests ensuring algorithm correctness
- **Visual Output**: Debug-friendly grid visualization
- **Data Models**: Type-safe data structures for crossword representation

## Algorithm Approach

The crossword generator uses a methodical approach:

1. Places the first word horizontally in the center of the grid
2. For each remaining word, finds potential intersections with already-placed words
3. Attempts to place intersecting words perpendicular to existing words
4. Falls back to random placement if no intersections are possible
5. Ensures no letter conflicts occur during placement

## Testing

The project includes comprehensive tests that verify:
- Intersection detection between words
- Word placement validation
- Grid generation with multiple intersections
- Conflict-free letter placement

All tests must pass for the algorithm to be considered functional.

## Development History

This project was created following the detailed specifications in `prompts/phase-1-development-prompt.md`.

**Original development prompt**: https://claude.ai/public/artifacts/fd3d7c29-3149-4655-8cad-f158a9f0a4e8

## Next Steps

Future phases will include:
- Dynamic word generation based on user topics
- Interactive puzzle solving interface
- Clue generation and management
- Web deployment and sharing capabilities
- Enhanced crossword generation algorithms

## Contributing

This project follows test-driven development principles. All new features should include comprehensive tests and maintain the existing test suite's passing status.