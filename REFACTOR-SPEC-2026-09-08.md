# k-pullup 리팩터링 스펙 (우선순위별)

- 기준 문서: `AUDIT-2026-09-08.md`
- 작성일: 2026-09-08
- 검증 방식: 감사 리포트의 상위 발견 12개 항목을 현재 코드베이스와 1:1 대조 재검증 (전부 일치 확인)
- 베이스라인: 리포트 기준 `yarn typecheck`/`yarn lint`/`yarn test`/`yarn build` 모두 통과

---

## 이 문서를 어떻게 쓰나

- 우선순위 **P0 → P4** 순으로 진행. 각 P는 독립 커밋(또는 PR)으로 분리한다.
- **P0-A(정책 결정)를 먼저 확정하기 전에는 P1·P4의 "dead 분기 삭제"를 진행하지 않는다.** (되돌리기 옵션 선택 시 그 분기가 되살아나기 때문)
- 각 항목은 AGENTS.md 원칙을 따른다: 작은 변경 → `yarn lint` → 영향 크면 `yarn build` → 플로우 변경이면 e2e 1개.
- 체크박스는 완료 시 채운다.

### 검증으로 확정된 사실 요약

| 주장 | 검증 결과 |
|---|---|
| fetchData가 non-2xx에서 `FetchError` throw, ok면 `Response` 반환 | ✅ `lib/fetchData.ts` 확인 |
| API 함수 내부 `!response.ok`/`{error}` 반환 경로가 dead | ✅ `get-all-marker.ts:12`, `marker-detail.ts`, `new-pictures.ts` 확인 |
| 호출부 dead 체크 대량 존재 | ✅ grep `!response.ok\|response.status ===\|.error ===` → **64매치 / 35파일** |
| `useMapStore` delete가 배열을 안 비움 → 마커 무한 누적 | ✅ `store/useMapStore.ts:51-66` `{ ...prev }` 반환 확인 |
| `useGps` stale 반환 + watcher 미해제 | ✅ `hooks/useGps.ts:37` 확인 |
| `format-date` UTC getter, `minutes-ago` clamp 없음, `search` 미인코딩 | ✅ 전부 확인 |
| 미사용 파일/의존성 (react-query, event-popup 등) | ✅ 소스 참조 0건 (lock/package.json/정의부만) |
| admin 레이아웃 프로바이더 이중 래핑, sitemap `/home` 404 | ✅ `app/admin/layout.tsx`, `app/sitemap.ts:20` 확인 |

> 결론: 감사 리포트의 정확도는 매우 높다. 아래 스펙은 리포트를 재분류·우선순위화한 것이며, 임의 추가 항목은 없다.

---

## P0 — 선결 정책 결정 (코드 변경 전)

이후 모든 작업의 방향을 좌우한다. **오너 결정 필요.**

### [ ] P0-A. fetchData 에러 처리 전략: A(되돌리기) vs B(throw 유지 + 호출부 마이그레이션)

- **A안**: `fetchData`를 HTTP 에러 시 `Response` 반환하도록 되돌림. 47개 dead 분기가 즉시 부활.
  - 범위: `fetchData.ts` + `user-provider.tsx`(401 throw 의존) + fetchData 테스트 11파일 재작성.
  - 단점: 2026-07-09 스펙(`.kiro/specs/fetchdata-error-handling`)·테스트·최근 로그인 수정 커밋과 충돌.
- **B안 (리포트 추천)**: throw 유지, 호출부 ~35곳을 `try/catch (FetchError)`로 마이그레이션.
  - 장점: 스펙 의도 일치, 이미 3곳(`user-provider`, `signin-form`, `moments/page`)이 이 패턴, SSR 안전성(alert 제거) 유지.
  - 단점: 작업량 큼.

**권고: B안.** 이유 — 스펙과 최신 커밋 방향이 throw이고, 되돌리면 SSR 안전성 회귀 + 테스트 재작성 비용이 발생한다. 아래 P1·P4는 **B안 확정을 전제**로 기술한다. A안 선택 시 P1은 "dead 분기 되살리기"로 성격이 바뀌므로 별도 협의.

---

## P1 — 치명/사용자 영향 (최우선 수정)

