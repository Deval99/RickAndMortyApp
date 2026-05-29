# Rick and Morty App

A React Native app for browsing the [Rick and Morty API](https://rickandmortyapi.com/api). Browse characters, episodes, and locations — and save your favourites for offline access.

---

## Features

- **Characters** — infinite-scroll list with debounced search and status/gender filters
- **Episodes** — all episodes fetched and grouped by season with sticky section headers
- **Locations** — infinite-scroll list of all locations in the show
- **Favourites** — offline-capable list of saved characters, persisted to SQLite

Each list item navigates to a detail screen with full info and related data (e.g. characters in an episode, residents of a location).

---

## Tech Stack

| Category | Library | Version |
|---|---|---|
| Framework | React Native | 0.85.3 |
| Language | TypeScript | ^5.8.3 |
| Navigation | React Navigation (native-stack + bottom-tabs) | ^7.x |
| Server state | TanStack React Query | ^5.100.14 |
| Client state | Redux Toolkit + react-redux | ^2.12 / ^9.3 |
| HTTP | Axios | ^1.16.1 |
| Local DB | react-native-quick-sqlite | ^8.2.7 |
| Animations | react-native-reanimated + react-native-worklets | ^4.4 / ^0.9 |

---

## Project Structure

```
src/
├── assets/images/        # App icons and images
├── components/           # Shared UI components
│   ├── CharacterCard.tsx
│   ├── FilterBar.tsx     # Status + gender filter dropdowns
│   ├── SearchBar.tsx     # Debounced search input
│   ├── SkeletonLoader.tsx
│   └── StatusBadge.tsx
├── database/
│   └── DatabaseService.ts  # SQLite (characters cache + favourites)
├── hooks/                # React Query + custom hooks
│   ├── useInfiniteCharacters.ts
│   ├── useInfiniteLocations.ts
│   ├── useAllEpisodes.ts
│   ├── useFavourite.ts
│   ├── useFavourites.ts
│   └── ...
├── navigation/
│   └── AppNavigator.tsx  # Root stack + bottom tab navigator
├── screens/
│   ├── CharacterListScreen/
│   ├── CharacterDetailScreen/
│   ├── EpisodeListScreen/
│   ├── EpisodeDetailScreen/
│   ├── LocationListScreen/
│   ├── LocationDetailScreen/
│   └── FavouritesScreen/
├── services/
│   ├── ApiClient.ts      # Axios instance with interceptors + 429 handling
│   ├── CharacterService.ts
│   ├── EpisodeService.ts
│   └── LocationService.ts
├── store/
│   ├── index.ts
│   ├── hooks.ts
│   └── slices/characterSlice.ts
└── types/
    ├── api.ts
    ├── character.ts
    ├── episode.ts
    └── location.ts
```

---

## Architecture

**State management — dual layer:**
- TanStack React Query handles all remote data (caching, pagination, retries, loading/error states)
- Redux Toolkit holds UI state: the favourites ID list and selected character

**Offline favourites:**
- Toggling a favourite writes to two SQLite tables: `favourites` (ID only) and `characters` (full data)
- The Favourites screen reads entirely from SQLite and works without an internet connection

**API client:**
- Axios with request/response interceptors for logging and request timing
- Built-in 429 rate-limit handling — blocks all requests for 5 seconds after a rate-limit response

**Navigation:**
- Single root `NativeStack` with a `BottomTab` navigator as the entry point
- Detail screens live on the root stack so they can be pushed from any tab

---

## Getting Started

### Prerequisites

- Node.js >= 22.11.0
- React Native development environment set up ([guide](https://reactnative.dev/docs/set-up-your-environment))
- Android Studio (for Android) or Xcode (for iOS)

### Install dependencies

```bash
npm install
```

### Run on Android

```bash
npm run android
```

### Run on iOS

```bash
npm run ios
```

### Start Metro bundler

```bash
npm start
```

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start Metro bundler (with cache reset) |
| `npm run android` | Build and run on Android |
| `npm run ios` | Build and run on iOS |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests |

---

## API

Data is sourced from the public [Rick and Morty API](https://rickandmortyapi.com). No API key required.
