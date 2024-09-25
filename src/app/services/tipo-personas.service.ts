import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TipoPersonasService {

  
  constructor(private http: HttpClient, private authService: AuthService,private messageService: MessageService ) { }


  private apiUrl = 'http://localhost:8081/tipo_personas';
  

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
    if (id >= 1 && id <= 3) {
      
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Este ID es necesario para el funcionamiento del sistema y no puede ser eliminado.',
        life: 10000
      });
      return of(null);  
    } else {
      return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
  }

    
    
}

