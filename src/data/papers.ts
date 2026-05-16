import { supabase } from "@/integrations/supabase/client";

export type Paper = {
  id: string;
  subject: string;
  code: string;
  year: number;
  university: string;
  branch: string;
  semester: string;
  difficulty: "Easy" | "Medium" | "Hard";
  downloads: number;
  pdfUrl: string;
  topics: string[];
};

type UniversityRow = { university: string };
type BranchRow = { branch: string };

export async function getUniversities(): Promise<string[]> {
  const { data, error } = await supabase
    .from("papers")
    .select("university");

  if (error) {
    console.error("Error fetching universities:", error);
    return [];
  }

  // Get unique universities
  const uniqueUniversities = [...new Set(data?.map(row => row.university).filter(Boolean))];
  return uniqueUniversities;
}

export async function getBranches(): Promise<string[]> {
  const { data, error } = await supabase
    .from("papers")
    .select("branch");

  if (error) {
    console.error("Error fetching branches:", error);
    return [];
  }

  // Get unique branches
  const uniqueBranches = [...new Set(data?.map(row => row.branch).filter(Boolean))];
  return uniqueBranches;
}


export async function getYears(): Promise<string[]> {
  const { data, error } = await supabase
    .from("papers")
    .select("year");

  if (error) {
    console.error("Error fetching years:", error);
    return [];
  }

  // Get unique years
  const uniqueYears = [...new Set(data?.map(row => row.year).filter(Boolean))];
  return uniqueYears;
}

export async function getPapers(): Promise<Paper[]> {
  const { data, error } = await supabase
    .from("papers")
    .select("*");

  if (error) {
    console.error("Error fetching papers:", error);
    return [];
  }

  return data.map((p: Paper) => ({
    id: p.id,
    subject: p.subject,
    code: p.code,
    year: p.year,
    university: p.university,
    branch: p.branch,
    semester: p.semester,
    difficulty: p.difficulty,
    downloads: p.downloads,
    pdfUrl: p.pdf_url,
    topics: p.topics,
  }));
}

// Get a single paper by ID
export async function getPaper(id: string): Promise<Paper | null> {
  const { data, error } = await supabase
    .from("papers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching paper:", error);
    return null;
  }

  return { 
    id: data.id,
    subject: data.subject,
    code: data.code,
    year: data.year,
    university: data.university,
    branch: data.branch,
    semester: data.semester,
    difficulty: data.difficulty,
    downloads: data.downloads,
    pdfUrl: data.pdf_url,
    topics: data.topics,
  };
}

// For filtering by specific criteria
export async function filterPapers(filters: {
  university?: string;
  branch?: string;
  year?: number;
}): Promise<Paper[]> {
  let query = supabase.from("papers").select("*");

  if (filters.university && filters.university !== "All Universities") {
    query = query.eq("university", filters.university);
  }
  if (filters.branch && filters.branch !== "All Branches") {
    query = query.eq("branch", filters.branch);
  }
  if (filters.year) {
    query = query.eq("year", filters.year);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error filtering papers:", error);
    return [];
  }

  return data.map((p: any) => ({
    id: p.id,
    subject: p.subject,
    code: p.code,
    year: p.year,
    university: p.university,
    branch: p.branch,
    semester: p.semester,
    difficulty: p.difficulty,
    downloads: p.downloads,
    pdfUrl: p.pdf_url,
    topics: p.topics,
  }));
}

// Static papers array for backward compatibility (fallback)
// export const papers: Paper[] = [
//   {
//     id: "p1",
//     subject: "Data Structures & Algorithms",
//     code: "CS-301",
//     year: 2024,
//     university: "Delhi University",
//     branch: "Computer Science",
//     semester: "Sem 3",
//     difficulty: "Hard",
//     downloads: 12480,
//     pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
//     topics: ["Trees", "Graphs", "Dynamic Programming", "Sorting"],
//   }  ];