에러 UX 붕괴와 메모리 누수. 공개 라우트·핵심 플로우 직접 영향.

### [ ] P1-1. 서버 컴포넌트 에러 경로 복구 (공개 라우트 우선)

- **문제**: fetchData가 throw하면서 서버 페이지의 `.error === "..."` 체크가 전부 dead → `NotFound`/`AuthError` 대신 `app/error.tsx`로 전환.
- **대상**:
  - `app/pullup/[id]/page.tsx:74`, `app/pullup/[id]/report/page.tsx:21` — 404 시 `NotFoud` 미도달. **공개 라우트, 실트래픽.** `generateMetadata`도 throw.
  - `app/(home)/page.tsx:19`, `app/social/page.tsx:21` — `Promise.all` catch 없음 → 상위 API 하나 실패 시 홈/소셜 전체 error.tsx.
  - `app/mypage/*` (page.tsx, user, bookmark, report, locate, myreport), `app/admin/page.tsx` — 만료/무효 쿠키 시 로그인 안내 대신 에러 페이지.
- **해결**: 서버 페이지 공통 헬퍼 도입.
  ```ts
  // 예: lib/server-fetch-guard.ts
  try { data = await api(cookie); }
  catch (e) {
    if (e instanceof FetchError && e.status === 401) return <AuthError />;
    if (e instanceof FetchError && e.status === 404) return <NotFound />;
    throw e;
  }
  ```
- **참고 패턴**: `app/moments/page.tsx`(try/catch 있음), `app/admin/report-admin/page.tsx`(chulbong 체크 있음)를 기준으로 통일.
- **검증**: 각 화면 404/401 수동 재현 + `yarn build`.

### [ ] P1-2. 지도 마커/오버레이 메모리 누수 (`store/useMapStore.ts:51-66`)

- **문제**: `deleteAllMarker`/`deleteOverlays`가 `setMap(null)`만 하고 `{ ...prev }` 반환 → `markers`/`overlays` 배열이 절대 비워지지 않음. `idle`마다 append → 무한 누적(메모리 + idle 순회 비용) + 새 객체 반환으로 selector 없는 `useMapStore()` 구독자 리렌더.
- **해결**: `deleteAllMarker`는 `return { markers: [] }`, `deleteOverlays`는 `return { overlays: [] }`.
- **주의**: `replaceMarkers`/`replaceOverlays`는 앱 호출 0건(테스트만) — append/reset 의도 분리(AGENTS.md 6조)와 함께 정리 검토.
- **검증**: 지도 이동 반복 시 마커 수 안정 확인, `yarn test`.

### [ ] P1-3. 클라이언트 로딩 stuck + 에러 메시지 dead (핵심 플로우부터)

- **문제**: `setLoading(true)` 후 throw로 빠져 스피너 무한 + unhandled rejection + 상태별 안내 미표시.
- **영향 순 대상**:
  1. `app/register/register-client.tsx:148-192` — `uploadStatus` 영구 pending, `submitRequestedRef` 고정 → 재시도 불가
  2. `app/signup/signup-client.tsx:70`, `components/pages/signup/verify-email.tsx:65-119`
  3. `components/pages/pullup/comments.tsx:60-186` — 생성/삭제/무한스크롤 정지
  4. `components/pages/pullup/bookmark-button.tsx:43-67` — 401 로그인 이동 안내 dead
  5. `app/pullup/[id]/pullup-client.tsx:58-73`(삭제), `report/report-client.tsx:230`(버튼 disabled 고정), `facilities/facilities-client.tsx:68`
  6. 나머지: share-button, add-moment-page, bookmark-list, username-card, user-setting, reset-password/send-password, select-location
- **해결**: 각 호출부에 `try { … } catch (e) { if (e instanceof FetchError) <상태별 메시지> } finally { setLoading(false) }`.
- **검증**: 각 화면 실패 케이스 수동 확인 + 관련 e2e.

### [ ] P1-4. 읽기 호출 catch 누락 (마커 미로딩/무한스크롤 정지)

