import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from './admin.service';
import { FullUser } from '../models/models';

// Interfaces TypeScript
export interface Grade {
  subject: string;
  grade: number;
  evaluation_date: string;
  teacher: string;
  class_name: string;
}

export interface ScheduleEntry {
  subject: string;
  day: string;
  start_time: string;
  end_time: string;
  class_name: string;
}

export interface StudentInfo {
  nom: string;
  prenom: string;
  email: string;
  class_name: string;
  last_login: string;
}

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {
  private apiUrl = '/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Récupérer les notes de l'étudiant
  getGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/grades`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getSchedule(): Observable<ScheduleEntry[]> {
  return this.http.get<ScheduleEntry[]>(`${this.apiUrl}/schedule`, {
    headers: this.authService.getAuthHeaders()
  });
}
// Modification de getUserProfile
getUserProfile(userId: number): Observable<FullUser> {
  return this.http.get<FullUser>(`${this.apiUrl}/users/${userId}`, {
    headers: this.authService.getAuthHeaders()
  });
}

  // Calculer la moyenne générale
  calculateAverage(grades: Grade[]): number {
    if (!grades || grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + grade.grade, 0);
    return parseFloat((total / grades.length).toFixed(2));
  }

  // Formater l'horaire pour l'affichage
  formatScheduleTime(entry: ScheduleEntry): string {
    return `${entry.start_time} - ${entry.end_time}`;
  }
}

// Exemple d'utilisation dans un composant :
/*
@Component({...})
export class StudentGradesComponent implements OnInit {
  grades: Grade[] = [];
  average = 0;

  constructor(private etudiantService: EtudiantService) {}

  ngOnInit() {
    this.etudiantService.getGrades().subscribe({
      next: (grades) => {
        this.grades = grades;
        this.average = this.etudiantService.calculateAverage(grades);
      },
      error: (err) => console.error('Erreur récupération notes:', err)
    });
  }
}
*/

// Version étendue avec plus de fonctionnalités
@Injectable({
  providedIn: 'root'
})
export class EnhancedEtudiantService extends EtudiantService {
  // Suivi des progrès par matière
  getSubjectProgress(grades: Grade[]): Map<string, { count: number, total: number }> {
    const progress = new Map<string, { count: number, total: number }>();
    
    grades.forEach(grade => {
      if (!progress.has(grade.subject)) {
        progress.set(grade.subject, { count: 1, total: grade.grade });
      } else {
        const current = progress.get(grade.subject);
        if (current) {
          current.count++;
          current.total += grade.grade;
        }
      }
    });
    
    return progress;
  }

  // Prévision de la moyenne nécessaire
  predictTargetAverage(currentGrades: Grade[], targetAverage: number, remainingGrades: number): number {
    if (remainingGrades <= 0 || !currentGrades?.length) return 0;
    
    const currentTotal = currentGrades.reduce((sum, grade) => sum + grade.grade, 0);
    const neededTotal = targetAverage * (currentGrades.length + remainingGrades) - currentTotal;
    
    return parseFloat(Math.max(0, neededTotal / remainingGrades).toFixed(2));
  }

  // Générer un calendrier des évaluations
  generateEvaluationCalendar(grades: Grade[]): Map<string, Grade[]> {
    const calendar = new Map<string, Grade[]>();
    
    grades.forEach(grade => {
      const dateKey = grade.evaluation_date; 
      if (!calendar.has(dateKey)) {
        calendar.set(dateKey, [grade]);
      } else {
        calendar.get(dateKey)?.push(grade);
      }
    });
    
    return calendar;
  }
}
