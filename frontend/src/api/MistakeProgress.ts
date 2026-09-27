import { ERROR_MESSAGES } from "../constants/errorMessages";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { MISTAKE_PROGRESS_STORAGE_KEY } from "../constants/masteryRules";
import type { MistakeProgress } from "../types/MistakeProgress";

const endpoint = "/api/mistake-progress";

export async function listMistakeProgress(): Promise<MistakeProgress[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && false) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  try {
    const raw = localStorage.getItem(MISTAKE_PROGRESS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MistakeProgress[]) : [];
  } catch {
    console.error(ERROR_MESSAGES.PROGRESS_LOAD_FAILED);
    return [];
  }
}

export async function saveMistakeProgress(rows: MistakeProgress[]) {
  try {
    localStorage.setItem(MISTAKE_PROGRESS_STORAGE_KEY, JSON.stringify(rows));
    console.info(LOG_TEMPLATES.MistakeProgress[1], rows.length);
  } catch {
    console.error(ERROR_MESSAGES.PROGRESS_SAVE_FAILED);
  }
  return rows;
}
