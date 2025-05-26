import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AdminService, User } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { UserFormData } from '../../models/models';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit, OnDestroy {
  users: User[] = [];
  selectedUser: User | null = null;
  showCreateForm = false;
  searchTerm = '';
  isLoading = false;
  private subscriptions = new Subscription();

  constructor(
    private adminService: AdminService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadUsers(): void {
    this.isLoading = true;
    const sub = this.adminService.getUsers(this.searchTerm).subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.isLoading = false;
      }
    });
    this.subscriptions.add(sub);
  }

  async deleteUser(userId: number): Promise<void> {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await this.adminService.deleteUser(userId).toPromise();
        this.loadUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  }

  openEditModal(user: User): void {
    this.selectedUser = { ...user };
  }

  handleFormSubmit(userData: UserFormData): void {
    if (this.selectedUser?.id) {
      const sub = this.adminService.updateUser(this.selectedUser.id, userData)
        .subscribe(() => {
          this.loadUsers();
          this.resetForm();
        });
      this.subscriptions.add(sub);
    } else {
      const sub = this.adminService.createUser(userData)
        .subscribe(() => {
          this.loadUsers();
          this.resetForm();
        });
      this.subscriptions.add(sub);
    }
  }

  resetForm(): void {
    this.selectedUser = null;
    this.showCreateForm = false;
  }
}
