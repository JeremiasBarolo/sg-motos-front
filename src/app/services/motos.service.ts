import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { PaginatedResponse } from '../models/paginated-response';
import { getPaginated } from '../utils/pagination-http.util';

@Injectable({
  providedIn: 'root'
})
export class MotosService {

  
  constructor(private http: HttpClient, private authService: AuthService) { }

  private apiUrl = 'http://localhost:8081/motos';
  
  // Método para obtener encabezado con token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
 
  getAll(): Observable<any[] | PaginatedResponse<any>> {
    return this.http.get<any[] | PaginatedResponse<any>>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  getAllDisponibles(excludeMotoId?: number): Observable<any[] | PaginatedResponse<any>> {
    const params = excludeMotoId != null ? `?excludeMotoId=${excludeMotoId}` : '';
    return this.http.get<any[] | PaginatedResponse<any>>(`${this.apiUrl}/disponibles${params}`, { headers: this.getHeaders() });
  }

  getPage(page = 0, size = 10): Observable<PaginatedResponse<any>> {
    return getPaginated(this.http, this.apiUrl, page, size, this.getHeaders());
  }

  getAllUsadas(): Observable<any[] | PaginatedResponse<any>> {
    return this.http.get<any[] | PaginatedResponse<any>>(`${this.apiUrl}/usadas`, { headers: this.getHeaders() });
  }

  getPageUsadas(page = 0, size = 10): Observable<PaginatedResponse<any>> {
    return getPaginated(this.http, `${this.apiUrl}/usadas`, page, size, this.getHeaders());
  }

  getAllConsignacion(): Observable<any[] | PaginatedResponse<any>> {
    return this.http.get<any[] | PaginatedResponse<any>>(`${this.apiUrl}/consignacion`, { headers: this.getHeaders() });
  }

  getPageConsignacion(page = 0, size = 10): Observable<PaginatedResponse<any>> {
    return getPaginated(this.http, `${this.apiUrl}/consignacion`, page, size, this.getHeaders());
  }

  getAllNuevas(): Observable<any[] | PaginatedResponse<any>> {
    return this.http.get<any[] | PaginatedResponse<any>>(`${this.apiUrl}/nuevas`, { headers: this.getHeaders() });
  }

  getPageNuevas(page = 0, size = 10): Observable<PaginatedResponse<any>> {
    return getPaginated(this.http, `${this.apiUrl}/nuevas`, page, size, this.getHeaders());
  }


  // get by id
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
    
  }

  // create
  create(Entity: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, Entity, { headers: this.getHeaders() })
      
  }

  // update
  update(id: number, Entity: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, Entity, { headers: this.getHeaders() })

  }

  // delete
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  }
}
