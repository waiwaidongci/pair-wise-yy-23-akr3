import { MistakeReason, MistakeReasonText } from "../constants/MistakeReason";
import { createDefaultMistakeProgress, mistakeProgressKey } from "../constructors/MistakeProgressConstructor";
import type { AnswerRecord } from "../types/AnswerRecord";
import type { BrailleSymbol } from "../types/BrailleSymbol";
import type { MistakeProgress } from "../types/MistakeProgress";

export interface MistakeEntryView {
  mistake_reason: string;
  symbol_id: number;
  symbol?: BrailleSymbol;
  progress: MistakeProgress;
  mastered: boolean;
}

export interface MistakeReasonGroup {
  reason: string;
  pending: MistakeEntryView[];
  mastered: MistakeEntryView[];
}

export const mistakeReasonText = (reason: string): string =>
  (MistakeReasonText as Record<string, string>)[reason] ?? reason;

export function isWrongAnswer(record: AnswerRecord): boolean {
  return String(record.correct).toLowerCase() !== "true" && record.mistake_reason !== "";
}

export function buildMistakeBook(
  records: AnswerRecord[],
  symbols: BrailleSymbol[],
  progressRows: MistakeProgress[]
): MistakeReasonGroup[] {
  const symbolMap = new Map(symbols.map((symbol) => [symbol.id, symbol]));
  const progressMap = new Map(progressRows.map((row) => [row.id, row]));
  const groups = new Map<string, MistakeReasonGroup>();
  const seen = new Set<string>();

  for (const record of records) {
    if (!isWrongAnswer(record)) continue;
    const key = mistakeProgressKey(record.mistake_reason, record.symbol_id);
    if (seen.has(key)) continue;
    seen.add(key);

    const progress = progressMap.get(key)
      ?? createDefaultMistakeProgress({ id: key, mistake_reason: record.mistake_reason, symbol_id: record.symbol_id });
    const entry: MistakeEntryView = {
      mistake_reason: record.mistake_reason,
      symbol_id: record.symbol_id,
      symbol: symbolMap.get(record.symbol_id),
      progress,
      mastered: progress.mastered
    };

    let group = groups.get(record.mistake_reason);
    if (!group) {
      group = { reason: record.mistake_reason, pending: [], mastered: [] };
      groups.set(record.mistake_reason, group);
    }
    (progress.mastered ? group.mastered : group.pending).push(entry);
  }

  const order = (reason: string) => {
    const index = (MistakeReason as readonly string[]).indexOf(reason);
    return index === -1 ? MistakeReason.length : index;
  };
  return [...groups.values()].sort((a, b) => order(a.reason) - order(b.reason));
}
