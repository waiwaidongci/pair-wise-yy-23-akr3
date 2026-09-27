import { BrailleCell } from "../components/common/BrailleCell";
import { EmptyState } from "../components/common/EmptyState";
import { StatCard } from "../components/common/StatCard";
import { MistakeGroupText } from "../constants/MistakeGroup";
import { CONSECUTIVE_CORRECT_TO_MASTER } from "../constants/masteryRules";
import { useMistakeBook } from "../hooks/useMistakeBook";
import { formatStreak } from "../utils/formatters";
import { mistakeReasonText, type MistakeEntryView } from "../utils/mistakeBook";

function MistakeCard({ entry }: { entry: MistakeEntryView }) {
  return (
    <article className="mistake-card">
      <BrailleCell pattern={entry.symbol?.cell_pattern ?? ""} caption={entry.symbol?.letter ?? "?"} />
      <div className="meta">
        <strong>{entry.symbol?.letter ?? "未知字符"}</strong>
        <span>拼音 {entry.symbol?.pinyin ?? "-"}</span>
      </div>
      {entry.mastered ? (
        <span className="badge mastered">{MistakeGroupText.MASTERED}</span>
      ) : (
        <span className="badge pending">连对 {formatStreak(entry.progress.streak)}/{CONSECUTIVE_CORRECT_TO_MASTER}</span>
      )}
    </article>
  );
}

export function MistakesPage({ onEnterPractice }: { onEnterPractice?: () => void }) {
  const { groups, loading, selectReason } = useMistakeBook();
  const pendingTotal = groups.reduce((sum, group) => sum + group.pending.length, 0);
  const masteredTotal = groups.reduce((sum, group) => sum + group.mastered.length, 0);

  const enterPractice = (reason: string) => {
    selectReason(reason);
    onEnterPractice?.();
  };

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">braille-trainer</p>
          <h1>错题本</h1>
        </div>
      </section>
      <section className="metrics">
        <StatCard label="错误原因" value={groups.length} />
        <StatCard label={MistakeGroupText.PENDING} value={pendingTotal} />
        <StatCard label={MistakeGroupText.MASTERED} value={masteredTotal} />
      </section>
      {loading ? <EmptyState title="加载中…" /> : null}
      {!loading && groups.length === 0 ? <EmptyState title="暂无错题记录" /> : null}
      <div className="mistake-groups">
        {groups.map((group) => (
          <section className="panel" key={group.reason}>
            <div className="group-head">
              <h2>{mistakeReasonText(group.reason)}</h2>
              <span className="group-counts">
                {MistakeGroupText.PENDING} {group.pending.length} · {MistakeGroupText.MASTERED} {group.mastered.length}
              </span>
            </div>
            <div className="group-cols">
              <div className="group-col">
                <h3>{MistakeGroupText.PENDING}（{group.pending.length}）</h3>
                <div className="mistake-list">
                  {group.pending.map((entry) => (
                    <MistakeCard key={entry.symbol_id} entry={entry} />
                  ))}
                  {group.pending.length === 0 ? <EmptyState title="本组已没有待巩固字符" /> : null}
                </div>
                <button
                  className="btn"
                  disabled={group.pending.length === 0}
                  onClick={() => enterPractice(group.reason)}
                >
                  进入练习
                </button>
              </div>
              <div className="group-col">
                <h3>{MistakeGroupText.MASTERED}（{group.mastered.length}）</h3>
                <div className="mistake-list">
                  {group.mastered.map((entry) => (
                    <MistakeCard key={entry.symbol_id} entry={entry} />
                  ))}
                  {group.mastered.length === 0 ? <EmptyState title={`连续答对 ${CONSECUTIVE_CORRECT_TO_MASTER} 次后移入这里`} /> : null}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
