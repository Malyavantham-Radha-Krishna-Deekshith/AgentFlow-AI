"use client";

import { useState } from "react";

type Props = {
  onSend: (text: string) => void;
};

export default function InputBox({ onSend }: Props) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div
      className="
        sticky bottom-0 z-20
        p-3 sm:p-4
        border-t
        bg-white dark:bg-gray-900
        flex gap-2 sm:gap-3
      "
    >
      <input
        type="text"
        className="
          flex-1
          border border-gray-300 dark:border-gray-700
          rounded-xl
          px-4 py-2
          text-sm
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none
          focus:ring-2 focus:ring-blue-500
        "
        placeholder="Ask AgentFlow AI anything..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
          }
        }}
      />

      <button
        onClick={handleSend}
        disabled={!text.trim()}
        className="
          bg-blue-600 hover:bg-blue-700
          disabled:bg-blue-400
          text-white
          px-4 sm:px-6
          rounded-xl
          text-sm
          transition
          whitespace-nowrap
        "
      >
        Send
      </button>
    </div>
  );
}
