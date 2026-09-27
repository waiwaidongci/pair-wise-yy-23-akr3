export const mockData = {
  "brailleSymbol": [
    {
      "id": 1,
      "cell_pattern": "100000",
      "letter": "a",
      "pinyin": "a",
      "category": "LETTER",
      "difficulty": "EASY",
      "audio_hint_key": "hint_a"
    },
    {
      "id": 2,
      "cell_pattern": "101000",
      "letter": "b",
      "pinyin": "bo",
      "category": "LETTER",
      "difficulty": "EASY",
      "audio_hint_key": "hint_b"
    },
    {
      "id": 3,
      "cell_pattern": "100100",
      "letter": "c",
      "pinyin": "ci",
      "category": "LETTER",
      "difficulty": "MEDIUM",
      "audio_hint_key": "hint_c"
    },
    {
      "id": 4,
      "cell_pattern": "100110",
      "letter": "d",
      "pinyin": "de",
      "category": "LETTER",
      "difficulty": "MEDIUM",
      "audio_hint_key": "hint_d"
    },
    {
      "id": 5,
      "cell_pattern": "100010",
      "letter": "e",
      "pinyin": "e",
      "category": "LETTER",
      "difficulty": "EASY",
      "audio_hint_key": "hint_e"
    },
    {
      "id": 6,
      "cell_pattern": "101100",
      "letter": "f",
      "pinyin": "fo",
      "category": "LETTER",
      "difficulty": "MEDIUM",
      "audio_hint_key": "hint_f"
    },
    {
      "id": 7,
      "cell_pattern": "101110",
      "letter": "g",
      "pinyin": "ge",
      "category": "LETTER",
      "difficulty": "HARD",
      "audio_hint_key": "hint_g"
    },
    {
      "id": 8,
      "cell_pattern": "101010",
      "letter": "h",
      "pinyin": "he",
      "category": "LETTER",
      "difficulty": "HARD",
      "audio_hint_key": "hint_h"
    }
  ],
  "lesson": [
    {
      "id": 1,
      "title": "基础字母 a-e",
      "symbol_ids": [1, 2, 3, 4, 5],
      "stage": "基础",
      "estimated_minutes": 10,
      "unlock_rule": "无"
    },
    {
      "id": 2,
      "title": "进阶字母 f-h",
      "symbol_ids": [6, 7, 8],
      "stage": "进阶",
      "estimated_minutes": 15,
      "unlock_rule": "完成基础课程"
    },
    {
      "id": 3,
      "title": "综合复习",
      "symbol_ids": [1, 2, 3, 4, 5, 6, 7, 8],
      "stage": "综合",
      "estimated_minutes": 20,
      "unlock_rule": "完成进阶课程"
    }
  ],
  "practiceSession": [
    {
      "id": 1,
      "lesson_id": 1,
      "mode": "MIXED",
      "started_at": "2026-09-20T09:00:00Z",
      "finished_at": "2026-09-20T09:12:00Z",
      "score": 60,
      "mistake_count": 4
    },
    {
      "id": 2,
      "lesson_id": 2,
      "mode": "CELL_TO_TEXT",
      "started_at": "2026-09-22T09:00:00Z",
      "finished_at": "2026-09-22T09:15:00Z",
      "score": 75,
      "mistake_count": 3
    },
    {
      "id": 3,
      "lesson_id": 3,
      "mode": "LISTENING",
      "started_at": "2026-09-25T09:00:00Z",
      "finished_at": "2026-09-25T09:18:00Z",
      "score": 80,
      "mistake_count": 3
    }
  ],
  "answerRecord": [
    {
      "id": 1,
      "session_id": 1,
      "symbol_id": 1,
      "user_answer": "c",
      "correct": "false",
      "latency_ms": "4200",
      "mistake_reason": "DOT_CONFUSION"
    },
    {
      "id": 2,
      "session_id": 1,
      "symbol_id": 2,
      "user_answer": "d",
      "correct": "false",
      "latency_ms": "3800",
      "mistake_reason": "DOT_CONFUSION"
    },
    {
      "id": 3,
      "session_id": 1,
      "symbol_id": 3,
      "user_answer": "e",
      "correct": "false",
      "latency_ms": "5100",
      "mistake_reason": "DIRECTION_FLIP"
    },
    {
      "id": 4,
      "session_id": 2,
      "symbol_id": 1,
      "user_answer": "d",
      "correct": "false",
      "latency_ms": "4600",
      "mistake_reason": "DIRECTION_FLIP"
    },
    {
      "id": 5,
      "session_id": 2,
      "symbol_id": 4,
      "user_answer": "h",
      "correct": "false",
      "latency_ms": "6100",
      "mistake_reason": "LISTENING_SLIP"
    },
    {
      "id": 6,
      "session_id": 2,
      "symbol_id": 5,
      "user_answer": "a",
      "correct": "false",
      "latency_ms": "5500",
      "mistake_reason": "MEMORY_FUZZY"
    },
    {
      "id": 7,
      "session_id": 3,
      "symbol_id": 6,
      "user_answer": "g",
      "correct": "false",
      "latency_ms": "4900",
      "mistake_reason": "DOT_CONFUSION"
    },
    {
      "id": 8,
      "session_id": 3,
      "symbol_id": 3,
      "user_answer": "c",
      "correct": "true",
      "latency_ms": "2600",
      "mistake_reason": ""
    },
    {
      "id": 9,
      "session_id": 3,
      "symbol_id": 7,
      "user_answer": "j",
      "correct": "false",
      "latency_ms": "5300",
      "mistake_reason": "MEMORY_FUZZY"
    },
    {
      "id": 10,
      "session_id": 2,
      "symbol_id": 8,
      "user_answer": "b",
      "correct": "false",
      "latency_ms": "4700",
      "mistake_reason": "DIRECTION_FLIP"
    }
  ]
} as const;
