from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.services.intent_service import handle_query

app = FastAPI(title="AgentFlow AI")

# Enable CORS for frontend communication (dev-safe)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str


@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    """
    Agent-powered chat endpoint
    Returns answer + agent metadata
    """
    result = handle_query(request.query)
    return result


@app.get("/")
def health_check():
    return {"status": "AgentFlow AI backend running"}
