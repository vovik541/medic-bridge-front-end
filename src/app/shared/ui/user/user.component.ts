import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
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

interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  login: string;
  isLocked: boolean;
  registrationDate: string;
  imageUrl: string;
  roles: string[];
}

interface ConsultationDto {
  id: number;
  start: string;
  end: string;
  status: string;
  description: string;
  summary?: string;
  meetingLink?: string;
  attachedDocumentUrl?: string;
  doctor: UserDto;
}

@Component({
  selector: 'app-user',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  searchForm!: FormGroup;
  doctors: SpecialistDto[] = [];
  consultations: ConsultationDto[] = [];
  loading = false;
  environment = environment; // Доступ до apiUrl у шаблоні

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      city: ['Київ'],
      language: ['Українська'],
      doctorType: ['Невролог']
    });
    this.loadConsultations();
  }

  openDoctorPage(specialistType: string ,id: number): void {
    const url = `/user/specialist/${specialistType}/${id}`;
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

  loadConsultations(): void {
    this.http.get<{ consultations: ConsultationDto[] }>(
      `${environment.apiUrl}/appointments/my-appointments`
    ).subscribe({
      next: res => this.consultations = res.consultations,
      error: () => alert('Не вдалося завантажити консультації')
    });
  }

  downloadAttachment(fileUrl: string, suggestedName: string = 'документ'): void {
  this.http.get(`${environment.apiUrl}${fileUrl}`, {
    responseType: 'blob',
  }).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = suggestedName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, error => {
    console.error('Помилка при завантаженні файлу', error);
    alert('Не вдалося завантажити файл');
  });
}
}
