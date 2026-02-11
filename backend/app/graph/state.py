from typing import TypedDict, Optional

class AgentState(TypedDict):
    query: str
    research: Optional[str]
    plan: Optional[str]
    answer: Optional[str]
