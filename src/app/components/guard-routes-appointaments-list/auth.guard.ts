import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Se o token existe, permite o acesso à rota
      return true;
    } else {
      // Se não houver token, redireciona para a página de login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
