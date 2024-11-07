import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Class } from './class.model';
import {AuthService} from "../../components/auth.service";

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  private baseUrl = 'http://localhost:8080/api/classes';

  constructor(private http: HttpClient) {}

  getClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(`${this.baseUrl}/owner/${AuthService.getUserId()}`);
  }

  addClass(newClass: Class): Observable<Class> {
    return this.http.post<Class>(this.baseUrl, newClass);
  }

  // Other methods...
  deleteClass(classId: number) {
    return this.http.delete<void>(`${this.baseUrl}/${classId}`)
  }
}
