import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-specialist-detail',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  template: `
    <full-calendar *ngIf="calendarOptions" [options]="calendarOptions"></full-calendar>
  `,
})
export class SpecialistDetailComponent {
  calendarOptions!: CalendarOptions;

  constructor(private http: HttpClient) {
    this.http.get<any[]>(`${environment.apiUrl}/appointments/1`).subscribe(events => {
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

  handleSlotSelect(selectionInfo: any) {
    const confirmBooking = confirm(`Забронювати з ${selectionInfo.startStr} до ${selectionInfo.endStr}?`);
    if (confirmBooking) {
      this.http.post(`${environment.apiUrl}/appointments/book`, {
        specialistId: 1,
        start: selectionInfo.startStr,
        end: selectionInfo.endStr
      }).subscribe(() => {
        alert('Успішно заброньовано!');
        window.location.reload();
      });
    }
  }
}