import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;
  loading = false;
  passwordVisible = false;
  isAuthenticated: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.isAuthenticated = !!localStorage.getItem('authToken');
  }

  onLogin() {
    this.loginError = null;
    this.loading = true;
  
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
  
      this.http.post<any>('http://127.0.0.1:8000/api/login', { username, password })
        .subscribe(
          (response: any) => {
            this.loading = false;
  
            if (response && response.token) {
              localStorage.setItem('authToken', response.token);
              localStorage.setItem('userRole', response.user.role);
  
              if (response.user.role === 'admin') {
                this.router.navigate(['/appointments-list']);
              } else {
                this.router.navigate(['/home']);
              }
  
              this.isAuthenticated = true;
              this.loginForm.reset();
            } else {
              this.loginError = 'Erro inesperado: Token de autenticação não encontrado.';
              console.error('Token ausente na resposta:', response);
            }
          },
          error => {
            this.loading = false;
            if (error.status === 401) {
              this.loginError = 'Credenciais inválidas. Verifique seu nome de usuário e senha.';
            } else {
              this.loginError = 'Erro ao fazer login. Tente novamente mais tarde.';
            }
            console.error('Erro de login:', error);
          }
        );
    } else {
      this.loading = false;
      this.loginError = 'Por favor, preencha todos os campos.';
    }
  }
  

  logout() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      })
    };

    this.http.post<any>('http://127.0.0.1:8000/api/logout', {}, httpOptions)
      .subscribe(response => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        this.isAuthenticated = false; // Atualiza a variável para refletir o estado de logout
        this.router.navigate(['/login']);
      }, error => {
        console.error('Erro ao fazer logout:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        this.isAuthenticated = false; // Atualiza a variável mesmo em caso de erro
        this.router.navigate(['/login']);
      });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
