from app.core.llm import get_llm
from app.graph.state import AgentState

llm = get_llm()

def planner_node(state: AgentState) -> AgentState:
    research_text = state["research"]

    prompt = f"""
You are a planning AI agent.

Research Information:
{research_text}

Task:
Break this information into clear, logical sections or steps.
Use bullet points or numbered steps.
Keep it structured and concise.
"""

    response = llm.invoke(prompt)

    return {
        **state,
        "plan": response.content
    }
