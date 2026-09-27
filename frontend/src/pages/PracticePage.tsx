import { useEffect, useState } from "react";
import { BrailleCell } from "../components/common/BrailleCell";
import { EmptyState } from "../components/common/EmptyState";
import { PracticePanel } from "../components/common/PracticePanel";
import { ResultBadge } from "../components/common/ResultBadge";
import { MistakeGroupText } from "../constants/MistakeGroup";
import { CONSECUTIVE_CORRECT_TO_MASTER } from "../constants/masteryRules";
import { useMistakeBook } from "../hooks/useMistakeBook";
import { usePracticeSession, type PracticeTarget } from "../hooks/usePracticeSession";
import { mistakeReasonText } from "../utils/mistakeBook";

interface Session {
  key: number;
  reason: string;
  targets: PracticeTarget[];
}

export function PracticePage({ onBack }: { onBack?: () => void }) {
  const { groups, loading, selectedReason, selectReason, recordAnswer } = useMistakeBook();
  const [session, setSession] = useState<Session | null>(null);
  const [answer, setAnswer] = useState("");
  const runner = usePracticeSession(
    session?.targets ?? [],
    (target, correct) => recordAnswer(target.mistake_reason, target.symbol_id, correct)
  );

  const startSession = (reason: string) => {
    const group = groups.find((item) => item.reason === reason);
    const targets: PracticeTarget[] = (group?.pending ?? [])
      .filter((entry) => entry.symbol)
      .map((entry) => ({
        mistake_reason: reason,
        symbol_id: entry.symbol_id,
        letter: entry.symbol!.letter,
        pinyin: entry.symbol!.pinyin,
        cell_pattern: entry.symbol!.cell_pattern
      }));
    selectReason(reason);
    setAnswer("");
    setSession({ key: Date.now(), reason, targets });
  };

  // 从错题本“进入练习”跳转过来时，自动用选中的错误原因开局。
  useEffect(() => {
    if (!session && selectedReason) {
      const group = groups.find((item) => item.reason === selectedReason);
      if (group && group.pending.length > 0) startSession(selectedReason);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, selectedReason, session]);

  const quit = () => {
    setSession(null);
    setAnswer("");
    selectReason(null);
  };

  const submit = async () => {
    if (!answer.trim()) return;
    await runner.submit(answer);
  };

  const goNext = () => {
    runner.next();
    setAnswer("");
  };

  if (!session) {
    return (
      <main className="page">
        <section className="page-head">
          <div>
            <p className="eyebrow">braille-trainer</p>
            <h1>练习模式</h1>
          </div>
        </section>
        <PracticePanel title={`选择一组${MistakeGroupText.PENDING}错题开始练习`}>
          {loading ? <EmptyState title="加载中…" /> : null}
          {!loading && groups.every((group) => group.pending.length === 0) ? (
            <EmptyState title="没有待巩固的错题，先去学习或等新的错题出现" />
          ) : null}
          <div className="reason-picker">
            {groups.map((group) => (
              <div className="reason-item" key={group.reason}>
                <strong>{mistakeReasonText(group.reason)}</strong>
                <span>{MistakeGroupText.PENDING} {group.pending.length} · {MistakeGroupText.MASTERED} {group.mastered.length}</span>
                <button className="btn" disabled={group.pending.length === 0} onClick={() => startSession(group.reason)}>
                  开始练习
                </button>
              </div>
            ))}
          </div>
        </PracticePanel>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">braille-trainer</p>
          <h1>练习模式 · {mistakeReasonText(session.reason)}</h1>
        </div>
        <button className="btn ghost" onClick={quit}>退出本组练习</button>
      </section>
      {runner.done ? (
        <PracticePanel title="本组练习完成">
          <p>该错误原因下的待巩固字符已全部连续答对 {CONSECUTIVE_CORRECT_TO_MASTER} 次，移入{MistakeGroupText.MASTERED}。</p>
          <div className="answer-row">
            <button className="btn" onClick={onBack}>返回错题本</button>
            <button className="btn ghost" onClick={quit}>选择其他错误原因</button>
          </div>
        </PracticePanel>
      ) : (
        <PracticePanel title={`剩余 ${runner.remaining} / 共 ${runner.total} 个待巩固字符`}>
          {runner.current ? (
            <div className="practice-stage">
              <BrailleCell pattern={runner.current.cell_pattern} size="lg" />
              <div className="practice-side">
                <p>请写出上面点阵对应的字母。</p>
                <div className="answer-row">
                  <input
                    value={answer}
                    autoFocus
                    disabled={!!runner.feedback}
                    placeholder="输入字母"
                    onChange={(event) => setAnswer(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter") return;
                      if (runner.feedback) goNext();
                      else void submit();
                    }}
                  />
                  {runner.feedback ? (
                    <button className="btn" onClick={goNext}>下一题</button>
                  ) : (
                    <button className="btn" disabled={!answer.trim()} onClick={() => void submit()}>提交</button>
                  )}
                </div>
                {runner.feedback ? (
                  <>
                    <ResultBadge
                      correct={runner.feedback.correct}
                      streak={runner.feedback.streak}
                      mastered={runner.feedback.mastered}
                    />
                    {!runner.feedback.correct ? (
                      <p className="correct-answer">正确答案：{runner.current.letter}（拼音 {runner.current.pinyin}）</p>
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>
          ) : (
            <EmptyState title="本组没有待巩固字符" />
          )}
        </PracticePanel>
      )}
    </main>
  );
}
