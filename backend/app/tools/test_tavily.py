from app.tools.tavily_tool import tavily_search

if __name__ == "__main__":
    data = tavily_search("What is Agentic AI?")
    print(data[:800])
