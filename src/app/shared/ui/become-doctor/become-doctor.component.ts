// become-doctor.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-become-doctor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './become-doctor.component.html',
  styleUrls: ['./become-doctor.component.css']
})
export class BecomeDoctorComponent implements OnInit {
  form!: FormGroup;
  languages: string[] = [];
  doctorTypes: string[] = [];
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      additionalLanguage: ['', Validators.required],
      doctorType: ['', Validators.required],
      aboutMeDescription: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.loadDropdownData();
  }

  loadDropdownData(): void {
    this.http.get<string[]>(`${environment.apiUrl}/commons/specialist-types`)
      .subscribe(data => this.doctorTypes = data);
    this.http.get<string[]>(`${environment.apiUrl}/commons/languages-types`)
      .subscribe(data => this.languages = data);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(this.form.value)], { type: 'application/json' }));
    if (this.selectedFile) {
      formData.append('attachedReviewDocument', this.selectedFile);
    }

    this.http.post(`${environment.apiUrl}/user/review-request`, formData)
      .subscribe({
        next: () => {
          alert('Заявку подано успішно!')
        this.router.navigate(['/settings']);},
        error: () => alert('Помилка при подачі заявки')
      });
  }
}