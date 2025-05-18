import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-specialist-detail',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormsModule],
  templateUrl: './specialist-detail.component.html',
  styleUrls: ['./specialist-detail.component.css']
})
export class SpecialistDetailComponent {
  @ViewChild('appointmentModal', { static: false }) appointmentModal!: ElementRef;

  calendarOptions!: CalendarOptions;
  specialistId!: number;
  doctorType!: string;
  specialistInfo: any;

  selectedStart!: string;
  selectedEnd!: string;
  description = '';
  summary = '';
  selectedFile: File | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      this.specialistId = Number(params.get('id'));
      this.doctorType = params.get('specialistType') ?? '';
      this.loadSpecialistInfo();
    });
  }

  loadSpecialistInfo(): void {
    this.http.get<any>(`${environment.apiUrl}/users/specialist-info-page`, {
      params: { specialistId: this.specialistId }
    }).subscribe({
      next: (data) => {
        this.specialistInfo = data;
        this.loadCalendar();
      },
      error: (err) => {
        console.error('Не вдалося завантажити інформацію про спеціаліста', err);
      }
    });
  }

  loadCalendar(): void {
    this.http.get<any[]>(`${environment.apiUrl}/appointments/${this.specialistId}`).subscribe(events => {
      this.calendarOptions = {
        initialView: 'timeGridWeek',
        plugins: [timeGridPlugin, interactionPlugin],
        slotMinTime: '08:00:00',
        slotMaxTime: '20:00:00',
        events,
        selectable: true,
        select: this.handleSlotSelect.bind(this),
      };
    });
  }

  handleSlotSelect(selectionInfo: any): void {
    this.selectedStart = selectionInfo.startStr;
    this.selectedEnd = selectionInfo.endStr;
    this.description = '';
    this.summary = '';
    this.selectedFile = null;

    // Відображення модального вікна
    setTimeout(() => {
      this.appointmentModal?.nativeElement?.classList?.remove('visually-hidden');
    });
  }

  closeModal(): void {
    this.appointmentModal?.nativeElement?.classList?.add('visually-hidden');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  submitAppointment(): void {
    const requestBody = {
      specialistId: this.specialistId,
      startTime: this.selectedStart,
      endTime: this.selectedEnd,
      description: this.description,
      summary: this.summary,
      doctorType: this.doctorType
    };

    const formData = new FormData();
    formData.append('appointment', new Blob([JSON.stringify(requestBody)], { type: 'application/json' }));
    if (this.selectedFile) {
      formData.append('attachedDocument', this.selectedFile);
    }

    this.http.post(`${environment.apiUrl}/appointments/book`, formData).subscribe({
      next: () => {
        alert('Успішно заброньовано!');
        this.closeModal();
        window.location.reload();
      },
      error: (err) => {
        console.error('Booking error:', err);
        alert('Помилка під час бронювання');
      }
    });
  }
}
