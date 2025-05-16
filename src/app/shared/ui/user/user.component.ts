import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment'
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
}

@Component({
  selector: 'app-user',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  searchForm!: FormGroup;
  doctors: SpecialistDto[] = [];
  loading = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      city: ['Київ'],
      language: ['Українська'],
      doctorType: ['Дієтолог']
    });
  }
  openDoctorPage(id: number): void {
    const url = `/user/specialist/${id}`;
    window.open(url, '_blank');
  }

  onSearch(): void {
    const payload = this.searchForm.value;
    const params = new HttpParams()
      .set('city', payload.city ?? '')
      .set('language', payload.language ?? '')
      .set('doctorType', payload.doctorType ?? '');

    this.loading = true;

    this.http.get<{ specialists: SpecialistDto[] }>(
      environment.apiUrl + '/users/specialist-search',
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
