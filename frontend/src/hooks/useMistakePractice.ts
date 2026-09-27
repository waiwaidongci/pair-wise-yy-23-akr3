import { useCallback, useEffect, useMemo, useState } from "react";
import { MASTERY_STREAK_THRESHOLD } from "../constants/MistakeGroupStatus";
import type { MistakeGroupStatus } from "../constants/MistakeGroupStatus";
import { useMistakeProgressStore } from "../stores/MistakeProgressStore";
import type { MistakeProgress } from "../types/MistakeProgress";
import type { MistakeItem, MistakeQueueItem } from "../types/Mistake";
import { buildMistakeQueue, isAnswerCorrect } from "../utils/mistakes";

export type AnswerFeedback = {
  correct: boolean;
  expected: string;
  streak: number;
  mastered: boolean;
} | null;

/**
 * 错题本分组练习：
 * - 只出所选错误原因 + 所选分组（待巩固/已掌握）里的字符；
 * - 连续两次答对后该字符移出队列（进入已掌握），答错清零并排到队尾再练。
 */
export function useMistakePractice(
  items: MistakeItem[],
  reason: string,
  status: MistakeGroupStatus,
  ready: boolean
) {
  const recordAnswer = useMistakeProgressStore((state) => state.recordAnswer);
  const masteredTarget = status === "MASTERED";

  const initialQueue = useMemo(
    () => (ready ? buildMistakeQueue(items, reason, masteredTarget) : []),
    // 仅在进入练习 / 切换分组时按当时快照建队，答题中不随进度变化重建
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reason, status, ready]
  );

  const [queue, setQueue] = useState<MistakeQueueItem[]>(initialQueue);
  const [feedback, setFeedback] = useState<AnswerFeedback>(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionWrong, setSessionWrong] = useState(0);

  useEffect(() => {
    setQueue(initialQueue);
    setFeedback(null);
  }, [initialQueue]);

  const current = queue[0] ?? null;
  const remaining = queue.length;

  const submit = useCallback(
    async (userAnswer: string): Promise<MistakeProgress | null> => {
      if (!current || feedback) return null;
      const correct = isAnswerCorrect(current.symbol, userAnswer);
      const saved = await recordAnswer(current.symbol_id, current.mistake_reason, correct);

      setFeedback({
        correct,
        expected: current.symbol.letter,
        streak: saved?.correct_streak ?? 0,
        mastered: saved?.mastered ?? false
      });
      if (correct) setSessionCorrect((value) => value + 1);
      else setSessionWrong((value) => value + 1);
      return saved;
    },
    [current, feedback, recordAnswer]
  );

  const next = useCallback(() => {
    setFeedback(null);
    setQueue((prev) => {
      const [head, ...rest] = prev;
      if (!head) return prev;
      const progress = useMistakeProgressStore
        .getState()
        .getProgress(head.symbol_id, head.mistake_reason);
      const nowMastered = progress?.mastered ?? false;
      // 待巩固组：达到连续答对阈值即离队进入已掌握；否则（含答错）排到队尾重练
      if (!masteredTarget && nowMastered) return rest;
      // 已掌握组练习答错被打回待巩固时离队；其余保持轮转
      if (masteredTarget && !nowMastered) return rest;
      return [...rest, head];
    });
  }, [masteredTarget]);

  return {
    current,
    remaining,
    total: initialQueue.length,
    feedback,
    threshold: MASTERY_STREAK_THRESHOLD,
    sessionCorrect,
    sessionWrong,
    submit,
    next
  };
}
