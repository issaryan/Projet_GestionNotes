import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// Interfaces TypeScript pour le typage fort
interface User {
  id: number;
  username: string;
  role: 'admin' | 'teacher' | 'student';
  nom?: string;
  prenom?: string;
  email?: string;
  class_id?: number;
  status?: 'Actif' | 'Inactif';
}

interface CsvResponse {
  success: boolean;
  message: string;
  inserted: number;
  errors: Array<{
    ligne: number;
    erreur: string;
    donnees: any;
  }>;
}

interface Class {
  id: number;
  name: string;
  level: string;
  academic_year: string;
  student_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class UtilisateursService {
  private apiUrl = '/api';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  // Gestion des utilisateurs
  getUsers(searchTerm: string = ''): Observable<User[]> {
    const params = new HttpParams().set('search', searchTerm);
    return this.http.get<User[]>(`${this.apiUrl}/users`, {
      headers: this.auth.getAuthHeaders(),
      params
    });
  }

  createUser(userData: {
    username: string;
    password: string;
    role: string;
    nom?: string;
    prenom?: string;
    email?: string;
    class_id?: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, userData, {
      headers: this.auth.getAuthHeaders()
    });
  }

  updateUser(userId: number, updates: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, updates, {
      headers: this.auth.getAuthHeaders()
    });
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`, {
      headers: this.auth.getAuthHeaders()
    });
  }

  // Gestion des imports CSV
  uploadUsersCsv(csvFile: File): Observable<CsvResponse> {
    const formData = new FormData();
    formData.append('file', csvFile);
    
    return this.http.post<CsvResponse>(`${this.apiUrl}/upload`, formData, {
      headers: {
        ...this.auth.getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  // Gestion des classes (pour les administrateurs)
  getClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(`${this.apiUrl}/classes`, {
      headers: this.auth.getAuthHeaders()
    });
  }

  // Gestion des enseignants
  getTeachers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/teachers`, {
      headers: this.auth.getAuthHeaders()
    });
  }

  // Gestion des étudiants d'une classe
  getClassStudents(classId: number): Observable<User[]> {
  return this.http.get<User[]>(`${this.apiUrl}/users`, {
    headers: this.auth.getAuthHeaders(),
    params: new HttpParams()
      .set('role', 'student')
      .set('class_id', classId.toString())
  });
}
}
