export interface ChartRow {
  label: string;
  pending: number;
  mastered: number;
}

export function ChartPanel({ rows }: { rows: ChartRow[] }) {
  return (
    <div className="chart-rows">
      {rows.map((row) => {
        const total = row.pending + row.mastered;
        const ratio = total === 0 ? 0 : row.mastered / total;
        return (
          <div className="chart-row" key={row.label}>
            <span>{row.label}</span>
            <span className="chart-bar">
              <span className="mastered" style={{ width: `${ratio * 100}%` }} />
            </span>
            <span>
              待巩固 {row.pending} · 已掌握 {row.mastered}
            </span>
          </div>
        );
      })}
    </div>
  );
}
