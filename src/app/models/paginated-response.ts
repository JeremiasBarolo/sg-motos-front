export interface PaginatedResponse<T = any> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface PageChangeEvent {
  page: number;
  size: number;
}

/** Respuesta de listado: array plano, paginada completa o solo `{ content }`. */
export type ListResponse<T = any> =
  | T[]
  | PaginatedResponse<T>
  | { content: T[] }
  | null
  | undefined;

export function isPaginatedResponse<T = any>(
  data: ListResponse<T>
): data is PaginatedResponse<T> | { content: T[] } {
  return !!data && !Array.isArray(data) && Array.isArray((data as PaginatedResponse<T>).content);
}

export function unwrapList<T = any>(data: ListResponse<T>): T[] {
  if (!data) {
    return [];
  }
  if (Array.isArray(data)) {
    return data;
  }
  if (isPaginatedResponse(data)) {
    return data.content;
  }
  return [];
}

export function mapPaginatedResponse<T, R>(
  response: PaginatedResponse<T> | T[],
  mapper: (item: T) => R
): { items: R[]; totalRecords: number; serverSide: boolean } {
  if (Array.isArray(response)) {
    const items = response.map(mapper);
    return { items, totalRecords: items.length, serverSide: false };
  }

  return {
    items: response.content.map(mapper),
    totalRecords: response.totalElements,
    serverSide: true,
  };
}
