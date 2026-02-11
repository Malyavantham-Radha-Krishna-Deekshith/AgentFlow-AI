from langgraph.graph import StateGraph, END
from app.graph.state import AgentState
from app.agents.research_agent import research_node
from app.agents.planner_agent import planner_node
from app.agents.writer_agent import writer_node

def build_agent_graph():
    graph = StateGraph(AgentState)

    graph.add_node("research", research_node)
    graph.add_node("planner", planner_node)
    graph.add_node("writer", writer_node)

    graph.set_entry_point("research")

    graph.add_edge("research", "planner")
    graph.add_edge("planner", "writer")
    graph.add_edge("writer", END)

    return graph.compile()
