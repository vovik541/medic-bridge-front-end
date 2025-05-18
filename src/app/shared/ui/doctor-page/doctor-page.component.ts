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
}
