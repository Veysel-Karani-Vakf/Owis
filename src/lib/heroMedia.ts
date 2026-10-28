// What the landing hero currently shows as its visual: nothing yet (`pending`),
// its background video playing (`video`), or the poster because no video
// applies or the video did not start (`poster`).
//
// The poster is a fallback, not a placeholder: the splash waits for this state
// on the landing route and the hero keeps its background dark while pending,
// so the poster is never seen standing in for the video.

export type HeroMediaState = 'pending' | 'video' | 'poster';

let state: HeroMediaState = 'pending';
const listeners = new Set<() => void>();

export function getHeroMediaState(): HeroMediaState {
  return state;
}

export function setHeroMediaState(next: HeroMediaState) {
  if (state === next) return;
  state = next;
  listeners.forEach((listener) => listener());
}

export function subscribeHeroMedia(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
