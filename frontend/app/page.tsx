"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { sendMessage } from "../lib/api";
import { saveChats, loadChats } from "../lib/storage";
import { typeText } from "../lib/typing";
import { generateTitleFromText } from "../lib/title";

/* ─── Types ───────────────────────────────────────────────────── */
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
  metadata?: AgentMetadata;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

/* ─── Icons ───────────────────────────────────────────────────── */
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const ClearIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
  </svg>
);

const BotIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="10" rx="2"/>
    <circle cx="12" cy="5" r="2"/><line x1="12" y1="7" x2="12" y2="11"/>
    <line x1="8" y1="16" x2="8" y2="16" strokeWidth="3" strokeLinecap="round"/>
    <line x1="12" y1="16" x2="12" y2="16" strokeWidth="3" strokeLinecap="round"/>
    <line x1="16" y1="16" x2="16" y2="16" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

/* ─── Empty State ─────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <BotIcon />
      </div>
      <h2>AgentFlow AI</h2>
      <p>Your intelligent agent is ready. Ask anything — from web research to code generation.</p>
    </div>
  );
}

/* ─── Thinking Indicator ──────────────────────────────────────── */
function ThinkingIndicator() {
  return (
    <div className="thinking-bar">
      <div className="thinking-inner">
        <div className="thinking-dots">
          <span /><span /><span />
        </div>
        <span>Agent is thinking…</span>
      </div>
    </div>
  );
}

