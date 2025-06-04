# Crossword Puzzle Generator - Phase 1 Development Prompt

**Original prompt from:** https://claude.ai/public/artifacts/fd3d7c29-3149-4655-8cad-f158a9f0a4e8

## Project Context & Ultimate Goal
You are helping build a crossword puzzle generator for a blog that demonstrates AI/LLM capabilities to the public. The final product will be a web application where users can input topics they know well (e.g., "The Office", "World War II", "New Girl") and receive a playable crossword puzzle based on that topic. This will eventually be shareable with friends and demonstrate how easy it is to build cool projects with LLMs.

### Technology Stack:
- Backend: Python with pipenv for package management
- Frontend: React with TypeScript and npm for package management
- Testing: pytest for Python backend tests
- Architecture: Separate backend/frontend to enable future website/app deployment

### Previous Challenge: 
Other LLMs have struggled with creating valid crossword puzzles with proper word overlaps and intersections. This is why we're taking a methodical, test-driven approach.

## Phase 1 Objective
Create a basic crossword algorithm that takes a predefined list of 5-10 words and generates a valid crossword grid with proper intersections. Focus on the core algorithm logic before adding interactivity.

## Required Deliverables

### Step 1: Project Structure Setup
Create the following directory structure:
```
crossword-generator/
├── backend/
│   ├── Pipfile
│   ├── Pipfile.lock
│   ├── src/
│   │   ├── __init__.py
│   │   ├── crossword_generator.py
│   │   └── models.py
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_crossword_generator.py
│   └── requirements.txt
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
└── README.md
```

### Step 2: Backend Data Models (models.py)
Create these exact classes with type hints:
```python
from dataclasses import dataclass
from typing import List, Optional, Tuple
from enum import Enum

class Direction(Enum):
    HORIZONTAL = "horizontal"
    VERTICAL = "vertical"

@dataclass
class WordPlacement:
    word: str
    start_row: int
    start_col: int
    direction: Direction
    clue: str = ""

@dataclass
class CrosswordGrid:
    grid: List[List[Optional[str]]]
    width: int
    height: int
    word_placements: List[WordPlacement]
```

### Step 3: Core Algorithm (crossword_generator.py)
Implement this exact class structure:
```python
class CrosswordGenerator:
    def __init__(self, words: List[str], grid_size: int = 15):
        """Initialize with word list and grid size"""
        pass
    
    def find_intersections(self, word1: str, word2: str) -> List[Tuple[int, int]]:
        """Find all possible intersection points between two words
        Returns: List of (word1_index, word2_index) tuples"""
        pass
    
    def can_place_word(self, grid: List[List[Optional[str]]], word: str, 
                      start_row: int, start_col: int, direction: Direction) -> bool:
        """Check if word can be placed at given position without conflicts"""
        pass
    
    def place_word(self, grid: List[List[Optional[str]]], word: str,
                  start_row: int, start_col: int, direction: Direction) -> bool:
        """Place word on grid if possible, return success status"""
        pass
    
    def generate_crossword(self) -> CrosswordGrid:
        """Main algorithm to generate crossword puzzle"""
        pass
    
    def print_grid(self, grid: CrosswordGrid) -> str:
        """Return string representation of grid for debugging"""
        pass
```

### Step 4: Test Suite (test_crossword_generator.py)
Create these exact tests with expected behaviors:
```python
import pytest
from src.crossword_generator import CrosswordGenerator
from src.models import Direction, WordPlacement, CrosswordGrid

class TestCrosswordGenerator:
    
    @pytest.fixture
    def test_words(self):
        """Test with these exact 7 words"""
        return ["PYTHON", "CODE", "TEST", "GRID", "WORD", "PLACE", "CROSS"]
    
    @pytest.fixture
    def generator(self, test_words):
        return CrosswordGenerator(test_words)
    
    def test_find_intersections(self, generator):
        """Test intersection finding between words"""
        intersections = generator.find_intersections("PYTHON", "CODE")
        # Should find intersection at O (index 4 in PYTHON, index 1 in CODE)
        assert (4, 1) in intersections
        
        intersections = generator.find_intersections("TEST", "CROSS")
        # Should find intersection at S (index 2 in TEST, index 3 in CROSS)  
        assert (2, 3) in intersections
    
    def test_can_place_word_empty_grid(self, generator):
        """Test word placement on empty grid"""
        empty_grid = [[None for _ in range(15)] for _ in range(15)]
        
        # Should be able to place any word on empty grid
        assert generator.can_place_word(empty_grid, "PYTHON", 7, 4, Direction.HORIZONTAL)
        assert generator.can_place_word(empty_grid, "CODE", 3, 7, Direction.VERTICAL)
    
    def test_place_word_success(self, generator):
        """Test successful word placement"""
        empty_grid = [[None for _ in range(15)] for _ in range(15)]
        
        success = generator.place_word(empty_grid, "PYTHON", 7, 4, Direction.HORIZONTAL)
        assert success == True
        
        # Check that letters are correctly placed
        expected_letters = list("PYTHON")
        for i, letter in enumerate(expected_letters):
            assert empty_grid[7][4 + i] == letter
    
    def test_word_intersection_placement(self, generator):
        """Test placing intersecting words"""
        grid = [[None for _ in range(15)] for _ in range(15)]
        
        # Place first word
        generator.place_word(grid, "PYTHON", 7, 4, Direction.HORIZONTAL)
        
        # Place intersecting word at the O
        success = generator.place_word(grid, "CODE", 5, 8, Direction.VERTICAL)
        assert success == True
        
        # Verify intersection point has correct letter
        assert grid[7][8] == "O"  # From both PYTHON and CODE
    
    def test_generate_crossword_basic(self, generator):
        """Test basic crossword generation"""
        crossword = generator.generate_crossword()
        
        # Verify structure
        assert isinstance(crossword, CrosswordGrid)
        assert len(crossword.word_placements) >= 3  # At least 3 words placed
        assert crossword.width == 15
        assert crossword.height == 15
        
        # Verify at least one intersection exists
        placed_words = crossword.word_placements
        assert len(placed_words) > 1
        
    def test_no_conflicts(self, generator):
        """Test that generated crossword has no letter conflicts"""
        crossword = generator.generate_crossword()
        
        # Check every placed letter for conflicts
        for placement in crossword.word_placements:
            word = placement.word
            for i, letter in enumerate(word):
                if placement.direction == Direction.HORIZONTAL:
                    row, col = placement.start_row, placement.start_col + i
                else:
                    row, col = placement.start_row + i, placement.start_col
                
                grid_letter = crossword.grid[row][col]
                assert grid_letter == letter, f"Conflict at ({row}, {col}): expected {letter}, got {grid_letter}"
```

