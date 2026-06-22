import { useEffect, useRef, useState } from "react";
import { Send, X, Loader2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const ChatIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4h16v10H5.5L4 16.5V4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 8h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 12h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M18 18l-2-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M16 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const RobotIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="6" width="14" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="9" cy="11" r="1.25" fill="currentColor" />
    <circle cx="15" cy="11" r="1.25" fill="currentColor" />
    <path d="M8 16h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M10 4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const SUGGESTIONS = [
  "Which service fits a new SaaS startup?",
  "What does Aspiria Certification include?",
  "Help me find investors",
];

export const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm **Aspy**, your Aspiria mascot and AI assistant. Ask me anything about our services for SMEs and startups — strategy, marketing, web, branding, training, certification, or investor connections!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    let acc = "";
    const upsert = (chunk: string) => {
      acc += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.content !== "" && prev.length > next.length) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: acc } : m));
        }
        return [...prev, { role: "assistant", content: acc }];
      });
    };

    try {
      const proxy = import.meta.env.VITE_CHAT_PROXY_URL?.trim();
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`
        : "";
      const targetUrl = proxy ? `${proxy}/chat` : supabaseUrl;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (!proxy) {
        headers["apikey"] = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      }

      const resp = await fetch(targetUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (resp.status === 429) {
        upsert("I'm a bit busy right now — please try again in a moment.");
        return;
      }
      if (resp.status === 402) {
        upsert("AI credits exhausted. Please contact us via WhatsApp or the contact form!");
        return;
      }
      if (!resp.ok) {
        const text = await resp.text();
        console.error('Chat function error', resp.status, text);
        if (resp.status === 401) {
          upsert("Chat service requires additional server-side configuration (401).\nPlease enable public access for the 'chat' Edge Function in your Supabase dashboard or call it from a trusted backend.");
        } else {
          upsert("Sorry, I couldn't reach the server. Please try again.");
        }
        return;
      }
      if (!resp.body) {
        console.error('Chat function returned no body', resp.status);
        upsert("Sorry, no response from server.");
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsert(content);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch {
      upsert("Sorry, I couldn't reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (text: string, isUser: boolean) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={idx} className={cn("font-bold", isUser ? "text-white" : "text-foreground dark:text-white font-semibold")}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open AI assistant"
        className={cn(
          "fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full gradient-hero text-white shadow-elegant hover:shadow-glow flex items-center justify-center transition-smooth hover:scale-110 hover:rotate-3",
          open && "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <RobotIcon className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[400px] h-[560px] max-h-[80vh] rounded-3xl bg-card border border-border/80 shadow-elegant flex flex-col animate-fade-in-up overflow-hidden">
          <div className="gradient-hero text-white px-5 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow-sm">
                <Bot className="w-5.5 h-5.5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-sm tracking-tight">Aspiria Assistant (Aspy)</div>
                <div className="text-[10px] opacity-85">Always here to help you take flight</div>
              </div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => setOpen(false)} className="text-white hover:bg-white/20 h-8 w-8 rounded-lg">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-secondary/15">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm border",
                    m.role === "user"
                      ? "gradient-hero text-white border-transparent rounded-br-sm shadow-glow"
                      : "bg-card border-border/80 text-foreground/95 rounded-bl-sm"
                  )}
                >
                  {m.content ? formatContent(m.content, m.role === "user") : (loading && <Loader2 className="w-4 h-4 animate-spin" />)}
                </div>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="pt-2 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-3.5 py-2 rounded-xl bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:border-primary hover:bg-primary/[0.03] hover:scale-[1.02] active:scale-[0.98] shadow-sm transition-smooth"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="border-t border-border/60 p-3.5 flex gap-2 bg-card"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-secondary/50 border border-border/65 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-smooth dark:bg-slate-900/50"
              disabled={loading}
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()} className="rounded-xl gradient-hero text-white border-0 shrink-0 shadow-sm hover:scale-105 active:scale-95 transition-smooth">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4.5 h-4.5" />}
            </Button>
          </form>
        </div>
      )}
    </>
  );
};
