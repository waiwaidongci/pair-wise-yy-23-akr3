import { MASTERY_STREAK_THRESHOLD as MASTERY_THRESHOLD } from "../constants/MistakeGroupStatus";
import { getMistakeReasonText } from "../constants/MistakeReason";
import type { AnswerRecord } from "../types/AnswerRecord";
import type { BrailleSymbol } from "../types/BrailleSymbol";
import type { MistakeProgress } from "../types/MistakeProgress";
import type {
  MistakeItem,
  MistakeQueueItem,
  MistakeReasonGroup,
  MistakeReasonStat
} from "../types/Mistake";

/** 判定一条答题记录是否进入错题本（答错，且带错误原因） */
export function isWrongRecord(record: AnswerRecord): boolean {
  return !record.correct && record.mistake_reason.trim().length > 0;
}

/** 答案归一化：忽略大小写与首尾空白 */
export function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase();
}

/** 判断本次作答是否正确（看点阵字符对应的字母） */
export function isAnswerCorrect(symbol: BrailleSymbol, userAnswer: string): boolean {
  return normalizeAnswer(userAnswer) === normalizeAnswer(symbol.letter);
}

/** 连续答对次数是否已达到掌握阈值 */
export function isStreakMastered(correctStreak: number): boolean {
  return correctStreak >= MASTERY_THRESHOLD;
}

function progressKey(symbolId: number, reason: string): string {
  return `${symbolId}::${reason}`;
}

/**
 * 以“字符 × 错误原因”为粒度归并错题。
 * 同一字符在不同错误原因下分别产生条目，进度也按各自 key 读取。
 */
export function buildMistakeItems(
  records: AnswerRecord[],
  symbolsById: Map<number, BrailleSymbol>,
  progressByKey: Map<string, MistakeProgress>
): MistakeItem[] {
  const merged = new Map<string, MistakeItem>();

  for (const record of records) {
    if (!isWrongRecord(record)) continue;
    const symbol = symbolsById.get(record.symbol_id);
    if (!symbol) continue;

    const key = progressKey(record.symbol_id, record.mistake_reason);
    const existed = merged.get(key);
    if (existed) {
      existed.record_count += 1;
      existed.latest_record = record;
      continue;
    }

    const progress = progressByKey.get(key);
    merged.set(key, {
      key,
      symbol_id: record.symbol_id,
      mistake_reason: record.mistake_reason,
      symbol,
      latest_record: record,
      record_count: 1,
      correct_streak: progress?.correct_streak ?? 0,
      mastered: progress?.mastered ?? false
    });
  }

  return [...merged.values()];
}

/** 按错误原因归组，组内再分待巩固 / 已掌握 */
export function groupMistakesByReason(items: MistakeItem[]): MistakeReasonGroup[] {
  const groups = new Map<string, MistakeReasonGroup>();
  for (const item of items) {
    let group = groups.get(item.mistake_reason);
    if (!group) {
      group = { mistake_reason: item.mistake_reason, pending: [], mastered: [] };
      groups.set(item.mistake_reason, group);
    }
    (item.mastered ? group.mastered : group.pending).push(item);
  }
  return [...groups.values()].sort((a, b) =>
    getMistakeReasonText(a.mistake_reason).localeCompare(getMistakeReasonText(b.mistake_reason), "zh-CN")
  );
}

/** 各错误原因的剩余数量与掌握数量 */
export function summarizeMistakeReasons(items: MistakeItem[]): MistakeReasonStat[] {
  return groupMistakesByReason(items).map((group) => ({
    mistake_reason: group.mistake_reason,
    remaining: group.pending.length,
    mastered: group.mastered.length,
    total: group.pending.length + group.mastered.length
  }));
}

/** 取出某个错误原因下指定分组（待巩固 / 已掌握）的练习题目 */
export function buildMistakeQueue(
  items: MistakeItem[],
  reason: string,
  mastered: boolean
): MistakeQueueItem[] {
  return items
    .filter((item) => item.mistake_reason === reason && item.mastered === mastered)
    .map((item) => ({
      key: item.key,
      symbol_id: item.symbol_id,
      mistake_reason: item.mistake_reason,
      symbol: item.symbol
    }));
}