- `components/layout/kakao-map.tsx:124-139` `getAllMarker` — unhandled rejection, 마커 미로딩
- `around-marker-carousel.tsx`, `moments/around.tsx`, `registered-locate-list.tsx`, `around-search.tsx`(loadMore), `marker-ranking-list.tsx`, `weather-badge.tsx`, `description.tsx`
- `app/user-info/[user]/page-client.tsx:35` — `isLoading` 무한스크롤 정지
- **해결**: catch 추가 + 빈 상태/재시도 UI.

### [ ] P1-5. `Alert.onClickAsync`가 에러를 삼킴

- `app/mypage/myreport/myreport-client.tsx`, `report-admin-client.tsx`, `mypage/report/report-client.tsx` — 승인/거절/삭제 실패가 `console.error`로 삼켜져 다이얼로그만 열린 채 무반응.
- **해결**: `app/admin/admin-client.tsx:126-164`의 올바른 try/catch 패턴 복사.

---

## P2 — 지도/GPS 라이프사이클 (성능·안정성)

P1-2 이후 이어서. 대부분 독립적.

- [ ] **P2-1.** `hooks/useMarkerControl.tsx:98-111` — 클러스터 버블 `createRoot` 후 삭제 시 `unmount()` 없음 → React root 누수. root를 overlay 옆에 보관 후 삭제 시 `unmount()`, 또는 정적 HTML 렌더.
- [ ] **P2-2.** `components/layout/kakao-map.tsx:119-145` — `pathname`이 deps에 있어 네비게이션마다 4.2초 후 전체 마커 재요청. pathname을 ref로 읽거나 `/admin` 가드만 분리.
- [ ] **P2-3.** `hooks/useGps.ts:37` — stale 동기 반환 + watcher 미해제. `useGeolocationStore.getState().myLocation ?? await getCurrentPosition()`로 교체, 훅 정리.
- [ ] **P2-4.** `hooks/useCompass.ts:46` + `useGpsTracking.ts:53,288` — `deviceorientation` 스로틀 없음(센서 속도 리렌더). `setHeading(p => { const h = Math.round(a); return p === h ? p : h })`, 트래킹 중에만 구독.
- [ ] **P2-5.** `hooks/useCompass.ts:51-74` — `requestPermission()`을 마운트 시 제스처 없이 호출 → iOS 항상 거부. `handleGps`(제스처) 안으로 이동 + cleanup `active` 플래그.
- [ ] **P2-6.** `hooks/useGpsTracking.ts:300-325` — cleanup이 `map` null 조건이라 실질 dead. `gpsWatchId` 기준 재작성 또는 삭제.
- [ ] **P2-7.** `components/layout/roadview.tsx:129-131` — leave 시 `addOverlayMapTypeId(ROADMAP)` 오류 → `removeOverlayMapTypeId(MapTypeId.ROADVIEW)`.
- [ ] **P2-8.** `components/layout/roadview.tsx:40-124` — open마다 인스턴스+리스너 생성 cleanup 없음. `removeListener` cleanup + `disposed` 플래그.
- [ ] **P2-9.** `app/pullup/[id]/report/report-client.tsx:87-120` — `newLatLng`마다 새 Map 생성. ref로 1회 생성 후 `setCenter`.
- [ ] **P2-10.** `components/pages/search/around-search.tsx:141-172` — SDK 지연 로드로 직접 진입 시 빈 지도. `useMapStore(s => s.map)`을 ready 신호로 1회 init.

---

## P3 — 개별 로직 버그 (독립적, 각 1~5줄)

검증 완료 항목은 ✅. 나머지는 수정 전 해당 라인 재확인 권장.

**날짜/시간**
- [ ] **P3-1.** ✅ `lib/format-date.ts` — `getUTC*` → `Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", … })`로 타임존 고정. (로컬 getter는 SSR hydration mismatch 유발하니 금지)
- [ ] **P3-2.** ✅ `lib/minutes-ago.ts` — `Math.max(0, now - past)`로 clamp.

