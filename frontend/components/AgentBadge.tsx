// frontend/app/components/AgentBadge.tsx

import { Brain, Search, FileSearch, Wrench } from "lucide-react";

type AgentMetadata = {
  agent: string;
  intent: string;
  tools_used: string[];
};

type AgentBadgeProps = {
  metadata: AgentMetadata;
  variant?: "compact" | "detailed";
};

export default function AgentBadge({ metadata, variant = "compact" }: AgentBadgeProps) {
  if (!metadata) return null;

  const { agent, intent, tools_used } = metadata;

  // Agent configuration
  const agentConfig: Record<string, { name: string; icon: any; color: string; bgColor: string }> = {
    llm_agent: {
      name: "LLM Agent",
      icon: Brain,
      color: "text-purple-700 dark:text-purple-300",
      bgColor: "bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700",
    },
    search_agent: {
      name: "Search Agent",
      icon: Search,
      color: "text-blue-700 dark:text-blue-300",
      bgColor: "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700",
    },
    research_agent: {
      name: "Research Agent",
      icon: FileSearch,
      color: "text-green-700 dark:text-green-300",
      bgColor: "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700",
    },
    fallback_agent: {
      name: "Fallback Agent",
      icon: Brain,
      color: "text-gray-700 dark:text-gray-300",
      bgColor: "bg-gray-100 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700",
    },
  };

  const config = agentConfig[agent] || agentConfig.fallback_agent;
  const AgentIcon = config.icon;

  // Compact variant - single line with badges
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2 mb-2 flex-wrap text-xs">
        {/* Agent Badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium border ${config.bgColor} ${config.color}`}
        >
          <AgentIcon className="w-3.5 h-3.5" />
          <span>{config.name}</span>
        </div>

        {/* Intent Badge */}
        {intent && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
            <span className="text-[10px]">⚡</span>
            <span>{intent}</span>
          </div>
        )}

        {/* Tools Badge */}
        {tools_used && tools_used.length > 0 && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
            <Wrench className="w-3 h-3" />
            <span>{tools_used.join(", ")}</span>
          </div>
        )}
      </div>
    );
  }

  // Detailed variant - card with more information
  if (variant === "detailed") {
    return (
      <div className={`mb-3 p-3 rounded-lg border ${config.bgColor}`}>
        <div className="flex items-center gap-2 mb-2">
          <AgentIcon className={`w-4 h-4 ${config.color}`} />
          <span className={`font-semibold text-sm ${config.color}`}>
            {config.name}
          </span>
        </div>
        
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400">Intent:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {intent}
            </span>
          </div>
          
          {tools_used && tools_used.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Tools:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {tools_used.join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}