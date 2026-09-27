import type { AnswerRecord } from "../types/AnswerRecord";
import type { BrailleSymbol } from "../types/BrailleSymbol";
import type { MistakeReason } from "../constants/MistakeReason";
import type { MistakeGroupStatus } from "../constants/MistakeGroupStatus";

/** 一条“字符 × 错误原因”错题单元，附带字符信息与巩固进度 */
export interface MistakeItem {
  key: string;
  symbol_id: number;
  mistake_reason: MistakeReason | string;
  symbol: BrailleSymbol;
  latest_record: AnswerRecord;
  record_count: number;
  correct_streak: number;
  mastered: boolean;
}

export type MistakeReasonGroup = {
  mistake_reason: MistakeReason | string;
  pending: MistakeItem[];
  mastered: MistakeItem[];
};

export type MistakeGroupsByStatus = Record<MistakeGroupStatus, MistakeItem[]>;

/** 练习流中的一道题 */
export interface MistakeQueueItem {
  key: string;
  symbol_id: number;
  mistake_reason: MistakeReason | string;
  symbol: BrailleSymbol;
}

export interface MistakeReasonStat {
  mistake_reason: MistakeReason | string;
  remaining: number;
  mastered: number;
  total: number;
}
