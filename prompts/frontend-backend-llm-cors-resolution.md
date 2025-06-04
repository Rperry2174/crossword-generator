# Frontend vs Backend LLM Integration: CORS Resolution

## Issue Summary

**Problem**: Users reported that topic-based word generation wasn't working properly. When entering "Pixar characters" as a topic, the system was showing generic fallback words (PUZZLE, BRAIN, THINK) instead of Pixar-related terms.

**Root Cause**: The frontend was attempting to make direct API calls to external LLM services (OpenAI, Anthropic) from the browser, which resulted in CORS (Cross-Origin Resource Sharing) errors. Browser security policies block these cross-origin requests.

**Error Evidence**:
```
Access to fetch at 'https://api.anthropic.com/v1/messages' from origin 'http://localhost:3000' has been blocked by CORS policy
```

## Technical Analysis

### Original Architecture (Problematic)
```
Frontend (localhost:3000) → Direct API calls → External LLM APIs
                                              ↑
                                          CORS blocked
```

### Issues with Frontend LLM Calls:
1. **CORS Restrictions**: Browsers block direct calls to external APIs from different origins
2. **API Key Exposure**: Storing API keys in frontend environment variables exposes them to users
3. **Rate Limiting**: No centralized control over API usage
4. **Error Handling**: Limited fallback options when APIs fail

## Solution: Backend LLM Proxy Service

### New Architecture (Resolved)
```
Frontend (localhost:3000) → Backend API (localhost:8000) → External LLM APIs
                           ↑                            ↑
                    No CORS issues              API keys secure
```

### Implementation Details

#### 1. Backend LLM Service (`/backend/src/llm_service.py`)
- **Multi-provider support**: OpenAI, Anthropic, Ollama, and mock data
- **Robust error handling**: Automatic fallback to mock data if APIs fail
- **Comprehensive mock database**: Topic-specific word sets for common themes
- **Environment-based configuration**: Secure API key management

```python
class LLMService:
    @staticmethod
    async def generate_words_from_topic(topic: str) -> List[str]:
        config = LLMService.get_config()
        
        try:
            if config['provider'] == 'openai' and config['openai_key']:
                return await LLMService._call_openai(topic, config)
            elif config['provider'] == 'anthropic' and config['anthropic_key']:
                return await LLMService._call_anthropic(topic, config)
            # ... other providers
        except Exception as e:
            return LLMService._get_mock_words(topic)
```

#### 2. API Endpoint (`/backend/src/api.py`)
Added new endpoint for topic-based word generation:

```python
@app.post("/generate-from-topic", response_model=TopicWordsResponse)
async def generate_words_from_topic(request: TopicRequest):
    words = await LLMService.generate_words_from_topic(topic)
    return TopicWordsResponse(words=words, topic=topic, success=True)
```

#### 3. Frontend Integration (`/frontend/src/services/api.ts`)
Updated to call backend instead of external APIs:

```typescript
static async generateWordsFromTopic(topic: string): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/generate-from-topic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic }),
  });
  
  const data: TopicWordsResponse = await response.json();
  return data.words;
}
```

## Benefits of Backend Approach

### 1. **Security**
- API keys stored securely on server
- No exposure of sensitive credentials to frontend
- Centralized authentication and rate limiting

### 2. **CORS Compliance**
- No cross-origin requests from browser
- Backend acts as proxy for external API calls
- Seamless frontend integration

### 3. **Reliability**
- Automatic fallback to mock data if LLM APIs fail
- Consistent topic-specific word generation
- Better error handling and user experience

### 4. **Scalability**
- Centralized LLM provider management
- Easy to add new providers or switch between them
- Request caching possibilities for future optimization

## Testing Results

**Before Fix**:
```bash
# Frontend console showed CORS errors
# Topic "Pixar characters" returned: [PUZZLE, BRAIN, THINK, ...]
```

**After Fix**:
```bash
curl -X POST "http://localhost:8000/generate-from-topic" \
  -H "Content-Type: application/json" \
  -d '{"topic": "pixar characters"}'

# Returns: [WOODY, BUZZ, TOY, STORY, NEMO, DORY, ...]
```

## Future Enhancements

1. **LLM Provider Configuration**: Environment variables for provider selection
2. **Caching**: Redis cache for frequently requested topics
3. **Rate Limiting**: API quota management per user/session
4. **Monitoring**: Logging and analytics for LLM usage patterns
5. **Custom Prompts**: User-defined prompt templates for word generation

## Files Modified

### Backend
- `src/llm_service.py` - New LLM service with multi-provider support
- `src/api.py` - Added `/generate-from-topic` endpoint
- `Pipfile` - Added `httpx` dependency for HTTP requests

### Frontend
- `src/services/api.ts` - Added backend LLM integration
- `src/components/WordInput.tsx` - Updated to use backend API

This resolution ensures reliable, secure, and scalable LLM integration while maintaining the desired user experience of topic-based crossword generation.