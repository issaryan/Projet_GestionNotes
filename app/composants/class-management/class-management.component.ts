import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Class, AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { ClassesService } from '../../services/classes.service';

interface ClassFormData {
  name: string;
  level: string;
  academic_year: string;
}

@Component({
  selector: 'app-class-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './class-management.component.html',
  styleUrls: ['./class-management.component.scss']
})
export class ClassManagementComponent implements OnInit, OnDestroy {
  classes: Class[] = [];
  selectedClass: Class | null = null;
  showCreateForm = false;
  isLoading = false;
  reportType: 'summary' | 'detailed' = 'summary';
  csvUploadMessage = '';
  private subscriptions = new Subscription();

  constructor(
    private classesService: ClassesService,
    private adminService: AdminService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadClasses(): void {
    this.isLoading = true;
    const sub = this.adminService.getAllClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading classes:', err);
        this.isLoading = false;
      }
    });
    this.subscriptions.add(sub);
  }

  async deleteClass(classId: number): Promise<void> {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      try {
        await this.adminService.deleteClass(classId).toPromise();
        this.loadClasses();
      } catch (err) {
        console.error('Error deleting class:', err);
      }
    }
  }

  handleClassFormSubmit(classData: ClassFormData): void {
    if (this.selectedClass?.id) {
      const sub = this.classesService.updateClass(this.selectedClass.id, classData)
        .subscribe(() => {
          this.loadClasses();
          this.resetForm();
        });
      this.subscriptions.add(sub);
    } else {
      const sub = this.classesService.createClass(classData)
        .subscribe(() => {
          this.loadClasses();
          this.resetForm();
        });
      this.subscriptions.add(sub);
    }
  }

  generateClassReport(classId: number): void {
    const sub = this.classesService.generateClassReport(classId, this.reportType)
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport-classe-${classId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
    this.subscriptions.add(sub);
  }

  onCsvUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const sub = this.classesService.uploadClassesCsv(file).subscribe({
        next: (response) => {
          this.csvUploadMessage = `Import réussi : ${response.inserted} classes ajoutées`;
          this.loadClasses();
        },
        error: (err) => {
          this.csvUploadMessage = `Erreur d'import : ${err.error.message}`;
        }
      });
      this.subscriptions.add(sub);
    }
  }

  resetForm(): void {
    this.selectedClass = null;
    this.showCreateForm = false;
  }
}
