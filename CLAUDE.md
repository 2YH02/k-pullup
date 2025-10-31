# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**k-pullup** (대한민국 철봉 지도) is a Next.js 14 frontend application for a community platform that helps users find and share pull-up bar locations across South Korea. Users can register locations with photos, add comments, chat with others, and search for nearby exercise equipment.

- **Frontend**: This repository (Next.js 14, TypeScript, Tailwind CSS)
- **Backend**: Go-based API at https://github.com/Alfex4936/chulbong-kr (separate repository)
- **API Base URL**: https://api.k-pullup.com/api/v1

## Development Commands

### Basic Commands
```bash
# Development server with HTTPS (runs on https://local.k-pullup.com:5173)
# Requires hosts file configuration (see setup below)
yarn dev

# Development server without HTTPS (runs on http://localhost:5173)
# No configuration needed
yarn dev:simple

# Production build
yarn build

# Start production server
yarn start

# Lint code
yarn lint
```

### Initial Setup

If using `yarn dev` (HTTPS with custom domain), add this to your hosts file:

```bash
# Add local.k-pullup.com to hosts file (macOS/Linux)
echo "127.0.0.1 local.k-pullup.com" | sudo tee -a /etc/hosts

# Verify it was added
cat /etc/hosts | grep k-pullup
```

For Windows, manually edit `C:\Windows\System32\drivers\etc\hosts` and add:
```
127.0.0.1 local.k-pullup.com
```

### Testing
```bash
# Run E2E tests with Playwright
yarn test:e2e

# Run E2E tests with browser visible
yarn test:e2e:headed

# Run E2E tests in CI mode
yarn test:e2e:ci
```

### Storybook
```bash
# Run Storybook development server (port 6006)
yarn storybook

# Build Storybook for production
yarn build-storybook
```

## Architecture & Structure

### Project Organization

The project follows Next.js 14 App Router structure with these key directories:

```
app/              # Next.js pages using App Router
├── admin/        # Admin pages
├── moments/      # Story-like 24-hour posts feature
├── pullup/       # Pull-up bar detail pages
├── register/     # Location registration flow
├── search/       # Search functionality
└── [other routes]

components/
├── common/       # Reusable UI components
├── icons/        # Icon components
├── layout/       # Layout components (kakao-map, roadview, etc.)
├── pages/        # Page-specific components
├── provider/     # React Context providers
└── ui/           # shadcn/ui components

lib/
├── api/          # API client functions organized by domain
│   ├── auth/     # Authentication endpoints
│   ├── marker/   # Marker/location endpoints
│   ├── comment/  # Comment endpoints
│   ├── user/     # User endpoints
│   └── ...
└── [utilities]   # Helper functions

store/            # Zustand state management stores
hooks/            # Custom React hooks
types/            # TypeScript type definitions
constant/         # Application constants (cities, regions, etc.)
```

### Path Aliases

The following path aliases are configured in tsconfig.json:

- `@/*` - Root directory
- `@lib/*` - lib directory
- `@components/*` - components directory
- `@pages/*` - components/pages
- `@common/*` - components/common
- `@layout/*` - components/layout
- `@icons/*` - components/icons
- `@store/*` - store directory
- `@provider/*` - components/provider
- `@hooks/*` - hooks directory
- `@api/*` - lib/api
- `@constant/*` - constant directory
- `@types/*` - types directory

### State Management

This project uses **Zustand** for global state management. Key stores include:

- `useMapStore` - Kakao Map instance and map element
- `useMarkerStore` - Marker data and management
- `useGeolocationStore` - User location and GPS state
- `useUserStore` - Current user information
- `useAlertStore` - Alert/modal management
- `useBottomSheetStore` - Bottom sheet UI state
- `useSearchStore` - Search functionality state
- `useImageModalStore` - Image viewer modal state

Each store is a separate file in `/store` directory.

### API Integration

#### API Client Pattern

API calls are organized by domain in `lib/api/[domain]/`. Each API function:
1. Uses `fetchData()` wrapper (handles rate limiting)
2. Makes requests to `/api/v1/...` which are proxied to backend via Next.js rewrites
3. Returns typed responses

Example API call structure:
```typescript
import fetchData from "@lib/fetchData";

const someApiCall = async (params): Promise<ReturnType> => {
  const response = await fetchData("/api/v1/endpoint", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return response.json();
};
```

#### Authentication

- JWT tokens are stored in cookies
- `UserProvider` fetches user info on app load using `/api/v1/users/my-info`
- Social login supported: Kakao, Naver, Google

### Map Integration

The application heavily integrates **Kakao Maps API**:

- `KakaoMap` component (`components/layout/kakao-map.tsx`) is the main map container
- Map instance is stored in Zustand (`useMapStore`)
- Markers are clustered and managed through `useMarkerControl` hook
- Roadview (street view) feature available via `Roadview` component
- Map instance is loaded via Kakao SDK script tag in `KakaoSdk` provider

### React Native WebView Support

The app supports React Native WebView embedding:
- Detects `window.ReactNativeWebView` presence
- Handles location messages from native app
- Device type detection for responsive behavior

## Key Features Implementation

### Markers (Pull-up Bar Locations)
- All markers loaded on app initialization (`getAllMarker`)
- Markers stored in `useMarkerStore`
- Clustering algorithm in `lib/cluster-markers.ts`
- Users can add new markers with photos and descriptions

