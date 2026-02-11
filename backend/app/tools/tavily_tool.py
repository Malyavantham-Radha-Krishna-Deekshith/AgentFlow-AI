from tavily import TavilyClient
from app.core.config import TAVILY_API_KEY

client = TavilyClient(api_key=TAVILY_API_KEY)

def tavily_search(query: str, max_results: int = 5) -> str:
    """
    Search the web using Tavily and return combined content.
    """
    response = client.search(
        query=query,
        max_results=max_results
    )

    contents = []
    for result in response.get("results", []):
        content = result.get("content")
        if content:
            contents.append(content)

    return "\n".join(contents)
