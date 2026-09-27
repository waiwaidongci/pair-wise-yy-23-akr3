export const MistakeReason = ["DOT_CONFUSION","DIRECTION_FLIP","LISTENING_SLIP","MEMORY_FUZZY"] as const;
export type MistakeReason = (typeof MistakeReason)[number];
export const MistakeReasonText: Record<MistakeReason, string> = {
  DOT_CONFUSION: "点位混淆",
  DIRECTION_FLIP: "方向颠倒",
  LISTENING_SLIP: "听写失误",
  MEMORY_FUZZY: "记忆模糊"
};
