# API 엔드포인트 맵

프론트엔드(`lib/api/**`)가 호출하는 백엔드 엔드포인트 목록.
요청/응답 스펙의 원천은 백엔드 저장소다.

- 백엔드: https://github.com/Alfex4936/chulbong-kr — 라우트 정의는 `backend/handler/*_api.go`
- 챌린지 API 스펙: [challenge-api-spec.md](./challenge-api-spec.md)

## 베이스 URL

| 실행 위치 | 베이스 | 비고 |
|---|---|---|
| 클라이언트 | `/api/v1` | `next.config.mjs` rewrite → `NEXT_PUBLIC_BASE_URL` |
| 서버(RSC) | `NEXT_PUBLIC_BASE_URL` | 미설정·빈 값이면 `https://api.k-pullup.com/api/v1` |

서버·클라이언트 공용 함수는 `getApiBase()`(`lib/api-base.ts`)로 베이스를 정한다.
아래 표의 경로는 베이스 이후 부분이다.

## Auth — `lib/api/auth/`

| 메서드 | 경로 | 파일 |
|---|---|---|
| POST | `/auth/signup` | `signup.ts` |
| POST | `/auth/login` | `signin.ts` |
| POST | `/auth/logout` | `signout.ts` |
| POST | `/auth/verify-email/send` | `send-signup-code.ts` |
| POST | `/auth/verify-email/confirm` | `verifyCode.ts` |
| POST | `/auth/request-password-reset` | `send-password-reset-email.ts` |
| POST | `/auth/reset-password` | `reset-password.ts` |

## User — `lib/api/user/`

| 메서드 | 경로 | 파일 |
|---|---|---|
| GET | `/users/me` | `myInfo.ts` |
| PATCH | `/users/me` | `update-username.ts` |
| DELETE | `/users/me` | `deleteUser.ts` |
| GET | `/users/favorites` | `favorites.ts` |
| GET | `/markers/my?page=&pageSize=7` | `my-registered-location.ts` |

## Marker — `lib/api/marker/`

| 메서드 | 경로 | 파일 |
|---|---|---|
| GET | `/markers` | `get-all-marker.ts` |
| POST | `/markers/new` | `set-new-marker.ts` |
| GET | `/markers/{id}/details` | `marker-detail.ts` |
| PUT | `/markers/{id}` | `update-description.ts` |
| DELETE | `/markers/{id}` | `delete-marker.ts` |
| DELETE | `/markers/{markerId}/photos/{photoId}` | `delete-marker-photo.ts` |
| GET | `/markers/{markerId}/facilities` | `get-facilities.ts` |
| POST | `/markers/facilities` | `set-new-facilities.ts` |
| GET | `/markers/close?latitude=&longitude=&distance=&n=&page=&pageSize=` | `close-marker.ts` |
| GET | `/markers/verify?latitude=&longitude=` | `locate-verify.ts` |
| GET | `/markers/convert?latitude=&longitude=` | `convert-wgs.ts` |
| GET | `/markers/weather?latitude=&longitude=` | `get-weather.ts` |
| GET | `/markers/roadview-date?latitude=&longitude=` | `get-roadview-date.ts` |
| GET | `/markers/save-offline?latitude=&longitude=` | `download-pdf.ts` |
| GET | `/markers/ranking` | `marker-ranking.ts` |
| GET | `/markers/area-ranking?latitude=&longitude=&limit=10` | `area-ranking.ts` |
| GET | `/markers/new-pictures` | `new-pictures.ts` |
| GET | `/markers/user/{userName}?page=&pageSize=` | `user-marker.ts` |

## Favorite — `lib/api/favorite/`

| 메서드 | 경로 | 파일 |
|---|---|---|
| POST | `/markers/{id}/favorites` | `set-favorite.ts` |
| DELETE | `/markers/{id}/favorites` | `delete-favorite.ts` |

## Comment — `lib/api/comment/`

| 메서드 | 경로 | 파일 |
|---|---|---|
| GET | `/comments/{markerId}/comments?page=&pageSize=10` | `get-comments.ts` |
| POST | `/comments` | `create-comment.ts` |
| DELETE | `/comments/{commentId}` | `delete-comment.ts` |

> `/comments/{markerId}/comments`는 오타가 아니다. 백엔드 라우트가 실제로 이 경로다 (`comment_api.go`).

## Moment (stories) — `lib/api/moment/`

| 메서드 | 경로 | 파일 |
|---|---|---|
| GET | `/markers/stories` | `get-all-moment.ts` |
| GET | `/markers/{markerId}/stories` | `get-moment-for-marker.ts` |
| POST | `/markers/{markerId}/stories` | `post-moment.ts` |
| DELETE | `/markers/{markerId}/stories/{momentId}` | `delete-moment.ts` |

## Report — `lib/api/report/`

| 메서드 | 경로 | 파일 |
|---|---|---|
| POST | `/reports` | `report-marker.ts` |
| GET | `/reports/all` | `get-all-reports.ts` |
| POST | `/reports/approve/{reportId}` | `approve-report.ts` |
| POST | `/reports/deny/{reportId}` | `deny-report.ts` |
| DELETE | `/reports?markerID=&reportID=` | `delete-report.ts` |
| GET | `/users/reports` | `my-suggested.ts` |
| GET | `/users/reports/for-my-markers` | `report-for-mymarker.ts` |

## Search — `lib/api/search/`

| 메서드 | 경로 | 파일 |
|---|---|---|
| GET | `/search/marker?term=` | `search.ts` |

## 백엔드 외부 호출

| 대상 | 용도 | 위치 |
|---|---|---|
| `wss://api.k-pullup.com/ws/{markerId \| regionCode}?request-id={cid}` | 마커별·지역별 채팅 | `app/pullup/[id]/chat/pullup-chat-client.tsx`, `app/social/chat/[code]/chat-detail-client.tsx` |
| `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json` | 좌표 → 행정구역 | `lib/api/common/get-address.ts` |

> WebSocket 주소는 현재 하드코딩되어 있어 `NEXT_PUBLIC_BASE_URL`을 따르지 않는다.
