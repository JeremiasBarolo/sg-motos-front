import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private http: HttpClient, private authService: AuthService) { }


  private apiUrl = 'http://localhost:8081/pedidos';
  
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

  getAllPendientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pendientes`, { headers: this.getHeaders() }); 
  }

  // get by id
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
    
  }

   // get by id
   getStockPedido(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stock/${id}`, { headers: this.getHeaders() })
    
  }

  // create
  create(Entity: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, Entity, { headers: this.getHeaders() })
      
  }

  // update
  update(id: number, Entity: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, Entity, { headers: this.getHeaders() })

  }

  SumarCantidades(id: number, Entity: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/SumarCantidades/${id}`, Entity, { headers: this.getHeaders() })

  }

  updatePedidoStock(id: number, Entity: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/stock/${id}`, Entity, { headers: this.getHeaders() })

  }

  // delete
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  }
}


