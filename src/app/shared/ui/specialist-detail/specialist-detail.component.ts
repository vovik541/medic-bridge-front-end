import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-specialist-detail',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  template: `
    <full-calendar *ngIf="calendarOptions" [options]="calendarOptions"></full-calendar>
  `
})
export class SpecialistDetailComponent {
  calendarOptions!: CalendarOptions;
  specialistId!: number;
  doctorType!: string;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      this.specialistId = Number(params.get('id'));
      this.doctorType = params.get('specialistType') ?? '';
      this.loadCalendar();
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
    const confirmBooking = confirm(`Забронювати з ${selectionInfo.startStr} до ${selectionInfo.endStr}?`);
    if (confirmBooking) {
      const requestBody = {
        specialistId: this.specialistId,
        startTime: selectionInfo.startStr, // ISO з зоною, підходить для OffsetDateTime
        endTime: selectionInfo.endStr,
        description: 'Консультація',
        summary: 'Початкова консультація',
        doctorType: this.doctorType
      };

      this.http.post(`${environment.apiUrl}/appointments/book`, requestBody).subscribe({
        next: () => {
          alert('Успішно заброньовано!');
          window.location.reload();
        },
        error: (err) => {
          console.error('Booking error:', err);
          alert('Помилка під час бронювання');
        }
      });
    }
  }
}
