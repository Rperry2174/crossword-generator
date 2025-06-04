#!/usr/bin/env python3
"""
Simple script to start the FastAPI server
"""
import uvicorn

if __name__ == "__main__":
    print("🚀 Starting Crossword Generator API Server...")
    print("📝 API Documentation will be available at: http://localhost:8000/docs")
    print("🔍 Health check endpoint: http://localhost:8000/health")
    print("🧩 Generate endpoint: http://localhost:8000/generate-crossword")
    print("\n⚡ Starting server on http://localhost:8000")
    
    uvicorn.run(
        "src.api:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        reload_dirs=["src"]
    )