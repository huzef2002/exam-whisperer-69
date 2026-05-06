import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { Download, Sparkles, FileText, Brain, TrendingUp, MessageSquare, ArrowLeft, Loader2, GraduationCap, Calendar, BookOpen } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getPaper } from "@/data/papers";
import { aiChat } from "@/server/ai.functions";
import { Markdown } from "@/components/Markdown";

export const Route = createFileRoute("/papers/$paperId")({
  loader: async ({ params }) => {
    const paper = await getPaper(params.paperId);
    if (!paper) throw notFound();
    return { paper };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.paper.subject} (${loaderData.paper.year}) — ExamPrep AI` : "Paper — ExamPrep AI" },
      {
        name: "description",
        content: loaderData
          ? `Previous year question paper: ${loaderData.paper.subject}, ${loaderData.paper.university}, ${loaderData.paper.year}. Get AI summaries and important questions.`
          : "Question paper detail",
      },
    ],
  }),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Couldn't load this paper</h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
        <Button onClick={() => { router.invalidate(); reset(); }} className="mt-6">Try again</Button>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-semibold">Paper not found</h1>
      <Button asChild className="mt-6"><Link to="/papers">Browse all papers</Link></Button>
    </div>
  ),
  component: PaperDetail,
});

type AIMode = "summarize" | "important" | "repeated";

function PaperDetail() {
  const { paper } = Route.useLoaderData();
  const [aiContent, setAiContent] = useState<string>("");
  const [aiMode, setAiMode] = useState<AIMode | null>(null);
  const [loading, setLoading] = useState<AIMode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const paperContext = `Subject: ${paper.subject} (${paper.code})
Year: ${paper.year}
University: ${paper.university}
Branch: ${paper.branch}, ${paper.semester}
Difficulty: ${paper.difficulty}
Topics covered: ${paper.topics.join(", ")}`;

  const runAI = async (mode: AIMode) => {
    setLoading(mode);
    setError(null);
    setAiMode(mode);
    setAiContent("");
    try {
      const prompt =
        mode === "summarize"
          ? "Summarize this exam paper for a student preparing for the next exam."
          : mode === "important"
          ? "Give me the most important questions to prepare from this paper."
          : "Show me the most repeated questions and predict what's likely to appear next.";
      const result = await aiChat({
        data: {
          mode,
          paperContext,
          messages: [{ role: "user", content: prompt }],
        },
      });
      if (result.error) {
        setError(result.error);
      } else {
        setAiContent(result.content);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/papers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to papers
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: details + viewer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">{paper.code} · {paper.semester}</p>
                <h1 className="font-display text-2xl sm:text-3xl font-bold mt-1">{paper.subject}</h1>
              </div>
              <Button asChild variant="hero">
                <a href={paper.pdfUrl} download>
                  <Download className="h-4 w-4" /> Download
                </a>
              </Button>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><GraduationCap className="h-4 w-4" /> {paper.university}</span>
              <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {paper.year}</span>
              <span className="inline-flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {paper.branch}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {paper.topics.map((t: string) => (
                <span key={t} className="rounded-full bg-accent text-accent-foreground px-3 py-1 text-xs font-medium">{t}</span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Paper preview</span>
            </div>
            <div className="aspect-[3/4] sm:aspect-[4/5] bg-muted">
              <iframe
                src={paper.pdfUrl}
                title={`${paper.subject} preview`}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Right: AI tools */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-primary/20 bg-[image:var(--gradient-soft)] p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold">AI Study Tools</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Let AI do the heavy lifting. Pick a mode below.
            </p>
            <div className="space-y-2">
              <AIToolButton icon={Brain} label="✨ Get Important Questions" mode="important" loading={loading} onClick={runAI} />
              <AIToolButton icon={FileText} label="🤖 Summarize Paper" mode="summarize" loading={loading} onClick={runAI} />
              <AIToolButton icon={TrendingUp} label="📊 Show Repeated Questions" mode="repeated" loading={loading} onClick={runAI} />
            </div>
            <Button asChild variant="outline" className="w-full mt-3">
              <Link to="/chat">
                <MessageSquare className="h-4 w-4" /> Ask anything about this paper
              </Link>
            </Button>
          </div>

          {(aiContent || loading || error) && (
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold capitalize">{aiMode === "important" ? "Important Questions" : aiMode === "repeated" ? "Repeated Questions" : "Summary"}</span>
              </div>
              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                  <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
                </div>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
              {aiContent && <Markdown content={aiContent} />}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function AIToolButton({
  icon: Icon,
  label,
  mode,
  loading,
  onClick,
}: {
  icon: typeof Brain;
  label: string;
  mode: AIMode;
  loading: AIMode | null;
  onClick: (mode: AIMode) => void;
}) {
  const isLoading = loading === mode;
  return (
    <Button
      variant="soft"
      className="w-full justify-start"
      onClick={() => onClick(mode)}
      disabled={loading !== null}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      {label}
    </Button>
  );
}
