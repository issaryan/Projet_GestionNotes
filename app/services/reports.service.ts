import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ReportParams {
  classId: number;
  reportType: 'summary' | 'detailed';
}
export interface ClassReportParams {
  classId: number;
  reportType: 'summary' | 'detailed' | 'grades';
}


@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = '/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Génère un bulletin scolaire pour un étudiant
   * @param studentId ID de l'étudiant
   * @returns PDF sous forme de Blob
   */
  generateStudentTranscript(studentId: number): Observable<Blob> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/report/student/${studentId}`, {
      headers,
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Génère un rapport de classe
   * @param params Paramètres du rapport {classId, reportType}
   * @returns PDF sous forme de Blob
   */
  generateClassReport(params: ClassReportParams): Observable<Blob> {
  const httpParams = new HttpParams()
    .set('class_id', params.classId.toString())
    .set('type', params.reportType);
  return this.http.get(`${this.apiUrl}/class-report`, {
    headers: this.authService.getAuthHeaders(),
    params: httpParams,
    responseType: 'blob'
  });
}

  /**
   * Télécharge un fichier PDF depuis un Blob
   * @param blob Données PDF
   * @param filename Nom du fichier
   */
  downloadPdf(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Erreur inconnue';
    if (error.error instanceof Blob) {
      // Gestion des erreurs PDF
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const err = JSON.parse(e.target.result);
          errorMessage = err.error || 'Erreur de génération du rapport';
        } catch (e) {
          errorMessage = 'Format d\'erreur inconnu';
        }
      };
      reader.readAsText(error.error);
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    console.error('Erreur ReportsService:', error);
    return throwError(() => new Error(errorMessage));
  }
}
