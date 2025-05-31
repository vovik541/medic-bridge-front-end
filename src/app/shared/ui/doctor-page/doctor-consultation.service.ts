import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserDto {
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

export interface ConsultationForDoctorDto {
  id: number;
  start: string;
  end: string;
  status: string;
  description: string;
  summary: string;
  user: UserDto;
  meetingLink: string;
  attachedDocumentUrl: string;
  doctorComment: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorConsultationService {

  constructor(private http: HttpClient) {}

  getApprovedOngoing(): Observable<ConsultationForDoctorDto[]> {
    return this.http.get<ConsultationForDoctorDto[]>(`${environment.apiUrl}/doctor/appointments/ongoing-approved`);
  }

  getUnapprovedOngoing(): Observable<ConsultationForDoctorDto[]> {
    return this.http.get<ConsultationForDoctorDto[]>(`${environment.apiUrl}/doctor/appointments/ongoing-upApproved`);
  }

  getPast(): Observable<ConsultationForDoctorDto[]> {
    return this.http.get<ConsultationForDoctorDto[]>(`${environment.apiUrl}/doctor/appointments/past`);
  }

  getRejected(): Observable<ConsultationForDoctorDto[]> {
    return this.http.get<ConsultationForDoctorDto[]>(`${environment.apiUrl}/doctor/appointments/rejected`);
  }
  getToReview(): Observable<ConsultationForDoctorDto[]> {
  return this.http.get<ConsultationForDoctorDto[]>(`${environment.apiUrl}/doctor/appointments/to-review`);
  }
  
  getRescheduled(): Observable<ConsultationForDoctorDto[]> {
    return this.http.get<ConsultationForDoctorDto[]>(`${environment.apiUrl}/doctor/appointments/rescheduled`);
  }
}
