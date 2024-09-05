// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { FormComponent } from './components/form/form.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { AboutComponent } from './components/about/about.component';
import { JobsComponent } from './components/jobs/jobs.component';
import { PrayerComponent } from './components/prayer/prayer.component';
import { PartnershipsComponent } from './components/partnerships/partnerships.component';
import { FilterComponent } from './components/filter/filter.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'appointments', component: FormComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'jobs', component: JobsComponent },
  { path: 'prayer', component: PrayerComponent },
  { path: 'partnerships', component: PartnershipsComponent },
  { path: 'filter', component: FilterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
];
