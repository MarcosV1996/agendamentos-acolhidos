import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false; 

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    this.isLoading = true; 
      
    // Obtendo o token CSRF do meta tag
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    // Configurando os headers com o token CSRF
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken
    });

    const loginData = {
      username: this.username,
      password: this.password
    };

    // Enviando a requisição de login com o token CSRF nos headers
    this.http.post('http://127.0.0.1:8000/login', loginData, {
      headers: headers,
      withCredentials: true 
    }).subscribe(response => {
      console.log(response);
      this.isLoading = false; // Define isLoading como false quando o login termina
      // Redireciona o usuário após o login bem-sucedido, se necessário
      this.router.navigate(['/home']);
    }, error => {
      console.error(error);
      this.isLoading = false; // Define isLoading como false mesmo em caso de erro
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
