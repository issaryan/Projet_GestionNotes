import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService, Class, SystemStats, User, Teacher } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats: SystemStats | null = null;
  recentUsers: User[] = [];
  recentClasses: Class[] = [];
  teachers: Teacher[] = [];
  csvFile: File | null = null;
  isLoading = false;

  constructor(
    public adminService: AdminService,
    private reportsService: ReportsService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading = true;
    
    this.adminService.getSystemStats().subscribe(stats => {
      this.stats = stats;
      this.isLoading = false;
    });

    this.adminService.getUsers().subscribe(users => {
      this.recentUsers = users.slice(-5).reverse();
    });

    this.adminService.getAllClasses().subscribe(classes => {
      this.recentClasses = classes.slice(-5).reverse();
    });

    this.adminService.getTeachers().subscribe(teachers => {
      this.teachers = teachers;
    });
  }

  onFileSelected(event: any): void {
    this.csvFile = event.target.files[0];
  }

  uploadUsersCSV(): void {
    if (this.csvFile) {
      this.adminService.uploadUsersCsv(this.csvFile).subscribe({
        next: () => {
          alert('Import réussi !');
          this.loadData();
        },
        error: (err) => console.error('Erreur import:', err)
      });
    }
  }

  generateFullReport(): void {
    this.adminService.exportAllData().subscribe(blob => {
      this.reportsService.downloadPdf(blob, 'rapport-complet.pdf');
    });
  }
}
