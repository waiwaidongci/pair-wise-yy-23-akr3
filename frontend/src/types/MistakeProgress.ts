import type { MistakeReason } from "../constants/MistakeReason";

/**
 * 错题巩固进度：以“字符 + 错误原因”为最小单元。
 * 同一个字符在不同错误原因下是两条独立记录，进度互不覆盖。
 */
export interface MistakeProgress {
  /** 形如 `${symbol_id}::${mistake_reason}` */
  key: string;
  symbol_id: number;
  mistake_reason: MistakeReason | string;
  /** 当前连续答对次数；答错清零，达到阈值（2 次）即视为已掌握 */
  correct_streak: number;
  mastered: boolean;
  updated_at: string;
}
