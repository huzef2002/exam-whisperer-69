import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, Sparkles, BookOpen, Brain, MessageSquare, ArrowRight, TrendingUp, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaperCard } from "@/components/PaperCard";
import { papers } from "@/data/papers";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ExamPrep AI — Smart Exam Preparation with Previous Year Papers" },
      {
        name: "description",
        content:
          "Search thousands of previous year question papers. Get AI summaries, repeated questions, and instant explanations.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const featured = papers.slice(0, 6);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/papers", search: { q: query, branch: "All Branches", year: "All Years" } });
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[image:var(--gradient-soft)]" />
        <div
          className="absolute inset-0 -z-10 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 10%, oklch(0.7 0.18 285 / 0.25), transparent 40%), radial-gradient(circle at 80% 30%, oklch(0.65 0.2 250 / 0.2), transparent 45%)",
          }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-6">
            <Sparkles className="h-3.5 w-3.5" /> AI-powered exam preparation
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto">
            Crack any exam with{" "}
            <span className="bg-clip-text text-transparent bg-[image:var(--gradient-hero)]">
              previous year papers
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Smart search, instant AI summaries, repeated question insights, and a tutor that
            explains anything — all in one beautiful place.
          </p>

          <form
            onSubmit={onSearch}
            className="mt-10 max-w-2xl mx-auto flex items-center gap-2 rounded-2xl border border-border/60 bg-card p-2 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center gap-3 flex-1 px-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by subject, code, or topic..."
                className="w-full bg-transparent border-0 outline-none text-base placeholder:text-muted-foreground py-3"
              />
            </div>
            <Button type="submit" variant="hero" size="lg">
              Search <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Popular:</span>
            {["Data Structures", "Operating Systems", "Thermodynamics", "Machine Learning"].map((t) => (
              <Link
                key={t}
                to="/papers"
                search={{ q: t, branch: "All Branches", year: "All Years" }}
                className="rounded-full border border-border bg-background px-3 py-1 hover:border-primary/40 hover:text-foreground transition-colors"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: BookOpen,
              title: "Massive paper library",
              desc: "Thousands of previous year papers across universities and branches.",
            },
            {
              icon: Brain,
              title: "AI summaries & insights",
              desc: "Get the gist of any paper in seconds, with key topics and difficulty.",
            },
            {
              icon: TrendingUp,
              title: "Repeated questions",
              desc: "Spot patterns. Prioritize the questions that show up year after year.",
            },
            {
              icon: MessageSquare,
              title: "Ask anything",
              desc: "Chat with an AI tutor for clear explanations of any concept.",
            },
            {
              icon: Zap,
              title: "Last night revision",
              desc: "Quick summaries and predicted questions for last-minute prep.",
            },
            {
              icon: Sparkles,
              title: "Built for students",
              desc: "Beautiful, fast, mobile-friendly — designed to help you focus.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-card)] hover:border-primary/40 transition-colors"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured papers */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Trending papers
            </h2>
            <p className="mt-2 text-muted-foreground">Most downloaded this month</p>
          </div>
          <Button asChild variant="ghost">
            <Link to="/papers">View all <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p) => <PaperCard key={p.id} paper={p} />)}
        </div>
      </section>
    </>
  );
}
