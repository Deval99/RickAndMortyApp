export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: LocationRef;
  location: LocationRef;
  image: string;
  episode: string[]; // array of episode URLs
  url: string;
  created: string;
}

/** Inline location reference embedded inside a Character response */
export interface LocationRef {
  name: string;
  url: string;
}

/** Optional filter parameters accepted by the /character list endpoint */
export interface CharacterFilters {
  name?: string;
  status?: 'alive' | 'dead' | 'unknown';
  species?: string;
  gender?: 'female' | 'male' | 'genderless' | 'unknown';
}
