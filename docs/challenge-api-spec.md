# 챌린지(방문 스트릭) API 스펙

> **목적**: 현재 localStorage 기반으로 동작하는 챌린지 기능을 백엔드와 동기화하여 멀티 디바이스 지원 및 데이터 영속성 확보
>
> **프론트 브랜치**: `develop` (챌린지 기능 구현 완료 상태)
>
> **백엔드 베이스**: `https://api.k-pullup.com/api/v1/`

---

## 1. 개요

사용자가 앱에 방문(접속)할 때마다 날짜별 기록을 저장하고, 연속 방문(스트릭) 및 주간 목표 달성 여부를 추적하는 기능입니다.

### 핵심 개념

| 용어 | 설명 |
|------|------|
| **Visit Record** | 특정 날짜의 방문 기록. 같은 날 여러 번 방문하면 `count`가 증가 |
| **Streak** | 연속으로 방문한 일수 (오늘 또는 어제부터 역순 카운트) |
| **Weekly Goal** | 사용자가 설정한 주간 방문 목표 일수 (1~7) |

### 인증

- 모든 엔드포인트는 로그인 필수 (기존 세션/쿠키 인증 방식 동일)
- 비로그인 사용자는 기존처럼 localStorage로만 동작 (프론트에서 처리)

---

## 2. 데이터 모델

### 2.1 Visit Record

```
challenge_visits 테이블 (제안)
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | BIGINT, PK | Auto increment |
| `user_id` | INT, FK | users 테이블 참조 |
| `date` | DATE | 방문 날짜 (YYYY-MM-DD) |
| `count` | INT | 해당 날짜 방문 횟수 (기본값 1) |
| `created_at` | TIMESTAMP | 최초 생성 시각 |
| `updated_at` | TIMESTAMP | 마지막 업데이트 시각 |

**유니크 제약**: `(user_id, date)` — 같은 날짜에 중복 row 방지, count로 증가 처리

### 2.2 Goal Settings

```
challenge_settings 테이블 (제안)
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `user_id` | INT, PK, FK | users 테이블 참조 |
| `weekly_goal` | TINYINT | 주간 목표 일수 (1~7, 기본값 5) |
| `updated_at` | TIMESTAMP | 마지막 변경 시각 |

---

## 3. API 엔드포인트

### 3.1 방문 기록

```
POST /api/v1/challenge/visit
```

**설명**: 오늘 방문을 기록합니다. 같은 날 중복 호출 시 해당 날짜의 count를 +1 합니다.

**Request Body**: 없음 (서버에서 현재 날짜 기준 처리)

**Response** `200 OK`:

```json
{
  "date": "2026-07-28",
  "count": 2,
  "streak": {
    "current": 5,
    "max": 12
  }
}
```

**비즈니스 로직**:
1. `challenge_visits`에 오늘 날짜 row가 없으면 INSERT (count=1)
2. 있으면 count를 +1로 UPDATE
3. 스트릭 계산 후 응답에 포함 (계산 로직은 아래 섹션 참고)

---

### 3.2 방문 기록 조회

```
GET /api/v1/challenge/records?from={date}&to={date}
```

**설명**: 기간 내 방문 기록을 조회합니다.

**Query Parameters**:

| 파라미터 | 필수 | 설명 | 예시 |
|----------|------|------|------|
| `from` | N | 시작 날짜 (기본: 49일 전) | `2026-06-09` |
| `to` | N | 종료 날짜 (기본: 오늘) | `2026-07-28` |

**Response** `200 OK`:

```json
{
  "records": [
    { "date": "2026-07-25", "count": 1 },
    { "date": "2026-07-26", "count": 3 },
    { "date": "2026-07-27", "count": 1 },
    { "date": "2026-07-28", "count": 2 }
  ],
  "streak": {
    "current": 4,
    "max": 12
  }
}
```

**참고**: 프론트에서 히트맵 렌더링을 위해 최근 49일(7주) 데이터를 기본 요청합니다.

---

### 3.3 주간 목표 설정

```
PUT /api/v1/challenge/goal
```

**설명**: 주간 방문 목표 일수를 변경합니다.

**Request Body**:

