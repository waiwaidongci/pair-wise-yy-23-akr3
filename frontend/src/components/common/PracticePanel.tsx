import type { ReactNode } from "react";

export function PracticePanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="panel practice-panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
