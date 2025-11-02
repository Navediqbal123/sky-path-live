import { Chatbot } from "@/components/Chatbot";
import { ChatHistory } from "@/components/ChatHistory";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

const Index = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Mobile Header with Sidebar Trigger */}
      <div className="lg:hidden border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <SidebarTrigger>
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
        <h1 className="text-xl font-bold">AI Assistant</h1>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <Chatbot />
        </div>

        {/* Chat History Sidebar */}
        <div className="hidden xl:flex xl:w-80 border-l border-border/50">
          <ChatHistory />
        </div>
      </div>
    </div>
  );
};

export default Index;
