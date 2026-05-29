# Custom Hooks

This document covers all custom hooks in the RickAndMortyApp. They live in two places:

- `src/hooks/` — feature hooks (data fetching, UI animation, favourites)
- `src/store/hooks.ts` — typed Redux wrappers

---

## Data Fetching Hooks

### `useCharacter(characterId)`

**File:** `src/hooks/useCharacter.ts`

Fetches a single character by ID from the Rick and Morty API.

**Parameters**

| Name          | Type     | Description              |
|---------------|----------|--------------------------|
| `characterId` | `number` | The character's numeric ID |

**Returns** `UseQueryResult<Character, ApiError>` — the full React Query result object.

**Example**
```ts
const { data: character, isLoading, isError } = useCharacter(1);
```

---

### `useInfiniteCharacters(filters?)`

**File:** `src/hooks/useInfiniteCharacters.ts`

Infinite-scroll query for the characters list. Supports optional filters (name, status, species, etc.). Retries up to 2 times, but not on 404 errors.

**Parameters**

| Name      | Type               | Description                          |
|-----------|--------------------|--------------------------------------|
| `filters` | `CharacterFilters` | Optional filter object (default: `{}`) |

**Returns** `UseInfiniteQueryResult<InfiniteData<PaginatedResponse<Character>>, ApiError>`

**Example**
```ts
const { data, fetchNextPage, hasNextPage } = useInfiniteCharacters({ status: 'alive' });
```

---

### `useLocation(locationId)`

**File:** `src/hooks/useLocation.ts`

Fetches a single location by ID.

**Parameters**

| Name         | Type     | Description             |
|--------------|----------|-------------------------|
| `locationId` | `number` | The location's numeric ID |

**Returns** `UseQueryResult<FullLocation, ApiError>`

**Example**
```ts
const { data: location, isLoading } = useLocation(3);
```

---

### `useInfiniteLocations()`

**File:** `src/hooks/useInfiniteLocations.ts`

Infinite-scroll query for the locations list. Takes no parameters.

**Returns** `UseInfiniteQueryResult<InfiniteData<PaginatedResponse<FullLocation>>, ApiError>`

**Example**
```ts
const { data, fetchNextPage, hasNextPage } = useInfiniteLocations();
```

---

### `useLocationWithResidents(locationId)`

**File:** `src/hooks/useLocationWithResidents.ts`

Two-step fetch: first loads the location, then batch-fetches all resident characters in a single API call using comma-separated IDs.

**Parameters**

| Name         | Type     | Description             |
|--------------|----------|-------------------------|
| `locationId` | `number` | The location's numeric ID |

**Returns**

| Field       | Type                    | Description                                      |
|-------------|-------------------------|--------------------------------------------------|
| `location`  | `FullLocation \| undefined` | The location data                            |
| `residents` | `Character[]`           | All resident characters (empty until loaded)     |
| `isLoading` | `boolean`               | True while either query is in flight             |
| `isError`   | `boolean`               | True if either query failed                      |
| `error`     | `ApiError \| null`      | The first error encountered                      |
| `refetch`   | `() => void`            | Refetches both the location and residents queries |

**Example**
```ts
const { location, residents, isLoading } = useLocationWithResidents(20);
```

---

### `useAllEpisodes()`

**File:** `src/hooks/useAllEpisodes.ts`

Fetches every episode page automatically (auto-fetches subsequent pages as soon as the previous one resolves). Returns episodes grouped by season.

**Returns**

| Field          | Type             | Description                                          |
|----------------|------------------|------------------------------------------------------|
| `seasons`      | `EpisodeSeason[]` | Episodes grouped and sorted by season number        |
| `totalLoaded`  | `number`         | Total number of episodes fetched so far              |
| `isLoadingAll` | `boolean`        | True while any page is still loading                 |
| `...query`     | —                | All other standard `useInfiniteQuery` fields         |

**`EpisodeSeason` shape**
```ts
interface EpisodeSeason {
  season: number;   // e.g. 1
  title: string;    // e.g. "Season 1"
  data: Episode[];  // episodes in this season
}
```

**Example**
```ts
const { seasons, isLoadingAll } = useAllEpisodes();
// seasons[0].title === "Season 1"
```

---

### `useEpisodeWithCharacters(episodeId)`

**File:** `src/hooks/useEpisodeWithCharacters.ts`

Two-step fetch: loads the episode, then batch-fetches all its characters in a single API call.

**Parameters**

| Name        | Type     | Description            |
|-------------|----------|------------------------|
| `episodeId` | `number` | The episode's numeric ID |

**Returns**

| Field        | Type                  | Description                                       |
|--------------|-----------------------|---------------------------------------------------|
| `episode`    | `Episode \| undefined` | The episode data                                 |
| `characters` | `Character[]`         | All characters in the episode                    |
| `isLoading`  | `boolean`             | True while either query is in flight             |
| `isError`    | `boolean`             | True if either query failed                      |
| `error`      | `ApiError \| null`    | The first error encountered                      |
| `refetch`    | `() => void`          | Refetches both the episode and characters queries |

**Example**
```ts
const { episode, characters, isLoading } = useEpisodeWithCharacters(5);
```

---

## Favourites Hooks

### `useFavourite(characterId, character?)`

**File:** `src/hooks/useFavourite.ts`

Manages the favourite state for a single character. Reads from Redux and persists to SQLite on toggle.

**Parameters**

