import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.login(this.credentials.username, this.credentials.password)
      .subscribe({
        next: () => {
          const user = this.authService.currentUserValue;
          if (user) {
            switch (user.role) {
              case 'admin':
                this.router.navigate(['/admin']);
                break;
              case 'teacher':
                this.router.navigate(['/enseignant']);
                break;
              case 'student':
                this.router.navigate(['/etudiant']);
                break;
              default:
                this.router.navigate(['/']);
            }
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.message || 'Identifiants incorrects';
        },
        complete: () => this.isLoading = false
      });
  }
}
