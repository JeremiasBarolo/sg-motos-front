import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { AuthService } from './auth.service';

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

  getAllRecaudacion(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/recaudacion`, { headers: this.getHeaders() });
  }

  listAllVentasPorCategoria(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/venta-categoria`, { headers: this.getHeaders() });
  }
  
  getAllHistorial(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historiales`, { headers: this.getHeaders() }); 
  }

  getAllVentasRespuestos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ventas-repuestos`, { headers: this.getHeaders() }); 
  }

  getAllVentasAccesorios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ventas-accesorios`, { headers: this.getHeaders() }); 
  }

  getListadoPrecios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listado-precios`, { headers: this.getHeaders() }); 
  }

  getAllVentasMoto(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ventas/motos`, { headers: this.getHeaders() }); 
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

