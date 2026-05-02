import { Link } from "@tanstack/react-router";
import { Download, FileText, GraduationCap, Calendar } from "lucide-react";
import type { Paper } from "@/data/papers";
import { Button } from "@/components/ui/button";

const difficultyStyles: Record<Paper["difficulty"], string> = {
  Easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Hard: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

export function PaperCard({ paper }: { paper: Paper }) {
  return (
    <article className="group relative flex flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-glow)]">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <FileText className="h-5 w-5" />
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyStyles[paper.difficulty]}`}>
          {paper.difficulty}
        </span>
      </div>

      <Link to="/papers/$paperId" params={{ paperId: paper.id }} className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground tracking-wide">{paper.code} · {paper.semester}</p>
        <h3 className="font-display text-lg font-semibold leading-tight text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
          {paper.subject}
        </h3>
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <GraduationCap className="h-3.5 w-3.5" /> {paper.university.replace(" University", "")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" /> {paper.year}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Download className="h-3.5 w-3.5" /> {paper.downloads.toLocaleString()}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <Button asChild size="sm" className="flex-1">
          <Link to="/papers/$paperId" params={{ paperId: paper.id }}>Open</Link>
        </Button>
        <Button asChild variant="soft" size="sm">
          <a href={paper.pdfUrl} download aria-label="Download PDF">
            <Download className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </article>
  );
}