**조건식/상태**
- [ ] **P3-3.** `app/pullup/[id]/pullup-client.tsx:141-149` — 기구 배지 조건식 오류. `{(!철봉 || !평행봉 || (철봉.quantity <= 0 && 평행봉.quantity <= 0)) && <Badge/>}`.
- [ ] **P3-4.** `mypage/user-info.tsx:14,16,26`, `around-search.tsx:498` — `{count && …}` → `{count > 0 && …}` (0 리터럴 렌더 방지).
- [ ] **P3-5.** `marker-search-result.tsx:27,66` — `data.error` 사용, `marker.photos?.[0]?.photoUrl ?? "/metaimg.webp"`.
- [ ] **P3-6.** `register/set-description.tsx:66,70` — `description === ""` → `!description` (초깃값 null).
- [ ] **P3-7.** `components/common/alert.tsx:144,157` — 확인 버튼 게이트 `(onClick || onClickAsync || cancel)`. (현재 잠복, 방어적 수정)
- [ ] **P3-8.** `register-client.tsx:430-433` — `!user` 스켈레톤 영구화 → `isLoading` 기준 스켈레톤, `!user`는 `AuthError`.

**채팅**
- [ ] **P3-9.** `app/pullup/[id]/chat/pullup-chat-client.tsx:68` — `localStorage cid`를 raw 사용. `JSON.parse(raw).cid` (소셜은 이미 파싱).
- [ ] **P3-10.** `chat-detail-client.tsx:110-119` — ping effect `[]` deps로 소켓 생성 전 실행 → ping 안 나감. WebSocket 생성 effect 안으로 이동.
- [ ] **P3-11.** `chat-detail-client.tsx:58-63`, `pullup-chat-client.tsx:67-70` — 딥링크 시 `cid` null 유지. 없으면 로컬에서 생성·저장.

**레이아웃/라우팅**
- [ ] **P3-12.** ✅ `app/admin/layout.tsx` — 루트가 감싼 `ThemeProvider`/`UserProvider`/`Toaster`/`localFont` 재래핑 → `/users/me` 2회 + 토스트 이중. wrapper `<div>`만 남기고 삭제.
- [ ] **P3-13.** `app/admin/page.tsx:10-21` — user 확인 전 fetch, chulbong 체크 없음. `report-admin/page.tsx` 패턴 복사.
- [ ] **P3-14.** ✅ `app/sitemap.ts:20` — `/home` 제거(존재하지 않는 경로).
- [ ] **P3-15.** `app/mypage/locate/page.tsx:33` — `returnUrl="mypage/locate"` 앞 슬래시 누락. `"/mypage/locate"`.
- [ ] **P3-16.** `app/mypage/page.tsx:85` — 상대 `href="mypage/config"` → `"/mypage/config"`.

**입력/인코딩/안전성**
- [ ] **P3-17.** ✅ `lib/api/search/search.ts:16` — `term=${encodeURIComponent(query)}`.
- [ ] **P3-18.** `lib/api/marker/user-marker.ts:34` — 경로 `encodeURIComponent(userName)`.
- [ ] **P3-19.** `geo-provider.tsx:40-41`, `kakao-map.tsx:149-150` — window `message` 핸들러 `JSON.parse` 가드(`typeof e.data !== "string"` + try/catch). RN WebView SyntaxError 방지.
- [ ] **P3-20.** `lib/session-cache.ts:43` — `setSessionCache` try/catch 없음 → setItem throw 시 로그인 직후 로그아웃. try/catch 추가.
- [ ] **P3-21.** `moment-list.tsx:197-205` — `decodeBlurhash` 가드 없이 렌더 호출 → 크래시. `:46-51`의 try/catch 재사용.
- [ ] **P3-22.** `comments.tsx:152-186` — updater 내부 사이드 이펙트 + 삭제 후 raw page1 교체. 필터·totalPages 정합성 수정.
- [ ] **P3-23.** `moment-client.tsx:76,106` — `createObjectURL` 미해제 blob 누수. `revokeObjectURL`.
- [ ] **P3-24.** `carousel.tsx:117-119` — cleanup에 `reInit` 리스너 누락.
- [ ] **P3-25.** `moment-list.tsx:55,93-97` — `let animationFrameId` 렌더마다 재선언 → `useRef`.
- [ ] **P3-26.** `image-carousel.tsx:15`, `image-modal.tsx:39` — 슬라이드 공유 `loaded` boolean → URL별 Set.
- [ ] **P3-27.** `components/layout/overlay.tsx:24` — 클래스 오타 `absolut` → `absolute` (시각 확인 필요).

