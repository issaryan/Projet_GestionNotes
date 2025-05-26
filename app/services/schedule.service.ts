import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ScheduleEntry } from './enseignant.service';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private apiUrl = '/api';
  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}
  getClassSchedule(classId: number): Observable<ScheduleEntry[]> {
    return this.http.get<ScheduleEntry[]>(`${this.apiUrl}/schedule`, {
      headers: this.auth.getAuthHeaders(),
      params: new HttpParams().set('class_id', classId.toString())
    });
  }
  updateSchedule(entries: ScheduleEntry[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/schedule`, entries, {
      headers: this.auth.getAuthHeaders()
    });
  }
}
