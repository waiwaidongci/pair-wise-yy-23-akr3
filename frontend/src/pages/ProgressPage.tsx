import { useEffect, useMemo } from "react";
import { getMistakeReasonText } from "../constants/MistakeReason";
import { BrailleCell } from "../components/common/BrailleCell";
import { EmptyState } from "../components/common/EmptyState";
import { StatCard } from "../components/common/StatCard";
import { useAnswerRecordStore } from "../stores/AnswerRecordStore";
import { useBrailleSymbolStore } from "../stores/BrailleSymbolStore";
import { useMistakeProgressStore } from "../stores/MistakeProgressStore";
import { buildMistakeItems, summarizeMistakeReasons } from "../utils/mistakes";

export function ProgressPage() {
  const recordRows = useAnswerRecordStore((state) => state.rows);
  const loadRecords = useAnswerRecordStore((state) => state.load);
  const symbolRows = useBrailleSymbolStore((state) => state.rows);
  const loadSymbols = useBrailleSymbolStore((state) => state.load);
  const progressRows = useMistakeProgressStore((state) => state.rows);
  const progressLoading = useMistakeProgressStore((state) => state.loading);
  const loadProgress = useMistakeProgressStore((state) => state.load);

  useEffect(() => {
    void Promise.all([loadRecords(), loadSymbols(), loadProgress()]);
  }, [loadRecords, loadSymbols, loadProgress]);

  const items = useMemo(() => {
    const symbolsById = new Map(symbolRows.map((symbol) => [symbol.id, symbol]));
    const progressByKey = new Map(progressRows.map((row) => [row.key, row]));
    return buildMistakeItems(recordRows, symbolsById, progressByKey);
  }, [recordRows, symbolRows, progressRows]);

  const stats = useMemo(() => summarizeMistakeReasons(items), [items]);
  const remainingTotal = stats.reduce((sum, stat) => sum + stat.remaining, 0);
  const masteredTotal = stats.reduce((sum, stat) => sum + stat.mastered, 0);
  const overallRate = items.length === 0 ? 0 : Math.round((masteredTotal / items.length) * 100);

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">braille-trainer</p>
          <h1>学习进度</h1>
          <p className="dim">{progressLoading ? "正在读取本地巩固进度…" : "各错误原因下的剩余数量与掌握数量（数据保存在本机，关掉再打开仍可查看）。"}</p>
        </div>
      </section>

      <section className="metrics">
        <StatCard label="待巩固总数" value={remainingTotal} />
        <StatCard label="已掌握总数" value={masteredTotal} />
        <StatCard label="总体掌握率" value={overallRate + "%"} />
      </section>

      {stats.length === 0 ? (
        <EmptyState title="暂无错题进度数据" />
      ) : (
        <section className="panel">
          <h2>按错误原因统计</h2>
          <div className="table">
            {stats.map((stat) => {
              const rate = stat.total === 0 ? 0 : Math.round((stat.mastered / stat.total) * 100);
              return (
                <article key={stat.mistake_reason} className="reason-stat-row">
                  <strong>{getMistakeReasonText(stat.mistake_reason)}</strong>
                  <div className="reason-bar" aria-label={`掌握率 ${rate}%`}>
                    <span style={{ width: `${rate}%` }} />
                  </div>
                  <span className="dim">剩余 {stat.remaining}</span>
                  <span className="dim">掌握 {stat.mastered}</span>
                  <span className="badge">{rate}%</span>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className="panel">
        <h2>逐字符巩固情况</h2>
        {items.length === 0 ? (
          <EmptyState title="暂无错题" />
        ) : (
          <div className="symbol-progress-grid">
            {items.map((item) => (
              <article key={item.key} className="symbol-progress-card">
                <BrailleCell pattern={item.symbol.cell_pattern} size={48} />
                <div>
                  <strong>{item.symbol.letter}</strong>
                  <span className="dim">{getMistakeReasonText(item.mistake_reason)}</span>
                </div>
                <span className={"badge " + (item.mastered ? "result-correct" : "result-wrong")}>
                  {item.mastered ? "已掌握" : `待巩固 · 连对 ${item.correct_streak}/2`}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
