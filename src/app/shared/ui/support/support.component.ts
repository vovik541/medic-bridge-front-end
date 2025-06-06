import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

interface ApprovalLogDTO {
  approvalLogId: number;
  firstName: string;
  lastName: string;
  imageUrl: string;
  doctorType: string;
  documentUrl: string;
  createdRequestAt: string;
  aboutDescription: string;
}

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css'
})
export class SupportComponent implements OnInit {
  approvalLogs: ApprovalLogDTO[] = [];
  comments: { [id: number]: string } = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<ApprovalLogDTO[]>(`${environment.apiUrl}/support/review-request`)
      .subscribe(data => this.approvalLogs = data);
  }

  getDocumentUrl(relativeUrl: string): string {
    return `${environment.apiUrl}${relativeUrl}`;
  }

  approve(id: number): void {
    const formData = new FormData();
    formData.append('logId', id.toString());
    formData.append('logComment', this.comments[id] || '');

    this.http.get(`${environment.apiUrl}/support/approve-request`, { params: { logId: id.toString(), reviewComment: this.comments[id] } })
      .subscribe(() => {
        this.approvalLogs = this.approvalLogs.filter(log => log.approvalLogId !== id);
      });
  }

  reject(id: number): void {
    this.http.get(`${environment.apiUrl}/support/reject-request`, { params: { logId: id.toString(), reviewComment: this.comments[id] } })
      .subscribe(() => {
        this.approvalLogs = this.approvalLogs.filter(log => log.approvalLogId !== id);
      });
  }
      downloadFile(fileUrl: string, suggestedName: string = 'документ'): void {
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
}
