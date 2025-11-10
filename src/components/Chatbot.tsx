import { useState, useRef, useEffect } from "react";
import { Send, MoreVertical, Mic, Shield, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatHistory {
  id: number;
  title: string;
  time: string;
  preview: string;
  messages: Message[];
}

export function Chatbot() {
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([
    {
      id: 1,
      title: "Recent Chat",
      time: "2 hours ago",
      preview: "How can I help you?",
      messages: [
        {
          id: "1",
          text: "Hello I'm Chatnova AI how can I help you today",
          sender: "bot",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        },
      ],
    },
    {
      id: 2,
      title: "Yesterday",
      time: "Yesterday",
      preview: "Flight information query",
      messages: [
        {
          id: "1",
          text: "Hello I'm Chatnova AI how can I help you today",
          sender: "bot",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
        {
          id: "2",
          text: "Can you help me find flights to Paris?",
          sender: "user",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
        {
          id: "3",
          text: "Of course! I can help you search for flights to Paris. Let me find some options for you.",
          sender: "bot",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
      ],
    },
  ]);
  
  const [currentChatId, setCurrentChatId] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>(chatHistories[0].messages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const checkAdminRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();
        setIsAdmin(!!data);
      }
    };
    checkAdminRole();
  }, []);

  const streamChat = async (userMsg: Message) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
    
    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: messages
            .filter(m => m.id !== "1")
            .map(m => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text }))
            .concat([{ role: "user", content: userMsg.text }])
        }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429 || resp.status === 402) {
          const error = await resp.json();
          toast({
            title: "Error",
            description: error.error || "Unable to process request",
            variant: "destructive",
          });
          return;
        }
        throw new Error("Failed to start stream");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      let assistantSoFar = "";

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.sender === "bot" && last.id === "streaming") {
                  return prev.map((m, i) => 
                    i === prev.length - 1 ? { ...m, text: assistantSoFar } : m
                  );
                }
                return [...prev, {
                  id: "streaming",
                  text: assistantSoFar,
                  sender: "bot" as const,
                  timestamp: new Date(),
                }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Update final message with proper ID
      setMessages(prev => prev.map(m => 
        m.id === "streaming" ? { ...m, id: Date.now().toString() } : m
      ));

    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // Update current chat history
    setChatHistories((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: updatedMessages, preview: input }
          : chat
      )
    );
    
    setInput("");
    setIsLoading(true);
    streamChat(userMessage);
  };

  const handleChatSelect = (chatId: number) => {
    const selectedChat = chatHistories.find((chat) => chat.id === chatId);
    if (selectedChat) {
      setCurrentChatId(chatId);
      setMessages(selectedChat.messages);
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteChat = (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatHistories((prev) => prev.filter((chat) => chat.id !== chatId));
    if (currentChatId === chatId && chatHistories.length > 1) {
      const remainingChats = chatHistories.filter((chat) => chat.id !== chatId);
      setCurrentChatId(remainingChats[0].id);
      setMessages(remainingChats[0].messages);
    }
    toast({
      title: "Chat Deleted",
      description: "Chat history has been removed.",
    });
  };

  const handleNewChat = () => {
    const newChatId = Date.now();
    const newChat: ChatHistory = {
      id: newChatId,
      title: "New Chat",
      time: "Just now",
      preview: "Start a new conversation",
      messages: [
        {
          id: "1",
          text: "Hello I'm Chatnova AI how can I help you today",
          sender: "bot",
          timestamp: new Date(),
        },
      ],
    };
    setChatHistories((prev) => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setMessages(newChat.messages);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      setIsLoading(true);
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transcribe-audio`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ audio: base64Audio }),
          }
        );

        if (!response.ok) {
          throw new Error('Transcription failed');
        }

        const data = await response.json();
        setInput(data.text);
      };
    } catch (error) {
      console.error("Transcription error:", error);
      toast({
        title: "Transcription Error",
        description: "Failed to transcribe audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Chat Header */}
        <div className="border-b border-border/50 px-6 py-3 flex items-center justify-between">
          <h2 className="font-semibold text-lg">ChatNova AI</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="h-10 w-10 rounded-lg hover:bg-muted active:bg-muted transition-colors"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-6 py-6 pt-8" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 transition-all ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border rounded-bl-sm"
                  }`}
                >
                  <div className="flex items-end gap-3 justify-between">
                    <p className="text-sm leading-relaxed flex-1">{message.text}</p>
                    <span className="text-xs opacity-60 whitespace-nowrap">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t border-border/50 px-6 py-4">
          <div className="flex gap-2 items-center">
            <input
              id="gallery-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  console.log("Gallery file selected:", file);
                  // Handle gallery upload
                }
              }}
            />
            <input
              id="camera-input"
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  console.log("Camera photo taken:", file);
                  // Handle camera photo
                }
              }}
            />
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ask Chatnova Ai"
                className="min-h-[60px] max-h-[120px] resize-none rounded-2xl px-4 py-4 flex items-center"
              />
            </div>
            <Button
              size="icon"
              variant="ghost"
              className={`h-[60px] w-[60px] rounded-full shrink-0 hover:scale-110 transition-all duration-300 border border-border/50 ${
                isRecording ? 'bg-red-500/20 hover:bg-red-500/30 animate-pulse' : 'hover:bg-primary/10'
              }`}
              onClick={handleMicClick}
              disabled={isLoading}
            >
              <Mic className={`h-6 w-6 ${isRecording ? 'text-red-500' : ''}`} />
            </Button>
            {input.trim() && (
              <Button
                onClick={handleSend}
                size="icon"
                className="h-[60px] w-[60px] rounded-full shrink-0"
                disabled={isLoading}
              >
                <Send className="h-5 w-5" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Right Side Chat History */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden lg:block'} w-80 border-l border-border/50 bg-muted/30`}>
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <h3 className="font-semibold text-sm">Chat History</h3>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-xs"
            onClick={handleNewChat}
          >
            + New Chat
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="p-4 space-y-4">
            {/* Admin Panel */}
            {isAdmin && (
              <div className="border border-primary/30 rounded-lg p-3 bg-primary/5">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-semibold text-primary">Admin Panel</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Manage chat histories</p>
              </div>
            )}

            {/* Chat History List */}
            <div className="space-y-2">
              {chatHistories.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatSelect(chat.id)}
                  className={`p-3 rounded-lg hover:bg-background/80 cursor-pointer transition-all border ${
                    currentChatId === chat.id
                      ? "bg-background border-primary/50 shadow-sm"
                      : "border-border/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium truncate">{chat.title}</h4>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.time}</span>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-destructive/20 hover:text-destructive"
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{chat.preview}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
