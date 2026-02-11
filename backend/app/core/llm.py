from langchain_groq import ChatGroq
from app.core.config import GROQ_API_KEY

def get_llm():
    return ChatGroq(
        model="llama-3.1-8b-instant",
        api_key=GROQ_API_KEY,
        temperature=0.7,      # Changed from 0.1
        max_tokens=800,       # Changed from 120
        timeout=15,           # Changed from 8
    )