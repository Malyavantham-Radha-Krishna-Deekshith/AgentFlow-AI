import ReactMarkdown from "react-markdown";

type MessageProps = {
  role: "user" | "ai";
  content: string;
};

export default function MessageBubble({ role, content }: MessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`max-w-3xl px-5 py-4 rounded-2xl leading-relaxed text-sm whitespace-pre-wrap ${
        isUser
          ? "bg-blue-600 text-white ml-auto"
          : "bg-white text-gray-900 mr-auto shadow"
      }`}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
