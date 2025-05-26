import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Student, ScheduleEntry, SubjectStats, GradeFormData, EnseignantService, Subject } from '../../services/enseignant.service';
import { ReportsService } from '../../services/reports.service';


@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss']
})
export class TeacherDashboardComponent implements OnInit {
  subjects: Subject[] = [];
  students: Student[] = [];
  schedule: ScheduleEntry[] = [];
  stats: SubjectStats | null = null;
  newGrade: GradeFormData = { student_id: 0, subject_id: 0, grade: 0 };
  selectedSubjectId: number | null = null;
  isLoading = false;

  constructor(
    public authService: AuthService,
    private enseignantService: EnseignantService,
    private reportsService: ReportsService
  ) {}

  ngOnInit(): void {
    this.loadTeacherData();
  }

  private loadTeacherData(): void {
    this.isLoading = true;
    
    this.enseignantService.getSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading subjects:', err);
        this.isLoading = false;
      }
    });

    this.enseignantService.getStudents().subscribe(students => this.students = students);
    this.enseignantService.getSchedule().subscribe(schedule => this.schedule = schedule);
  }

  onSubjectSelect(subjectId: number): void {
    this.selectedSubjectId = subjectId;
    this.enseignantService.getSubjectStats(subjectId).subscribe(stats => this.stats = stats);
  }

  submitGrade(): void {
    if (this.newGrade.grade < 0 || this.newGrade.grade > 20) {
      alert('La note doit être entre 0 et 20');
      return;
    }

    this.enseignantService.addGrade(this.newGrade).subscribe({
      next: () => {
        alert('Note enregistrée avec succès');
        this.newGrade = { student_id: 0, subject_id: 0, grade: 0 };
      },
      error: (err) => console.error('Erreur enregistrement note:', err)
    });
  }

  generateStudentReport(studentId: number): void {
    this.reportsService.generateStudentTranscript(studentId).subscribe(blob => {
      this.reportsService.downloadPdf(blob, `bulletin-${studentId}.pdf`);
    });
  }

  formatTime(entry: ScheduleEntry): string {
    return `${entry.start_time} - ${entry.end_time}`;
  }
}
