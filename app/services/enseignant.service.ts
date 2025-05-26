import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// Interfaces TypeScript
export interface Subject {
  id: number;
  name: string;
  class_name: string;
  student_count: number;
}

export interface Student {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  class_name: string;
}

export interface Grade {
  subject: string;
  grade: number;
  evaluation_date: string;
  teacher: string;
  class_name: string;
}

export interface GradeFormData {
  student_id: number;
  subject_id: number;
  grade: number;
  comments?: string;
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
export class EnseignantService {
  private apiUrl = '/api';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  // Gestion des matières
  getSubjects(): Observable<Subject[]> {
  return this.http.get<Subject[]>(`${this.apiUrl}/subjects`, {
    headers: this.auth.getAuthHeaders()
  });
}

  // Gestion des élèves
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/students`, {
      headers: this.auth.getAuthHeaders()
    });
  }

  // Gestion des notes
 addGrade(gradeData: GradeFormData): Observable<{ id: number }> {
  return this.http.post<{ id: number }>(`${this.apiUrl}/grades`, gradeData, {
    headers: this.auth.getAuthHeaders()
  });
}

  getStudentGrades(studentId: number): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/grades/${studentId}`, {
      headers: this.auth.getAuthHeaders()
    });
  }

  // Importation des notes CSV
  uploadGradesCsv(csvFile: File): Observable<CsvResponse> {
    const formData = new FormData();
    formData.append('file', csvFile);
    
    return this.http.post<CsvResponse>(`${this.apiUrl}/upload`, formData, {
      headers: {
        ...this.auth.getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  // Emploi du temps
  getSchedule(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/schedule`, {
      headers: this.auth.getAuthHeaders()
    });
  }

  // Génération de bulletins
  generateStudentReport(studentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/report/student/${studentId}`, {
      headers: this.auth.getAuthHeaders(),
      responseType: 'blob'
    });
  }

  // Statistiques matière
  getSubjectStats(subjectId: number): Observable<SubjectStats> {
  return this.http.get<SubjectStats>(`${this.apiUrl}/subjects/${subjectId}`, {
    headers: this.auth.getAuthHeaders(),
    params: new HttpParams().set('stats', 'true')
  });
}
}

// Interfaces supplémentaires
export interface ScheduleEntry {
  subject: string;
  day: string;
  start_time: string;
  end_time: string;
}

export interface SubjectStats {
  average: number;
  max_grade: number;
  min_grade: number;
  grade_distribution: Array<{ grade: number; count: number }>;
}
