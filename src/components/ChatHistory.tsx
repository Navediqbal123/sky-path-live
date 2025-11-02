import { MessageSquare, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

const mockChats: Chat[] = [
  {
    id: "1",
    title: "General Questions",
    lastMessage: "Tell me about AI technology",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "2",
    title: "Project Help",
    lastMessage: "How do I structure my code?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "3",
    title: "Learning Session",
    lastMessage: "Explain React hooks",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

export function ChatHistory() {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border/50 px-6 py-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Chat History
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          View your previous conversations
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {mockChats.map((chat) => (
            <Button
              key={chat.id}
              variant="ghost"
              className="w-full justify-start h-auto py-3 px-4 hover:bg-accent/50 transition-all"
            >
              <div className="flex flex-col items-start gap-1 w-full">
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold text-sm">{chat.title}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(chat.timestamp)}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground text-left line-clamp-1">
                  {chat.lastMessage}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
