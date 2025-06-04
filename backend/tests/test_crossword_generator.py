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
        
        # Place intersecting word at the O (CODE has O at index 1, so start at row 6)
        success = generator.place_word(grid, "CODE", 6, 8, Direction.VERTICAL)
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