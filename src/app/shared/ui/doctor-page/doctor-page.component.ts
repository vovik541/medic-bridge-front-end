import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorConsultationService, ConsultationForDoctorDto } from './doctor-consultation.service';

@Component({
  selector: 'app-doctor-page',
  standalone: true,
  imports: [CommonModule], // додай свої модулі, якщо потрібно
  templateUrl: './doctor-page.component.html',
  styleUrls: ['./doctor-page.component.css']
})
export class DoctorPageComponent implements OnInit {
  approved: ConsultationForDoctorDto[] = [];
  unapproved: ConsultationForDoctorDto[] = [];
  past: ConsultationForDoctorDto[] = [];
  rejected: ConsultationForDoctorDto[] = [];
  toReview: ConsultationForDoctorDto[] = [];

  constructor(private consultationService: DoctorConsultationService) {}

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
    // TODO: реалізуй модальне вікно підтвердження
    console.log('Confirm:', consultation);
  }

  openCancelModal(consultation: ConsultationForDoctorDto): void {
    // TODO: реалізуй модальне вікно скасування
    console.log('Cancel:', consultation);
  }

  openReviewModal(consultation: ConsultationForDoctorDto): void {
    // TODO: реалізуй модальне вікно для оцінки консультації
    console.log('Review:', consultation);
  }
}
