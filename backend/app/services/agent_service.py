from app.graph.agent_graph import build_agent_graph

graph = build_agent_graph()

def run_agentic_flow(query: str) -> str:
    initial_state = {
        "query": query,
        "research": None,
        "plan": None,
        "answer": None,
    }

    final_state = graph.invoke(initial_state)
    return final_state["answer"]
