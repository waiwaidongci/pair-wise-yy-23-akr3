import { useEffect, useState } from "react";
import { BrailleCell } from "../components/common/BrailleCell";
import { EmptyState } from "../components/common/EmptyState";
import { StatusBadge } from "../components/common/StatusBadge";
import { useBrailleSymbolStore } from "../stores/BrailleSymbolStore";
import { useIndexedDbStore } from "../hooks/useIndexedDbStore";

const DIFFICULTIES = ["ALL", "EASY", "MEDIUM", "HARD"] as const;

export function LearnPage() {
  const { rows, load, loading } = useBrailleSymbolStore();
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number]>("ALL");
  useEffect(() => {
    void load();
  }, [load]);

  const filtered = difficulty === "ALL" ? rows : rows.filter((row) => row.difficulty === difficulty);
  const { pageRows } = useIndexedDbStore(filtered);

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">braille-trainer</p>
          <h1>学习卡片</h1>
        </div>
        <div className="filter-row">
          {DIFFICULTIES.map((item) => (
            <button key={item} className={difficulty === item ? "active" : ""} onClick={() => setDifficulty(item)}>
              {item}
            </button>
          ))}
        </div>
      </section>
      {loading ? <EmptyState title="加载中…" /> : null}
      {!loading && pageRows.length === 0 ? <EmptyState title="暂无字符" /> : null}
      <section className="card-grid">
        {pageRows.map((symbol) => (
          <article className="panel symbol-card" key={symbol.id}>
            <BrailleCell pattern={symbol.cell_pattern} size="lg" />
            <div className="meta">
              <strong>{symbol.letter}</strong>
              <span>拼音 {symbol.pinyin}</span>
            </div>
            <StatusBadge value={symbol.difficulty} />
          </article>
        ))}
      </section>
    </main>
  );
}
