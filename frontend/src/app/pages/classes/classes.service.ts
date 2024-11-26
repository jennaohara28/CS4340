import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Class } from './class.model';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  private baseUrl = 'http://localhost:8080/api/classes';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    console.log('Sending userId in headers:', userId);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'userId': userId || ''
    });
  }

  getClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(`${this.baseUrl}/owner`, {
      headers: this.getHeaders(),
    });
  }

  addClass(newClass: Class): Observable<Class> {
    return this.http.post<Class>(this.baseUrl, newClass, {
      headers: this.getHeaders(),
    });
  }

  deleteClass(classId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${classId}`, { withCredentials: true });
  }

  updateClass(updatedClass: Class): Observable<Class> {
    return this.http.put<Class>(`${this.baseUrl}/${updatedClass.id}`, updatedClass, { withCredentials: true });
  }
}
