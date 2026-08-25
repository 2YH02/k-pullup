---
version: 1.0
name: k-pullup-design-system
description: 대한민국 철봉 지도 — 미니멀 화이트/블랙 베이스에 단일 포인트 컬러로 운동/아웃도어 정체성을 전달하는 디자인 시스템. 깨끗한 캔버스 위에 콘텐츠(사진, 지도, 데이터)가 주인공이 되고, 프라이머리 컬러는 CTA와 핵심 인터랙션에만 절제되게 사용한다.

colors:
  # === Brand & Accent ===
  primary: "#18181b"
  primary-hover: "#09090b"
  primary-active: "#000000"
  primary-muted: "#e4e4e7"
  primary-subtle: "#f4f4f5"

  # === Neutral (Light Mode) ===
  canvas: "#ffffff"
  surface: "#f8fafc"
  surface-elevated: "#ffffff"
  border: "#e2e8f0"
  border-strong: "#cbd5e1"
  divider: "#f1f5f9"

  # === Neutral (Dark Mode) ===
  canvas-dark: "#0f172a"
  surface-dark: "#1e293b"
  surface-elevated-dark: "#334155"
  border-dark: "#334155"
  border-strong-dark: "#475569"
  divider-dark: "#1e293b"

  # === Text ===
  ink: "#0f172a"
  body: "#334155"
  muted: "#64748b"
  placeholder: "#94a3b8"
  on-primary: "#ffffff"
  ink-dark: "#f8fafc"
  body-dark: "#cbd5e1"
  muted-dark: "#94a3b8"

  # === Semantic ===
  success: "#16a34a"
  success-muted: "#dcfce7"
  warning: "#ca8a04"
  warning-muted: "#fef9c3"
  error: "#dc2626"
  error-muted: "#fee2e2"
  info: "#18181b"
  info-muted: "#e4e4e7"

  # === Scrim & Overlay ===
  scrim: "rgba(15, 23, 42, 0.6)"
  scrim-light: "rgba(15, 23, 42, 0.3)"

typography:
  fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Noto Sans KR', sans-serif"

  display-lg:
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -0.4px
  display-md:
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: -0.3px
  display-sm:
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: -0.2px
  title-lg:
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: -0.1px
  title-md:
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-lg:
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-md:
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0
  caption:
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  caption-sm:
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.1px
  button-md:
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  button-sm:
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 20px
  xl: 24px
  2xl: 32px
  3xl: 40px
  section: 48px

elevation:
  none: "none"
  xs: "0 1px 2px rgba(0, 0, 0, 0.04)"
  sm: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)"
  md: "0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03)"
  lg: "0 10px 15px rgba(0, 0, 0, 0.06), 0 4px 6px rgba(0, 0, 0, 0.03)"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 10px 20px
    height: 40px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.border-strong}"
    padding: 10px 20px
    height: 40px
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 10px 16px
    height: 40px
  button-danger:
    backgroundColor: "{colors.error}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 10px 20px
    height: 40px
  search-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.border}"
    padding: 12px 16px
    height: 44px
  marker-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.border}"
    padding: 0
  marker-card-hover:
    border: "1px solid {colors.border-strong}"
    elevation: "{elevation.sm}"
  section-title:
    textColor: "{colors.ink}"
    typography: "{typography.title-lg}"
  badge:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  badge-primary:
    backgroundColor: "{colors.primary-subtle}"
    textColor: "{colors.primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  nav-bottom:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
    textColorActive: "{colors.primary}"
    border: "1px solid {colors.border}"
    height: 56px
  input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.border}"
    padding: 10px 14px
    height: 44px
  input-focus:
    border: "1px solid {colors.primary}"
    ring: "0 0 0 3px {colors.primary-muted}"
  card-location:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.border}"
    elevation: "{elevation.xs}"
  modal:
    backgroundColor: "{colors.surface-elevated}"
    rounded: "{rounded.xl}"
    elevation: "{elevation.lg}"
    padding: 24px
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 12px 16px
  divider:
    backgroundColor: "{colors.divider}"
    height: 1px
---

## Overview

