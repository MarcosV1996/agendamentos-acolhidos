import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NationalityService {
  private apiUrl = 'https://restcountries.com/v3.1/all'; // URL da API para obter dados de países

  constructor(private http: HttpClient) {}

  getNationalities(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
