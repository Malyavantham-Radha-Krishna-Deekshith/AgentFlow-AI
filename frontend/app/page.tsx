"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import InputBox from "../components/InputBox";
import { sendMessage } from "../lib/api";
import { saveChats, loadChats } from "../lib/storage";
import { typeText } from "../lib/typing";
import { generateTitleFromText } from "../lib/title";

type AgentMetadata = {
  agent: string;
  intent: string;
  tools_used: string[];
};

type Message = {
  role: "user" | "ai";
  content: string;
  fullContent?: string;
  isExpanded?: boolean;
  metadata?: AgentMetadata; // ✅ STRICT
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* -------------------------------
     AUTO CREATE FIRST CHAT
  -------------------------------- */
  useEffect(() => {
    const { chats: storedChats, activeId } = loadChats();

    if (!storedChats || storedChats.length === 0) {
      const id = crypto.randomUUID();
      const firstChat: Chat = {
        id,
        title: "New Conversation",
        messages: [],
      };
      setChats([firstChat]);
      setActiveChatId(id);
    } else {
      setChats(storedChats);
      setActiveChatId(activeId || storedChats[0].id);
    }
  }, []);

  /* -------------------------------
     Persist Chats
  -------------------------------- */
  useEffect(() => {
    if (chats.length > 0) {
      saveChats(chats, activeChatId);
    }
  }, [chats, activeChatId]);

  /* -------------------------------
     Create Chat
  -------------------------------- */
  const createChat = () => {
    const id = crypto.randomUUID();
    const newChat: Chat = {
      id,
      title: "New Conversation",
      messages: [],
    };

    setChats((prev) => [...prev, newChat]);
    setActiveChatId(id);
  };

  /* -------------------------------
     Delete Chat
  -------------------------------- */
  const deleteChat = (id: string) => {
    if (!confirm("Delete this chat?")) return;

    const updated = chats.filter((c) => c.id !== id);
    setChats(updated);

    if (id === activeChatId) {
      setActiveChatId(updated.length ? updated[0].id : null);
    }
  };

  /* -------------------------------
     Clear All Chats
  -------------------------------- */
  const clearAllChats = () => {
    if (!confirm("Clear all chats?")) return;

    const id = crypto.randomUUID();
    const freshChat: Chat = {
      id,
      title: "New Conversation",
      messages: [],
    };

    setChats([freshChat]);
    setActiveChatId(id);
  };

  /* -------------------------------
     Toggle Expansion
  -------------------------------- */
  const toggleExpansion = (index: number) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: chat.messages.map((m, i) =>
                i === index ? { ...m, isExpanded: !m.isExpanded } : m
              ),
            }
          : chat
      )
    );
  };

  /* -------------------------------
     Send Message
  -------------------------------- */
  const send = async (text: string) => {
    if (!text.trim() || !activeChatId) return;

    const currentChat = chats.find((c) => c.id === activeChatId);
    const isFirstMessage = currentChat?.messages.length === 0;

    setLoading(true);

    // Add user message
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [...chat.messages, { role: "user", content: text }],
            }
          : chat
      )
    );

    try {
      const response = await sendMessage(text);

      const metadata: AgentMetadata = {
        agent: response.agent || "LLM",
        intent: response.intent || "general",
        tools_used: response.tools_used || [],
      };

      const fullResponse = response.answer;

      // Insert AI message
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    role: "ai",
                    content: "",
                    fullContent: fullResponse,
                    isExpanded: false,
                    metadata,
                  },
                ],
              }
            : chat
        )
      );

      // Typing effect
      await typeText(fullResponse, (partial) => {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === activeChatId
              ? {
                  ...chat,
                  messages: chat.messages.map((m, i) =>
                    i === chat.messages.length - 1
                      ? { ...m, content: partial }
                      : m
                  ),
                }
              : chat
          )
        );
      });

      // Generate title
      if (isFirstMessage) {
        const title = generateTitleFromText(text);
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === activeChatId ? { ...chat, title } : chat
          )
        );
      }
    } catch {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    role: "ai",
                    content:
                      "⚠️ Sorry, something went wrong. Please try again.",
                  },
                ],
              }
            : chat
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const activeChat = chats.find((c) => c.id === activeChatId);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar
        chats={chats}
        activeId={activeChatId}
        onNewChat={createChat}
        onSelectChat={setActiveChatId}
        onDeleteChat={deleteChat}
        onClearAll={clearAllChats}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <ChatWindow
          messages={activeChat?.messages || []}
          onToggleExpansion={toggleExpansion}
        />

        {loading && (
          <div className="px-6 py-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
            🤖 Agent is thinking...
          </div>
        )}

        <InputBox onSend={send} />
      </div>
    </div>
  );
}
