// Immutable get/set for the dot paths used by the page schema.
// An empty path addresses the root value itself (used by list-only pages).

export function getAtPath(source: unknown, path: string): unknown {
  if (!path) return source;
  return path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object') {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
}

export function setAtPath<T>(source: T, path: string, value: unknown): T {
  if (!path) return value as T;

  const [head, ...rest] = path.split('.');
  const base: Record<string, unknown> =
    source && typeof source === 'object' && !Array.isArray(source)
      ? { ...(source as Record<string, unknown>) }
      : {};

  base[head] = rest.length === 0 ? value : setAtPath(base[head], rest.join('.'), value);
  return base as T;
}

/** Deletes the value at `path`, pruning nothing above it. */
export function unsetAtPath<T>(source: T, path: string): T {
  if (!path) return source;
  const [head, ...rest] = path.split('.');
  if (!source || typeof source !== 'object') return source;

  const base = { ...(source as Record<string, unknown>) };
  if (rest.length === 0) {
    delete base[head];
  } else {
    base[head] = unsetAtPath(base[head], rest.join('.'));
  }
  return base as T;
}
