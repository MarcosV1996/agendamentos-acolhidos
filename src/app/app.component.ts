// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskDirective } from 'ngx-mask';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { FilterComponent } from './components/filter/filter.component';
import { AboutComponent } from './components/about/about.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { JobsComponent } from './components/jobs/jobs.component';
import { FormComponent } from './components/form/form.component';
import { PartnershipsComponent } from './components/partnerships/partnerships.component';

import { AuthGuard } from './components/guard-routes/auth.guard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    NgxMaskDirective,
    RouterModule,
    RouterOutlet,
    LoginComponent,
    HomeComponent,
    FilterComponent,
    AboutComponent,
    ContactsComponent,
    NavBarComponent,
    FooterComponent,
    JobsComponent,
    FormComponent,
    PartnershipsComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}

const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'contacts', component: ContactsComponent, canActivate: [AuthGuard] },
  { path: 'jobs', component: JobsComponent, canActivate: [AuthGuard] },
  { path: 'form', component: FormComponent, canActivate: [AuthGuard] },
  { path: 'partnerships', component: PartnershipsComponent, canActivate: [AuthGuard] },
  { path: 'filter', component: FilterComponent, canActivate: [AuthGuard] },
];

export const AppRoutingModule = RouterModule.forRoot(appRoutes);
