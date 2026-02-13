"use client";

import { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

type Chat = {
  id: string;
  title: string;
};

type Props = {
  chats: Chat[];
  activeId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onClearAll: () => void;
};

export default function Sidebar({
  chats,
  activeId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onClearAll,
}: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // 🔒 Prevent SSR / hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-800 text-white p-2 rounded"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X /> : <Menu />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static z-50 h-full w-64
          bg-gray-900 text-white p-4
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-lg">AgentFlow AI</h1>

          {/* Theme toggle (only after mount) */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>

        {/* New chat */}
        <button
          onClick={() => {
            onNewChat();
            setOpen(false);
          }}
          className="w-full bg-blue-600 py-2 rounded mb-3"
        >
          + New Chat
        </button>

        {/* Clear chats */}
        {chats.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-red-400 text-sm mb-4"
          >
            Clear all chats
          </button>
        )}

        {/* Chat list */}
        <div className="space-y-2 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                chat.id === activeId
                  ? "bg-gray-700"
                  : "hover:bg-gray-800"
              }`}
              onClick={() => {
                onSelectChat(chat.id);
                setOpen(false);
              }}
            >
              <span className="truncate text-sm">{chat.title}</span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="text-red-400"
                aria-label="Delete chat"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
