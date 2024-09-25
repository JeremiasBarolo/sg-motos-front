import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  private apiUrl = 'http://localhost:8081/tareas';

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

  

  // Obtener por ID
  getTareasEmpleado(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/empleado/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError<any>('getById'))
    );
  }

  getPendientesCount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/countHome`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError<any>('countHome'))
    );
  }

  // Crear
  create(Entity: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, Entity, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError<any>('create'))
    );
  }

  // Actualizar
  update(id: number, Entity: any): Observable<any> {
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
