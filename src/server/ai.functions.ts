import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

const inputSchema = z.object({
  messages: z.array(messageSchema).min(1).max(50),
  paperContext: z.string().optional(),
  mode: z.enum(["chat", "summarize", "important", "repeated"]).default("chat"),
});

const SYSTEM_PROMPTS = {
  chat:
    "You are ExamPrep AI, a friendly and concise tutor for college students. Explain concepts in simple language, use examples, and format answers in clean markdown with bullet points and short paragraphs.",
  summarize:
    "You are ExamPrep AI. Summarize the given exam paper in clean markdown with sections: **Overview**, **Key Topics Covered**, **Difficulty**, and **Quick Revision Notes**. Be concise and student-friendly.",
  important:
    "You are ExamPrep AI. Extract and list the most important questions a student MUST prepare from this paper. Group by topic. Use markdown with bold headings and numbered lists. Add a short reason why each is important.",
  repeated:
    "You are ExamPrep AI. Identify likely repeated and predicted questions for the next exam based on the paper. Format as markdown: **Most Repeated Questions**, **Likely To Appear Next**, and **Why** for each.",
} as const;

type Message = z.infer<typeof messageSchema>;

type AIInput = z.infer<typeof inputSchema>;

type AIResult = { content: string; error: string | null };

export async function aiChat({ data }: { data: AIInput }): Promise<AIResult> {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? (typeof process !== "undefined" ? process.env.GEMINI_API_KEY : undefined);
  if (!GEMINI_API_KEY) {
    return { error: "AI service is not configured. Please add VITE_GEMINI_API_KEY to your environment.", content: "" };
  }

  const dataValidated = inputSchema.safeParse(data);
  if (!dataValidated.success) {
    return { error: "Invalid AI request payload.", content: "" };
  }

  const systemPrompt = SYSTEM_PROMPTS[dataValidated.data.mode];
  const contextNote = dataValidated.data.paperContext
    ? `\n\nPAPER CONTEXT:\n${dataValidated.data.paperContext}`
    : "";

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt + contextNote },
          ...dataValidated.data.messages,
        ],
      }),
    });

    if (response.status === 429) {
      return { error: "Too many requests. Please wait a moment and try again.", content: "" };
    }
    if (response.status === 402) {
      return { error: "AI credits exhausted. Please add credits to continue.", content: "" };
    }
    if (!response.ok) {
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return { error: "AI service is temporarily unavailable.", content: "" };
    }

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content ?? "";
    return { content, error: null };
  } catch (err) {
    console.error("AI chat failed:", err);
    return { error: "Something went wrong reaching the AI.", content: "" };
  }
}
