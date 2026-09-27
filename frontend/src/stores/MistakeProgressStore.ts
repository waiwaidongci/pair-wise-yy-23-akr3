import { create } from "zustand";
import {
  ensureMistakeProgress,
  listMistakeProgress,
  saveMistakeProgress
} from "../api/MistakeProgress";
import { createDefaultMistakeProgress } from "../constructors/MistakeProgressConstructor";
import type { MistakeProgress } from "../types/MistakeProgress";
import { isStreakMastered } from "../utils/mistakes";

type State = {
  rows: MistakeProgress[];
  loading: boolean;
  loaded: boolean;
  load: () => Promise<void>;
  registerPairs: (pairs: Array<{ symbol_id: number; mistake_reason: string }>) => Promise<void>;
  recordAnswer: (
    symbolId: number,
    mistakeReason: string,
    correct: boolean
  ) => Promise<MistakeProgress | null>;
  getProgress: (symbolId: number, mistakeReason: string) => MistakeProgress | undefined;
};

const keyOf = (symbolId: number, mistakeReason: string) => `${symbolId}::${mistakeReason}`;

export const useMistakeProgressStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  loaded: false,

  async load() {
    set({ loading: true });
    try {
      set({ rows: await listMistakeProgress(), loaded: true });
    } finally {
      set({ loading: false });
    }
  },

  async registerPairs(pairs) {
    const { rows } = get();
    const missing = pairs.filter(
      (pair) => !rows.some((row) => row.key === keyOf(pair.symbol_id, pair.mistake_reason))
    );
    if (missing.length === 0) return;
    const created = await Promise.all(
      missing.map((pair) => ensureMistakeProgress(pair.symbol_id, pair.mistake_reason))
    );
    set({ rows: [...rows, ...created] });
  },

  async recordAnswer(symbolId, mistakeReason, correct) {
    const { rows } = get();
    const key = keyOf(symbolId, mistakeReason);
    const previous =
      rows.find((row) => row.key === key) ??
      createDefaultMistakeProgress(symbolId, mistakeReason);

    // 连续两次答对才移入已掌握；答错直接清零（已掌握者也会被打回待巩固）
    const nextStreak = correct ? previous.correct_streak + 1 : 0;
    const next: MistakeProgress = {
      ...previous,
      key,
      symbol_id: symbolId,
      mistake_reason: mistakeReason,
      correct_streak: nextStreak,
      mastered: isStreakMastered(nextStreak),
      updated_at: new Date().toISOString()
    };

    const saved = await saveMistakeProgress(next, correct ? "correct" : "wrong");
    set({ rows: [...rows.filter((row) => row.key !== key), saved] });
    return saved;
  },

  getProgress(symbolId, mistakeReason) {
    return get().rows.find((row) => row.key === keyOf(symbolId, mistakeReason));
  }
}));
