// src/app/services/csrf-token.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsrfTokenService {
  private csrfTokenUrl = 'http://127.0.0.1:8000/csrf-token';

  constructor(private http: HttpClient) {}

  getCsrfToken(): Observable<{ csrf_token: string }> {
    return this.http.get<{ csrf_token: string }>(this.csrfTokenUrl);
  }
}
