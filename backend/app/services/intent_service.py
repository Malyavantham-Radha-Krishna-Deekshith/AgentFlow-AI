# backend/app/services/intent_service.py

from app.agents.intent_router import route_intent
from app.core.llm import get_llm
from app.tools.tavily_tool import tavily_search

llm = get_llm()


def handle_query(query: str) -> dict:
    """
    Agentic entry point:
    - decides intent
    - routes to tools
    - returns answer + agent metadata
    """

    intent = route_intent(query)

    # 1️⃣ LLM-only agent (concepts, definitions)
    if intent == "llm":
        response = llm.invoke(query)
        return {
            "answer": response.content,
            "agent": "llm_agent",
            "intent": "llm",
            "tools_used": []
        }

    # 2️⃣ Search agent (latest / factual info)
    if intent == "search":
        search_results = tavily_search(query)

        prompt = f"""
        Based on the following web search results, answer the question clearly.

        Search Results:
        {search_results}

        Question:
        {query}
        """

        response = llm.invoke(prompt)
        return {
            "answer": response.content,
            "agent": "search_agent",
            "intent": "search",
            "tools_used": ["tavily"]
        }

    # 3️⃣ Research agent (search + structured explanation)
    if intent == "research":
        search_results = tavily_search(query)

        prompt = f"""
        Use the following information to provide a clear and complete explanation.

        Research Data:
        {search_results}

        Topic:
        {query}
        """

        response = llm.invoke(prompt)
        return {
            "answer": response.content,
            "agent": "research_agent",
            "intent": "research",
            "tools_used": ["tavily"]
        }

    # Fallback (safety)
    response = llm.invoke(query)
    return {
        "answer": response.content,
        "agent": "fallback_agent",
        "intent": "unknown",
        "tools_used": []
    }