```json
{
  "weeklyGoal": 5
}
```

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `weeklyGoal` | int | 1~7 | 주간 목표 일수 |

**Response** `200 OK`:

```json
{
  "weeklyGoal": 5
}
```

**에러**: `weeklyGoal`이 1~7 범위를 벗어나면 `400 Bad Request`

---

### 3.4 챌린지 요약 조회 (선택)

```
GET /api/v1/challenge/summary
```

**설명**: 현재 사용자의 챌린지 전체 상태를 한 번에 가져옵니다. 페이지 진입 시 hydration용.

**Response** `200 OK`:

```json
{
  "records": [
    { "date": "2026-07-25", "count": 1 },
    { "date": "2026-07-28", "count": 2 }
  ],
  "streak": {
    "current": 4,
    "max": 12
  },
  "goalSettings": {
    "weeklyGoal": 5
  }
}
```

**참고**: records는 최근 49일 범위만 반환하면 됩니다.

---

## 4. 스트릭 계산 로직

프론트에 이미 구현된 순수 함수 로직입니다. 백엔드에서 동일하게 구현해주세요.

```
calculateStreak(records, today):
  1. records에서 날짜 Set 구성
  2. today가 Set에 있으면 → today부터 역순 카운트 시작
     today가 없고 yesterday가 있으면 → yesterday부터 역순 카운트 시작
     둘 다 없으면 → streak = 0
  3. 시작일부터 하루씩 과거로 이동, Set에 존재하면 streak++
  4. 끊기면 중단
```

**max streak**: `challenge_visits` 테이블 전체에서 계산하거나, 별도 컬럼으로 캐싱 가능 (성능상 캐싱 권장)

---

## 5. 프론트 연동 계획

현재 프론트 구조:

```
[페이지 진입]
  → useChallengeStore.hydrate()   // localStorage에서 로드
  → useChallengeStore.recordVisit() // 오늘 방문 기록
```

백엔드 연동 후:

```
[페이지 진입]
  → 로그인 상태 확인
  → 로그인 O: GET /challenge/summary → store 세팅 → POST /challenge/visit
  → 로그인 X: 기존 localStorage 로직 유지
```

- 프론트의 `lib/challenge-streak.ts` 계산 함수는 그대로 유지 (UI 표시용)
- 백엔드 응답의 streak 값을 신뢰값으로 사용하되, 응답 전까지는 로컬 계산값 표시

---

## 6. 에러 응답 형식

기존 백엔드 에러 형식과 동일:

```json
{
  "error": "에러 메시지"
}
```

| 상황 | Status Code |
|------|-------------|
| 비로그인 | 401 Unauthorized |
| 잘못된 파라미터 | 400 Bad Request |
| 서버 에러 | 500 Internal Server Error |

---

## 7. 우선순위

| 순위 | 엔드포인트 | 이유 |
|------|-----------|------|
| 1 | `POST /challenge/visit` | 핵심 기능 |
| 2 | `GET /challenge/summary` | 페이지 hydration에 필요 |
| 3 | `PUT /challenge/goal` | 목표 설정 동기화 |
| 4 | `GET /challenge/records` | summary로 대체 가능하지만, 기간 조회가 필요할 수 있음 |

---

## 8. 추후 확장 고려사항

- **리더보드/랭킹**: 전체 또는 지역별 스트릭 랭킹 (별도 API)
- **뱃지/보상**: 스트릭 마일스톤 달성 시 뱃지 부여
- **푸시 알림**: 스트릭 끊기기 전 리마인더
- **데이터 마이그레이션**: 기존 localStorage 데이터를 백엔드로 일괄 업로드하는 1회성 API (`POST /challenge/migrate`)

---

## 9. 참고 파일 (프론트 소스)

| 파일 | 역할 |
|------|------|
| `lib/challenge-storage.ts` | 데이터 스키마 정의 + localStorage I/O |
| `lib/challenge-streak.ts` | 스트릭/히트맵/주간카운트 순수 함수 |
| `store/useChallengeStore.ts` | Zustand store (hydrate, recordVisit, setWeeklyGoal) |
| `components/pages/challenge/*` | UI 컴포넌트 |
