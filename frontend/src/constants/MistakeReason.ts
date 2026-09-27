export const MistakeReason = [
  "DOT_POSITION",
  "SIMILAR_SYMBOL",
  "PINYIN_MISMATCH",
  "DIRECTION_FLIP"
] as const;
export type MistakeReason = (typeof MistakeReason)[number];

export const MistakeReasonText: Record<MistakeReason, string> = {
  DOT_POSITION: "点位记错",
  SIMILAR_SYMBOL: "形近混淆",
  PINYIN_MISMATCH: "拼音对应错",
  DIRECTION_FLIP: "左右镜像颠倒"
};

export function getMistakeReasonText(reason: string): string {
  return (MistakeReasonText as Record<string, string>)[reason] ?? reason;
}
