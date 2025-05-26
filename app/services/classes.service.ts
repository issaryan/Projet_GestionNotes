import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// Interfaces TypeScript
export interface Class {
  id: number;
  name: string;
  level: string;
  academic_year: string;
  student_count: number;
}

interface ClassFormData {
  name: string;
  level: string;
  academic_year: string;
}

export interface ClassDetails {
  id: number;
  name: string;
  level: string;
  academic_year: string;
  students: Student[];
  subjects: Subject[];
  average_grade?: number;
}

interface Student {
  id: number;
  nom: string;
  prenom: string;
}

interface Subject {
  id: number;
  name: string;
  teacher_name: string;
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
export class ClassesService {
  private apiUrl = '/api';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  // Opérations CRUD de base
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

  updateClass(classId: number, updates: Partial<Class>): Observable<Class> {
    return this.http.put<Class>(`${this.apiUrl}/classes/${classId}`, updates, {
      headers: this.auth.getAuthHeaders()
    });
  }

  deleteClass(classId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/classes/${classId}`, {
      headers: this.auth.getAuthHeaders()
    });
  }



  // Import CSV
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

  // Rapports PDF
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

 

  // Gestion des matières
  addSubjectToClass(classId: number, subjectData: SubjectFormData): Observable<Subject> {
    return this.http.post<Subject>(`${this.apiUrl}/classes/${classId}/subjects`, subjectData, {
      headers: this.auth.getAuthHeaders()
    });
  }

getClassDetails(classId: number): Observable<ClassDetails> {
  return this.http.get<ClassDetails>(`${this.apiUrl}/classes/${classId}`, {
    headers: this.auth.getAuthHeaders(),
    params: new HttpParams().set('details', 'true')
  });
}

getClassStudents(classId: number): Observable<Student[]> {
  return this.http.get<Student[]>(`${this.apiUrl}/classes/${classId}/students`, {
    headers: this.auth.getAuthHeaders()
  });
}

}

// Interfaces supplémentaires
interface ClassFormData {
  name: string;
  level: string;
  academic_year: string;
}

interface SubjectFormData {
  name: string;
  teacher_id: number;
}
