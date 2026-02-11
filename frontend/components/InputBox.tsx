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
    <div className="p-4 border-t bg-white flex gap-3">
      <input
        type="text"
        className="flex-1 border rounded-xl px-4 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Ask AgentFlow AI anything..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
      />

      <button
        onClick={handleSend}
        disabled={!text.trim()}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                   text-white px-6 rounded-xl text-sm transition"
      >
        Send
      </button>
    </div>
  );
}
