import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  isLoggedIn = false;
  userRole: 'admin' | 'teacher' | 'student' | null = null;

  features = {
    admin: [
      {
        title: "Gestion des Utilisateurs",
        description: "Créez et gérez les comptes des enseignants, étudiants et administrateurs",
        icon: "bi-people-fill"
      },
      {
        title: "Gestion des Classes",
        description: "Organisez les classes, assignez les étudiants et enseignants",
        icon: "bi-journal-bookmark-fill"
      },
      {
        title: "Analyses Complets",
        description: "Accédez aux statistiques détaillées et rapports d'activité",
        icon: "bi-graph-up"
      }
    ],
    teacher: [
      {
        title: "Saisie des Notes",
        description: "Enregistrez et modifiez les notes des étudiants facilement",
        icon: "bi-clipboard-data-fill"
      },
      {
        title: "Emploi du Temps",
        description: "Consultez et gérez votre planning de cours",
        icon: "bi-calendar-week-fill"
      },
      {
        title: "Suivi des Élèves",
        description: "Analysez les performances de vos étudiants",
        icon: "bi-person-lines-fill"
      }
    ],
    student: [
      {
        title: "Consultation des Notes",
        description: "Accédez à vos résultats en temps réel",
        icon: "bi-award-fill"
      },
      {
        title: "Emploi du Temps",
        description: "Consultez votre planning hebdomadaire",
        icon: "bi-table"
      },
      {
        title: "Ressources Pédagogiques",
        description: "Accédez aux documents de cours partagés",
        icon: "bi-folder-fill"
      }
    ]
  };

  constructor(private authService: AuthService) {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userRole = this.authService.currentUserValue?.role || null;
  }

  getRoleTitle(role: string): string {
    return {
      'admin': 'Administrateur',
      'teacher': 'Enseignant',
      'student': 'Étudiant'
    }[role] || 'Utilisateur';
  }
}
