import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { AuthService } from './auth.service';
import { PaginatedResponse } from '../models/paginated-response';
import { getPaginated } from '../utils/pagination-http.util';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  private apiUrl = 'http://localhost:8081/marca';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método para obtener encabezado con token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // Obtener todos
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError<any[]>('getAll', []))
    );
  }

  getPage(page = 0, size = 10): Observable<PaginatedResponse<any>> {
    return getPaginated(this.http, this.apiUrl, page, size, this.getHeaders());
  }

  // Obtener por ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError<any>('getById'))
    );
  }

  // Crear
  create(Entity: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, Entity, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError<any>('create'))
    );
  }

  // Actualizar
  update(id: number, Entity: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, Entity, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError<any>('update'))
    );
  }

  // Eliminar
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError<any>('delete'))
    );
  }

  // Manejo de errores
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