---

## P4 — 사이드 이펙트 없는 정리 (동작 변화 0)

순서 무관. 커밋 분리 권장. **B 확정 후** "dead `!response.ok` 분기 삭제" 진행.

### [ ] P4-1. 미사용 파일 삭제 (✅ 표본 검증: 소스 참조 0건)

`hooks/useEventPopup.ts` + `event-popup.tsx`, `mypage/device-type.tsx` + `useDeviceType.ts`, `scroll-to-top.tsx`, `slide-icons.tsx`, `ui/badge.tsx`, 아이콘 4종(`bookmark/checked/config/location-pin-icon`), `types/kakao-location.type.ts`, `types/cluster.types.ts`, `move-map-input.tsx`(타입만 `types/`로 이동 후).

### [ ] P4-2. 미사용 의존성 제거 (✅ 표본 검증: react-query/remark-breaks/react-slot 참조 0건)

deps: `@tanstack/react-query`, `remark-breaks`, `@radix-ui/react-slot`.
devDeps: `jsdom`, `@types/jsdom`, `@testing-library/jest-dom`, `@vitejs/plugin-react`, `webpack-cli`, `@types/sharp`.
`webpack`은 storybook peer라 유지. 제거 후 `yarn install` → `yarn build` + `yarn storybook` 확인 필수.

### [ ] P4-3. 중복 fetchData 테스트 정리

11파일이 4개 프로퍼티를 3중 복사. 한 세트만 유지. `package.json` `test:e2e:ci` 미사용 스크립트 정리.

### [ ] P4-4. Dead state / dead 분기 삭제

`kakao-map.tsx:67`(loading), `pullup-chat-client.tsx:51,131`(connection), `side-main.tsx:312`, `overlay.tsx:48-51`, `celebration-motion.tsx:44`, `useSearchStore.ts:26`, `kakao-geocoder.ts:79`, `map-walker.ts:54`, `optimize-image.ts:259`, `useAddressResolver.ts`(AbortController 미전달), `useAlertStore.ts:34`, `bottom-nav.tsx:52`(동적 Tailwind 클래스), 등. (B 확정 후 `admin-client.tsx:129,180` 등 `!response.ok` 삭제)

### [ ] P4-5. 중복 구현 통합

`getToday` 4벌 → `lib/challenge-streak.ts`, haversine 2벌 → 1개 export, `addDays` 3벌, `useMarkerControl` createMarker 분기, `Device` 타입 → `types/device.ts`(61파일 import), `ImageWrap`/`SheetHeight`/`Region` 중복 타입 정리.

### [ ] P4-6. 미사용 export 정리 + React key + 접근성

- 미사용 export: `getErrorMessage`(✅ 확인), `replaceMarkers/replaceOverlays`, `validateNumeric`, `getPriorityLevel` 등. `optimizeImages/validateImages`는 CLAUDE.md 문서화됨 → 유지 또는 문서 동반 삭제.
- React key: `moment-client.tsx:223`, `chat-detail-client.tsx:209`, `report-admin-client.tsx:148`, `search-client.tsx:265`, `upload-image.tsx`, `moment-list.tsx:244` — 고유 id 필드로 교체.
- 접근성: 아이콘 버튼 `aria-label`, `AddImageButton` `<div>` → `<button>`, `SectionTitle` 빈 버튼 조건부 렌더.

### [ ] P4-7. 설정/툴링

- `.storybook/main.ts:26` — `"..\\public"` → `"../public"`.
- `NEXT_PUBLIC_BASE_URL` — 공통 상수 `API_BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://api.k-pullup.com/api/v1"` 도입 또는 CI workflow env 주입. `new-pictures.ts:14` 하드코딩 정리, `.env.example` 추가.
- e2e: `challenge.spec.ts` `waitForTimeout`/조건부 단언 → `expect.poll` + 무조건 단언, `signin.spec.ts` 이름 정정.

---

## 권장 실행 순서 요약

