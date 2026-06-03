import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ListResponse, PaginatedResponse, unwrapList } from '../models/paginated-response';
import { getPaginated } from '../utils/pagination-http.util';

@Injectable({
  providedIn: 'root'
})
export class PersonasService {

  constructor(private http: HttpClient, private authService: AuthService) { }


  private apiUrl = 'http://localhost:8081/personas';
  
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
    return this.http.get<any[]>(`${this.apiUrl}`,{ headers: this.getHeaders() }); 
  }

  getPage(page = 0, size = 10): Observable<PaginatedResponse<any>> {
    return getPaginated(this.http, this.apiUrl, page, size, this.getHeaders());
  }

  getAllEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/empleados`,{ headers: this.getHeaders() }); 
  }

  getPageEmpleados(page = 0, size = 10): Observable<PaginatedResponse<any>> {
    return getPaginated(this.http, `${this.apiUrl}/empleados`, page, size, this.getHeaders());
  }

  getMejoresEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mejores-empleados`,{ headers: this.getHeaders() }); 
  }

  getMejoresClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mejores-clientes`,{ headers: this.getHeaders() }); 
  }
  getAllProveedores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/proveedores`,{ headers: this.getHeaders() }); 
  }

  getPageProveedores(page = 0, size = 10): Observable<PaginatedResponse<any>> {
    return getPaginated(this.http, `${this.apiUrl}/proveedores`, page, size, this.getHeaders());
  }

  getAllClientes(): Observable<any[]> {
    return this.http
      .get<ListResponse<any>>(`${this.apiUrl}/clientes`, { headers: this.getHeaders() })
      .pipe(
        map((data) =>
          unwrapList(data).map((cliente) => ({
            ...cliente,
            nombreCompleto: `${cliente.nombre ?? ''} ${cliente.apellido ?? ''}`.trim(),
          }))
        )
      );
  }

  getPageClientes(page = 0, size = 10): Observable<PaginatedResponse<any>> {
    return getPaginated(this.http, `${this.apiUrl}/clientes`, page, size, this.getHeaders());
  }

  // get by id
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`,{ headers: this.getHeaders() })
    
  }

  // create
  create(Entity: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, Entity,{ headers: this.getHeaders() })
      
  }

  // update
  update(id: number, Entity: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, Entity,{ headers: this.getHeaders() })

  }

  // delete
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`,{ headers: this.getHeaders() })
  }
}

