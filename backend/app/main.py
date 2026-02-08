from fastapi import FastAPI

app = FastAPI(title="AgentFlow AI")

@app.get("/")
def home():
    return {"message": "AgentFlow backend running"}
