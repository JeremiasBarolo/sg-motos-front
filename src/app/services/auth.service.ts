import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {jwtDecode} from 'jwt-decode'; 
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081';
  private tokenKey: string = 'token';

  constructor(private http: HttpClient) { }

  login(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, userData);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      return decodedToken && decodedToken.rol;
    }
    return false;
  }


  isAllowed(): any {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      if(decodedToken.rol == 'ADMIN'){
        return true;
      }else{
        return false;
      }
      
    }
    
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    console.log('nashe');
    
  }

  private decodeToken(token: string): any {
    try {
      return jwtDecode(token); 
    } catch (Error) {
      return null;
    }
  }

  getUserData(): Observable<any> {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      return of(decodedToken); 
    }
    return of(null);
  }
}
