interface BrailleCellProps {
  /** 6 位凸点串，依次为点位 1,2,3（左列）/ 4,5,6（右列） */
  pattern?: string;
  size?: number;
  title?: string;
  /** 兼容旧调用 */
  value?: string;
}

/** 点位在两列三行网格中的位置：左列 1,2,3；右列 4,5,6 */
const DOT_ORDER = [0, 2, 4, 1, 3, 5] as const;

export function BrailleCell({ pattern = "000000", size = 84, title, value }: BrailleCellProps) {
  const resolved = value && /^[01]{6}$/.test(value) ? value : pattern;
  const raised = DOT_ORDER.map((index) => resolved[index] === "1");
  const dot = Math.round(size * 0.22);
  return (
    <div className="braille-cell" style={{ width: size * 0.75, height: size }} title={title}>
      {raised.map((on, index) => (
        <span
          key={index}
          className={"braille-dot" + (on ? " on" : "")}
          style={{ width: dot, height: dot }}
        />
      ))}
    </div>
  );
}
