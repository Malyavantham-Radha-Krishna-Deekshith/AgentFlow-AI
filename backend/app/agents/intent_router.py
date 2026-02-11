# backend/app/agents/intent_router.py

from typing import Literal

Intent = Literal["llm", "search", "research"]


def route_intent(query: str) -> Intent:
    q = query.lower()

    search_keywords = [
        "latest",
        "recent",
        "news",
        "today",
        "current",
        "update",
        "score",
        "match",
        "price",
        "weather",
    ]

    research_keywords = [
        "explain",
        "overview",
        "about",
        "research",
        "analysis",
        "study",
        "history",
        "impact",
        "future",
    ]

    if any(word in q for word in search_keywords):
        return "search"

    if any(word in q for word in research_keywords):
        return "research"

    return "llm"
