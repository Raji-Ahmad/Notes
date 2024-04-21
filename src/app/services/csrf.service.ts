// csrf.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import {baseURL} from "../globals";

@Injectable({
  providedIn: 'root',
})
export class CsrfService {
  private csrfTokenSubject = new BehaviorSubject<string>('');
  csrfToken$: Observable<string> = this.csrfTokenSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchCsrfToken();
  }

  private fetchCsrfToken(): void {
    this.http.get<any>(baseURL + "/api/get-csrf-token").subscribe(response => {
      const csrfToken = response.csrftoken;
      this.csrfTokenSubject.next(csrfToken);
    });
  }

  getCsrfToken(): Observable<string> {
    return this.csrfToken$;
  }
}
