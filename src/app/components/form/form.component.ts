import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { IbgeService } from '../ibge.service'; 
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Estado {
  id: number;
  nome: string;
  sigla: string;
}

interface Cidade {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxMaskDirective, NgxMaskPipe],
  providers: [IbgeService, provideNgxMask(), DatePipe],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  doNotShowAgain: boolean = false;

  registerForm!: FormGroup;
  dontShowAgain: boolean = false;
  
  selectedFile: File | null = null;
  invalidFile: boolean = false;
  
  successMessage: string = '';
  errorMessage: string = '';
  states: Estado[] = [];
  cidades: Cidade[] = [];
  rulesContent: TemplateRef<any> | null = null;
  initialRulesContent: TemplateRef<any> | null = null;
  today: string | null = null; 

  private readonly ERROR_MESSAGES = {
    invalidFile: 'Arquivo inválido. Apenas arquivos .jpg, .jpeg e .png são aceitos.',
    requiredFields: 'Por favor, preencha todos os campos obrigatórios.',
    registrationSuccess: 'Cadastro realizado com sucesso!',
    registrationError: 'Erro ao realizar o cadastro. Tente novamente.'
  };

  constructor(
    private fb: FormBuilder,
    private locale: IbgeService,
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.today = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
  
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      cpf: ['', [Validators.required, FormComponent.validarCPF]],
      birth_date: ['', Validators.required],
      mother_name: ['', Validators.required], 
      gender: ['', Validators.required],
      arrival_date: ['', Validators.required],
      time: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      phone: [''],
      noPhone: [false],
      foreignCountry: [false], 
      observation: [''],
      photo: ['']
    });
  
    this.loadStates();
    this.checkInitialRulesModal();

    this.registerForm.get('foreignCountry')?.valueChanges.subscribe(isForeign => {
      const stateControl = this.registerForm.get('state');
      const cityControl = this.registerForm.get('city');
      if (isForeign) {
        stateControl?.clearValidators();
        cityControl?.clearValidators();
        stateControl?.disable();
        cityControl?.disable();
      } else {
        stateControl?.setValidators(Validators.required);
        cityControl?.setValidators(Validators.required);
        stateControl?.enable();
        cityControl?.enable();
      }
      stateControl?.updateValueAndValidity();
      cityControl?.updateValueAndValidity();
    });

    this.registerForm.get('noPhone')?.valueChanges.subscribe(noPhone => {
      const phoneControl = this.registerForm.get('phone');
      if (noPhone) {
        phoneControl?.clearValidators();
        phoneControl?.disable();
      } else {
        phoneControl?.setValidators([Validators.required, Validators.pattern(/\(\d{2}\) \d{5}-\d{4}/)]);
        phoneControl?.enable();
      }
      phoneControl?.updateValueAndValidity();
    });
  }

  loadStates() {
    this.locale.getEstados().subscribe({
      next: (states: Estado[]) => (this.states = states),
      error: (error: any) => console.error('Erro ao buscar estados', error),
    });
  }

  onStateChange(event: any) {
    const estadoId = event.target.value;

    if (estadoId) {
      this.locale.getCidadesPorEstado(+estadoId).subscribe({
        next: (cidades: Cidade[]) => (this.cidades = cidades),
        error: (error: any) => console.error('Erro ao buscar cidades', error),
      });
    } else {
      this.cidades = [];
    }
  }

  onFileChange(event: any) {
    const file: File = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (file && allowedTypes.includes(file.type)) {
      this.selectedFile = file;
      this.invalidFile = false;
    } else {
      this.selectedFile = null;
      this.invalidFile = true;
      this.errorMessage = this.ERROR_MESSAGES.invalidFile; // Feedback visual ao usuário
    }
  }

  checkInitialRulesModal() {
    const rulesAccepted = localStorage.getItem('rulesAccepted');
    const dontShowAgain = localStorage.getItem('dontShowRulesAgain') === 'true';

    if (!rulesAccepted && !dontShowAgain && this.initialRulesContent) {
      this.openInitialRulesModal(this.initialRulesContent);
    }
  }

  openInitialRulesModal(content: TemplateRef<any>) {
    const modalRef = this.modalService.open(content, { centered: true });
    modalRef.result.then(
      () => {
        localStorage.setItem('rulesAccepted', 'true');
      },
      () => {}
    );
  }

  openRulesModal(content: TemplateRef<any>) {
    if (content) {
      this.modalService.open(content, { centered: true });
    }
  }

  openRulesAgain() {
    if (this.rulesContent) {
      this.openRulesModal(this.rulesContent);
    }
  }

  toggleDontShowAgain(event: Event) {
    const target = event.target as HTMLInputElement;
    localStorage.setItem('dontShowRulesAgain', target.checked.toString());
  }

  formatName(field: 'name' | 'last_name') {
    const control = this.registerForm.get(field);
    if (control && control.value) {
      const formattedValue = control.value
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      control.setValue(formattedValue);
    }
  }

  static validarCPF(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value;

    if (!cpf) {
        return null;
    }

    const cpfLimpo = cpf.replace(/[^\d]+/g, '');
    if (cpfLimpo.length !== 11) return { invalidCPF: true };

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.substring(9, 10))) return { invalidCPF: true };

    soma = 0;

    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.substring(10, 11))) return { invalidCPF: true };

    return null; 
  }

  onSubmit(content: TemplateRef<any>) {
    if (this.registerForm.valid) {
      if (this.invalidFile) {
        this.errorMessage = this.ERROR_MESSAGES.invalidFile;
        return;
      }
  
      const formData = new FormData();
      formData.append('name', this.registerForm.get('name')?.value);
      formData.append('last_name', this.registerForm.get('last_name')?.value);
      formData.append('cpf', this.registerForm.get('cpf')?.value);
      formData.append('mother_name', this.registerForm.get('mother_name')?.value);
      formData.append('gender', this.registerForm.get('gender')?.value);
      formData.append('date', this.registerForm.get('birth_date')?.value);
      formData.append('arrival_date', this.registerForm.get('arrival_date')?.value);
      formData.append('time', this.registerForm.get('time')?.value);
      formData.append('state', this.getStateName(this.registerForm.get('state')?.value));
      formData.append('city', this.getCityName(this.registerForm.get('city')?.value));
      formData.append('phone', this.registerForm.get('phone')?.value);
      formData.append('observation', this.registerForm.get('observation')?.value);
      if (this.selectedFile) {
        formData.append('photo', this.selectedFile, this.selectedFile.name);
      }
  
      this.http.post('http://127.0.0.1:8000/api/appointments', formData).subscribe({
        next: () => {
          this.successMessage = this.ERROR_MESSAGES.registrationSuccess;
          this.registerForm.reset();
          this.openSuccessModal(content);
        },
        error: () => {
          this.errorMessage = this.ERROR_MESSAGES.registrationError;
        }
      });
    } else {
      this.markInvalidFields();
      this.errorMessage = this.ERROR_MESSAGES.requiredFields;
    }
  }
  
  private markInvalidFields() {
    Object.keys(this.registerForm.controls).forEach((field) => {
      const control = this.registerForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }
  

private getStateName(stateId: string): string {
    const state = this.states.find(s => s.id.toString() === stateId);
    return state ? state.nome : '';
}

private getCityName(cityId: string): string {
    const city = this.cidades.find(c => c.id.toString() === cityId);
    return city ? city.nome : '';
}

  openSuccessModal(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }
}