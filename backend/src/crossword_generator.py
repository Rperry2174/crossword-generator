from typing import List, Optional, Tuple
from src.models import Direction, WordPlacement, CrosswordGrid
import random

class CrosswordGenerator:
    def __init__(self, words: List[str], grid_size: int = 15):
        """Initialize with word list and grid size"""
        self.words = [word.upper() for word in words]
        self.grid_size = grid_size
        self.max_unintended_words = max(1, len(words) // 5)  # 1 unintended word per 5 intended
    
    def find_intersections(self, word1: str, word2: str) -> List[Tuple[int, int]]:
        """Find all possible intersection points between two words
        Returns: List of (word1_index, word2_index) tuples"""
        intersections = []
        for i, char1 in enumerate(word1):
            for j, char2 in enumerate(word2):
                if char1 == char2:
                    intersections.append((i, j))
        return intersections
    
    def can_place_word(self, grid: List[List[Optional[str]]], word: str, 
                      start_row: int, start_col: int, direction: Direction, 
                      word_placements: List[WordPlacement] = None) -> bool:
        """Check if word can be placed at given position without conflicts"""
        # Check bounds
        if direction == Direction.HORIZONTAL:
            if start_col + len(word) > self.grid_size or start_row >= self.grid_size:
                return False
            if start_row < 0 or start_col < 0:
                return False
        else:  # VERTICAL
            if start_row + len(word) > self.grid_size or start_col >= self.grid_size:
                return False
            if start_row < 0 or start_col < 0:
                return False
        
        # Check for conflicts
        for i, letter in enumerate(word):
            if direction == Direction.HORIZONTAL:
                row, col = start_row, start_col + i
            else:
                row, col = start_row + i, start_col
            
            if grid[row][col] is not None and grid[row][col] != letter:
                return False
        
        # Check perpendicular word formation if we have existing placements
        if word_placements and len(word_placements) > 0:
            if not self._is_valid_perpendicular_placement(grid, word, start_row, start_col, direction):
                return False
            
            # Ensure connectivity (word must intersect with existing words)
            if not self._is_connected_to_existing(grid, word, start_row, start_col, direction):
                return False
        
        return True
    
    def place_word(self, grid: List[List[Optional[str]]], word: str,
                  start_row: int, start_col: int, direction: Direction) -> bool:
        """Place word on grid if possible, return success status"""
        if not self.can_place_word(grid, word, start_row, start_col, direction):
            return False
        
        for i, letter in enumerate(word):
            if direction == Direction.HORIZONTAL:
                row, col = start_row, start_col + i
            else:
                row, col = start_row + i, start_col
            grid[row][col] = letter
        
        return True
    
    def generate_crossword(self) -> CrosswordGrid:
        """Main algorithm to generate crossword puzzle"""
        grid = [[None for _ in range(self.grid_size)] for _ in range(self.grid_size)]
        word_placements = []
        
        # Place first word in center horizontally
        first_word = self.words[0]
        start_row = self.grid_size // 2
        start_col = (self.grid_size - len(first_word)) // 2
        
        if self.place_word(grid, first_word, start_row, start_col, Direction.HORIZONTAL):
            word_placements.append(WordPlacement(
                word=first_word,
                start_row=start_row,
                start_col=start_col,
                direction=Direction.HORIZONTAL
            ))
        
        # Try to place remaining words
        for word in self.words[1:]:
            placed = False
            
            # Try to intersect with existing words
            for placed_word in word_placements:
                intersections = self.find_intersections(word, placed_word.word)
                
                for word_idx, placed_idx in intersections:
                    # Calculate position for intersection
                    if placed_word.direction == Direction.HORIZONTAL:
                        # Place new word vertically
                        new_start_row = placed_word.start_row - word_idx
                        new_start_col = placed_word.start_col + placed_idx
                        new_direction = Direction.VERTICAL
                    else:
                        # Place new word horizontally
                        new_start_row = placed_word.start_row + placed_idx
                        new_start_col = placed_word.start_col - word_idx
                        new_direction = Direction.HORIZONTAL
                    
                    if self.can_place_word(grid, word, new_start_row, new_start_col, new_direction, word_placements):
                        if self.place_word(grid, word, new_start_row, new_start_col, new_direction):
                            word_placements.append(WordPlacement(
                                word=word,
                                start_row=new_start_row,
                                start_col=new_start_col,
                                direction=new_direction
                            ))
                            placed = True
                            break
                
                if placed:
                    break
            
            # Skip words that can't be connected (removed random fallback)
            # All words must be connected to maintain crossword integrity
        
        return CrosswordGrid(
            grid=grid,
            width=self.grid_size,
            height=self.grid_size,
            word_placements=word_placements
        )
    
    def print_grid(self, grid: CrosswordGrid) -> str:
        """Return string representation of grid for debugging"""
        output = []
        for row in grid.grid:
            row_str = ""
            for cell in row:
                row_str += f" {cell or '.'} "
            output.append(row_str)
        return "\n".join(output)
    
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
        intersections = []
        
        for i, placement1 in enumerate(crossword.word_placements):
            for j, placement2 in enumerate(crossword.word_placements[i+1:], i+1):
                # Check if words intersect
                for k, letter1 in enumerate(placement1.word):
                    if placement1.direction == Direction.HORIZONTAL:
                        row1, col1 = placement1.start_row, placement1.start_col + k
                    else:
                        row1, col1 = placement1.start_row + k, placement1.start_col
                    
                    for l, letter2 in enumerate(placement2.word):
                        if placement2.direction == Direction.HORIZONTAL:
                            row2, col2 = placement2.start_row, placement2.start_col + l
                        else:
                            row2, col2 = placement2.start_row + l, placement2.start_col
                        
                        if row1 == row2 and col1 == col2 and letter1 == letter2:
                            intersections.append({
                                'word1': placement1.word,
                                'word2': placement2.word,
                                'letter': letter1,
                                'row': row1,
                                'col': col1
                            })
        
        return intersections
    
    def _extract_perpendicular_words(self, grid: List[List[Optional[str]]], 
                                   word: str, start_row: int, start_col: int, 
                                   direction: Direction) -> List[str]:
        """Extract all words that would be formed perpendicular to the placed word"""
        perpendicular_words = []
        
        for i in range(len(word)):
            if direction == Direction.HORIZONTAL:
                # Check vertical word formation at each letter position
                col = start_col + i
                
                # Find start of vertical word
                word_start = start_row
                while word_start > 0 and (grid[word_start - 1][col] is not None or word_start - 1 == start_row):
                    word_start -= 1
                
                # Build vertical word
                vertical_word = ""
                row = word_start
                while (row < self.grid_size and 
                       (grid[row][col] is not None or row == start_row)):
                    if row == start_row:
                        vertical_word += word[i]  # The letter we're placing
                    else:
                        vertical_word += grid[row][col]
                    row += 1
                
                if len(vertical_word) > 1:
                    perpendicular_words.append(vertical_word)
            
            else:  # VERTICAL
                # Check horizontal word formation at each letter position
                row = start_row + i
                
                # Find start of horizontal word
                word_start = start_col
                while word_start > 0 and (grid[row][word_start - 1] is not None or word_start - 1 == start_col):
                    word_start -= 1
                
                # Build horizontal word
                horizontal_word = ""
                col = word_start
                while (col < self.grid_size and 
                       (grid[row][col] is not None or col == start_col)):
                    if col == start_col:
                        horizontal_word += word[i]  # The letter we're placing
                    else:
                        horizontal_word += grid[row][col]
                    col += 1
                
                if len(horizontal_word) > 1:
                    perpendicular_words.append(horizontal_word)
        
        return perpendicular_words
    
    def _is_valid_perpendicular_placement(self, grid: List[List[Optional[str]]], 
                                        word: str, start_row: int, start_col: int, 
                                        direction: Direction) -> bool:
        """Check if placing word creates valid perpendicular words"""
        perpendicular_words = self._extract_perpendicular_words(grid, word, start_row, start_col, direction)
        
        unintended_words = []
        for perp_word in perpendicular_words:
            if perp_word not in self.words:
                unintended_words.append(perp_word)
        
        # Allow up to max_unintended_words unintended words
        return len(unintended_words) <= self.max_unintended_words
    
    def _is_connected_to_existing(self, grid: List[List[Optional[str]]], 
                                word: str, start_row: int, start_col: int, 
                                direction: Direction) -> bool:
        """Check if word connects to existing letters on the grid"""
        for i in range(len(word)):
            if direction == Direction.HORIZONTAL:
                row, col = start_row, start_col + i
            else:
                row, col = start_row + i, start_col
            
            # If any position already has a letter, we're connecting
            if grid[row][col] is not None:
                return True
        
        return False