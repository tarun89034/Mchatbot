"""
Production-ready runner for the Mental Health Chatbot API
"""

import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    # Configuration
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    workers = int(os.getenv("WORKERS", 1))
    log_level = os.getenv("LOG_LEVEL", "info").lower()
    reload = os.getenv("ENVIRONMENT", "production") == "development"
    
    # Run the application
    uvicorn.run(
        "app:app",
        host=host,
        port=port,
        workers=workers if not reload else 1,
        log_level=log_level,
        reload=reload,
        access_log=True
    )