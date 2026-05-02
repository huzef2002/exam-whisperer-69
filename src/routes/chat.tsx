import { createFileRoute } from "@tanstack/react-router";
import { Send, Sparkles, Loader2, MessageSquare } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { aiChat } from "@/server/ai.functions";
import { Markdown } from "@/components/Markdown";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — ExamPrep AI" },
      { name: "description", content: "Chat with an AI tutor. Ask anything about your subjects, papers, and concepts." },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Explain dynamic programming with a simple example",
  "What's the difference between TCP and UDP?",
  "Give me a 5-minute summary of operating systems",
  "Predict important questions for DBMS exam",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const result = await aiChat({
        data: { mode: "chat", messages: next },
      });
      if (result.error) {
        setError(result.error);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: result.content }]);
      }
    } catch {
      setError("Failed to reach the AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-2">
          <Sparkles className="h-3.5 w-3.5" /> AI Tutor
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Ask anything</h1>
        <p className="text-sm text-muted-foreground">Get clear, simple explanations for any concept.</p>
      </div>

      <div className="flex-1 overflow-y-auto rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-card)] p-4 sm:p-6 space-y-4">
        {messages.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center py-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[image:var(--gradient-hero)] shadow-[var(--shadow-glow)] mb-4">
              <MessageSquare className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="font-display text-xl font-semibold">How can I help you study?</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Pick a suggestion or type your own question.
            </p>
            <div className="grid sm:grid-cols-2 gap-2 mt-6 w-full max-w-2xl">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left text-sm rounded-xl border border-border bg-background hover:border-primary/40 hover:bg-accent/40 transition-colors p-3"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm shadow-sm"
                  : "max-w-[90%] rounded-2xl rounded-bl-sm bg-muted px-4 py-3 shadow-sm"
              }
            >
              {m.role === "user" ? <p className="whitespace-pre-wrap">{m.content}</p> : <Markdown content={m.content} />}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
            </div>
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="mt-4 flex items-center gap-2 rounded-2xl border border-border/60 bg-card p-2 shadow-[var(--shadow-card)]"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about any concept, formula, or paper..."
          className="flex-1 bg-transparent border-0 outline-none text-base placeholder:text-muted-foreground px-3 py-2"
          disabled={loading}
        />
        <Button type="submit" variant="hero" disabled={loading || !input.trim()}>
          <Send className="h-4 w-4" /> Send
        </Button>
      </form>
    </div>
  );
}
