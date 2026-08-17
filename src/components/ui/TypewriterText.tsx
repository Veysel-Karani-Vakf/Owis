import { useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

type TypewriterTextProps = {
  text: string;
  /** Delay before the first character appears (ms). */
  startDelay?: number;
  /** Delay between characters (ms). */
  charDelay?: number;
  /** How long the caret keeps blinking after the last character (ms). */
  caretLinger?: number;
  /** Whether the typing reveal should be skipped when reduced motion is requested. */
  respectReducedMotion?: boolean;
  className?: string;
  onComplete?: () => void;
};

type Word = {
  text: string;
  chars: string[];
  start: number;
};

function splitWords(text: string): Word[] {
  const words: Word[] = [];
  let offset = 0;

  for (const raw of text.trim().split(/\s+/)) {
    const chars = Array.from(raw);
    words.push({ text: raw, chars, start: offset });
    // +1 accounts for the separating space, which is "typed" as a step too.
    offset += chars.length + 1;
  }

  return words;
}

/**
 * Reveals `text` character by character, like someone typing it.
 *
 * Every word is rendered as an inline-block whose width is reserved by an invisible
 * copy of the full word, so the layout never shifts while typing (works for RTL and
 * cursive scripts such as Arabic). The full text stays available to screen readers.
 */
export default function TypewriterText({
  text,
  startDelay = 0,
  charDelay = 55,
  caretLinger = 1400,
  respectReducedMotion = true,
  className = '',
  onComplete,
}: TypewriterTextProps) {
  const reducedMotionRequested = useReducedMotion();
  const shouldSkipAnimation = respectReducedMotion && reducedMotionRequested;
  const words = useMemo(() => splitWords(text), [text]);
  const totalSteps = useMemo(
    () => words.reduce((sum, word) => sum + word.chars.length, 0) + Math.max(words.length - 1, 0),
    [words],
  );

  const [typedCount, setTypedCount] = useState(0);
  const [showCaret, setShowCaret] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (shouldSkipAnimation) {
      setTypedCount(totalSteps);
      setShowCaret(false);
      onCompleteRef.current?.();
      return;
    }

    setTypedCount(0);
    setShowCaret(true);

    let step = 0;
    let timer = 0;

    const finish = () => {
      onCompleteRef.current?.();
      timer = window.setTimeout(() => setShowCaret(false), caretLinger);
    };

    const tick = () => {
      step += 1;
      setTypedCount(step);
      if (step < totalSteps) {
        timer = window.setTimeout(tick, charDelay);
      } else {
        finish();
      }
    };

    timer = window.setTimeout(totalSteps > 0 ? tick : finish, startDelay);
    return () => window.clearTimeout(timer);
  }, [totalSteps, charDelay, startDelay, caretLinger, shouldSkipAnimation]);

  // The caret sits after the last typed character; before typing starts it sits in the first word.
  let caretWordIndex = 0;
  for (let index = 0; index < words.length; index += 1) {
    if (words[index].start < typedCount) caretWordIndex = index;
  }

  return (
    <span className={className || undefined}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => {
          const typedInWord = Math.min(Math.max(typedCount - word.start, 0), word.chars.length);
          const caretHere = showCaret && index === caretWordIndex;

          return (
            <span key={`${word.start}-${word.text}`}>
              <span className="relative inline-block whitespace-nowrap">
                <span className="invisible">{word.text}</span>
                <span className="absolute inset-0 whitespace-nowrap">
                  {word.chars.slice(0, typedInWord).join('')}
                  {caretHere && <span className="typewriter-caret" />}
                </span>
              </span>
              {index < words.length - 1 && ' '}
            </span>
          );
        })}
      </span>
    </span>
  );
}
