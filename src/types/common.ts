export interface ApiResponse<T> {
  success: boolean;
  error: string | null;
  data: T;
}

export interface ApiListResponse<T> {
  data: T[];
}

export interface PaginatedPayload<T> {
  data: T[];
  total: number;
}

export interface PaginatedApiResponse<T> {
  data: PaginatedPayload<T>;
}
