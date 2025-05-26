// models.ts
export interface FullUser {
  id: number;
  username: string;
  role: 'admin' | 'teacher' | 'student';
  nom: string;
  prenom: string;
  email: string;
  class_id?: number;
  last_login: string;
  status?: 'Actif' | 'Inactif';
}

export interface ClassDetails {
  id: number;
  name: string;
  level: string;
  academic_year: string;
  student_count: number;
  subjects: Subject[];
  teachers: Teacher[];
  average_grade: number;
}

export interface Subject {
  id: number;
  name: string;
  teacher_id: number;
  class_id: number;
  teacher_name?: string; 
  class_name?: string;   
}

// Interface pour un enseignant
export interface Teacher {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  subjects_count?: number;
}

// Interface utilisateur complète
export interface FullUser {
  id: number;
  username: string;
  role: 'admin' | 'teacher' | 'student';
  nom: string;
  prenom: string;
  email: string;
  class_id?: number;
  last_login: string;
  status?: 'Actif' | 'Inactif';
  class_name: string;
}

// Interface pour les détails de classe
export interface ClassDetails {
  id: number;
  name: string;
  level: string;
  academic_year: string;
  student_count: number;
  subjects: Subject[];
  teachers: Teacher[];
  average_grade: number;
}

// Interface pour les données de formulaire utilisateur
export interface UserFormData {
  username: string;
  password: string;
  role: 'admin' | 'teacher' | 'student';
  nom?: string;
  prenom?: string;
  email?: string;
  class_id?: number;
}
export interface Grade {
  id: number;
  subject: string;
  grade: number;
  comments: string;
  evaluation_date: string;
  student_id: number;
}
export interface Subject {
  id: number;
  name: string;
  class_id: number;
  teacher_id: number;
}
