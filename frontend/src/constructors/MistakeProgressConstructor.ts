import { buildMistakeProgressKey } from "../constants/MistakeGroupStatus";
import type { MistakeReason } from "../constants/MistakeReason";
import type { MistakeProgress } from "../types/MistakeProgress";

export const createDefaultMistakeProgress = (
  symbolId: number,
  mistakeReason: MistakeReason | string,
  overrides: Partial<MistakeProgress> = {}
): MistakeProgress => ({
  key: buildMistakeProgressKey(symbolId, mistakeReason),
  symbol_id: symbolId,
  mistake_reason: mistakeReason,
  correct_streak: 0,
  mastered: false,
  updated_at: new Date(0).toISOString(),
  ...overrides
});

export const createMistakeProgressForm = createDefaultMistakeProgress;
export const createMistakeProgressResponse = createDefaultMistakeProgress;
