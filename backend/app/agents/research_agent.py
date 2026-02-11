from app.tools.tavily_tool import tavily_search
from app.core.llm import get_llm
from app.graph.state import AgentState

llm = get_llm()

def research_node(state: AgentState) -> AgentState:
    query = state["query"]

    web_data = tavily_search(query)

    prompt = f"""
You are a research-focused AI agent.

User Query:
{query}

Web Data:
{web_data}

Task:
Extract the most important, accurate, and relevant insights.
Avoid repetition. Be concise and informative.
"""

    response = llm.invoke(prompt)

    return {
        **state,
        "research": response.content
    }
