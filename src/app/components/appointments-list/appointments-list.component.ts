import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Appointment } from '../models/appointment.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.css']
})
export class AppointmentsListComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  errorMessage: string = '';
  sortBy: string = 'name-asc';
  searchTerm: string = '';
  editAppointmentData: Appointment = this.initializeEditAppointment();
  isEditing: boolean = false;
  isLoading: boolean = false;
  appointmentToDelete: Appointment | null = null; // Para armazenar o agendamento a ser excluído
  isDeleteModalOpen: boolean = false; // Propriedade para controlar o modal de exclusão

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    const token = localStorage.getItem('authToken');
  
    if (token) {
      this.http.get<Appointment[]>('http://127.0.0.1:8000/api/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe(
        response => {
          console.log('Dados recebidos:', response); // Verifica se additionalInfo está sendo carregado corretamente
          this.appointments = (response || []).filter(appointment => appointment?.name && appointment?.last_name);
          
          // Adicionando dinamicamente a propriedade showMore e inicializando additionalInfo para cada agendamento
          this.appointments.forEach(appointment => {
            appointment.additionalInfo = appointment.additionalInfo || { 
              ethnicity: '-', 
              addictions: '-', 
              is_accompanied: false, 
              benefits: '-', 
              is_lactating: false, 
              has_disability: false, 
              chronic_disease: '-', 
              education_level: '-', 
              nationality: '-', 
              room_id: null, 
              bed_id: null, 
              reason_for_accommodation: '-', 
              has_religion: false, 
              religion: '-', 
              has_chronic_disease: false 
            };
            (appointment as any).showMore = false; // Inicializa como falso
          });
  
          this.applyFilter();
        },
        error => this.handleError('Não foi possível carregar os agendamentos.', error)
      ).add(() => this.isLoading = false);
    } else {
      this.errorMessage = 'Autenticação necessária. Faça login novamente.';
      this.isLoading = false;
      this.router.navigate(['/login']); // Redireciona para login
    }
  }

  handleError(message: string, error: any): void {
    console.error(message, error);
    this.errorMessage = message;
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortBy = target.value;
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredAppointments = this.appointments.filter(appointment => 
      appointment.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      appointment.last_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.sortFilteredAppointments();
  }

  sortFilteredAppointments(): void {
    const sortOrder = this.sortBy.split('-');
    const key = sortOrder[0] as keyof Appointment; // Usando keyof para garantir que a chave seja válida
    const order = sortOrder[1];

    this.filteredAppointments.sort((a, b) => {
      const aValue = key === 'date' ? new Date(a.date).getTime() : String(a[key]).toLowerCase();
      const bValue = key === 'date' ? new Date(b.date).getTime() : String(b[key]).toLowerCase();

      return order === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });
  }

  onSearch(): void {
    this.applyFilter();
  }

  formatPhoneNumber(phone?: string): string {
    if (!phone || phone.length < 10) return '';
    const ddd = phone.slice(0, 2);
    const prefixo = phone.slice(2, 3);
    const numero = phone.slice(3);
    return `(${ddd}) ${prefixo} ${numero.replace(/(\d{4})(\d)/, '$1-$2')}`;
  }

  formatCpf(cpf?: string): string {
    if (!cpf || cpf.length !== 11) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  toCamelCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Função para alternar entre exibir e esconder as informações complementares
  toggleShowMore(appointment: Appointment): void {
    appointment.showMore = !appointment.showMore;
  }

  // Função para formatar strings removendo underline e capitalizando corretamente
  formatString(value: string): string {
    if (!value) return '';
    return value
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Método para abrir o modal de confirmação
  openDeleteModal(appointment: Appointment): void {
    this.appointmentToDelete = appointment;
    this.isDeleteModalOpen = true; // Abre o modal
  }

  confirmDelete(): void {
    if (this.appointmentToDelete) {
      this.deleteAppointment(this.appointmentToDelete.id);
    }
  }

  deleteAppointment(id: number): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.http.delete(`http://127.0.0.1:8000/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe(
        () => {
          this.appointments = this.appointments.filter(appointment => appointment.id !== id);
          this.applyFilter();
          this.closeDeleteModal(); // Fecha o modal após a exclusão
        },
        error => this.handleError('Erro ao deletar agendamento.', error)
      );
    }
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false; // Fecha o modal
    this.appointmentToDelete = null; // Limpa a referência ao agendamento
  }

  // Método para editar agendamento
  editAppointment(appointment: Appointment): void {
    // Inicializa additionalInfo se não estiver definido
    appointment.additionalInfo = appointment.additionalInfo || {
      ethnicity: '',
      addictions: '',
      is_accompanied: false,
      benefits: '',
      is_lactating: false,
      has_disability: false,
      reason_for_accommodation: '',
      has_religion: false,
      religion: '',
      has_chronic_disease: false,
      chronic_disease: '',
      education_level: '',
      nationality: 'Brasileiro',
      room_id: null,
      bed_id: null
    };
  
    this.editAppointmentData = { ...appointment }; // Copia os dados do agendamento para edição
    this.router.navigate(['/edit', appointment.id]); // Navega para a página de edição
  }

  saveEdit(): void {
    if (!this.editAppointmentData) return;

    const token = localStorage.getItem('authToken');
    if (token) {
      this.http.put<Appointment>(`http://127.0.0.1:8000/api/appointments/${this.editAppointmentData.id}`, this.editAppointmentData, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe(
        response => {
          const index = this.appointments.findIndex(a => a.id === this.editAppointmentData!.id);
          if (index !== -1) {
            this.appointments[index] = response;
            this.applyFilter();
          }
          this.closeEditModal();
        },
        error => this.handleError('Erro ao editar agendamento.', error)
      );
    }
  }

  cancelEdit(): void {
    this.closeEditModal();
  }

  closeEditModal(): void {
    this.isEditing = false;
    this.editAppointmentData = this.initializeEditAppointment();
  }

  private initializeEditAppointment(): Appointment {
    return { 
      id: 0,
      name: '', 
      last_name: '', 
      cpf: '', 
      date: '', 
      arrival_date: '', 
      time: '',
      state: '', 
      city: '', 
      mother_name: '', 
      phone: '',
      observation: '',
      photo: null,
      gender: '',
      additionalInfo: { 
        ethnicity: '',
        addictions: '',
        is_accompanied: false,
        benefits: '',
        is_lactating: false,
        has_disability: false,
        reason_for_accommodation: '',
        has_religion: false,
        religion: '',
        has_chronic_disease: false,
        chronic_disease: '',
        education_level: '',
        nationality: 'Brasileiro',
        room_id: null, 
        bed_id: null 
      }
    };
  }

  // Método para lidar com o arquivo selecionado
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.editAppointmentData.photo = file;
    }
  }

  // Método para salvar novo agendamento ou editar existente com foto
  saveAppointment() {
    const formData = new FormData();
    formData.append('name', this.editAppointmentData.name);
    formData.append('last_name', this.editAppointmentData.last_name);
    formData.append('cpf', this.editAppointmentData.cpf);
    formData.append('arrival_date', this.editAppointmentData.arrival_date);
    formData.append('mother_name', this.editAppointmentData.mother_name);
    formData.append('date', this.editAppointmentData.date);
    formData.append('time', this.editAppointmentData.time);
    formData.append('state', this.editAppointmentData.state);
    formData.append('city', this.editAppointmentData.city);
    formData.append('phone', this.editAppointmentData.phone);
    formData.append('observation', this.editAppointmentData.observation);
    formData.append('gender', this.editAppointmentData.gender);

    // Adicione a foto se ela existir
    if (this.editAppointmentData.photo) {
      formData.append('photo', this.editAppointmentData.photo);
    }

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.post('http://127.0.0.1:8000/api/appointments', formData, { headers })
      .subscribe(
        response => {
          console.log('Agendamento salvo com sucesso:', response);
          this.loadAppointments(); // Recarrega os agendamentos após o salvamento
        },
        error => {
          console.error('Erro ao salvar agendamento:', error);
        }
      );
  }
}
