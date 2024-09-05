import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, BsDropdownModule, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  constructor(private router: Router) {} 

  isLoggedIn(): boolean {
    // Lógica para verificar se o usuário está logado
    return true; // Exemplo: retornar verdadeiro para simulação
  }

  logout() {
    // Lógica para logout do usuário
    console.log('Usuário deslogado');
  }

  navigateToLogin() {
    this.router.navigate(['/login']); // Navega para a rota de login
  }
}
