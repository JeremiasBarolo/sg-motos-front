import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { PaginatedResponse } from '../models/paginated-response';
import { getPaginated } from '../utils/pagination-http.util';

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {
 
  constructor(private http: HttpClient, private authService: AuthService) { }


  private apiUrl = 'http://localhost:8081/movimientos';
  
  
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
 
  //get all
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, { headers: this.getHeaders() }); 
  }

  getPage(page = 0, size = 10): Observable<PaginatedResponse<any>> {
    return getPaginated(this.http, this.apiUrl, page, size, this.getHeaders());
  }

  getAllRecaudacion(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/recaudacion`, { headers: this.getHeaders() });
  }

  listAllVentasPorCategoria(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/venta-categoria`, { headers: this.getHeaders() });
  }
  
  getAllHistorial(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historiales`, { headers: this.getHeaders() }); 
  }

  getPageHistorial(page = 0, size = 10): Observable<PaginatedResponse<any>> {
    return getPaginated(this.http, `${this.apiUrl}/historiales`, page, size, this.getHeaders());
  }

  getAllVentasRespuestos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ventas-repuestos`, { headers: this.getHeaders() }); 
  }

  getPageVentasRespuestos(page = 0, size = 10): Observable<PaginatedResponse<any>> {
    return getPaginated(this.http, `${this.apiUrl}/ventas-repuestos`, page, size, this.getHeaders());
  }

  getAllVentasAccesorios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ventas-accesorios`, { headers: this.getHeaders() }); 
  }

  getPageVentasAccesorios(page = 0, size = 10): Observable<PaginatedResponse<any>> {
    return getPaginated(this.http, `${this.apiUrl}/ventas-accesorios`, page, size, this.getHeaders());
  }

  getListadoPrecios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listado-precios`, { headers: this.getHeaders() }); 
  }

  getPageListadoPrecios(page = 0, size = 10): Observable<PaginatedResponse<any>> {
    return getPaginated(this.http, `${this.apiUrl}/listado-precios`, page, size, this.getHeaders());
  }

  getAllVentasMoto(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ventas/motos`, { headers: this.getHeaders() }); 
  }

  getPageVentasMoto(page = 0, size = 10): Observable<PaginatedResponse<any>> {
    return getPaginated(this.http, `${this.apiUrl}/ventas/motos`, page, size, this.getHeaders());
  }

  getAllServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/services`, { headers: this.getHeaders() }); 
  }

  // get by id
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
    
  }

  getRelaciones(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/relaciones/${id}`, { headers: this.getHeaders() })
    
  }

  // create
  create(Entity: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, Entity, { headers: this.getHeaders() })
      
  }

  // create
  createVentaMoto(Entity: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/venta/motos`, Entity, { headers: this.getHeaders() })
      
  }

  // update
  update(id: number, Entity: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, Entity, { headers: this.getHeaders() })

  }

  // update
  updateVentaMoto(id: number, Entity: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/venta/motos/${id}`, Entity, { headers: this.getHeaders() })

  }

  // update
  updateVentaRepuestos(id: number, Entity: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/repuestos/${id}`, Entity, { headers: this.getHeaders() });

  }

  // delete
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  }

  deleteVentaRepuesto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/venta-repuestos/${id}`, { headers: this.getHeaders() })
  }
}

