import os
from dotenv import load_dotenv

load_dotenv()

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not TAVILY_API_KEY:
    raise ValueError("TAVILY_API_KEY not set")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not set")
