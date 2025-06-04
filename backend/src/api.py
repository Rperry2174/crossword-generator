from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import json
import uuid
from src.crossword_generator import CrosswordGenerator
from src.models import Direction
from src.llm_service import LLMService

app = FastAPI(title="Crossword Generator API", version="1.0.0")

# In-memory storage for clue data (could be replaced with Redis/database in production)
clue_storage: Dict[str, Dict[str, str]] = {}

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WordListRequest(BaseModel):
    words: List[str]

class TopicRequest(BaseModel):
    topic: str

class TopicWordsResponse(BaseModel):
    words: List[str]
    topic: str
    success: bool
    message: str
    crossword_id: Optional[str] = None

class ClueData(BaseModel):
    word: str
    clue: str

class CluesResponse(BaseModel):
    clues: Dict[str, str]  # word -> clue mapping
    crossword_id: str
    success: bool
    message: str

class WordPlacementResponse(BaseModel):
    word: str
    start_row: int
    start_col: int
    direction: str
    number: int

class CrosswordResponse(BaseModel):
    grid: List[List[Optional[str]]]
    width: int
    height: int
    word_placements: List[WordPlacementResponse]
    success: bool
    message: str
    crossword_id: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "Crossword Generator API", "status": "running"}

@app.post("/generate-crossword", response_model=CrosswordResponse)
async def generate_crossword(request: WordListRequest):
    try:
        # Validate input
        if not request.words or len(request.words) < 2:
            raise HTTPException(
                status_code=400, 
                detail="Please provide at least 2 words"
            )
        
        # Clean and validate words
        cleaned_words = []
        for word in request.words:
            cleaned_word = word.strip().upper()
            if not cleaned_word.isalpha():
                raise HTTPException(
                    status_code=400,
                    detail=f"Word '{word}' contains invalid characters. Only letters allowed."
                )
            if len(cleaned_word) < 2:
                raise HTTPException(
                    status_code=400,
                    detail=f"Word '{word}' is too short. Minimum 2 letters required."
                )
            cleaned_words.append(cleaned_word)
        
        # Generate crossword
        generator = CrosswordGenerator(cleaned_words)
        crossword = generator.generate_crossword()
        
        # Check if crossword was successfully generated
        if len(crossword.word_placements) < 2:
            return CrosswordResponse(
                grid=[],
                width=0,
                height=0,
                word_placements=[],
                success=False,
                message=f"Could not generate a valid crossword with the given words. Only {len(crossword.word_placements)} words could be placed. Try different words with more overlapping letters."
            )
        
        # Assign numbers to word placements
        numbered_placements = []
        number = 1
        
        # Sort placements by row, then column to assign numbers consistently
        sorted_placements = sorted(crossword.word_placements, 
                                 key=lambda p: (p.start_row, p.start_col))
        
        # Assign numbers to starting positions
        position_numbers = {}
        for placement in sorted_placements:
            pos_key = (placement.start_row, placement.start_col)
            if pos_key not in position_numbers:
                position_numbers[pos_key] = number
                number += 1
        
        # Create response with numbered placements
        for placement in crossword.word_placements:
            pos_key = (placement.start_row, placement.start_col)
            numbered_placements.append(WordPlacementResponse(
                word=placement.word,
                start_row=placement.start_row,
                start_col=placement.start_col,
                direction=placement.direction.value,
                number=position_numbers[pos_key]
            ))
        
        return CrosswordResponse(
            grid=crossword.grid,
            width=crossword.width,
            height=crossword.height,
            word_placements=numbered_placements,
            success=True,
            message=f"Successfully generated crossword with {len(crossword.word_placements)} words"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@app.post("/generate-from-topic", response_model=TopicWordsResponse)
async def generate_words_from_topic(request: TopicRequest):
    try:
        # Validate input
        if not request.topic or not request.topic.strip():
            raise HTTPException(
                status_code=400,
                detail="Please provide a topic"
            )
        
        topic = request.topic.strip()
        
        # Generate words and clues using LLM service
        word_clue_data = await LLMService.generate_words_and_clues_from_topic(topic)
        
        # Extract words and create clue mapping
        words = [item['word'] for item in word_clue_data]
        clue_mapping = {item['word']: item['clue'] for item in word_clue_data}
        
        # Generate unique ID for this crossword session
        crossword_id = str(uuid.uuid4())
        
        # Store clue data for later retrieval
        clue_storage[crossword_id] = clue_mapping
        
        return TopicWordsResponse(
            words=words,
            topic=topic,
            success=True,
            message=f"Successfully generated {len(words)} words for topic '{topic}'",
            crossword_id=crossword_id
        )
        
    except Exception as e:
        print(f"Error generating words for topic '{request.topic}': {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate words for topic: {str(e)}"
        )

@app.get("/clues/{crossword_id}", response_model=CluesResponse)
async def get_clues(crossword_id: str):
    try:
        if crossword_id not in clue_storage:
            raise HTTPException(
                status_code=404,
                detail=f"Crossword ID '{crossword_id}' not found. Clues may have expired."
            )
        
        clues = clue_storage[crossword_id]
        
        return CluesResponse(
            clues=clues,
            crossword_id=crossword_id,
            success=True,
            message=f"Retrieved {len(clues)} clues for crossword"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving clues for crossword '{crossword_id}': {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve clues: {str(e)}"
        )

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "crossword-generator"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)