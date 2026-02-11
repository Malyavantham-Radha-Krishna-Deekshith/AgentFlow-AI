export type AgentResponse = {
  answer: string;
  agent: string;
  intent: string;
  tools_used: string[];
};

export async function sendMessage(query: string): Promise<AgentResponse> {
  const response = await fetch("https://agentflow-backend-cgqf.onrender.com/chat", {  // ← Changed here
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch response");
  }

  return response.json();
}