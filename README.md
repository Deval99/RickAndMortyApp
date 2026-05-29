# Rick and Morty App

A React Native app for browsing the [Rick and Morty API](https://rickandmortyapi.com/). Browse characters, episodes, and locations, and save your favourites for offline access.

---

## Features

- **Characters** — infinite-scroll list with search, status, and gender filters; detail screen with species, origin, location, and episode chips
- **Episodes** — full episode list grouped by season, with detail screen showing cast
- **Locations** — paginated location list with detail screen showing residents
- **Favourites** — persisted offline via SQLite; available without a network connection

---

## Project Setup

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | >= 22.11.0 |
| React Native CLI | via `@react-native-community/cli` |
| Android Studio / Xcode | Latest stable |
| JDK | 17+ (Android) |
| CocoaPods | Latest (iOS) |

### Install dependencies

```bash
npm install
```

### iOS — install pods

```bash
cd ios && pod install && cd ..
```

### Run on Android

```bash
npm run android
```

### Run on iOS

```bash
npm run ios
```

### Start Metro bundler (with cache reset)

```bash
npm start
```

### Lint

```bash
npm run lint
```

### Tests

```bash
npm test
```

---

## Libraries

| Library | Version | Purpose |
|---|---|---|
| `react-native` | 0.85.3 | Core framework |
| `@react-navigation/native` | ^7.2.5 | Navigation container |
| `@react-navigation/native-stack` | ^7.16.0 | Stack navigator |
| `@react-navigation/bottom-tabs` | ^7.16.2 | Bottom tab navigator |
| `@reduxjs/toolkit` | ^2.12.0 | Global state management |
| `react-redux` | ^9.3.0 | React bindings for Redux |
| `@tanstack/react-query` | ^5.100.14 | Server state, infinite queries, caching |
| `axios` | ^1.16.1 | HTTP client with interceptors |
| `react-native-quick-sqlite` | ^8.2.7 | SQLite offline storage for favourites |
| `react-native-reanimated` | ^4.4.0 | Animations (shared transitions, collapsible header, press effects) |
| `react-native-worklets` | ^0.9.1 | Worklets runtime required by Reanimated 4 |
| `react-native-screens` | ^4.25.2 | Native screen optimisation |
| `react-native-safe-area-context` | ^5.5.2 | Safe area insets |

---

## Architecture

```
src/
├── assets/images/        # PNG icon assets
├── components/           # Shared UI components (CharacterCard, FilterBar, SearchBar, SkeletonLoader, StatusBadge)
├── database/             # SQLite service (react-native-quick-sqlite)
├── features/             # Feature-based screens
│   ├── characters/       # CharacterListScreen, CharacterDetailScreen
│   ├── episodes/         # EpisodeListScreen, EpisodeDetailScreen
│   ├── favourites/       # FavouritesScreen
│   └── locations/        # LocationListScreen, LocationDetailScreen
├── hooks/                # Custom hooks (data fetching, animations, favourites)
├── navigation/           # AppNavigator (root stack + bottom tabs)
├── services/             # ApiClient (Axios), CharacterService, EpisodeService, LocationService
├── store/                # Redux store + slices (characters, favourites, ui)
├── types/                # TypeScript interfaces (Character, Episode, Location, API types)
└── utils/                # navigateToDetail (prevents stack bloat)
```

**State management split:**
- React Query handles all server/async state (fetching, caching, pagination)
- Redux manages UI state (active tab, character filters) and the favourites list
- SQLite persists favourited characters for offline use; loaded into Redux on app start

**State management split:**
- React Query handles all server/async state (fetching, caching, pagination)
- Redux manages UI state (active tab, character filters) and the favourites list
- SQLite persists favourited characters for offline use; loaded into Redux on app start
