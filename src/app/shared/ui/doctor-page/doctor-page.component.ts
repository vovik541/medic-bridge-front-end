import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorConsultationService, ConsultationForDoctorDto } from './doctor-consultation.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-doctor-page',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './doctor-page.component.html',
  styleUrls: ['./doctor-page.component.css']
})
export class DoctorPageComponent implements OnInit {
  approved: ConsultationForDoctorDto[] = [];
  unapproved: ConsultationForDoctorDto[] = [];
  past: ConsultationForDoctorDto[] = [];
  rejected: ConsultationForDoctorDto[] = [];
  toReview: ConsultationForDoctorDto[] = [];
  rescheduled: ConsultationForDoctorDto[] = [];
  cancelFormIndex: number | null = null;
  cancelComment: string = '';
  confirmFormIndex: number | null = null;
  confirmComment: string = '';
  confirmLink: string = '';
  rescheduleFormIndex: number | null = null;
  rescheduleSelectedSlot: any;
  availableSlots: { [key: number]: any[] } = {};

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
    this.consultationService.getRescheduled().subscribe(data => this.rescheduled = data);
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
  toggleConfirmForm(index: number): void {
  this.confirmFormIndex = this.confirmFormIndex === index ? null : index;
  this.confirmComment = '';
  this.confirmLink = '';

  this.cancelFormIndex = null;
  this.cancelComment = '';
  this.rescheduleFormIndex = null;
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
  console.log('Toggle cancel for index', index);
  this.cancelFormIndex = this.cancelFormIndex === index ? null : index;
  this.cancelComment = '';

  this.confirmFormIndex = null;
  this.confirmComment = '';
  this.confirmLink = '';
  this.rescheduleFormIndex = null;
}
submitCancel(appointmentId: number, comment: string): void {
  console.log('Cancelling', appointmentId, 'with comment', comment);
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

  toggleRescheduleForm(consultation: ConsultationForDoctorDto): void {
    this.rescheduleFormIndex = this.rescheduleFormIndex === consultation.id ? null : consultation.id;
    this.rescheduleSelectedSlot = null;
    const date = consultation.start;
    this.loadAvailableSlots(consultation.id, date);
    this.cancelFormIndex = null;
    this.confirmFormIndex = null;
  }

  loadAvailableSlots(appointmentId: number, date: string): void {
    this.http.get<any[]>(`${environment.apiUrl}/appointments/available/${appointmentId}`, {
      params: { date }
    }).subscribe({
      next: slots => this.availableSlots[appointmentId] = slots,
      error: err => console.error('Не вдалося завантажити слоти', err)
    });
  }

  submitReschedule(appointmentId: number): void {
  if (!this.rescheduleSelectedSlot) return;

  const payload = {
    appointmentId,
    newStart: this.rescheduleSelectedSlot.start,
    newEnd: this.rescheduleSelectedSlot.end
  };

  this.http.post(`${environment.apiUrl}/appointments/reschedule`, payload)
    .subscribe({
      next: () => {
        alert('Консультацію перенесено');
        this.rescheduleFormIndex = null;
        this.loadConsultations();
      },
      error: () => alert('Не вдалося перенести консультацію')
    });
}


  trackBySlot(index: number, slot: any): string {
    return `${slot.start}-${slot.end}`;
  }
}
