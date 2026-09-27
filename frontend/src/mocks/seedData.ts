import type { BrailleSymbol } from "../types/BrailleSymbol";
import type { AnswerRecord } from "../types/AnswerRecord";

// cell_pattern 为 6 位串，依次对应点位 1,2,3（左列）/ 4,5,6（右列），1 为凸点。
const brailleSymbol: BrailleSymbol[] = [
  { id: 1, cell_pattern: "100000", letter: "a", pinyin: "a", category: "LETTER", difficulty: "EASY", audio_hint_key: "pinyin:a" },
  { id: 2, cell_pattern: "110000", letter: "b", pinyin: "bo", category: "LETTER", difficulty: "EASY", audio_hint_key: "pinyin:bo" },
  { id: 3, cell_pattern: "100100", letter: "c", pinyin: "ci", category: "LETTER", difficulty: "EASY", audio_hint_key: "pinyin:ci" },
  { id: 4, cell_pattern: "100110", letter: "d", pinyin: "de", category: "LETTER", difficulty: "MEDIUM", audio_hint_key: "pinyin:de" },
  { id: 5, cell_pattern: "100010", letter: "e", pinyin: "e", category: "LETTER", difficulty: "EASY", audio_hint_key: "pinyin:e" },
  { id: 6, cell_pattern: "110100", letter: "f", pinyin: "fo", category: "LETTER", difficulty: "MEDIUM", audio_hint_key: "pinyin:fo" },
  { id: 7, cell_pattern: "110110", letter: "g", pinyin: "ge", category: "LETTER", difficulty: "MEDIUM", audio_hint_key: "pinyin:ge" },
  { id: 8, cell_pattern: "110010", letter: "h", pinyin: "he", category: "LETTER", difficulty: "MEDIUM", audio_hint_key: "pinyin:he" },
  { id: 9, cell_pattern: "010100", letter: "i", pinyin: "yi", category: "LETTER", difficulty: "HARD", audio_hint_key: "pinyin:yi" },
  { id: 10, cell_pattern: "010110", letter: "j", pinyin: "ji", category: "LETTER", difficulty: "HARD", audio_hint_key: "pinyin:ji" }
];

// 答错记录进入错题本；字符 a、c 各带两种错误原因，验证同一字符两边进度独立保存。
const answerRecord: AnswerRecord[] = [
  { id: 1, session_id: 1, symbol_id: 1, user_answer: "c", correct: false, latency_ms: 4200, mistake_reason: "DOT_POSITION" },
  { id: 2, session_id: 1, symbol_id: 1, user_answer: "b", correct: false, latency_ms: 3800, mistake_reason: "SIMILAR_SYMBOL" },
  { id: 3, session_id: 1, symbol_id: 2, user_answer: "p", correct: false, latency_ms: 5100, mistake_reason: "DOT_POSITION" },
  { id: 4, session_id: 1, symbol_id: 2, user_answer: "f", correct: false, latency_ms: 4600, mistake_reason: "DOT_POSITION" },
  { id: 5, session_id: 2, symbol_id: 3, user_answer: "a", correct: false, latency_ms: 6000, mistake_reason: "DIRECTION_FLIP" },
  { id: 6, session_id: 2, symbol_id: 3, user_answer: "k", correct: false, latency_ms: 5400, mistake_reason: "PINYIN_MISMATCH" },
  { id: 7, session_id: 2, symbol_id: 4, user_answer: "h", correct: false, latency_ms: 4900, mistake_reason: "SIMILAR_SYMBOL" },
  { id: 8, session_id: 2, symbol_id: 5, user_answer: "i", correct: false, latency_ms: 4300, mistake_reason: "DOT_POSITION" },
  { id: 9, session_id: 3, symbol_id: 6, user_answer: "h", correct: false, latency_ms: 5800, mistake_reason: "DIRECTION_FLIP" },
  { id: 10, session_id: 3, symbol_id: 7, user_answer: "q", correct: false, latency_ms: 5200, mistake_reason: "PINYIN_MISMATCH" },
  { id: 11, session_id: 3, symbol_id: 8, user_answer: "f", correct: false, latency_ms: 4700, mistake_reason: "SIMILAR_SYMBOL" },
  { id: 12, session_id: 1, symbol_id: 9, user_answer: "i", correct: true, latency_ms: 2100, mistake_reason: "" },
  { id: 13, session_id: 2, symbol_id: 10, user_answer: "j", correct: true, latency_ms: 2400, mistake_reason: "" }
];

export const mockData = {
  brailleSymbol,
  answerRecord,
  lesson: [
    { id: 1, title: "声母与单韵母（一）", symbol_ids: [1, 2, 3, 4, 5], stage: "入门", estimated_minutes: 15, unlock_rule: "完成课程介绍" },
    { id: 2, title: "常见易混点位", symbol_ids: [6, 7, 8], stage: "基础", estimated_minutes: 20, unlock_rule: "课程一正确率 60%" },
    { id: 3, title: "高难度形近字符", symbol_ids: [9, 10], stage: "进阶", estimated_minutes: 25, unlock_rule: "课程二正确率 80%" }
  ],
  practiceSession: [
    { id: 1, lesson_id: 1, mode: "CELL_TO_TEXT", started_at: "2026-09-20T09:00:00Z", finished_at: "2026-09-20T09:12:00Z", score: 62, mistake_count: 5 },
    { id: 2, lesson_id: 2, mode: "MIXED", started_at: "2026-09-22T14:00:00Z", finished_at: "2026-09-22T14:18:00Z", score: 71, mistake_count: 4 },
    { id: 3, lesson_id: 3, mode: "LISTENING", started_at: "2026-09-25T20:00:00Z", finished_at: "2026-09-25T20:22:00Z", score: 83, mistake_count: 3 }
  ]
} as const;

export type MockData = {
  brailleSymbol: BrailleSymbol[];
  answerRecord: AnswerRecord[];
  lesson: typeof mockData.lesson;
  practiceSession: typeof mockData.practiceSession;
};
