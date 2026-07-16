const STORAGE_KEY = "k-pullup-challenge";
const CURRENT_VERSION = 1;

interface ChallengeData {
  version: number;
  lastSyncedAt: string | null;
  records: VisitRecord[];
  streakData: StreakData;
  goalSettings: GoalSettings;
}

interface VisitRecord {
  date: string; // ISO 8601 date (YYYY-MM-DD)
  count: number;
}

interface StreakData {
  current: number;
  max: number;
}

interface GoalSettings {
  weeklyGoal: number; // 1-7
  celebrationShownWeek: string | null; // ISO week identifier (e.g., "2024-W03")
}

const getDefaultData = (): ChallengeData => ({
  version: CURRENT_VERSION,
  lastSyncedAt: null,
  records: [],
  streakData: { current: 0, max: 0 },
  goalSettings: { weeklyGoal: 5, celebrationShownWeek: null },
});

const isValidChallengeData = (data: unknown): data is ChallengeData => {
  if (typeof data !== "object" || data === null) return false;

  const obj = data as Record<string, unknown>;

  if (typeof obj.version !== "number") return false;
  if (obj.lastSyncedAt !== null && typeof obj.lastSyncedAt !== "string")
    return false;
  if (!Array.isArray(obj.records)) return false;
  if (typeof obj.streakData !== "object" || obj.streakData === null)
    return false;
  if (typeof obj.goalSettings !== "object" || obj.goalSettings === null)
    return false;

  const streakData = obj.streakData as Record<string, unknown>;
  if (typeof streakData.current !== "number" || typeof streakData.max !== "number")
    return false;

  const goalSettings = obj.goalSettings as Record<string, unknown>;
  if (typeof goalSettings.weeklyGoal !== "number") return false;
  if (
    goalSettings.celebrationShownWeek !== null &&
    typeof goalSettings.celebrationShownWeek !== "string"
  )
    return false;

  for (const record of obj.records) {
    if (typeof record !== "object" || record === null) return false;
    const rec = record as Record<string, unknown>;
    if (typeof rec.date !== "string" || typeof rec.count !== "number")
      return false;
  }

  return true;
};

const migrateData = (data: unknown): ChallengeData => {
  if (typeof data !== "object" || data === null) {
    console.warn(
      "[challenge-storage] 마이그레이션 실패: 유효하지 않은 데이터, 기본값으로 초기화"
    );
    return getDefaultData();
  }

  const obj = data as Record<string, unknown>;

  // 현재 version이 1이므로, 향후 version 2+ 마이그레이션을 여기에 추가
  // 기본 구조를 가진 데이터를 현재 버전으로 변환 시도
  const migrated: ChallengeData = {
    version: CURRENT_VERSION,
    lastSyncedAt:
      typeof obj.lastSyncedAt === "string" ? obj.lastSyncedAt : null,
    records: Array.isArray(obj.records)
      ? (obj.records as unknown[])
          .filter(
            (r): r is VisitRecord =>
              typeof r === "object" &&
              r !== null &&
              typeof (r as Record<string, unknown>).date === "string" &&
              typeof (r as Record<string, unknown>).count === "number"
          )
      : [],
    streakData:
      typeof obj.streakData === "object" &&
      obj.streakData !== null &&
      typeof (obj.streakData as Record<string, unknown>).current === "number" &&
      typeof (obj.streakData as Record<string, unknown>).max === "number"
        ? (obj.streakData as StreakData)
        : { current: 0, max: 0 },
    goalSettings:
      typeof obj.goalSettings === "object" &&
      obj.goalSettings !== null &&
      typeof (obj.goalSettings as Record<string, unknown>).weeklyGoal ===
        "number"
        ? {
            weeklyGoal: (obj.goalSettings as Record<string, unknown>)
              .weeklyGoal as number,
            celebrationShownWeek:
              typeof (obj.goalSettings as Record<string, unknown>)
                .celebrationShownWeek === "string"
                ? ((obj.goalSettings as Record<string, unknown>)
                    .celebrationShownWeek as string)
                : null,
          }
        : { weeklyGoal: 5, celebrationShownWeek: null },
  };

  return migrated;
};

const loadChallengeData = (): ChallengeData | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;

    const parsed: unknown = JSON.parse(raw);

    if (!isValidChallengeData(parsed)) {
      console.warn(
        "[challenge-storage] 저장된 데이터 구조가 유효하지 않음, 마이그레이션 시도"
      );
      return migrateData(parsed);
    }

    if (parsed.version !== CURRENT_VERSION) {
      console.warn(
        `[challenge-storage] 버전 불일치 (저장: ${parsed.version}, 현재: ${CURRENT_VERSION}), 마이그레이션 실행`
      );
      return migrateData(parsed);
    }

    return parsed;
  } catch (error) {
    console.warn("[challenge-storage] localStorage 읽기 실패:", error);
    return null;
  }
};

const saveChallengeData = (data: ChallengeData): boolean => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.warn("[challenge-storage] localStorage 저장 실패:", error);
    return false;
  }
};

export {
  loadChallengeData,
  saveChallengeData,
  getDefaultData,
  migrateData,
  STORAGE_KEY,
  CURRENT_VERSION,
};

export type { ChallengeData, VisitRecord, StreakData, GoalSettings };
