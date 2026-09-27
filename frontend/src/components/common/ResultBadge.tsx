interface ResultBadgeProps {
  correct?: boolean | null;
  label?: string;
  /** 兼容旧调用 */
  value?: string;
}

export function ResultBadge({ correct = null, label, value }: ResultBadgeProps) {
  if (correct === null) {
    return <span className="badge result-idle">{value ?? label ?? "待作答"}</span>;
  }
  return (
    <span className={"badge " + (correct ? "result-correct" : "result-wrong")}>
      {label ?? (correct ? "回答正确" : "回答错误")}
    </span>
  );
}
