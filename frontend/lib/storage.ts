const CHAT_KEY = "agentflow_chats";
const ACTIVE_CHAT_KEY = "agentflow_active_chat";

export function saveChats(chats: any[], activeId: string | null) {
  try {
    localStorage.setItem(CHAT_KEY, JSON.stringify(chats));
    localStorage.setItem(ACTIVE_CHAT_KEY, activeId ?? "");
  } catch (error) {
    console.error("Failed to save chats:", error);
  }
}

export function loadChats() {
  try {
    const chats = localStorage.getItem(CHAT_KEY);
    const activeId = localStorage.getItem(ACTIVE_CHAT_KEY);

    return {
      chats: chats ? JSON.parse(chats) : [],
      activeId: activeId || null,
    };
  } catch (error) {
    console.error("Failed to load chats:", error);
    return {
      chats: [],
      activeId: null,
    };
  }
}
