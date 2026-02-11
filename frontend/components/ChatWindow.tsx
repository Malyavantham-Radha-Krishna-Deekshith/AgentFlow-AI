import FormattedMessage from "./FormattedMessage";
import AgentBadge from "./AgentBadge";

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

type ChatWindowProps = {
  messages: Message[];
  onToggleExpansion: (index: number) => void;
};

export default function ChatWindow({ messages, onToggleExpansion }: ChatWindowProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div className="max-w-[70%]">
            {/* ✨ AGENT METADATA BADGE - Only show for AI messages */}
            {msg.role === "ai" && msg.metadata && (
              <AgentBadge metadata={msg.metadata} variant="compact" />
            )}
            
            {/* Message Content */}
            <div
              className={`rounded-lg px-4 py-3 ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {msg.role === "ai" ? (
                <FormattedMessage 
                  content={msg.isExpanded ? msg.fullContent || msg.content : msg.content} 
                />
              ) : (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              )}
              
              {/* Show More/Less Button */}
              {msg.role === "ai" && msg.fullContent && msg.fullContent !== msg.content && (
                <button
                  onClick={() => onToggleExpansion(index)}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-semibold 
                            flex items-center gap-1 transition-colors"
                >
                  {msg.isExpanded ? (
                    <>Show less <span>↑</span></>
                  ) : (
                    <>Show more <span>↓</span></>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}