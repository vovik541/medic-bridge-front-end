import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface SpecialistDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  login: string;
  registrationDate: string;
  imageUrl: string;
  doctorType: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  searchForm!: FormGroup;
  doctors: SpecialistDto[] = [];
  paginatedDoctors: SpecialistDto[] = [];
  doctorTypes: string[] = [];
  languages: string[] = [];
  loading = false;

  pageSize: number = 5;
  currentPage: number = 1;
  totalPages: number = 0;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      city: [''],
      language: ['Українська'],
      doctorType: [''],
      priceFrom: [100],
      priceTo: [300]
    });

    this.loadDoctorTypes();
    this.loadLanguages();
  }

  loadDoctorTypes(): void {
    this.http.get<string[]>(`${environment.apiUrl}/commons/specialist-types`).subscribe({
      next: (types) => {
        this.doctorTypes = types;
        if (types.length > 0) {
          this.searchForm.patchValue({ doctorType: types[0] });
        }
      },
      error: () => alert('Не вдалося завантажити спеціалізації')
    });
  }

  loadLanguages(): void {
    this.http.get<string[]>(`${environment.apiUrl}/commons/languages-types`).subscribe({
      next: (langs) => {
        this.languages = langs;
        if (langs.length > 0) {
          this.searchForm.patchValue({ language: langs[0] });
        }
      },
      error: () => alert('Не вдалося завантажити мови')
    });
  }

  onSearch(): void {
    const payload = this.searchForm.value;
    const params = new HttpParams()
      .set('city', payload.city ?? '')
      .set('language', payload.language ?? '')
      .set('doctorType', payload.doctorType ?? '');

    this.loading = true;

    this.http.get<{ specialists: SpecialistDto[] }>(
      `${environment.apiUrl}/users/specialist-search`,
      { params }
    ).subscribe({
      next: (res) => {
        this.doctors = res.specialists;
        this.currentPage = 1;
        this.totalPages = Math.ceil(this.doctors.length / this.pageSize);
        this.updatePaginatedDoctors();
        this.loading = false;
      },
      error: () => {
        alert('Помилка під час пошуку');
        this.loading = false;
      }
    });
  }

  updatePaginatedDoctors(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedDoctors = this.doctors.slice(startIndex, endIndex);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedDoctors();
    }
  }

    getUserRoles(): string[] {
    const rolesJson = localStorage.getItem('roles');
    return rolesJson ? JSON.parse(rolesJson) : [];
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role.toUpperCase());
  }
}
