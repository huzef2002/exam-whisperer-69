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

export const universities = [
  "All Universities",
  "Delhi University",
  "Mumbai University",
  "Anna University",
  "Pune University",
  "Bangalore University",
];

export const branches = [
  "All Branches",
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Mathematics",
  "Physics",
];

export const years = ["All Years", "2024", "2023", "2022", "2021", "2020", "2019"];

export const papers: Paper[] = [
  {
    id: "p1",
    subject: "Data Structures & Algorithms",
    code: "CS-301",
    year: 2024,
    university: "Delhi University",
    branch: "Computer Science",
    semester: "Sem 3",
    difficulty: "Hard",
    downloads: 12480,
    pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
    topics: ["Trees", "Graphs", "Dynamic Programming", "Sorting"],
  },
  {
    id: "p2",
    subject: "Operating Systems",
    code: "CS-401",
    year: 2023,
    university: "Mumbai University",
    branch: "Computer Science",
    semester: "Sem 4",
    difficulty: "Medium",
    downloads: 9230,
    pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
    topics: ["Processes", "Scheduling", "Memory", "File Systems"],
  },
  {
    id: "p3",
    subject: "Database Management",
    code: "CS-402",
    year: 2024,
    university: "Anna University",
    branch: "Computer Science",
    semester: "Sem 4",
    difficulty: "Medium",
    downloads: 8410,
    pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
    topics: ["SQL", "Normalization", "Transactions", "Indexing"],
  },
  {
    id: "p4",
    subject: "Engineering Mathematics III",
    code: "MA-301",
    year: 2023,
    university: "Pune University",
    branch: "Mathematics",
    semester: "Sem 3",
    difficulty: "Hard",
    downloads: 15670,
    pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
    topics: ["Laplace", "Fourier", "PDE", "Complex Analysis"],
  },
  {
    id: "p5",
    subject: "Digital Electronics",
    code: "EC-202",
    year: 2022,
    university: "Bangalore University",
    branch: "Electronics",
    semester: "Sem 2",
    difficulty: "Easy",
    downloads: 6120,
    pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
    topics: ["Boolean Algebra", "K-Maps", "Flip-Flops", "Counters"],
  },
  {
    id: "p6",
    subject: "Thermodynamics",
    code: "ME-301",
    year: 2024,
    university: "Delhi University",
    branch: "Mechanical",
    semester: "Sem 3",
    difficulty: "Hard",
    downloads: 4830,
    pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
    topics: ["First Law", "Second Law", "Entropy", "Cycles"],
  },
  {
    id: "p7",
    subject: "Computer Networks",
    code: "CS-501",
    year: 2023,
    university: "Mumbai University",
    branch: "Computer Science",
    semester: "Sem 5",
    difficulty: "Medium",
    downloads: 7240,
    pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
    topics: ["OSI Model", "TCP/IP", "Routing", "Security"],
  },
  {
    id: "p8",
    subject: "Structural Analysis",
    code: "CE-302",
    year: 2022,
    university: "Anna University",
    branch: "Civil",
    semester: "Sem 3",
    difficulty: "Hard",
    downloads: 3210,
    pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
    topics: ["Trusses", "Beams", "Frames", "Deflection"],
  },
  {
    id: "p9",
    subject: "Quantum Physics",
    code: "PH-401",
    year: 2024,
    university: "Pune University",
    branch: "Physics",
    semester: "Sem 4",
    difficulty: "Hard",
    downloads: 2980,
    pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
    topics: ["Wave Function", "Schrödinger", "Operators", "Spin"],
  },
  {
    id: "p10",
    subject: "Machine Learning",
    code: "CS-601",
    year: 2024,
    university: "Bangalore University",
    branch: "Computer Science",
    semester: "Sem 6",
    difficulty: "Medium",
    downloads: 18920,
    pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
    topics: ["Regression", "Neural Nets", "SVM", "Clustering"],
  },
  {
    id: "p11",
    subject: "Software Engineering",
    code: "CS-403",
    year: 2023,
    university: "Delhi University",
    branch: "Computer Science",
    semester: "Sem 4",
    difficulty: "Easy",
    downloads: 5640,
    pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
    topics: ["SDLC", "Agile", "Testing", "Design Patterns"],
  },
  {
    id: "p12",
    subject: "Signals & Systems",
    code: "EC-301",
    year: 2022,
    university: "Mumbai University",
    branch: "Electronics",
    semester: "Sem 3",
    difficulty: "Hard",
    downloads: 4120,
    pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
    topics: ["Convolution", "Fourier Transform", "Z-Transform", "LTI"],
  },
];

export function getPaper(id: string): Paper | undefined {
  return papers.find((p) => p.id === id);
}
