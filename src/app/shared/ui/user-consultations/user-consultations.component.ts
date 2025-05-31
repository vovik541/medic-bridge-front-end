import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  comment: string;
}

@Component({
  selector: 'app-user-consultations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-consultations.component.html',
  styleUrls: ['./user-consultations.component.css']
})
export class UserConsultationsComponent implements OnInit {
  consultations: ConsultationDto[] = [];
  consultationsToBeApproved: ConsultationDto[] = [];

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
    this.http.get<{ consultations: ConsultationDto[] }>(`${environment.apiUrl}/appointments/to-approve`)
    .subscribe({
      next: res => this.consultationsToBeApproved = res.consultations,
      error: () => alert('Не вдалося завантажити консультації для підтвердження')
    });
  }

  downloadAttachment(fileUrl: string, suggestedName: string = 'документ'): void {
    this.http.get(`${environment.apiUrl}/files/${fileUrl}`, {
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

  updateStatus(consultationId: number, newStatus: 'CONFIRMED' | 'CANCELED'): void {
  const payload = {
    appointmentId: consultationId,
    newStatus
  };

  this.http.post(`${environment.apiUrl}/appointments/update-status-user-choice`, payload)
    .subscribe({
      next: () => {
        this.consultationsToBeApproved = this.consultationsToBeApproved.filter(c => c.id !== consultationId);
        alert('Статус консультації оновлено');
        this.loadConsultations();
      },
      error: () => alert('Не вдалося оновити статус консультації')
    });
}
}
