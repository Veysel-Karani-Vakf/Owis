/**
 * Turns the flat paragraph list from the catalog into semantic blocks so the
 * article page can render headings, lists, an author card, and call-to-action
 * links — and build a table of contents from the headings.
 *
 * The source text has no markup, so this is heuristic: short lines followed by
 * body text become headings, runs of short lines become lists, "بقلم" starts an
 * author card, and bare URLs become CTA buttons.
 */

export type ArticleBlock =
  | { type: 'heading'; id: string; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'paragraph'; text: string; lead?: boolean }
  | { type: 'list'; items: string[] }
  | { type: 'author'; name: string; bio: string[] }
  | { type: 'cta'; url: string; text: string }
  | { type: 'note'; text: string };

const urlPattern = /https?:\/\/[^\s)]+/;
const internalRoutePattern = /\/donate\b/;
const authorPattern = /^(✍️\s*)?بقلم\s*[/:]/;
const seriesNotePattern = /^(للإطلاع على|للاطلاع على|اقرأ أيضاً|اقرأ أيضا)/;
const numberedPattern = /^(\d+|[١-٩]+)[.)\-:]\s+/;
const terminalPunctuation = /[.،,؛;!…»"”]\s*$/;
const leadPattern = /[:：]\s*$/;
const questionPattern = /[؟?]\s*$/;
const keywordHeadingPattern =
  /^(الخلاصة|خلاصة|مقدمة|المقدمة|خاتمة|الخاتمة|تمهيد|النتيجة)(?=[\s:：]|$)|^(أولاً|أولا|ثانياً|ثانيا|ثالثاً|ثالثا|رابعاً|رابعا|خامساً|خامسا|سادساً|سادسا|سابعاً|سابعا|ثامناً|ثامنا|تاسعاً|تاسعا|عاشراً|عاشرا)\s*[:：\-–]/;
const sentenceStarterPattern = /^(قد|لكن|وقد|ولكن|ثم|إن|إنّ|إذا|حيث|كما|بل|أي|أو|هذا|هذه|و\S)/;
const closingSentencePattern = /^(وهذا|وبذلك|وذلك|وهكذا|وبهذا|كل ذلك|وهذه|وبالتالي|فالوقف|بمعنى آخر|وبناءً|وبناء|هذا|هذه)/;

const headingMaxLength = 48;
const questionHeadingMaxLength = 40;
const shortMaxLength = 72;
const leadMaxLength = 140;
const bodyMinLength = 90;

const isShort = (text: string) => text.length <= shortMaxLength;
const isLong = (text: string | undefined) => Boolean(text && text.length >= bodyMinLength);
const isLead = (text: string | undefined) => Boolean(text && text.length <= leadMaxLength && leadPattern.test(text));
const isQuestion = (text: string | undefined) => Boolean(text && questionPattern.test(text));
const isUrl = (text: string) => urlPattern.test(text);

function isSpecial(text: string) {
  return isUrl(text) || numberedPattern.test(text) || authorPattern.test(text) || seriesNotePattern.test(text);
}

type HeadingContext = { previous?: string; next?: string; inLeadList?: boolean };

function isHeading(text: string, { previous, next, inLeadList }: HeadingContext) {
  if (text.length > headingMaxLength || isSpecial(text) || isLead(text)) return false;
  if (keywordHeadingPattern.test(text) && !terminalPunctuation.test(text)) return true;
  if (terminalPunctuation.test(text) || sentenceStarterPattern.test(text)) return false;
  if (isLead(previous)) return false; // first item of a list

  if (isQuestion(text)) {
    return text.length <= questionHeadingMaxLength && !isQuestion(previous);
  }
  if (inLeadList) {
    // Inside a list opened by "…:" keep short lines as items, unless the previous
    // item clearly closed a sentence and body text follows (a new section).
    return Boolean(previous && terminalPunctuation.test(previous) && isLong(next));
  }
  if (isLong(next)) return true;
  if (isLead(next)) return true;
  if (next && numberedPattern.test(next) && isShort(next)) return true;
  return false;
}

function isListCandidate(text: string, context: HeadingContext) {
  if (!isShort(text) || isSpecial(text)) return false;
  if (isHeading(text, context)) return false;
  if (closingSentencePattern.test(text)) return false;
  return true;
}

function cleanCta(text: string) {
  return text
    .replace(/\p{Extended_Pictographic}|️/gu, '')
    .replace(urlPattern, '')
    .replace(internalRoutePattern, '')
    .trim()
    .replace(/[:：]$/, '')
    .trim();
}

export function parseArticleContent(content: readonly string[], slug: string): ArticleBlock[] {
  const lines = content.map((line) => line.trim()).filter(Boolean);
  const blocks: ArticleBlock[] = [];
  let headingCount = 0;
  let index = 0;

  while (index < lines.length) {
    const text = lines[index];
    const previous = lines[index - 1];
    const next = lines[index + 1];

    // Author block: "✍️ بقلم / name" followed by an optional repeated name and a bio.
    if (authorPattern.test(text)) {
      const inlineName = text.replace(authorPattern, '').trim();
      let cursor = index + 1;
      let name = inlineName;
      const bio: string[] = [];
      if (lines[cursor] && isShort(lines[cursor]) && (!name || lines[cursor] === name)) {
        name = lines[cursor];
        cursor += 1;
      }
      while (
        cursor < lines.length &&
        !seriesNotePattern.test(lines[cursor]) &&
        !isUrl(lines[cursor]) &&
        !authorPattern.test(lines[cursor])
      ) {
        bio.push(lines[cursor]);
        cursor += 1;
      }
      blocks.push({ type: 'author', name, bio });
      index = cursor;
      continue;
    }

    if (seriesNotePattern.test(text)) {
      blocks.push({ type: 'note', text });
      index += 1;
      continue;
    }

    const urlMatch = text.match(urlPattern) ?? text.match(internalRoutePattern);
    if (urlMatch && text.length <= 120) {
      // Use a short preceding "🔽 ساهم الآن:" style lead-in as the CTA label.
      const last = blocks[blocks.length - 1];
      let label = cleanCta(text);
      if (!label && last?.type === 'paragraph' && cleanCta(last.text).length <= 40) {
        label = cleanCta(last.text);
        blocks.pop();
      } else if (!label && last?.type === 'list') {
        const candidate = last.items[last.items.length - 1];
        if ((isLead(candidate) || /ساهم|تبرع|انضم/.test(candidate)) && cleanCta(candidate).length <= 40) {
          label = cleanCta(candidate);
          last.items.pop();
          if (last.items.length === 0) blocks.pop();
          else if (last.items.length === 1) blocks[blocks.length - 1] = { type: 'paragraph', text: last.items[0] };
        }
      }
      blocks.push({ type: 'cta', url: urlMatch[0], text: label });
      index += 1;
      continue;
    }

    if (numberedPattern.test(text) && isShort(text)) {
      blocks.push({ type: 'subheading', text });
      index += 1;
      continue;
    }

    if (isHeading(text, { previous, next })) {
      headingCount += 1;
      blocks.push({ type: 'heading', id: `${slug}-section-${headingCount}`, text });
      index += 1;
      continue;
    }

    if (isLead(text) && isShort(text)) {
      blocks.push({ type: 'paragraph', text, lead: true });
      index += 1;
      continue;
    }

    // Runs of short lines (after a lead-in, or at least two in a row) become a list.
    let inLeadList = isLead(previous);
    const startsList =
      isListCandidate(text, { previous, next }) &&
      (inLeadList ||
        (next !== undefined && !isLead(next) && isListCandidate(next, { previous: text, next: lines[index + 2] })));
    if (startsList) {
      const items: string[] = [];
      let cursor = index;
      while (
        cursor < lines.length &&
        isListCandidate(lines[cursor], { previous: lines[cursor - 1], next: lines[cursor + 1], inLeadList })
      ) {
        items.push(lines[cursor]);
        if (isLead(lines[cursor])) inLeadList = true; // a nested "…:" keeps the run going as items
        cursor += 1;
      }
      if (items.length >= 2) {
        blocks.push({ type: 'list', items });
        index = cursor;
        continue;
      }
    }

    blocks.push({ type: 'paragraph', text });
    index += 1;
  }

  return blocks;
}

export function getArticleHeadings(blocks: ArticleBlock[]) {
  return blocks.flatMap((block) => (block.type === 'heading' ? [{ id: block.id, text: block.text }] : []));
}

/** Maps known official URLs to in-site routes (e.g. the donate page). */
export function resolveInternalUrl(url: string): string | null {
  if (url.startsWith('/')) return url;
  return null;
}
