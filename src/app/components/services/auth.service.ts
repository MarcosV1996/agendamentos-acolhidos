import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // Método de autenticação de exemplo
  login(username: string, password: string): Promise<any> {
    // Aqui você pode implementar a chamada ao backend para autenticar
    return new Promise((resolve, reject) => {
      if (username === 'admin' && password === 'admin') {
        resolve({ success: true });
      } else {
        reject({ error: 'Invalid credentials' });
      }
    });
  }
}
