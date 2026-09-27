import { formatPercent } from "../../utils/formatters";

export function LessonProgress({ value, label }: { value: number; label?: string }) {
  const ratio = Math.max(0, Math.min(1, value));
  return (
    <div className="lesson-progress">
      {label ? <span className="lesson-progress-label">{label}</span> : null}
      <span className="progress-bar">
        <span style={{ width: `${ratio * 100}%` }} />
      </span>
      <span className="lesson-progress-value">{formatPercent(ratio)}</span>
    </div>
  );
}
