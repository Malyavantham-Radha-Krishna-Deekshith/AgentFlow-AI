from app.agents.research_agent import research_agent
from app.agents.planner_agent import planner_agent
from app.agents.writer_agent import writer_agent

if __name__ == "__main__":
    research = research_agent("Explain Agentic AI in simple terms")
    plan = planner_agent(research)
    final_answer = writer_agent(plan)
    print(final_answer)
