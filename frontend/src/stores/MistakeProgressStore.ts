import { create } from "zustand";
import { listMistakeProgress, saveMistakeProgress } from "../api/MistakeProgress";
import { createDefaultMistakeProgress, mistakeProgressKey } from "../constructors/MistakeProgressConstructor";
import { CONSECUTIVE_CORRECT_TO_MASTER } from "../constants/masteryRules";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { MistakeProgress } from "../types/MistakeProgress";

type State = {
  rows: MistakeProgress[];
  loading: boolean;
  selectedReason: string | null;
  load: () => Promise<void>;
  selectReason: (reason: string | null) => void;
  recordAnswer: (reason: string, symbolId: number, correct: boolean) => Promise<MistakeProgress>;
};

export const useMistakeProgressStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  selectedReason: null,
  async load() {
    set({ loading: true });
    set({ rows: await listMistakeProgress(), loading: false });
  },
  selectReason(reason) {
    set({ selectedReason: reason });
  },
  async recordAnswer(reason, symbolId, correct) {
    const key = mistakeProgressKey(reason, symbolId);
    const prev = get().rows.find((row) => row.id === key)
      ?? createDefaultMistakeProgress({ id: key, mistake_reason: reason, symbol_id: symbolId });
    const streak = correct ? prev.streak + 1 : 0;
    const next: MistakeProgress = {
      ...prev,
      streak,
      mastered: streak >= CONSECUTIVE_CORRECT_TO_MASTER,
      updated_at: new Date().toISOString()
    };
    const rows = [...get().rows.filter((row) => row.id !== key), next];
    set({ rows });
    await saveMistakeProgress(rows);
    console.info(LOG_TEMPLATES.MistakeProgress[2], { key, streak, mastered: next.mastered });
    return next;
  }
}));
