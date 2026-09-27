import { CONSECUTIVE_CORRECT_TO_MASTER } from "../../constants/masteryRules";
import { formatStreak } from "../../utils/formatters";

export function ResultBadge({ correct, streak, mastered }: { correct: boolean; streak: number; mastered: boolean }) {
  const text = !correct
    ? "回答错误，连对次数已清零"
    : mastered
      ? `回答正确，连续答对 ${formatStreak(streak)}，移入已掌握`
      : `回答正确，当前连续答对 ${formatStreak(streak)}，再对 ${CONSECUTIVE_CORRECT_TO_MASTER - streak} 次即可掌握`;
  return (
    <div className={"result-badge " + (correct ? "ok" : "ng")} role="status">
      {text}
    </div>
  );
}
