import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ потрібен для пайпів (наприклад, 'date')
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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
  selector: 'app-user-consultations',
  standalone: true,
  imports: [CommonModule], // ✅ додаємо тут
  templateUrl: './user-consultations.component.html',
  styleUrls: ['./user-consultations.component.css']
})
export class UserConsultationsComponent implements OnInit {
  consultations: ConsultationDto[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadConsultations();
  }

  loadConsultations(): void {
    this.http.get<{ consultations: ConsultationDto[] }>(`${environment.apiUrl}/appointments/my-appointments`)
      .subscribe({
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