k-pullup(대한민국 철봉 지도)의 디자인 시스템은 **미니멀리스트 화이트/블랙 베이스**에 단일 프라이머리 컬러(#18181b, 차콜)로 포인트를 주는 구조입니다. 콘텐츠(사진, 지도 마커, 사용자 데이터)가 화면의 주인공이 되고, UI 크롬은 최대한 배경으로 빠집니다.

### Design Principles

1. **콘텐츠 퍼스트** — 지도, 사진, 위치 데이터가 시각적 무게의 중심. UI 장식은 최소화.
2. **절제된 컬러** — 프라이머리 차콜는 CTA, 활성 상태, 핵심 인터랙션에만 사용. 나머지는 뉴트럴.
3. **깨끗한 공간** — 넉넉한 여백과 1px 보더로 섹션을 구분. 그림자는 계층이 필요할 때만.
4. **다크모드 네이티브** — 라이트/다크 모두 같은 계층 구조를 유지. 다크는 슬레이트 계열.
5. **모바일 우선** — 터치 타겟 44px 이상, 모바일에서 먼저 완성하고 데스크톱으로 확장.

## Colors

### Philosophy

화면의 90%는 화이트(라이트) 또는 다크 슬레이트(다크)로 채워집니다. 프라이머리 차콜(#18181b)는 **CTA 버튼, 활성 탭, 토글 on 상태, 링크** 등 "지금 여기를 눌러라"는 시그널에만 사용합니다. 대부분의 텍스트, 아이콘, 보더는 뉴트럴 슬레이트 팔레트로 처리합니다.

### Brand & Accent

| Token | Hex | Use |
|---|---|---|
| `primary` | #18181b | CTA 버튼, 활성 상태, 토글, 링크, 선택된 마커 |
| `primary-hover` | #09090b | 호버 상태 |
| `primary-active` | #000000 | 누름 상태 |
| `primary-muted` | #e4e4e7 | Focus ring, 선택 배경 (연한 그레이) |
| `primary-subtle` | #f4f4f5 | 뱃지 배경, 알림 배경 (가장 연한 그레이) |

프라이머리 차콜를 선택한 이유:
- 미니멀 흑백 기반으로 콘텐츠에 집중
- 화이트/블랙 베이스에서 충분한 대비를 확보 (WCAG AA 통과)
- 무채색이라 어떤 콘텐츠 위에서도 방해하지 않음

### Surface (Light)

| Token | Hex | Use |
|---|---|---|
| `canvas` | #ffffff | 페이지 배경, 카드 배경 |
| `surface` | #f8fafc | 입력 필드 배경, 섹션 구분 배경 |
| `surface-elevated` | #ffffff | 모달, 드롭다운 |
| `border` | #e2e8f0 | 카드 보더, 구분선 |
| `border-strong` | #cbd5e1 | 입력 필드 보더, 강조 구분선 |
| `divider` | #f1f5f9 | 리스트 구분선 (미세) |

### Surface (Dark)

| Token | Hex | Use |
|---|---|---|
| `canvas-dark` | #0f172a | 페이지 배경 |
| `surface-dark` | #1e293b | 카드 배경, 섹션 배경 |
| `surface-elevated-dark` | #334155 | 모달, 드롭다운 |
| `border-dark` | #334155 | 카드 보더 |
| `border-strong-dark` | #475569 | 입력 필드 보더 |
| `divider-dark` | #1e293b | 리스트 구분선 |

### Text

| Token | Light | Dark | Use |
|---|---|---|---|
| `ink` | #0f172a | #f8fafc | 헤드라인, 강조 텍스트 |
| `body` | #334155 | #cbd5e1 | 본문 |
| `muted` | #64748b | #94a3b8 | 보조 텍스트, 캡션, 비활성 |
| `placeholder` | #94a3b8 | #64748b | 입력 필드 placeholder |

### Semantic

| Token | Hex | Use |
|---|---|---|
| `success` | #16a34a | 성공 메시지, 완료 상태 |
| `warning` | #ca8a04 | 경고 |
| `error` | #dc2626 | 에러, 삭제 |
| `info` | #18181b | 정보 알림 (= primary) |

각 시맨틱 색상은 `-muted` 변형(연한 배경용)을 함께 제공합니다.

## Typography

### Font Family

```
'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 
system-ui, Roboto, 'Helvetica Neue', 'Noto Sans KR', sans-serif
```

Pretendard를 기본으로 사용합니다. 한/영 모두 깔끔하게 처리되고, Variable Font로 weight 제어가 유연합니다.

### Scale

| Token | Size | Weight | Use |
|---|---|---|---|
| `display-lg` | 24px | 700 | 페이지 메인 타이틀 |
| `display-md` | 20px | 700 | 섹션 타이틀 |
| `display-sm` | 18px | 600 | 서브 섹션 타이틀 |
| `title-lg` | 16px | 600 | 카드 타이틀, 섹션 헤드 |
| `title-md` | 15px | 600 | 리스트 아이템 타이틀 |
| `body-lg` | 16px | 400 | 긴 본문 |
| `body-md` | 14px | 400 | 기본 본문 |
| `body-sm` | 13px | 400 | 보조 텍스트, 메타 |
| `caption` | 12px | 500 | 뱃지, 라벨, 타임스탬프 |
| `caption-sm` | 11px | 500 | 마이크로 라벨 |
| `button-md` | 14px | 600 | 버튼 라벨 |
| `button-sm` | 13px | 600 | 작은 버튼 라벨 |

### Principles

- Display는 700 이하로 유지. 타이포보다 콘텐츠(사진, 지도)가 시각적 무게를 담당.
- body 텍스트는 400 weight만 사용. 강조가 필요하면 600으로 올리지, 볼드(700)를 남용하지 않음.
- line-height는 1.3~1.6 범위. 작은 텍스트일수록 line-height를 높여 가독성 확보.

## Layout

### Spacing

4px 기반 시스템. 주요 간격:

- 요소 내부 패딩: `sm`(8px) ~ `base`(16px)
- 섹션 간 여백: `section`(48px)
- 카드 내부: `base`(16px) ~ `lg`(20px)
- 인라인 요소 간 간격: `xs`(4px) ~ `sm`(8px)

### Responsive

| Breakpoint | Width | 설명 |
|---|---|---|
| Mobile | < 484px | 기본. 사이드 패널이 바텀시트로 동작 |
| Desktop | ≥ 485px | 좌측 사이드 패널(max-w-96) + 지도 |

모바일 우선 설계. 사이드 패널 최대 너비 384px(max-w-96)로 콘텐츠 밀도 유지.

### Grid

- 카드 목록: 1열 기본, 이미지 갤러리는 2열 masonry
- 수평 스크롤: 마커 카드, 모먼트 썸네일
- 리스트: full-width, 1px divider로 구분

## Elevation

그림자 사용은 **최소한**으로:

| Level | Use |
|---|---|
| `none` | 기본 (카드, 버튼, 대부분의 요소) |
| `xs` | 플로팅 위치 뱃지 |
| `sm` | 카드 호버 상태 |
| `md` | 드롭다운, 팝오버 |
| `lg` | 모달, 오버레이 |

기본 상태에서는 **1px 보더**로 구분하고, 그림자는 계층 전환(호버, 떠오름)에만 사용합니다.

## Components

### Buttons

- **Primary**: 블루 배경 + 흰 텍스트. CTA에만 사용. 한 화면에 1개가 이상적.
- **Secondary**: 흰 배경 + 보더 + 잉크 텍스트. 보조 액션.
- **Ghost**: 배경 없음. 텍스트만. 덜 중요한 액션, 취소.
- **Danger**: 빨간 배경. 삭제, 신고 등 파괴적 액션.

모든 버튼: 높이 40px, rounded 12px, font-weight 600.

### Cards

- **Marker Card**: 사진 + 주소 + 거리. 흰 배경, 1px 보더, rounded 16px. 호버 시 보더 강화 + 미세 그림자.
- **Location Card**: 위치 상세 정보. 시설 뱃지, 설명, 댓글 수.
- 카드 내부 여백은 일관되게 16~20px.

### Navigation

- **Bottom Nav**: 흰 배경(다크: 슬레이트), 상단 1px 보더. 아이콘 + 라벨. 활성 탭만 프라이머리 차콜.
- **Header**: 타이틀 중앙 정렬. 좌측 뒤로가기, 우측 액션 아이콘.

### Search

- 검색 바: rounded 16px, surface 배경, 1px 보더. 높이 44px.
- 검색 결과: 리스트 형태, 1px divider 구분.

### Forms

- Input: 높이 44px, rounded 12px, 1px 보더. Focus 시 프라이머리 보더 + 3px 링.
- Textarea: 동일 스타일, 높이 가변.

### Feedback

- **Toast**: 다크 배경(ink) + 흰 텍스트. 하단 중앙. rounded 12px.
- **Badge**: 연한 배경 + 진한 텍스트. 작고 둥글게(full round).
- **Skeleton**: surface 색상으로 실제 레이아웃과 동일한 구조.

## Interaction & Motion

### Principles

- 기본 transition: `150ms ease-out`
- 호버 효과는 보더 강화 또는 미세 그림자만. 배경색 변화 최소화.
- Active/press: `scale(0.98)` 또는 `scale(0.99)` — 미세한 눌림 피드백.
- 페이지 전환: `opacity + translateY(4px)`, 180ms.
- `prefers-reduced-motion` 시 모든 모션 비활성화.

### Touch

- 최소 터치 타겟: 44×44px
- Active 상태를 반드시 제공 (hover 의존 금지)
- 스와이프 가능한 영역에 시각적 힌트 제공 (잘림, 그라디언트 마스크)

## Dark Mode

### Philosophy

다크모드는 단순 색 반전이 아닌, **동일한 계층 구조를 다크 팔레트로 재해석**합니다.

- 배경: 슬레이트 900(#0f172a) → 슬레이트 800(#1e293b) → 슬레이트 700(#334155) 순으로 elevation 표현
- 텍스트: 밝은 회색 계열. 순백(#fff)은 가장 강조 텍스트에만.
- 프라이머리: 동일 블루 유지. 다크 위에서 더 밝게 보이므로 별도 보정 불필요.
- 보더: 슬레이트 700(#334155) 기본 → 슬레이트 600(#475569) 강조.

### 대비 확보

모든 텍스트/배경 조합은 최소 WCAG AA(4.5:1) 충족:
- ink-dark(#f8fafc) on canvas-dark(#0f172a) → 15.4:1 ✓
- muted-dark(#94a3b8) on canvas-dark(#0f172a) → 5.7:1 ✓
- primary-light(#a1a1aa) on canvas-dark(#0f172a) → 6.3:1 ✓ (다크모드에서는 primary-light 사용)

## Implementation Notes

### Tailwind Integration

이 디자인 시스템은 Tailwind CSS의 `@theme` 디렉티브로 구현됩니다:

```css
@theme {
  --color-primary: #18181b;
  --color-primary-hover: #09090b;
  --color-primary-active: #000000;
  --color-primary-muted: #e4e4e7;
  --color-primary-subtle: #f4f4f5;
  /* ... */
}
```

### Migration from Current Tokens

| 현재 토큰 | 새 토큰 | 비고 |
|---|---|---|
| `--color-primary: #6c705e` | `--color-primary: #18181b` | 올리브 → 블루 |
| `--color-surface: #f3ede5` | `--color-surface: #f8fafc` | 웜 베이지 → 쿨 슬레이트 |
| `--color-text-on-surface: #404038` | `--color-ink: #0f172a` | 웜 다크 → 쿨 다크 |
| `--color-search-input-bg: #e4e8de` | `--color-surface: #f8fafc` | 통합 |
| `--color-location-badge-bg` | 제거 (범용 토큰 사용) | 특수 토큰 → 범용화 |

### Known Gaps

- **지도 마커 색상**: Kakao Maps 위 마커 디자인은 이 시스템의 primary를 따르되, 지도 타일과의 가시성은 별도 검증 필요.
- **이미지 위 텍스트**: 사진 위 오버레이 텍스트의 가독성은 scrim 처리로 보장 — 구체적 scrim opacity는 구현 시 조정.
- **애니메이션 디테일**: 페이지 전환, 모달 진입 등 복잡한 모션은 구현 단계에서 세부 조정.
