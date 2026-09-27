import { useEffect, useMemo } from "react";
import { useAnswerRecordStore } from "../stores/AnswerRecordStore";
import { useBrailleSymbolStore } from "../stores/BrailleSymbolStore";
import { useMistakeProgressStore } from "../stores/MistakeProgressStore";
import { buildMistakeBook } from "../utils/mistakeBook";

export function useMistakeBook() {
  const records = useAnswerRecordStore((state) => state.rows);
  const loadRecords = useAnswerRecordStore((state) => state.load);
  const recordsLoading = useAnswerRecordStore((state) => state.loading);
  const symbols = useBrailleSymbolStore((state) => state.rows);
  const loadSymbols = useBrailleSymbolStore((state) => state.load);
  const symbolsLoading = useBrailleSymbolStore((state) => state.loading);
  const progress = useMistakeProgressStore((state) => state.rows);
  const loadProgress = useMistakeProgressStore((state) => state.load);
  const progressLoading = useMistakeProgressStore((state) => state.loading);
  const selectedReason = useMistakeProgressStore((state) => state.selectedReason);
  const selectReason = useMistakeProgressStore((state) => state.selectReason);
  const recordAnswer = useMistakeProgressStore((state) => state.recordAnswer);

  useEffect(() => {
    void loadRecords();
    void loadSymbols();
    void loadProgress();
  }, [loadRecords, loadSymbols, loadProgress]);

  const groups = useMemo(() => buildMistakeBook(records, symbols, progress), [records, symbols, progress]);

  return {
    groups,
    symbols,
    loading: recordsLoading || symbolsLoading || progressLoading,
    selectedReason,
    selectReason,
    recordAnswer
  };
}
