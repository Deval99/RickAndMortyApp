/** Full location object returned by the /location endpoint */
export interface FullLocation {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[]; // URLs to character resources
  url: string;
  created: string;
}

/** @deprecated Use FullLocation instead */
export type RMLocation = FullLocation;
