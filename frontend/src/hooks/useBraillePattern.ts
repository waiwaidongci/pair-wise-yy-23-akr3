import { useMemo } from "react";

export function useBraillePattern(pattern: string) {
  return useMemo(() => {
    const bits = (pattern.match(/[01]/g) ?? []).slice(0, 6);
    while (bits.length < 6) bits.push("0");
    return bits.map((bit) => bit === "1");
  }, [pattern]);
}
