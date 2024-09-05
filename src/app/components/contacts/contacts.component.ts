/* ID8: O aluno demonstrou a compreensão e a aplicação de técnicas de one-way data binding,
 como Interpolation e Property Binding, para exibir e atualizar dados na interface gráfica 
 de maneira unidirecional. */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Adicione esta linha

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent {
  contacts = [
    { 
      nome: 'Assistente Social', 
      email: 'assistentsocial@albergue.com', 
      telefone: '(42)1234-5678', 
      horario: '08:00 às 18:00',
      icone: 'fas fa-user-nurse fa-5x'
    },
    { 
      nome: 'Psicólogo', 
      email: 'psicologo@albergue.com', 
      telefone: '(42) 1234-5678', 
      horario: '08:00 às 18:00',
      icone: 'fas fa-user-md fa-5x'
    },
    { 
      nome: 'Cuidadores', 
      email: 'cuidadores@albergue.com', 
      telefone: '(42)1234-5678', 
      horario: '24 horas',
      icone: 'fas fa-user-friends fa-5x'
    }
  ];
}
