import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo } from "react";
import { PaperCard } from "@/components/PaperCard";
import { getPapers, getBranches, getYears, getUniversities } from "@/data/papers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  branch: fallback(z.string(), "All Branches").default("All Branches"),
  year: fallback(z.string(), "All Years").default("All Years"),
  university: fallback(z.string(), "All Universities").default("All Universities"),
});

export const Route = createFileRoute("/papers")({
  loader: async () => {
    const papers = await getPapers();
    const universities = await getUniversities();
    const branches = await getBranches();
    const years = await getYears();
    return { papers, universities, branches, years };
  },
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Papers Library — ExamPrep AI" },
      { name: "description", content: "Browse and filter previous year question papers by subject, year, branch, and university." },
    ],
  }),
  component: PapersPage,
});

function PapersPage() {
  const { q, branch, year, university } = Route.useSearch();
  const loaderData = Route.useLoaderData();
  const navigate = useNavigate({ from: "/papers" });

  const update = (patch: Record<string, string>) => {
    navigate({ search: (prev: Record<string, string>) => ({ ...prev, ...patch }) });
  };

  const filtered = useMemo(() => {
    return loaderData.papers.filter((p) => {
      const matchQ =
        !q ||
        p.subject.toLowerCase().includes(q.toLowerCase()) ||
        p.code.toLowerCase().includes(q.toLowerCase()) ||
        p.topics.some((t) => t.toLowerCase().includes(q.toLowerCase()));
      const matchBranch = branch === "All Branches" || p.branch === branch;
      const matchYear = year === "All Years" || String(p.year) === year;
      const matchUni = university === "All Universities" || p.university === university;
      return matchQ && matchBranch && matchYear && matchUni;
    });
  }, [q, branch, year, university, loaderData.papers]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Papers Library</h1>
        <p className="mt-2 text-muted-foreground">Find the right paper. Fast.</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-card)] mb-8">
        <div className="flex items-center gap-3 px-2 mb-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Search subject, code, topic..."
            className="w-full bg-transparent border-0 outline-none text-base placeholder:text-muted-foreground py-2"
          />
        </div>
        <div className="grid sm:grid-cols-3 gap-3 border-t border-border/60 pt-4">
          <FilterSelect label="Branch" value={branch} options={["All Branches", ...loaderData.branches]} onChange={(v) => update({ branch: v })} />
          <FilterSelect label="Year" value={year} options={["All Years", ...loaderData.years]} onChange={(v) => update({ year: v })} />
          <FilterSelect label="University" value={university} options={["All Universities", ...loaderData.universities]} onChange={(v) => update({ university: v })} />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          <SlidersHorizontal className="inline h-4 w-4 mr-1.5" />
          {filtered.length} {filtered.length === 1 ? "paper" : "papers"} found
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-16 text-center">
          <p className="font-display text-lg font-semibold">No papers found</p>
          <p className="text-sm text-muted-foreground mt-1">Try changing your filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => <PaperCard key={p.id} paper={p} />)}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
