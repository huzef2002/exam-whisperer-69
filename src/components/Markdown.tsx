// Lightweight markdown renderer (headings, bold, italics, lists, code, links)
// Avoids adding a heavy dependency for the v1.

function renderInline(text: string): string {
  // Escape HTML
  let out = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Inline code
  out = out.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-muted text-foreground text-[0.85em] font-mono">$1</code>');
  // Bold
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  // Italic
  out = out.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  // Links
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="text-primary underline" href="$2" target="_blank" rel="noreferrer">$1</a>');
  return out;
}

export function Markdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushList = () => {
    if (!listBuffer) return;
    const Tag = listBuffer.type;
    blocks.push(
      <Tag key={blocks.length} className={Tag === "ul" ? "list-disc pl-5 space-y-1 my-2" : "list-decimal pl-5 space-y-1 my-2"}>
        {listBuffer.items.map((it, i) => (
          <li key={i} className="text-sm text-foreground/90" dangerouslySetInnerHTML={{ __html: renderInline(it) }} />
        ))}
      </Tag>
    );
    listBuffer = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { flushList(); continue; }

    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      flushList();
      const level = h[1].length;
      const text = renderInline(h[2]);
      const cls =
        level <= 2
          ? "font-display text-lg font-semibold mt-3 mb-1.5 text-foreground"
          : "font-display text-base font-semibold mt-2 mb-1 text-foreground";
      blocks.push(<div key={blocks.length} className={cls} dangerouslySetInnerHTML={{ __html: text }} />);
      continue;
    }

    const ul = /^[-*]\s+(.*)$/.exec(line);
    if (ul) {
      if (!listBuffer || listBuffer.type !== "ul") { flushList(); listBuffer = { type: "ul", items: [] }; }
      listBuffer.items.push(ul[1]);
      continue;
    }
    const ol = /^\d+\.\s+(.*)$/.exec(line);
    if (ol) {
      if (!listBuffer || listBuffer.type !== "ol") { flushList(); listBuffer = { type: "ol", items: [] }; }
      listBuffer.items.push(ol[1]);
      continue;
    }

    flushList();
    blocks.push(
      <p key={blocks.length} className="text-sm leading-relaxed text-foreground/90 my-1.5"
         dangerouslySetInnerHTML={{ __html: renderInline(line) }} />
    );
  }
  flushList();

  return <div className="space-y-1">{blocks}</div>;
}
