export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string; // e.g. "S01E01"
  characters: string[]; // URLs to character resources
  url: string;
  created: string;
}
