from app.core.llm import get_llm
from app.graph.state import AgentState

llm = get_llm()

def writer_node(state: AgentState) -> AgentState:
    plan_text = state["plan"]

    prompt = f"""
You are a writer AI agent.

Structured Plan:
{plan_text}

Task:
Convert this into a clear, well-written explanation.
Use headings and short paragraphs.
Keep the tone professional and easy to understand.
"""

    response = llm.invoke(prompt)

    return {
        **state,
        "answer": response.content
    }
