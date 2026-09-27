import { useBraillePattern } from "../../hooks/useBraillePattern";

export function BrailleCell({ pattern, caption, size = "md" }: { pattern: string; caption?: string; size?: "md" | "lg" }) {
  const dots = useBraillePattern(pattern);
  const order = [0, 3, 1, 4, 2, 5];
  return (
    <span className={"braille-wrap" + (size === "lg" ? " lg" : "")}>
      <span className={"braille-cell" + (size === "lg" ? " lg" : "")} role="img" aria-label={caption ?? "点字"}>
        {order.map((index) => (
          <span key={index} className={"braille-dot" + (dots[index] ? " on" : "")} />
        ))}
      </span>
      {caption ? <span className="braille-caption">{caption}</span> : null}
    </span>
  );
}
