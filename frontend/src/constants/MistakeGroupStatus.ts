import type { MistakeReason } from "./MistakeReason";
import { getMistakeReasonText } from "./MistakeReason";

/** 错题分组：待巩固 / 已掌握 */
export const MistakeGroupStatus = ["PENDING", "MASTERED"] as const;
export type MistakeGroupStatus = (typeof MistakeGroupStatus)[number];

export const MistakeGroupStatusText: Record<MistakeGroupStatus, string> = {
  PENDING: "待巩固",
  MASTERED: "已掌握"
};

/** 连续答对达到该次数后移入已掌握 */
export const MASTERY_STREAK_THRESHOLD = 2;

export const MISTAKE_STORAGE = {
  dbName: "braille-trainer",
  dbVersion: 1,
  storeName: "mistake_progress",
  fallbackKey: "braille-trainer:mistake-progress"
} as const;

/** 同一字符在不同错误原因下分别建档，键中同时带 symbol_id 与 mistake_reason */
export function buildMistakeProgressKey(symbolId: number, mistakeReason: MistakeReason | string): string {
  return `${symbolId}::${mistakeReason}`;
}

export function getMistakeGroupStatusText(status: MistakeGroupStatus): string {
  return MistakeGroupStatusText[status];
}

export { getMistakeReasonText };
