import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private http: HttpClient, private authService: AuthService) { }


  private apiUrl = 'http://localhost:8081/stock';

  // Método para obtener encabezado con token
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

  listAllStockCount(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/disponible`, { headers: this.getHeaders() }); 
  }


  getAllRepuestos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/repuestos`, { headers: this.getHeaders() }); 
  }

  getAllInsumos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/insumos`, { headers: this.getHeaders() }); 
  }

  getAllStockVentaAccesorios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/venta-accesorios`, { headers: this.getHeaders() }); 
  }

  getAllStockVentaRespuestos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/venta-respuestos`, { headers: this.getHeaders() }); 
  }

  getAllStockGeneral(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stock-general`, { headers: this.getHeaders() }); 
  }

  getAllServicios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/servicios`, { headers: this.getHeaders() }); 
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