### Step 5: Visual Test Output (add to crossword_generator.py)
Add this method for visual verification:
```python
def create_visual_test_output(self) -> str:
    """Create visual representation showing word placements and intersections"""
    crossword = self.generate_crossword()
    
    output = []
    output.append("=== CROSSWORD PUZZLE VISUAL TEST ===\n")
    
    # Show the grid
    output.append("Generated Grid:")
    for i, row in enumerate(crossword.grid):
        row_str = f"{i:2d} "
        for cell in row:
            row_str += f" {cell or '.'} "
        output.append(row_str)
    
    output.append(f"\nColumn numbers: {' '.join(f'{i:2d}' for i in range(crossword.width))}")
    
    # Show word placements
    output.append("\n=== WORD PLACEMENTS ===")
    for i, placement in enumerate(crossword.word_placements):
        direction_str = "→" if placement.direction == Direction.HORIZONTAL else "↓"
        output.append(f"{i+1}. {placement.word} {direction_str} at ({placement.start_row}, {placement.start_col})")
    
    # Show intersections found
    output.append("\n=== INTERSECTIONS DETECTED ===")
    intersections = self._find_all_intersections(crossword)
    for intersection in intersections:
        output.append(f"Words '{intersection['word1']}' and '{intersection['word2']}' intersect at letter '{intersection['letter']}' at position ({intersection['row']}, {intersection['col']})")
    
    return "\n".join(output)

def _find_all_intersections(self, crossword: CrosswordGrid) -> List[dict]:
    """Helper method to identify all intersections in the final grid"""
    # Implementation to detect intersections in completed crossword
    pass
```

### Step 6: Success Criteria & Expected Output
When you run `pytest tests/` from the backend directory, ALL tests must pass.
When you run the visual test, the output must show:

- A grid with at least 3 words placed
- At least 2 clear intersections between words
- No conflicting letters (same position, different letters)
- Words should form a connected crossword pattern

Example Expected Visual Output Pattern:
```
=== CROSSWORD PUZZLE VISUAL TEST ===

Generated Grid:
 0  .  .  .  .  .  .  .  .  .  .  .  .  .  .  . 
 1  .  .  .  .  .  .  .  .  .  .  .  .  .  .  . 
 2  .  .  .  .  .  .  .  .  .  .  .  .  .  .  . 
 3  .  .  .  .  .  .  .  C  .  .  .  .  .  .  . 
 4  .  .  .  .  .  .  .  O  .  .  .  .  .  .  . 
 5  .  .  .  .  .  .  .  D  .  .  .  .  .  .  . 
 6  .  .  .  .  .  .  .  E  .  .  .  .  .  .  . 
 7  .  .  .  .  P  Y  T  H  O  N  .  .  .  .  . 
 8  .  .  .  .  .  .  .  .  .  .  .  .  .  .  . 

=== WORD PLACEMENTS ===
1. PYTHON → at (7, 4)
2. CODE ↓ at (3, 7) 

=== INTERSECTIONS DETECTED ===
Words 'PYTHON' and 'CODE' intersect at letter 'H' at position (7, 7)
```

### Step 7: Execution Instructions

1. Set up the project structure exactly as specified
2. Install dependencies: `cd backend && pipenv install pytest`
3. Implement each class and method with the exact signatures provided
4. Run tests: `pipenv run pytest tests/ -v`
5. Create and run visual test: `pipenv run python -c "from src.crossword_generator import CrosswordGenerator; gen = CrosswordGenerator(['PYTHON', 'CODE', 'TEST', 'GRID', 'WORD', 'PLACE', 'CROSS']); print(gen.create_visual_test_output())"`
6. All tests must pass and visual output must show valid crossword with intersections

## Important Constraints

- Use ONLY the 7 test words provided: `["PYTHON", "CODE", "TEST", "GRID", "WORD", "PLACE", "CROSS"]`
- Grid must be exactly 15x15
- Algorithm must find and use at least 2 word intersections
- No word conflicts allowed (same grid position with different letters)
- All methods must have the exact signatures specified
- Tests must pass with the exact assertions provided

## Deliverable Checklist

- [ ] Directory structure matches specification exactly
- [ ] All classes implement specified methods with correct signatures
- [ ] All pytest tests pass without modification
- [ ] Visual output shows valid crossword with clear intersections
- [ ] No letter conflicts in final grid
- [ ] At least 3 words successfully placed
- [ ] Code is clean, documented, and follows Python best practices

Do not deviate from these specifications. Implement exactly what is described above.