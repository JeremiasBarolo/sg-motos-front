import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/paginated-response';

export function getPaginated<T>(
  http: HttpClient,
  url: string,
  page: number,
  size: number,
  headers: HttpHeaders
): Observable<PaginatedResponse<T>> {
  return http.get<PaginatedResponse<T>>(`${url}?page=${page}&size=${size}`, { headers });
}
