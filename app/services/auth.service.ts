import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
 interface LoginResponse {
  token: string;
  // Ajoutez d'autres propriétés si nécessaire
}

@Injectable({
  providedIn: 'root'
})
 
export class AuthService {
  private authUrl = '/api/login';
  private tokenKey = 'jwt_token';
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.initializeAuthState();
  }




  private initializeAuthState(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      this.currentUserSubject.next(this.decodeToken(token));
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.authUrl, { username, password }).pipe(
      tap(response => {
        if (response?.token) {
          this.storeToken(response.token);
          this.currentUserSubject.next(this.decodeToken(response.token));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get currentUser$(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  hasRole(requiredRole: string): boolean {
    const user = this.currentUserValue;
    return user?.role === requiredRole;
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    return decoded.exp * 1000 < Date.now();
  }

  // Pour les appels API protégés
  getAuthHeaders(): { [header: string]: string } {
    return {
      'Authorization': `Bearer ${this.getToken()}`
    };
  }
  private getTokenRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];
    const payload = this.decodeToken(token);
    return payload.roles || [];
  }
  hasAnyRole(requiredRoles: string[]): boolean {
    const userRoles = this.getTokenRoles();
    return requiredRoles.some(role => userRoles.includes(role));
  }
}
