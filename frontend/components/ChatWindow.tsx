import FormattedMessage from "./FormattedMessage";
import AgentBadge from "./AgentBadge";

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
  metadata?: AgentMetadata; // ✅ OPTIONAL (FIX)
};

type ChatWindowProps = {
  messages: Message[];
  onToggleExpansion: (index: number) => void;
};

export default function ChatWindow({
  messages,
  onToggleExpansion,
}: ChatWindowProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 pb-28">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div className="w-full sm:max-w-[75%] md:max-w-[65%]">
            
            {/* Agent Badge */}
            {msg.role === "ai" && msg.metadata && (
              <AgentBadge metadata={msg.metadata} variant="compact" />
            )}

            {/* Message Bubble */}
            <div
              className={`rounded-xl px-4 py-3 text-sm sm:text-base shadow-sm transition-colors ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
              }`}
            >
              {msg.role === "ai" ? (
                <FormattedMessage
                  content={
                    msg.isExpanded
                      ? msg.fullContent || msg.content
                      : msg.content
                  }
                />
              ) : (
                <div className="whitespace-pre-wrap break-words">
                  {msg.content}
                </div>
              )}

              {/* Show More / Less */}
              {msg.role === "ai" &&
                msg.fullContent &&
                msg.fullContent !== msg.content && (
                  <button
                    onClick={() => onToggleExpansion(index)}
                    className="mt-3 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline transition"
                  >
                    {msg.isExpanded ? "Show less ↑" : "Show more ↓"}
                  </button>
                )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
