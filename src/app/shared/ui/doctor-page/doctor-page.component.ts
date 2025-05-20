import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorConsultationService, ConsultationForDoctorDto } from './doctor-consultation.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-doctor-page',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './doctor-page.component.html',
  styleUrls: ['./doctor-page.component.css']
})
export class DoctorPageComponent implements OnInit {
  approved: ConsultationForDoctorDto[] = [];
  unapproved: ConsultationForDoctorDto[] = [];
  past: ConsultationForDoctorDto[] = [];
  rejected: ConsultationForDoctorDto[] = [];
  toReview: ConsultationForDoctorDto[] = [];
  cancelFormIndex: number | null = null;
  cancelComment: string = '';
  confirmFormIndex: number | null = null;
  confirmComment: string = '';
  confirmLink: string = '';

  constructor(
    private consultationService: DoctorConsultationService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadConsultations();
  }

  private loadConsultations(): void {
    this.consultationService.getApprovedOngoing().subscribe(data => this.approved = data);
    this.consultationService.getUnapprovedOngoing().subscribe(data => this.unapproved = data);
    this.consultationService.getPast().subscribe(data => this.past = data);
    this.consultationService.getRejected().subscribe(data => this.rejected = data);
    this.consultationService.getToReview().subscribe(data => this.toReview = data);
  }

  openConfirmModal(consultation: ConsultationForDoctorDto): void {
    console.log('Confirm:', consultation);
  }

  openCancelModal(consultation: ConsultationForDoctorDto): void {
    console.log('Cancel:', consultation);
  }

  openReviewModal(consultation: ConsultationForDoctorDto): void {
    console.log('Review:', consultation);
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
  toggleConfirmForm(index: number): void {
  this.confirmFormIndex = this.confirmFormIndex === index ? null : index;
  this.confirmComment = '';
  this.confirmLink = '';

  this.cancelFormIndex = null;
  this.cancelComment = '';
}

submitApprove(appointmentId: number, comment: string, appointmentLink: string): void {
  const formData = new FormData();
  formData.append('appointmentId', appointmentId.toString());
  formData.append('message', comment);
  formData.append('appointmentLink', appointmentLink);

  this.http.post(`${environment.apiUrl}/appointments/approve-appointment`, formData)
    .subscribe({
      next: () => {
        this.unapproved = this.unapproved.filter(c => c.id !== appointmentId);
        this.confirmFormIndex = null;
      },
      error: () => {
        alert('Не вдалося підтвердити консультацію.');
      }
    });
}
toggleCancelForm(index: number): void {
  this.cancelFormIndex = this.cancelFormIndex === index ? null : index;
  this.cancelComment = '';

  this.confirmFormIndex = null;
  this.confirmComment = '';
  this.confirmLink = '';
}
submitCancel(appointmentId: number, comment: string): void {
  const formData = new FormData();
  formData.append('appointmentId', appointmentId.toString());
  formData.append('message', comment);

  this.http.post(`${environment.apiUrl}/appointments/cancel-appointment`, formData)
    .subscribe({
      next: () => {
        this.unapproved = this.unapproved.filter(c => c.id !== appointmentId);
        this.approved = this.approved.filter(c => c.id !== appointmentId);
        this.cancelFormIndex = null;
      },
      error: () => {
        alert('Не вдалося скасувати консультацію.');
      }
    });
}
}
