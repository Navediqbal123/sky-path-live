import { useState } from "react";
import { Chatbot } from "@/components/Chatbot";
import { ChatHistory } from "@/components/ChatHistory";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu, History } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      {/* Mobile Header with Sidebar Trigger */}
      <div className="lg:hidden border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger>
            <Menu className="h-6 w-6" />
          </SidebarTrigger>
          <h1 className="text-xl font-bold">ChatNova AI</h1>
        </div>
        <Button
          variant={showHistory ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setShowHistory(!showHistory)}
        >
          <History className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Internal Sidebar for History - Desktop */}
        <div className="hidden lg:flex w-16 border-r border-border/50 flex-col items-center py-4 gap-4">
          <Button
            variant={showHistory ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setShowHistory(!showHistory)}
            className="w-12 h-12"
          >
            <History className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <Chatbot />
        </div>

        {/* Chat History Panel */}
        {showHistory && (
          <div className="w-80 border-l border-border/50 absolute lg:relative right-0 top-0 bottom-0 z-10 bg-background">
            <ChatHistory />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
