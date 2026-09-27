import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { getMistakeReasonText } from "../constants/MistakeReason";
import type { MistakeGroupStatus } from "../constants/MistakeGroupStatus";
import { MistakeGroupStatusText } from "../constants/MistakeGroupStatus";
import { BrailleCell } from "../components/common/BrailleCell";
import { EmptyState } from "../components/common/EmptyState";
import { ResultBadge } from "../components/common/ResultBadge";
import { useMistakePractice } from "../hooks/useMistakePractice";
import { useAnswerRecordStore } from "../stores/AnswerRecordStore";
import { useBrailleSymbolStore } from "../stores/BrailleSymbolStore";
import { useMistakeProgressStore } from "../stores/MistakeProgressStore";
import { buildMistakeItems } from "../utils/mistakes";

function readSelection(): { reason: string; group: MistakeGroupStatus } | null {
  const hash = window.location.hash.split("?")[1] ?? "";
  const params = new URLSearchParams(hash);
  const reason = params.get("reason");
  const group = params.get("group") === "MASTERED" ? "MASTERED" : "PENDING";
  return reason ? { reason, group } : null;
}

export function MistakePracticePage() {
  const [selection] = useState(readSelection);
  const [answer, setAnswer] = useState("");

  const recordRows = useAnswerRecordStore((state) => state.rows);
  const loadRecords = useAnswerRecordStore((state) => state.load);
  const symbolRows = useBrailleSymbolStore((state) => state.rows);
  const loadSymbols = useBrailleSymbolStore((state) => state.load);
  const progressRows = useMistakeProgressStore((state) => state.rows);
  const progressLoaded = useMistakeProgressStore((state) => state.loaded);
  const loadProgress = useMistakeProgressStore((state) => state.load);

  useEffect(() => {
    void Promise.all([loadRecords(), loadSymbols(), loadProgress()]);
  }, [loadRecords, loadSymbols, loadProgress]);

  const items = useMemo(() => {
    const symbolsById = new Map(symbolRows.map((symbol) => [symbol.id, symbol]));
    const progressByKey = new Map(progressRows.map((row) => [row.key, row]));
    return buildMistakeItems(recordRows, symbolsById, progressByKey);
  }, [recordRows, symbolRows, progressRows]);

  // 字符与巩固进度都加载完成才建队，避免空快照锁死队列
  const ready = symbolRows.length > 0 && progressLoaded;
  const { current, remaining, total, feedback, threshold, sessionCorrect, sessionWrong, submit, next } =
    useMistakePractice(items, selection?.reason ?? "", selection?.group ?? "PENDING", ready);

  if (!selection) {
    return (
      <main className="page">
        <EmptyState title={ERROR_MESSAGES.MISTAKE_GROUP_EMPTY} />
        <p><a className="btn" href="#/mistakes">返回错题本</a></p>
      </main>
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!answer.trim() || feedback) return;
    await submit(answer);
  };

  const handleNext = () => {
    setAnswer("");
    next();
  };

  return (
    <main className="page practice-page">
      <section className="page-head">
        <div>
          <p className="eyebrow">错题重练</p>
          <h1>{getMistakeReasonText(selection.reason)} · {MistakeGroupStatusText[selection.group]}</h1>
          <p className="dim">只出该错误原因下「{MistakeGroupStatusText[selection.group]}」组的字符；连续 {threshold} 次答对移入已掌握，答错次数清零。</p>
        </div>
        <a className="btn" href="#/mistakes">返回错题本</a>
      </section>

      <section className="metrics">
        <span className="stat"><span>本组题量</span><strong>{total}</strong></span>
        <span className="stat"><span>队列剩余</span><strong>{remaining}</strong></span>
        <span className="stat"><span>本次对 / 错</span><strong>{sessionCorrect} / {sessionWrong}</strong></span>
      </section>

      {!current ? (
        <section className="panel">
          {total === 0 ? (
            <EmptyState title={ERROR_MESSAGES.MISTAKE_GROUP_EMPTY} />
          ) : (
            <>
              <h2>本组待巩固字符已全部掌握 🎉</h2>
              <p className="dim">连续答对 {threshold} 次的字符已移入「已掌握」，可去进度页查看各错误原因的剩余与掌握数量。</p>
            </>
          )}
          <a className="btn primary" href="#/mistakes">返回错题本</a>
        </section>
      ) : (
        <section className="panel practice-card">
          <BrailleCell pattern={current.symbol.cell_pattern} size={140} title={current.symbol.letter} />
          <form className="answer-form" onSubmit={handleSubmit}>
            <label htmlFor="mistake-answer">这个点阵对应哪个字母？</label>
            <input
              id="mistake-answer"
              value={answer}
              autoFocus
              autoComplete="off"
              disabled={!!feedback}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="输入字母后回车"
            />
            {!feedback ? (
              <button className="btn primary" type="submit" disabled={!answer.trim()}>提交答案</button>
            ) : (
              <button className="btn primary" type="button" onClick={handleNext}>下一题</button>
            )}
          </form>
          {feedback && (
            <div className={"feedback " + (feedback.correct ? "ok" : "bad")}>
              <ResultBadge correct={feedback.correct} />
              <span>
                正确答案：<strong>{feedback.expected}</strong>
                {feedback.correct
                  ? feedback.mastered
                    ? "，已连续两次答对，移入已掌握！"
                    : `，再答对 ${threshold - feedback.streak} 次即掌握（当前连对 ${feedback.streak}/${threshold}）`
                  : "，连续答对次数已清零，这道题会再次出现"}
              </span>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