/* ─── Message Row ─────────────────────────────────────────────── */
function MessageRow({
  message,
  index,
  onToggle,
}: {
  message: Message;
  index: number;
  onToggle: (i: number) => void;
}) {
  const isUser = message.role === "user";
  const displayContent =
    message.fullContent && !message.isExpanded
      ? message.content.length > 600
        ? message.content.slice(0, 600) + "…"
        : message.content
      : message.content;

  return (
    <div className={`message-row ${isUser ? "user-row" : "ai-row"}`}>
      <div className={`message-avatar ${isUser ? "user-avatar" : "ai-avatar"}`}>
        {isUser ? "U" : <BotIcon />}
      </div>

      <div className="message-bubble">
        {isUser ? (
          <div className="message-content user-content">
            {displayContent}
          </div>
        ) : (
          <div className="message-content ai-content">
            <ReactMarkdown>{displayContent}</ReactMarkdown>
          </div>
        )}

        {/* Expand/Collapse for long AI messages */}
        {!isUser && message.fullContent && message.fullContent.length > 600 && (
          <button className="expand-btn" onClick={() => onToggle(index)}>
            {message.isExpanded ? "↑ Show less" : "↓ Show more"}
          </button>
        )}

        {/* Metadata badges */}
        {!isUser && message.metadata && (
          <div className="metadata-bar">
            <span className="meta-badge agent">⚡ {message.metadata.agent}</span>
            {message.metadata.intent && (
              <span className="meta-badge">{message.metadata.intent}</span>
            )}
            {message.metadata.tools_used?.map((tool) => (
              <span key={tool} className="meta-badge">🔧 {tool}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Sidebar ─────────────────────────────────────────────────── */
function Sidebar({
  chats,
  activeId,
  onNewChat,
  onSelect,
  onDelete,
  onClearAll,
}: {
  chats: Chat[];
  activeId: string | null;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-dot" />
          AgentFlow AI
        </div>
        <button className="btn-new-chat" onClick={onNewChat}>
          <PlusIcon />
          New conversation
        </button>
      </div>

      {chats.length > 0 && (
        <div className="sidebar-section-label">Recent</div>
      )}

      <div className="sidebar-list">
        {[...chats].reverse().map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${chat.id === activeId ? "active" : ""}`}
            onClick={() => onSelect(chat.id)}
          >
            <span className="chat-item-title">{chat.title}</span>
            <button
              className="chat-item-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(chat.id);
              }}
              title="Delete"
            >
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="btn-clear-all" onClick={onClearAll}>
          <ClearIcon />
          Clear all chats
        </button>
      </div>
    </aside>
  );
}

/* ─── Input Box ───────────────────────────────────────────────── */
function InputBox({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled: boolean;
}) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  };

  const submit = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
    if (ref.current) ref.current.style.height = "auto";
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="input-area">
      <div className="input-inner">
        <div className="input-form">
          <textarea
            ref={ref}
            className="input-textarea"
            value={value}
            placeholder="Message AgentFlow…"
            rows={1}
            onChange={(e) => { setValue(e.target.value); autoResize(); }}
            onKeyDown={handleKey}
            disabled={disabled}
          />
          <button
            className="send-btn"
            onClick={submit}
            disabled={!value.trim() || disabled}
            title="Send"
          >
            <SendIcon />
          </button>
        </div>
        <div className="input-hint">
          Press Enter to send · Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* Load / init */
  useEffect(() => {
    const { chats: stored, activeId } = loadChats();
    if (!stored || stored.length === 0) {
      const id = crypto.randomUUID();
      const first: Chat = { id, title: "New Conversation", messages: [] };
      setChats([first]);
      setActiveChatId(id);
    } else {
      setChats(stored);
      setActiveChatId(activeId || stored[0].id);
    }
  }, []);

  /* Persist */
  useEffect(() => {
    if (chats.length > 0) saveChats(chats, activeChatId);
  }, [chats, activeChatId]);

  /* Scroll to bottom on new messages */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, loading]);

  const createChat = () => {
    const id = crypto.randomUUID();
    setChats((p) => [...p, { id, title: "New Conversation", messages: [] }]);
    setActiveChatId(id);
  };

  const deleteChat = (id: string) => {
    if (!confirm("Delete this chat?")) return;
    const updated = chats.filter((c) => c.id !== id);
    setChats(updated);
    if (id === activeChatId) setActiveChatId(updated[0]?.id ?? null);
  };

  const clearAllChats = () => {
    if (!confirm("Clear all chats?")) return;
    const id = crypto.randomUUID();
    const fresh: Chat = { id, title: "New Conversation", messages: [] };
    setChats([fresh]);
    setActiveChatId(id);
  };

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

  const send = async (text: string) => {
    if (!text.trim() || !activeChatId) return;
    const currentChat = chats.find((c) => c.id === activeChatId);
    const isFirst = currentChat?.messages.length === 0;
    setLoading(true);

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, { role: "user", content: text }] }
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

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { role: "ai", content: "", fullContent: fullResponse, isExpanded: false, metadata },
                ],
              }
            : chat
        )
      );

      await typeText(fullResponse, (partial) => {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === activeChatId
              ? {
                  ...chat,
                  messages: chat.messages.map((m, i) =>
                    i === chat.messages.length - 1 ? { ...m, content: partial } : m
                  ),
                }
              : chat
          )
        );
      });

      if (isFirst) {
        const title = generateTitleFromText(text);
        setChats((prev) =>
          prev.map((chat) => (chat.id === activeChatId ? { ...chat, title } : chat))
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
                  { role: "ai", content: "⚠️ Something went wrong. Please try again." },
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
    <div className="app-shell">
      <Sidebar
        chats={chats}
        activeId={activeChatId}
        onNewChat={createChat}
        onSelect={setActiveChatId}
        onDelete={deleteChat}
        onClearAll={clearAllChats}
      />

      <main className="main-area">
        <div className="chat-window">
          <div className="messages-inner">
            {!activeChat?.messages.length ? (
              <EmptyState />
            ) : (
              activeChat.messages.map((msg, i) => (
                <MessageRow
                  key={i}
                  message={msg}
                  index={i}
                  onToggle={toggleExpansion}
                />
              ))
            )}
            {loading && <ThinkingIndicator />}
            <div ref={bottomRef} />
          </div>
        </div>

        <InputBox onSend={send} disabled={loading} />
      </main>
    </div>
  );
}