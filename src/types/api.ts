export interface PaginatedInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface PaginatedResponse<T> {
  info: PaginatedInfo;
  results: T[];
}

export interface ApiError {
  message: string;
  statusCode: number;
  originalError: unknown;
}

export interface DatabaseError {
  message: string;
  originalError: unknown;
}
