// Builds the URL segment for a record from its title, so editors never type one.

/**
 * Keeps Arabic and Latin letters and digits, turns everything else into a
 * single hyphen. Arabic segments are valid in URLs and stay readable to the
 * people managing this site.
 */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '') // Arabic diacritics
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

let fallbackCounter = 0;

/** A slug for `title`, falling back to a unique one when it yields nothing. */
export function slugFromTitle(title: string): string {
  const slug = slugify(title);
  if (slug) return slug;
  fallbackCounter += 1;
  return `item-${fallbackCounter}-${Math.random().toString(36).slice(2, 7)}`;
}
