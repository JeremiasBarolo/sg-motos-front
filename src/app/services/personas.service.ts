import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { AuthService } from './auth.service';

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

  getAllEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/empleados`,{ headers: this.getHeaders() }); 
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
  getAllClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clientes`,{ headers: this.getHeaders() }); 
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

