import os
import httpx
from typing import List, Optional
import json

class LLMService:
    
    @staticmethod
    def get_config():
        return {
            'provider': os.getenv('LLM_PROVIDER', 'mock'),
            'openai_key': os.getenv('OPENAI_API_KEY'),
            'anthropic_key': os.getenv('ANTHROPIC_API_KEY'),
            'ollama_url': os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434')
        }
    
    @staticmethod
    def create_prompt(topic: str) -> str:
        return f"""You are helping create a crossword puzzle. Generate exactly 30 words related to the topic "{topic}".

Requirements:
- Words should be 3-15 letters long
- Use common English words that most people would know
- Choose words with good crossword potential (mix of vowels and consonants)
- Avoid proper nouns, acronyms, or very technical terms
- Return ONLY the words in uppercase, separated by commas
- No explanations, just the comma-separated word list

Topic: {topic}

Example Input: "Basketball"
Example Output: BASKETBALL,PLAYER,COURT,HOOP,DUNK,SCORE,TEAM,COACH,REFEREE,FOUL,TIMEOUT,QUARTER,POINT,GUARD,FORWARD,CENTER,REBOUND,ASSIST,STEAL,BLOCK,SHOT,LAYUP,JERSEY,ARENA,PLAYOFFS,CHAMPIONSHIP,LEAGUE,DRAFT,ROOKIE,VETERAN

Now generate 30 words for the topic: "{topic}\""""

    @staticmethod
    async def generate_words_from_topic(topic: str) -> List[str]:
        config = LLMService.get_config()
        
        try:
            if config['provider'] == 'openai' and config['openai_key']:
                return await LLMService._call_openai(topic, config)
            elif config['provider'] == 'anthropic' and config['anthropic_key']:
                return await LLMService._call_anthropic(topic, config)
            elif config['provider'] == 'ollama':
                return await LLMService._call_ollama(topic, config)
            else:
                return LLMService._get_mock_words(topic)
        except Exception as e:
            print(f"LLM API failed: {e}, falling back to mock")
            return LLMService._get_mock_words(topic)
    
    @staticmethod
    async def _call_openai(topic: str, config: dict) -> List[str]:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                'https://api.openai.com/v1/chat/completions',
                headers={
                    'Authorization': f"Bearer {config['openai_key']}",
                    'Content-Type': 'application/json'
                },
                json={
                    'model': 'gpt-3.5-turbo',
                    'messages': [{'role': 'user', 'content': LLMService.create_prompt(topic)}],
                    'max_tokens': 500,
                    'temperature': 0.7
                },
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
            content = data['choices'][0]['message']['content']
            return LLMService._parse_words(content)
    
    @staticmethod
    async def _call_anthropic(topic: str, config: dict) -> List[str]:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                'https://api.anthropic.com/v1/messages',
                headers={
                    'x-api-key': config['anthropic_key'],
                    'Content-Type': 'application/json',
                    'anthropic-version': '2023-06-01'
                },
                json={
                    'model': 'claude-3-haiku-20240307',
                    'max_tokens': 500,
                    'messages': [{'role': 'user', 'content': LLMService.create_prompt(topic)}]
                },
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
            content = data['content'][0]['text']
            return LLMService._parse_words(content)
    
    @staticmethod
    async def _call_ollama(topic: str, config: dict) -> List[str]:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{config['ollama_url']}/api/generate",
                json={
                    'model': 'llama2',
                    'prompt': LLMService.create_prompt(topic),
                    'stream': False
                },
                timeout=60.0
            )
            response.raise_for_status()
            data = response.json()
            content = data['response']
            return LLMService._parse_words(content)
    
    @staticmethod
    def _parse_words(content: str) -> List[str]:
        # Find line with comma-separated words
        lines = content.split('\n')
        word_line = ''
        
        for line in lines:
            if ',' in line and len(line.split(',')) > 10:
                word_line = line.strip()
                break
        
        if not word_line:
            # Try to extract from entire content
            import re
            matches = re.findall(r'[A-Z]{3,15}', content)
            if matches and len(matches) > 10:
                word_line = ','.join(matches[:30])
        
        if not word_line:
            raise ValueError("Could not parse words from LLM response")
        
        # Parse and validate
        words = [w.strip().upper() for w in word_line.split(',')]
        words = [w for w in words if w.isalpha() and 3 <= len(w) <= 15]
        
        if len(words) < 10:
            raise ValueError(f"Too few valid words: {len(words)}")
        
        return words[:30]
    
    @staticmethod
    def _get_mock_words(topic: str) -> List[str]:
        topic_lower = topic.lower()
        
        mock_data = {
            'pixar': ['WOODY', 'BUZZ', 'TOY', 'STORY', 'MONSTER', 'SULLIVAN', 'MIKE', 'INCREDIBLES', 'DASH', 'VIOLET', 'ELASTIGIRL', 'FROZONE', 'CARS', 'LIGHTNING', 'MATER', 'NEMO', 'DORY', 'MARLIN', 'RATATOUILLE', 'REMY', 'LINGUINI', 'WALL', 'EVE', 'AUTO', 'UP', 'CARL', 'RUSSELL', 'DUG', 'ELLIE', 'BRAVE'],
            'pixar characters': ['WOODY', 'BUZZ', 'TOY', 'STORY', 'MONSTER', 'SULLIVAN', 'MIKE', 'INCREDIBLES', 'DASH', 'VIOLET', 'ELASTIGIRL', 'FROZONE', 'CARS', 'LIGHTNING', 'MATER', 'NEMO', 'DORY', 'MARLIN', 'RATATOUILLE', 'REMY', 'LINGUINI', 'WALL', 'EVE', 'AUTO', 'UP', 'CARL', 'RUSSELL', 'DUG', 'ELLIE', 'BRAVE'],
            'the office': ['DWIGHT', 'JIM', 'PAM', 'MICHAEL', 'ANGELA', 'KEVIN', 'OSCAR', 'STANLEY', 'PHYLLIS', 'CREED', 'MEREDITH', 'KELLY', 'RYAN', 'TOBY', 'ERIN', 'HOLLY', 'SCRANTON', 'DUNDIES', 'BEARS', 'BEETS', 'BATTLESTAR', 'PAPER', 'SALES', 'MANAGER', 'RECEPTIONIST', 'ACCOUNTING', 'WAREHOUSE', 'ANNEX', 'CONFERENCE', 'PARTY'],
            'basketball': ['BASKETBALL', 'PLAYER', 'COURT', 'HOOP', 'DUNK', 'SCORE', 'TEAM', 'COACH', 'REFEREE', 'FOUL', 'TIMEOUT', 'QUARTER', 'POINT', 'GUARD', 'FORWARD', 'CENTER', 'REBOUND', 'ASSIST', 'STEAL', 'BLOCK', 'SHOT', 'LAYUP', 'JERSEY', 'ARENA', 'PLAYOFFS', 'CHAMPIONSHIP', 'LEAGUE', 'DRAFT', 'ROOKIE', 'VETERAN']
        }
        
        # Try exact match
        if topic_lower in mock_data:
            return mock_data[topic_lower]
        
        # Try partial match
        for key, words in mock_data.items():
            if key in topic_lower or topic_lower in key:
                return words
        
        # Generic fallback
        return ['WORD', 'LETTER', 'PUZZLE', 'GAME', 'PLAY', 'FUN', 'BRAIN', 'THINK', 'SOLVE', 'CROSS', 'DOWN', 'ACROSS', 'CLUE', 'ANSWER', 'GRID', 'BOX', 'LINE', 'SQUARE', 'BLACK', 'WHITE', 'NUMBER', 'COUNT', 'TOTAL', 'SUM', 'ADD', 'MAKE', 'CREATE', 'BUILD', 'FORM', 'SHAPE']