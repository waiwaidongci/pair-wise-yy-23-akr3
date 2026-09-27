import { useEffect, useState } from "react";
import type { MistakeProgress } from "../types/MistakeProgress";

export interface PracticeTarget {
  mistake_reason: string;
  symbol_id: number;
  letter: string;
  pinyin: string;
  cell_pattern: string;
}

export interface PracticeFeedback {
  correct: boolean;
  streak: number;
  mastered: boolean;
}

export function usePracticeSession(
  targets: PracticeTarget[],
  onAnswer: (target: PracticeTarget, correct: boolean) => Promise<MistakeProgress | void>
) {
  const [queue, setQueue] = useState<PracticeTarget[]>(targets);
  const [feedback, setFeedback] = useState<PracticeFeedback | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);

  useEffect(() => {
    setQueue(targets);
    setFeedback(null);
    setAnsweredCount(0);
  }, [targets]);

  const current = queue[0] as PracticeTarget | undefined;

  async function submit(answer: string) {
    if (!current || feedback) return;
    const correct = answer.trim().toLowerCase() === current.letter.trim().toLowerCase();
    const progress = await onAnswer(current, correct);
    setAnsweredCount((count) => count + 1);
    setFeedback({
      correct,
      streak: progress?.streak ?? 0,
      mastered: progress?.mastered ?? false
    });
  }

  function next() {
    if (!feedback) return;
    const mastered = feedback.mastered;
    setQueue((prev) => {
      const [head, ...rest] = prev;
      if (!head) return prev;
      return mastered ? rest : [...rest, head];
    });
    setFeedback(null);
  }

  return {
    current,
    remaining: queue.length,
    total: targets.length,
    answeredCount,
    feedback,
    submit,
    next,
    done: targets.length > 0 && queue.length === 0
  };
}
