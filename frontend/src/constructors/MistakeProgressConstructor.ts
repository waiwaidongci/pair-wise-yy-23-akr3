import type { MistakeProgress } from "../types/MistakeProgress";

export const mistakeProgressKey = (mistakeReason: string, symbolId: number): string =>
  `${mistakeReason}::${symbolId}`;

export const createDefaultMistakeProgress = (overrides: Partial<MistakeProgress> = {}): MistakeProgress => ({
  id: "",
  mistake_reason: "",
  symbol_id: 0,
  streak: 0,
  mastered: false,
  updated_at: new Date(0).toISOString(),
  ...overrides
});

export const createMistakeProgressForm = createDefaultMistakeProgress;
export const createMistakeProgressResponse = createDefaultMistakeProgress;
