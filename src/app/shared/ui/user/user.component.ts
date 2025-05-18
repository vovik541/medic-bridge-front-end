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
  doctorTypes: string[] = [];
  loading = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      city: ['Київ'],
      language: ['Українська'],
      doctorType: ['']
    });

    this.loadDoctorTypes();
  }

  loadDoctorTypes(): void {
    this.http.get<string[]>(`${environment.apiUrl}/commons/specialist-types`)
      .subscribe({
        next: (types) => {
          this.doctorTypes = types;
          if (types.length > 0) {
            this.searchForm.patchValue({ doctorType: types[0] }); // встановлюємо перший тип за замовчуванням
          }
        },
        error: () => {
          alert('Не вдалося завантажити спеціалізації');
        }
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
        this.loading = false;
      },
      error: () => {
        alert('Помилка під час пошуку');
        this.loading = false;
      }
    });
  }
}
