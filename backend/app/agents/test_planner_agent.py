from app.agents.research_agent import research_agent
from app.agents.planner_agent import planner_agent

if __name__ == "__main__":
    research = research_agent("Explain Agentic AI in simple terms")
    plan = planner_agent(research)
    print(plan)
