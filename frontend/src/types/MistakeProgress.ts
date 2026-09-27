export interface MistakeProgress {
  id: string;
  mistake_reason: string;
  symbol_id: number;
  streak: number;
  mastered: boolean;
  updated_at: string;
}