| Name          | Type                  | Description                                                  |
|---------------|-----------------------|--------------------------------------------------------------|
| `characterId` | `number`              | The character's numeric ID                                   |
| `character`   | `Character` (optional) | Full character object — required when adding a new favourite |

**Returns**

| Field        | Type         | Description                                      |
|--------------|--------------|--------------------------------------------------|
| `isFavourite` | `boolean`   | Whether this character is currently favourited   |
| `toggle`     | `() => void` | Adds or removes the character from favourites    |

**Example**
```ts
const { isFavourite, toggle } = useFavourite(character.id, character);
```

---

### `useFavourites()`

**File:** `src/hooks/useFavourites.ts`

Loads and exposes the full list of favourited characters from Redux/SQLite. Triggers a SQLite load on mount. Works fully offline — no API calls.

**Returns**

| Field        | Type          | Description                                  |
|--------------|---------------|----------------------------------------------|
| `characters` | `Character[]` | All currently favourited characters          |
| `isLoading`  | `boolean`     | True while the SQLite load is in progress    |
| `reload`     | `() => void`  | Manually re-triggers the SQLite load         |

**Example**
```ts
const { characters, isLoading, reload } = useFavourites();
```

---

## UI / Animation Hooks

### `usePressAnimation(config?)`

**File:** `src/hooks/usePressAnimation.ts`

Provides Reanimated-based spring scale and shadow animations for pressable components.

**Parameters (`config`)**

| Name                    | Type     | Default | Description                          |
|-------------------------|----------|---------|--------------------------------------|
| `scaleValue`            | `number` | `1.025` | Scale factor when pressed            |
| `shadowOpacityActive`   | `number` | `0.22`  | Shadow opacity while pressed         |
| `shadowOpacityInactive` | `number` | `0.1`   | Shadow opacity when not pressed      |

**Returns**

| Field           | Type                    | Description                                      |
|-----------------|-------------------------|--------------------------------------------------|
| `animatedStyle` | `AnimatedStyleProp`     | Apply to an `Animated.View` for the effect       |
| `handlePressIn` | `() => void`            | Call on `onPressIn` to trigger the press animation |
| `handlePressOut`| `() => void`            | Call on `onPressOut` to reverse the animation    |

**Example**
```tsx
const { animatedStyle, handlePressIn, handlePressOut } = usePressAnimation({ scaleValue: 1.05 });

<Animated.View style={animatedStyle}>
  <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
    ...
  </Pressable>
</Animated.View>
```

---

### `useCollapsibleControls()`

**File:** `src/hooks/useCollapsibleControls.ts`

Drives a scroll-aware collapsible header/controls area. As the user scrolls down, the controls fade out and slide up. Pointer events are disabled once the controls are fully hidden to prevent invisible tap targets.

**Returns**

| Field                   | Type                        | Description                                                  |
|-------------------------|-----------------------------|--------------------------------------------------------------|
| `controlsAnimatedStyle` | `AnimatedStyleProp`         | Apply to the controls container for fade + slide animation   |
| `controlsHeight`        | `number`                    | Measured height of the controls area (px)                    |
| `controlsPointerEvents` | `ViewProps['pointerEvents']`| `'auto'` or `'none'` — disables touches when controls are hidden |
| `handleControlsLayout`  | `(e: LayoutChangeEvent) => void` | Pass to the controls container's `onLayout`            |
| `handleScroll`          | `(e: NativeSyntheticEvent<NativeScrollEvent>) => void` | Pass to the scroll view's `onScroll` |

**Example**
```tsx
const {
  controlsAnimatedStyle,
  controlsHeight,
  controlsPointerEvents,
  handleControlsLayout,
  handleScroll,
} = useCollapsibleControls();

<ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
  <Animated.View
    style={controlsAnimatedStyle}
    pointerEvents={controlsPointerEvents}
    onLayout={handleControlsLayout}
  >
    {/* search bar, filters, etc. */}
  </Animated.View>
  {/* list content */}
</ScrollView>
```

---

## Utility Hooks

### `useDebounce<T>(value, delayMs?)`

**File:** `src/hooks/useDebounce.ts`

Returns a debounced copy of `value` that only updates after `delayMs` milliseconds of inactivity. Generic — works with any value type. No lodash dependency.

**Parameters**

| Name      | Type     | Default | Description                    |
|-----------|----------|---------|--------------------------------|
| `value`   | `T`      | —       | The value to debounce          |
| `delayMs` | `number` | `300`   | Delay in milliseconds          |

**Returns** `T` — the debounced value.

**Example**
```ts
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 400);

// debouncedSearch only updates 400ms after the user stops typing
useEffect(() => {
  fetchResults(debouncedSearch);
}, [debouncedSearch]);
```

---

## Redux Store Hooks

### `useAppDispatch()`

**File:** `src/store/hooks.ts`

Typed wrapper around Redux's `useDispatch`. Returns `AppDispatch` so thunks are properly typed.

**Returns** `AppDispatch`

**Example**
```ts
const dispatch = useAppDispatch();
dispatch(loadFavourites());
```

---

### `useAppSelector<T>(selector)`

**File:** `src/store/hooks.ts`

Typed wrapper around Redux's `useSelector`. Infers the return type from the selector function.

**Parameters**

| Name       | Type                          | Description                    |
|------------|-------------------------------|--------------------------------|
| `selector` | `(state: RootState) => T`     | Selector function              |

**Returns** `T`

**Example**
```ts
const characters = useAppSelector(state => state.favourites.characters);
```
