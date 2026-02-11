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
  return (
    <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
      {/* Header */}
      <h1 className="text-xl font-semibold mb-4">AgentFlow AI</h1>

      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="bg-blue-600 hover:bg-blue-700 transition p-2 rounded-lg mb-2"
      >
        + New Chat
      </button>

      {/* Clear All Chats */}
      {chats.length > 0 && (
        <button
          onClick={onClearAll}
          className="text-sm text-red-400 hover:text-red-500 transition mb-4 self-start"
        >
          Clear all chats
        </button>
      )}

      {/* Chat List */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {chats.length === 0 && (
          <p className="text-sm text-gray-400 mt-4">
            No conversations yet
          </p>
        )}

        {chats.map((chat) => {
          const isActive = chat.id === activeId;

          return (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`flex items-center justify-between p-2 rounded cursor-pointer transition border-l-4 ${
                isActive
                  ? "bg-gray-700 border-blue-500"
                  : "bg-gray-800 border-transparent hover:bg-gray-700"
              }`}
            >
              {/* Chat title */}
              <span className="text-sm truncate flex-1 select-none">
                {chat.title}
              </span>

              {/* Delete chat */}
              <button
                aria-label="Delete chat"
                title="Delete chat"
                onClick={(e) => {
                  e.stopPropagation(); // prevent chat selection
                  onDeleteChat(chat.id);
                }}
                className="text-red-400 hover:text-red-500 text-xs ml-2"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
