export interface OutlineItem {
  id: string;
  text: string;
  /** Heading level (1-6) as written in the article. */
  level: number;
  /** Indentation depth, normalized so the shallowest heading is 0. */
  depth: number;
}

let outlineSeq = 0;

/**
 * Collect h1-h6 headings inside rendered article prose for the outline panel.
 * Assigns a stable element id when the heading has none and skips empty ones.
 */
export function extractOutline(prose: Element): OutlineItem[] {
  const collected: { element: Element; text: string; level: number }[] = [];
  for (const element of Array.from(prose.querySelectorAll('h1, h2, h3, h4, h5, h6'))) {
    const text = (element.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (!text) continue;
    collected.push({ element, text, level: Number(element.tagName.slice(1)) });
  }
  if (!collected.length) return [];
  const base = collected.reduce((min, item) => Math.min(min, item.level), collected[0].level);
  return collected.map(({ element, text, level }) => {
    if (!element.id) element.id = `qrs-outline-${(outlineSeq += 1)}`;
    return { id: element.id, text, level, depth: level - base };
  });
}
