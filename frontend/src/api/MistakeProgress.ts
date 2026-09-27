import { LOG_TEMPLATES } from "../constants/logTemplates";
import { MISTAKE_STORAGE } from "../constants/MistakeGroupStatus";
import { createDefaultMistakeProgress } from "../constructors/MistakeProgressConstructor";
import type { MistakeProgress } from "../types/MistakeProgress";

const [, createLog, streakLog, resetLog] = LOG_TEMPLATES.MistakeProgress;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("indexeddb-unavailable"));
      return;
    }
    const request = indexedDB.open(MISTAKE_STORAGE.dbName, MISTAKE_STORAGE.dbVersion);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(MISTAKE_STORAGE.storeName)) {
        const store = db.createObjectStore(MISTAKE_STORAGE.storeName, { keyPath: "key" });
        store.createIndex("symbol_id", "symbol_id", { unique: false });
        store.createIndex("mistake_reason", "mistake_reason", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

function readFallback(): MistakeProgress[] {
  try {
    const raw = localStorage.getItem(MISTAKE_STORAGE.fallbackKey);
    return raw ? (JSON.parse(raw) as MistakeProgress[]) : [];
  } catch {
    return [];
  }
}

function writeFallback(rows: MistakeProgress[]) {
  localStorage.setItem(MISTAKE_STORAGE.fallbackKey, JSON.stringify(rows));
}

/** 读取全部错题巩固进度（IndexedDB，失败时回退 localStorage） */
export async function listMistakeProgress(): Promise<MistakeProgress[]> {
  try {
    const db = await openDb();
    return await new Promise<MistakeProgress[]>((resolve, reject) => {
      const tx = db.transaction(MISTAKE_STORAGE.storeName, "readonly");
      const request = tx.objectStore(MISTAKE_STORAGE.storeName).getAll();
      request.onsuccess = () => resolve((request.result as MistakeProgress[]) ?? []);
      request.onerror = () => reject(request.error);
    });
  } catch {
    console.warn(LOG_TEMPLATES.MistakeProgress[3], "fallback:localStorage");
    return readFallback();
  }
}

async function persist(row: MistakeProgress): Promise<MistakeProgress> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(MISTAKE_STORAGE.storeName, "readwrite");
      tx.objectStore(MISTAKE_STORAGE.storeName).put(row);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    const rows = readFallback().filter((item) => item.key !== row.key);
    rows.push(row);
    writeFallback(rows);
  }
  return row;
}

export async function saveMistakeProgress(
  payload: MistakeProgress,
  outcome: "correct" | "wrong" = "correct"
): Promise<MistakeProgress> {
  const row = { ...payload, updated_at: new Date().toISOString() };
  console.info(outcome === "wrong" ? resetLog : streakLog, row);
  return persist(row);
}

/** 为“字符 × 错误原因”补建档（不覆盖已有进度） */
export async function ensureMistakeProgress(
  symbolId: number,
  mistakeReason: string
): Promise<MistakeProgress> {
  const existing = (await listMistakeProgress()).find(
    (row) => row.symbol_id === symbolId && row.mistake_reason === mistakeReason
  );
  if (existing) return existing;
  const row = createDefaultMistakeProgress(symbolId, mistakeReason);
  console.info(createLog, row);
  return persist(row);
}
