"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

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

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-800 text-white p-2 rounded-md shadow"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
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
        <div className="mb-6">
          <h1 className="font-bold text-lg tracking-wide">
            AgentFlow AI
          </h1>
        </div>

        {/* New Chat Button */}
        <button
          onClick={() => {
            onNewChat();
            setOpen(false);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded-md mb-3 text-sm font-medium"
        >
          + New Chat
        </button>

        {/* Clear All */}
        {chats.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-red-400 hover:text-red-500 text-sm mb-4 transition"
          >
            Clear all chats
          </button>
        )}

        {/* Chat List */}
        <div className="space-y-2 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex justify-between items-center p-2 rounded-md cursor-pointer transition ${
                chat.id === activeId
                  ? "bg-gray-700"
                  : "hover:bg-gray-800"
              }`}
              onClick={() => {
                onSelectChat(chat.id);
                setOpen(false);
              }}
            >
              <span className="truncate text-sm">
                {chat.title}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="text-red-400 hover:text-red-500 text-xs"
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
