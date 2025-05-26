import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EtudiantService, Grade, ScheduleEntry, StudentInfo } from '../../services/etudiant.service';
import { AuthService } from '../../services/auth.service';
import { ReportsService } from '../../services/reports.service';
import { FullUser } from '../../models/models';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
  studentInfo: FullUser | null = null;  grades: Grade[] = [];
  schedule: ScheduleEntry[] = [];
  averageGrade = 0;
  isLoading = false;
  selectedSubject: string | null = null;

  constructor(
    public authService: AuthService,
    public etudiantService: EtudiantService,
    private reportsService: ReportsService
  ) {}

  ngOnInit(): void {
    this.loadStudentData();
  }

  private loadStudentData(): void {
    this.isLoading = true;
    const userId = this.authService.currentUserValue?.id;

    if (userId) {
      this.etudiantService.getUserProfile(userId).subscribe({
        next: (info) => {
          this.studentInfo = info;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading profile:', err);
          this.isLoading = false;
        }
      });

      this.etudiantService.getGrades().subscribe(grades => {
        this.grades = grades;
        this.averageGrade = this.etudiantService.calculateAverage(grades);
      });

      this.etudiantService.getSchedule().subscribe(schedule => {
        this.schedule = schedule;
      });
    }
  }

  downloadTranscript(): void {
    const userId = this.authService.currentUserValue?.id;
    if (userId) {
      this.reportsService.generateStudentTranscript(userId).subscribe(blob => {
        this.reportsService.downloadPdf(blob, `bulletin-${userId}.pdf`);
      });
    }
  }

  filterGradesBySubject(subject: string): void {
    this.selectedSubject = subject;
  }

  get filteredGrades(): Grade[] {
    return this.selectedSubject 
      ? this.grades.filter(g => g.subject === this.selectedSubject)
      : this.grades;
  }

  get uniqueSubjects(): string[] {
    return [...new Set(this.grades.map(g => g.subject))];
  }
}
