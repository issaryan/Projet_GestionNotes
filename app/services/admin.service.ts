import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// Interfaces TypeScript
export interface User {
  id: number;
  username: string;
  role: 'admin' | 'teacher' | 'student';
  nom?: string;
  prenom?: string;
  email?: string;
  class_id?: number;
  status?: 'Actif' | 'Inactif';
}

export interface Class {
  id: number;
  name: string;
  level: string;
  academic_year: string;
  student_count: number;
}

export interface Teacher {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  subject_count: number;
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

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = '/api';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  // Gestion des utilisateurs
  getUsers(searchTerm: string = ''): Observable<User[]> {
    const params = new HttpParams().set('search', searchTerm);
    return this.http.get<User[]>(`${this.apiUrl}/users`, {
      headers: this.auth.getAuthHeaders(),
      params
    });
  }

  createUser(userData: UserFormData): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData, {
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

  // Gestion des classes
  getAllClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(`${this.apiUrl}/classes`, {
      headers: this.auth.getAuthHeaders()
    });
  }

  createClass(classData: ClassFormData): Observable<Class> {
    return this.http.post<Class>(`${this.apiUrl}/classes`, classData, {
      headers: this.auth.getAuthHeaders()
    });
  }

  deleteClass(classId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/classes/${classId}`, {
      headers: this.auth.getAuthHeaders()
    });
  }

  // Gestion des enseignants
  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.apiUrl}/teachers`, {
      headers: this.auth.getAuthHeaders()
    });
  }

  // Rapports et exports
  generateClassReport(classId: number, reportType: 'summary' | 'detailed' = 'summary'): Observable<Blob> {
    const params = new HttpParams()
      .set('class_id', classId.toString())
      .set('type', reportType);

    return this.http.get(`${this.apiUrl}/class-report`, {
      headers: this.auth.getAuthHeaders(),
      params,
      responseType: 'blob'
    });
  }

  exportAllData(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export-all`, {
      headers: this.auth.getAuthHeaders(),
      responseType: 'blob'
    });
  }

  // Importations CSV
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
  uploadClassesCsv(csvFile: File): Observable<CsvResponse> {
  const formData = new FormData();
  formData.append('file', csvFile);
  
  return this.http.post<CsvResponse>(`${this.apiUrl}/upload`, formData, {
    headers: {
      ...this.auth.getAuthHeaders(),
      'Content-Type': 'multipart/form-data'
    }
  });
}

  // Administration système
  initDb(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/system/init-db`, {}, {
      headers: this.auth.getAuthHeaders()
    });
  }

  getSystemStats(): Observable<SystemStats> {
    return this.http.get<SystemStats>(`${this.apiUrl}/system/stats`, {
      headers: this.auth.getAuthHeaders()
    });
  }
}

// Interfaces supplémentaires
interface UserFormData {
  username: string;
  password: string;
  role: string;
  nom?: string;
  prenom?: string;
  email?: string;
  class_id?: number;
}

interface ClassFormData {
  name: string;
  level: string;
  academic_year: string;
}

export interface SystemStats {
  total_users: number;
  active_users: number;
  total_classes: number;
  total_grades: number;
  avg_grades: number;
}