1. **P0-A 결정** (오너)
2. **P1** — 서버 페이지 헬퍼 → register/signup → comments → bookmark 401 → 나머지 / 지도 누수(P1-2)
3. **P2** — 지도 라이프사이클
4. **P3** — 개별 버그 (P3-1/2/12/14/17은 검증 완료, 저위험 우선)
5. **P4** — 정리 (파일/deps → 테스트 → dead분기 → 중복 → key/a11y)

각 단계: `yarn lint` → 영향 크면 `yarn build` → 플로우 변경이면 e2e 1개. 미실행 검증은 결과 보고에 명시(AGENTS.md 10조).

---

## 리스크 노트

- **미사용 판정은 grep/정적 기반.** 동적 import·문자열 참조를 놓쳤을 수 있으니 P4-1/4-2 삭제 후 반드시 `yarn build` + `yarn storybook`으로 재확인.
- **P1은 UX 동작을 의도적으로 바꾼다.** "에러가 이제 보인다"는 정상 변화이므로, 각 화면 실패 케이스를 수동 재현해 기대대로 표시되는지 확인.
- **P3-1(날짜)** 은 SSR/CSR 모두 Asia/Seoul 고정이어야 hydration mismatch가 안 난다. 로컬 타임존 getter로 바꾸지 말 것.

---

## 실행 결과 (2026-09-08, B안으로 실행)

최종 검증: `yarn typecheck` ✓ · `yarn lint` ✓ (0 warnings) · `yarn test` 106/106 ✓ · `yarn build` ✓ · `yarn build-storybook` ✓

### 완료
- **P0-A**: B안 확정 (throw 유지 + 호출부 마이그레이션)
- **P1-1~1-5**: 서버 페이지 에러 경로(`lib/server-fetch-guard.ts` 도입, 13개 페이지), 지도 메모리 누수, 클라이언트 로딩 stuck/에러 메시지 복구(~30개 호출부), Alert 에러 삼킴 — 전부 완료
- **P2-1~2-10**: overlay root unmount, kakao-map pathname deps, `useGps`→`lib/get-my-location.ts`, `useCompass` 스로틀/권한, `useGpsTracking` cleanup, roadview x2, report-client 지도 재사용, around-search SDK 게이트 — 전부 완료
- **P3**: 3-1~3-21, 3-23~3-27 완료 (날짜 타임존, clamp, 조건식, 채팅 cid/ping, 인코딩, 안전성 등). 추가로 pullup-chat ping도 수정.
- **P4-1**: 미사용 파일 삭제 (13개 + `move-map-input`은 `KakaoPlace` 타입을 `types/kakao-place.types.ts`로 이관 후 삭제)
- **P4-2**: 미사용 의존성 제거 (`@tanstack/react-query`, `remark-breaks`, `@radix-ui/react-slot`, `jsdom`, `@types/jsdom`, `@testing-library/jest-dom`, `@vitejs/plugin-react`, `webpack-cli`, `@types/sharp`) + `yarn install` 재검증
- **P4-4(부분)**: dead `!response.ok` 분기 제거 (favorites/my-suggested/admin-client), overlay/celebration-motion 중복 분기 병합, map-walker no-op 제거, useAlertStore identity 래퍼 제거, report-client dead `!reports` 제거
- **P4-7(부분)**: `.storybook/main.ts` staticDirs 경로 수정 (`..\\public` → `../public`)

### 후속 과제 (미처리 — 저위험이나 churn 큼)
- **P3-22**: comments updater 사이드 이펙트 / 삭제 후 page-1 교체 정합성 — comments가 P1-3에서 이미 대폭 수정되어 리스크상 분리
- **P4-3**: 중복 fetchData 테스트 11파일 정리
- **P4-4 잔여**: kakao-map `loading` dead state, side-main hasBackButton 3중 체크, useSearchStore 동일 분기, useAddressResolver AbortController 미전달, bottom-nav 동적 클래스 등
- **P4-5**: `getToday` 4벌/haversine 2벌/addDays 3벌 통합, `Device` 타입 이동(61파일 import) 등 광범위 리팩터링
- **P4-6**: React key 개선, 아이콘 버튼 aria-label, SectionTitle 빈 버튼
- **P4-7 잔여**: `NEXT_PUBLIC_BASE_URL` 공통 상수화 (isServer 분기 파일은 동작 위험으로 보류), CI env 주입, e2e 단언 개선