### Moments (24-hour Stories)
- Instagram-story-like feature for workout posts
- Posts expire after 24 hours
- Photo + caption format

### Search
- Address-based search with Korean initial consonant (초성) support
- Nearby search based on current location
- Search service handled in `lib/api/search/`

### Chat
- Regional chat rooms by province (서울, 경기, etc.)
- Per-marker chat rooms
- Anonymous chat functionality

### Ranking
- Area-based rankings
- Marker popularity rankings

## Testing

### E2E Testing with Playwright

- Tests located in `/tests/e2e/`
- Configured to run against `https://local.k-pullup.com:5173`
- Tests ignore HTTPS errors (development SSL)
- Run tests for home page and signin flows

## Environment Variables

Required environment variables (not committed):
- `NEXT_PUBLIC_GOOGLE_ANALYTICS` - Google Analytics tracking ID

Note: Kakao Maps API key is loaded via script tag, not environment variable.

## Package Manager

This project uses **Yarn Berry (v4.3.1)** with PnP (Plug'n'Play):
- Zero-install approach with `.pnp.cjs` and `.pnp.loader.mjs`
- Dependencies stored in `.yarn/cache`
- Always use `yarn` commands, not `npm`

## Development Notes

### HTTPS Development

The dev server runs with HTTPS on a custom domain:
```
https://local.k-pullup.com:5173
```

This requires local hosts file configuration for `local.k-pullup.com`.

### TypeScript Configuration

- Strict mode enabled
- Path aliases extensively used (see Path Aliases section)
- Next.js plugin for TypeScript configured

### Styling

- **Tailwind CSS** for styling
- **shadcn/ui** components in `components/ui/`
- **Framer Motion** for animations
- Custom font: Pretendard (Korean web font)

### Image Handling

- Images hosted on AWS S3: `chulbong-kr.s3.amazonaws.com`
- Kakao Maps static images: `t1.daumcdn.net`
- Next.js Image optimization disabled (`unoptimized: true`)

#### Client-Side Image Optimization

All images are optimized **before upload** using a custom utility (`lib/optimize-image.ts`) powered by `img-toolkit` (Rust + WebAssembly):

**Key Features:**
- Automatic format conversion to WebP
- Intelligent resizing with aspect ratio preservation
- Quality compression (80-85%)
- File validation (type, size)
- Multiple optimization presets for different use cases

**Optimization Presets:**
```typescript
// Adaptive presets that maintain aspect ratio for any orientation:
OPTIMIZATION_PRESETS.marker    // Max 1600px longest side, 78% quality
                               // Portrait (9:16): ~900x1600px
                               // Landscape (16:9): ~1600x900px
                               // Square: 1600x1600px

OPTIMIZATION_PRESETS.moment    // Max 1920px longest side, 82% quality
OPTIMIZATION_PRESETS.thumbnail // Max 400x400, 80% quality
OPTIMIZATION_PRESETS.avatar    // 512x512 square, 85% quality
```

**Usage in Components:**
- `components/pages/register/upload-image.tsx` - Uses `marker` preset
- `components/pages/pullup/upload-image.tsx` - Uses `marker` preset
- `app/pullup/[id]/moment/moment-client.tsx` - Uses `moment` preset

**Performance:**
- Powered by WebAssembly for fast client-side processing
- Resampling quality level 2 (Lanczos3) for balance between speed and quality
- Reduces upload bandwidth and backend storage requirements
- Max file size: 30MB before optimization

## Common Development Patterns

### Adding a New API Endpoint

1. Create a new file in `lib/api/[domain]/[endpoint-name].ts`
2. Import `fetchData` from `@lib/fetchData`
3. Define TypeScript interfaces for request/response
4. Export async function that calls backend endpoint

### Creating a New Store

1. Create file in `store/use[Name]Store.ts`
2. Use Zustand's `create` function
3. Define state interface and actions
4. Export store hook

### Adding a New Page

1. Create directory in `app/[route-name]/`
2. Add `page.tsx` for the route component
3. Create associated components in `components/pages/[route-name]/`
4. Use Server Components by default, add `"use client"` only when needed

### Working with Maps

- Always check if `window.kakao` is loaded before using Kakao Maps API
- Get map instance from `useMapStore().map`
- Use `useMarkerControl` hook for marker manipulation
- Location data format: `{ lat: number, lng: number }`

### Optimizing Images Before Upload

Always optimize images before uploading to the backend:

```typescript
import {
  optimizeImage,
  OPTIMIZATION_PRESETS,
  ImageValidationError,
} from "@lib/optimize-image";

// Using a preset (recommended)
try {
  const optimizedFile = await optimizeImage(
    originalFile,
    OPTIMIZATION_PRESETS.marker
  );
  // Upload optimizedFile to backend
} catch (error) {
  if (error instanceof ImageValidationError) {
    // Handle validation errors (wrong format, too large, etc.)
  }
}

// Using custom settings
const customOptimized = await optimizeImage(originalFile, {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.9,
  format: "webp",
  resampling: 3,
});

// Optimizing multiple images
import { optimizeImages } from "@lib/optimize-image";
const optimizedFiles = await optimizeImages(files, OPTIMIZATION_PRESETS.marker);
```
