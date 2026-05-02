import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-[image:var(--gradient-soft)] mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>ExamPrep AI · Smarter exam prep, powered by AI</span>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ExamPrep AI</p>
      </div>
    </footer>
  );
}
