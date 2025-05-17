import { Component, OnInit } from '@angular/core';
import { DoctorConsultationService, ConsultationForDoctorDto } from './doctor-consultation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-page',
  standalone: true,
  imports: [CommonModule], // додай потрібні імпорти
  templateUrl: './doctor-page.component.html',
  styleUrls: ['./doctor-page.component.css'],
})
export class DoctorPageComponent implements OnInit {
  approved: ConsultationForDoctorDto[] = [];
  unapproved: ConsultationForDoctorDto[] = [];
  past: ConsultationForDoctorDto[] = [];
  rejected: ConsultationForDoctorDto[] = [];

  constructor(private consultationService: DoctorConsultationService) {}

  ngOnInit(): void {
    this.consultationService.getApprovedOngoing().subscribe(data => this.approved = data);
    this.consultationService.getUnapprovedOngoing().subscribe(data => this.unapproved = data);
    this.consultationService.getPast().subscribe(data => this.past = data);
    this.consultationService.getRejected().subscribe(data => this.rejected = data);
  }
}