import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
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
export class NavBarComponent implements OnInit {
  userRole: string | null = null;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.updateUserRole(); // Agora a função é chamada dentro do ngOnInit, após o componente ser inicializado
  }

  // Atualiza o papel do usuário
  updateUserRole() {
    this.userRole = localStorage.getItem('userRole');
    this.cdr.detectChanges(); // Força a detecção de mudanças no template
  }

  // Verifica se o usuário está logado
  isLoggedIn(): boolean {
    const isLogged = !!localStorage.getItem('authToken');
    return isLogged;
  }

  // Verifica se o usuário é um administrador
  isAdmin(): boolean {
    const role = localStorage.getItem('userRole');
    return role === 'admin';
  }

  // Função para realizar o logout
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole'); // Remove o papel do usuário ao deslogar
    console.log('Usuário deslogado');
    this.router.navigate(['/login']);
    window.location.reload(); // Recarrega a página para atualizar o estado do navbar
  }

  // Função para navegar para a tela de login
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
