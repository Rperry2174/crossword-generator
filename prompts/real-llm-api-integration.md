# Real LLM API Integration

**User prompt:**

lets actually implement the llm api call and also in the prompt let's give it an example of what the input and output would looklike

## Implementation Requirements:

### **LLM Service Integration:**
1. **Real API Call**: Replace mock service with actual LLM API
2. **Structured Prompt**: Clear instructions with input/output examples
3. **Error Handling**: Robust fallbacks for API failures
4. **Environment Variables**: Secure API key management

### **Prompt Engineering:**

#### **Input Example:**
```
Topic: "Basketball"
```

#### **Expected Output Example:**
```
BASKETBALL,PLAYER,COURT,HOOP,DUNK,SCORE,TEAM,COACH,REFEREE,FOUL,TIMEOUT,QUARTER,POINT,GUARD,FORWARD,CENTER,REBOUND,ASSIST,STEAL,BLOCK,SHOT,LAYUP,JERSEY,ARENA,PLAYOFFS,CHAMPIONSHIP,LEAGUE,DRAFT,ROOKIE,VETERAN
```

### **LLM Prompt Template:**
```
You are helping create a crossword puzzle. Generate exactly 30 words related to the topic "{TOPIC}".

Requirements:
- Words should be 3-15 letters long
- Use common English words that most people would know
- Choose words with good crossword potential (mix of vowels and consonants)
- Avoid proper nouns, acronyms, or very technical terms
- Return ONLY the words in uppercase, separated by commas
- No explanations, just the comma-separated word list

Topic: {TOPIC}

Example Input: "Basketball"
Example Output: BASKETBALL,PLAYER,COURT,HOOP,DUNK,SCORE,TEAM,COACH,REFEREE,FOUL,TIMEOUT,QUARTER,POINT,GUARD,FORWARD,CENTER,REBOUND,ASSIST,STEAL,BLOCK,SHOT,LAYUP,JERSEY,ARENA,PLAYOFFS,CHAMPIONSHIP,LEAGUE,DRAFT,ROOKIE,VETERAN

Now generate 30 words for the topic: "{TOPIC}"
```

### **API Options to Support:**
1. **OpenAI GPT**: Most popular, reliable
2. **Anthropic Claude**: High quality responses
3. **Google Gemini**: Good alternative
4. **Ollama**: Local LLM option
5. **Generic REST API**: Configurable endpoint

### **Implementation Features:**
- **Environment Configuration**: API keys and endpoints
- **Response Parsing**: Extract words from LLM response
- **Validation**: Ensure 30 words, proper format
- **Fallback Strategy**: Use mock data if API fails
- **Rate Limiting**: Handle API quotas gracefully
- **Caching**: Optional caching for repeated topics

### **Security Considerations:**
- **API Key Protection**: Environment variables only
- **Input Sanitization**: Clean topic input
- **Response Validation**: Verify output format
- **Error Logging**: Track API issues without exposing keys