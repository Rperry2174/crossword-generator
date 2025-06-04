# LLM Topic-Based Crossword Generation

**User prompt:**

ok now let's put the current "generate custom crossword" to have two tabs.. one that generates the custom crossword as is. And another, which should become the default that allows you to type a topic. Once you type that topic then an LLM should be instructed to come up with a crossword with 30 items about that topic. The items should be generated in the proper format (comma separated) as that is what the backend takes.

## Requirements Specified:

### **UI Structure Changes:**
1. **Tabbed Interface**: Convert current word input form into a two-tab system
2. **Tab 1 - Topic Generation (Default)**: 
   - Single input field for topic (e.g., "The Office", "World War II", "Basketball")
   - LLM generates 30 related words
   - Words automatically formatted as comma-separated list
   - Seamless integration with existing backend
3. **Tab 2 - Custom Words**: 
   - Keep existing manual word input functionality
   - Maintain current comma-separated input format

### **LLM Integration:**
1. **Topic Processing**: Accept user topic input
2. **Word Generation**: LLM creates 30 topical words suitable for crosswords
3. **Format Compliance**: Output words in exact comma-separated format for backend
4. **Quality Control**: Ensure words are crossword-appropriate (good length, common letters)

### **User Experience Flow:**
```
Topic Input → LLM Processing → Word List Generation → Backend Crossword Creation → Interactive Puzzle
    ↓              ↓                    ↓                      ↓                        ↓
"Basketball"   AI generates      "BASKETBALL,PLAYER,     Crossword algorithm    Playable crossword
               30 words          COURT,DUNK,SCORE..."    creates valid grid     with topic words
```

### **Implementation Requirements:**
1. **Tab Component**: Clean switching between topic and custom modes
2. **LLM Service**: Integration with AI model for word generation
3. **Loading States**: Show progress during LLM processing
4. **Error Handling**: Fallbacks if LLM generation fails
5. **Seamless Backend**: Generated words use existing crossword API

### **Technical Architecture:**
- **Frontend**: Tabbed interface with topic input
- **LLM Service**: Word generation from topics
- **Existing Backend**: Unchanged crossword generation API
- **Data Flow**: Topic → LLM → Words → Crossword → UI

### **Example Topics to Support:**
- TV Shows: "The Office", "Friends", "Breaking Bad"
- History: "World War II", "Ancient Rome", "American Revolution"
- Sports: "Basketball", "Soccer", "Olympics"
- Science: "Space", "Chemistry", "Biology"
- General: "Food", "Animals", "Technology"

This creates the complete vision: users enter any topic and get a fully playable crossword puzzle about that subject matter.