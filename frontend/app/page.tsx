"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import InputBox from "../components/InputBox";
import { sendMessage } from "../lib/api";
import { saveChats, loadChats } from "../lib/storage";
import { typeText } from "../lib/typing";
import { generateTitleFromText } from "../lib/title";

type Message = {
  role: "user" | "ai";
  content: string;
  fullContent?: string;
  isExpanded?: boolean;
  metadata?: {              
    agent: string;
    intent: string;
    tools_used: string[];
  };
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

  /* Load chats */
  useEffect(() => {
    const { chats, activeId } = loadChats();
    setChats(chats);
    setActiveChatId(activeId);
  }, []);

  /* Persist chats */
  useEffect(() => {
    saveChats(chats, activeChatId);
  }, [chats, activeChatId]);

  const createChat = () => {
    const id = crypto.randomUUID();
    setChats((prev) => [
      ...prev,
      { id, title: "New Conversation", messages: [] },
    ]);
    setActiveChatId(id);
  };

  const deleteChat = (id: string) => {
    if (!confirm("Delete this chat?")) return;
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (id === activeChatId) setActiveChatId(null);
  };

  const clearAllChats = () => {
    if (!confirm("Clear all chats?")) return;
    setChats([]);
    setActiveChatId(null);
  };

  /* ---------------------------------
     CLEAN TEXT - Remove all asterisks
  ---------------------------------- */
  const cleanText = (text: string): string => {
    return text
      .replace(/\*\*/g, '')  // Remove ** (bold markdown)
      .replace(/\*/g, '');    // Remove single * (list markers, etc.)
  };

  /* ---------------------------------
     TRUNCATE AT SENTENCE BOUNDARY
  ---------------------------------- */
  const getPreview = (text: string, sentenceLimit: number = 3) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    
    if (sentences.length <= sentenceLimit) {
      return { preview: text, hasMore: false };
    }
    
    const preview = sentences.slice(0, sentenceLimit).join(' ');
    return { preview, hasMore: true };
  };

  /* ---------------------------------
     TOGGLE EXPANSION
  ---------------------------------- */
  const toggleExpansion = (messageIndex: number) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: chat.messages.map((m, i) =>
                i === messageIndex
                  ? { ...m, isExpanded: !m.isExpanded }
                  : m
              ),
            }
          : chat
      )
    );
  };

  /* ---------------------------------
     SEND MESSAGE
  ---------------------------------- */
  const send = async (text: string) => {
    if (!text.trim() || !activeChatId) return;

    const currentChat = chats.find((c) => c.id === activeChatId);
    const isFirstMessage = currentChat?.messages.length === 0;

    setLoading(true);

    // 1️⃣ Add user message
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
      // 2️⃣ Call LLM - ✨ NOW CAPTURES METADATA
      const response = await sendMessage(text);
      
      // 3️⃣ Clean the full response (remove all asterisks)
      const cleanedFullResponse = cleanText(response.answer);

      // 4️⃣ Get preview (2-3 sentences from cleaned text)
      const { preview, hasMore } = getPreview(cleanedFullResponse, 3);

      // 5️⃣ Insert empty AI message - ✨ WITH METADATA
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
                    fullContent: cleanedFullResponse,  // Store cleaned full content
                    isExpanded: false,
                    metadata: {                        // ✨ ADDED METADATA CAPTURE
                      agent: response.agent,
                      intent: response.intent,
                      tools_used: response.tools_used || [],
                    },
                  },
                ],
              }
            : chat
        )
      );

      // 6️⃣ Typing effect (ONLY PREVIEW - already cleaned)
      await typeText(preview, (partial) => {
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

      // 7️⃣ Generate chat title once
      if (isFirstMessage) {
        let title = generateTitleFromText(text);
        try {
          const t = await sendMessage(
            `Generate a short 3-5 word chat title for: "${text}"`
          );
          title = generateTitleFromText(t.answer);
        } catch {}

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
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        chats={chats}
        activeId={activeChatId}
        onNewChat={createChat}
        onSelectChat={setActiveChatId}
        onDeleteChat={deleteChat}
        onClearAll={clearAllChats}
      />

      <div className="flex flex-col flex-1">
        <ChatWindow 
          messages={activeChat?.messages || []} 
          onToggleExpansion={toggleExpansion}
        />

        {loading && (
          <div className="px-6 py-2 text-sm text-gray-500">
            🤖 Agent is thinking...
          </div>
        )}

        {activeChat && <InputBox onSend={send} />}
      </div>
    </div>
  );
}