export const MistakeGroup = ["PENDING","MASTERED"] as const;
export type MistakeGroup = (typeof MistakeGroup)[number];
export const MistakeGroupText: Record<MistakeGroup, string> = {
  PENDING: "待巩固",
  MASTERED: "已掌握"
};
