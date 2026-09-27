import { useEffect, useMemo } from "react";
import { getMistakeReasonText } from "../constants/MistakeReason";
import { useAnswerRecordStore } from "../stores/AnswerRecordStore";
import { useBrailleSymbolStore } from "../stores/BrailleSymbolStore";
import { useMistakeProgressStore } from "../stores/MistakeProgressStore";
import type { MistakeGroupStatus } from "../constants/MistakeGroupStatus";
import { BrailleCell } from "../components/common/BrailleCell";
import { EmptyState } from "../components/common/EmptyState";
import { MistakeGroupBadge } from "../components/common/MistakeGroupBadge";
import { StatCard } from "../components/common/StatCard";
import type { MistakeItem } from "../types/Mistake";
import { buildMistakeItems, groupMistakesByReason } from "../utils/mistakes";

function practiceHref(reason: string, status: MistakeGroupStatus) {
  return `#/mistakes/practice?reason=${encodeURIComponent(reason)}&group=${status}`;
}

function MistakeCard({ item }: { item: MistakeItem }) {
  return (
    <article className="mistake-card">
      <BrailleCell pattern={item.symbol.cell_pattern} size={64} title={item.symbol.letter} />
      <div className="mistake-card-body">
        <strong>{item.symbol.letter}</strong>
        <span>拼音：{item.symbol.pinyin}</span>
        <span className="dim">上次答成：{item.latest_record.user_answer || "（空）"} · 错 {item.record_count} 次</span>
      </div>
      <div className="mistake-card-side">
        <MistakeGroupBadge status={item.mastered ? "MASTERED" : "PENDING"} />
        <span className="dim">连对 {item.correct_streak}/2</span>
      </div>
    </article>
  );
}

export function MistakesPage() {
  const recordRows = useAnswerRecordStore((state) => state.rows);
  const loadRecords = useAnswerRecordStore((state) => state.load);
  const symbolRows = useBrailleSymbolStore((state) => state.rows);
  const loadSymbols = useBrailleSymbolStore((state) => state.load);
  const progressRows = useMistakeProgressStore((state) => state.rows);
  const loadProgress = useMistakeProgressStore((state) => state.load);
  const registerPairs = useMistakeProgressStore((state) => state.registerPairs);

  useEffect(() => {
    void Promise.all([loadRecords(), loadSymbols(), loadProgress()]);
  }, [loadRecords, loadSymbols, loadProgress]);

  const symbolsById = useMemo(
    () => new Map(symbolRows.map((symbol) => [symbol.id, symbol])),
    [symbolRows]
  );
  const progressByKey = useMemo(
    () => new Map(progressRows.map((row) => [row.key, row])),
    [progressRows]
  );

  const items = useMemo(
    () => buildMistakeItems(recordRows, symbolsById, progressByKey),
    [recordRows, symbolsById, progressByKey]
  );
  const groups = useMemo(() => groupMistakesByReason(items), [items]);

  // 为新出现的“字符 × 错误原因”补建档，进度独立保存
  const pairSignature = items.map((item) => item.key).join(",");
  useEffect(() => {
    if (!pairSignature) return;
    void registerPairs(
      pairSignature.split(",").map((key) => {
        const [symbolId, ...rest] = key.split("::");
        return { symbol_id: Number(symbolId), mistake_reason: rest.join("::") };
      })
    );
  }, [pairSignature, registerPairs]);

  const pendingTotal = items.filter((item) => !item.mastered).length;
  const masteredTotal = items.length - pendingTotal;

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">braille-trainer</p>
          <h1>错题本</h1>
          <p className="dim">按错误原因归类，选择「待巩固」或「已掌握」一组进入练习；同一字符在不同原因下进度独立。</p>
        </div>
      </section>

      <section className="metrics">
        <StatCard label="错误原因" value={groups.length} />
        <StatCard label="待巩固" value={pendingTotal} />
        <StatCard label="已掌握" value={masteredTotal} />
      </section>

      {groups.length === 0 ? (
        <EmptyState title="还没有错题，先去练习模式做几道题吧" />
      ) : (
        <section className="reason-stack">
          {groups.map((group) => (
            <article key={group.mistake_reason} className="panel reason-panel">
              <header className="reason-head">
                <h2>{getMistakeReasonText(group.mistake_reason)}</h2>
                <span className="dim">待巩固 {group.pending.length} · 已掌握 {group.mastered.length}</span>
              </header>
              <div className="group-columns">
                <div className="group-column">
                  <div className="group-title">
                    <MistakeGroupBadge status="PENDING" />
                    <a className="btn primary" href={practiceHref(group.mistake_reason, "PENDING")}>
                      进入练习
                    </a>
                  </div>
                  {group.pending.length === 0 ? (
                    <EmptyState title="本组已全部掌握" />
                  ) : (
                    group.pending.map((item) => <MistakeCard key={item.key} item={item} />)
                  )}
                </div>
                <div className="group-column">
                  <div className="group-title">
                    <MistakeGroupBadge status="MASTERED" />
                    <a className="btn" href={practiceHref(group.mistake_reason, "MASTERED")}>
                      进入练习
                    </a>
                  </div>
                  {group.mastered.length === 0 ? (
                    <EmptyState title="还没有掌握的字符" />
                  ) : (
                    group.mastered.map((item) => <MistakeCard key={item.key} item={item} />)
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
