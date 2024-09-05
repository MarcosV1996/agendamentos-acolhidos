import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms'; // Importe AbstractControl e ValidationErrors do @angular/forms
import { IbgeService } from '../ibge.service'; 
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { cpf } from 'cpf-cnpj-validator'; 
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

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
  imports: [NgbTooltipModule, NgxMaskDirective,NgxMaskPipe, CommonModule, ReactiveFormsModule],
  providers: [IbgeService, provideNgxMask(), NgbTooltipModule,],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
  registerForm!: FormGroup;

  states: Estado[] = [];
  cidades: Cidade[] = []; 

  constructor(
    private fb: FormBuilder,
    private locale: IbgeService,
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      cpf: ['', [Validators.required, validarCPF]], 
      mother_name: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required],
      observation: ['', Validators.required],
    });

    this.loadStates();
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
        next: (cities: Cidade[]) => (this.cidades = cities),
        error: (error: any) => console.error('Erro ao buscar cidades', error),
      });
    } else {
      this.cidades = []; 
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
    } else {
     
    }
  }
}

function validarCPF(control: AbstractControl): ValidationErrors | null { 
  if (!cpf.isValid(control.value)) {
    return { cpfInvalido: true };
  }
  return null;
}

