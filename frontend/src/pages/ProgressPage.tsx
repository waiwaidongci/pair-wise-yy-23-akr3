import { ChartPanel } from "../components/common/ChartPanel";
import { EmptyState } from "../components/common/EmptyState";
import { LessonProgress } from "../components/common/LessonProgress";
import { StatCard } from "../components/common/StatCard";
import { MistakeGroupText } from "../constants/MistakeGroup";
import { useMistakeBook } from "../hooks/useMistakeBook";
import { mistakeReasonText } from "../utils/mistakeBook";

export function ProgressPage() {
  const { groups, loading } = useMistakeBook();
  const pendingTotal = groups.reduce((sum, group) => sum + group.pending.length, 0);
  const masteredTotal = groups.reduce((sum, group) => sum + group.mastered.length, 0);

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">braille-trainer</p>
          <h1>学习进度</h1>
        </div>
      </section>
      <section className="metrics">
        <StatCard label="错误原因" value={groups.length} />
        <StatCard label={`剩余（${MistakeGroupText.PENDING}）`} value={pendingTotal} />
        <StatCard label={MistakeGroupText.MASTERED} value={masteredTotal} />
      </section>
      <section className="panel">
        <h2>各错误原因掌握情况</h2>
        {loading ? <EmptyState title="加载中…" /> : null}
        {!loading && groups.length === 0 ? <EmptyState title="暂无错题进度" /> : null}
        {groups.length > 0 ? (
          <>
            <ChartPanel
              rows={groups.map((group) => ({
                label: mistakeReasonText(group.reason),
                pending: group.pending.length,
                mastered: group.mastered.length
              }))}
            />
            <div className="reason-progress-list">
              {groups.map((group) => {
                const total = group.pending.length + group.mastered.length;
                return (
                  <LessonProgress
                    key={group.reason}
                    label={`${mistakeReasonText(group.reason)}：剩余 ${group.pending.length} · 掌握 ${group.mastered.length}`}
                    value={total === 0 ? 0 : group.mastered.length / total}
                  />
                );
              })}
            </div>
          </>
        ) : null}
        <p className="hint">进度保存在本地浏览器中，关闭页面后再次打开仍会保留上次结果。</p>
      </section>
    </main>
  );
}
