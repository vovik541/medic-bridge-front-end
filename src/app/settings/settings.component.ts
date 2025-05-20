import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  userForm!: FormGroup;
  passwordForm!: FormGroup;
  imageForm!: FormGroup;

  userData: any;
  imagePreviewUrl: string | null = null;

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.loadUserData();

    this.userForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      login: ['']
    });

    this.passwordForm = this.fb.group({
      oldPassword: [''],
      newPassword: ['']
    });

    this.imageForm = this.fb.group({
      image: ['']
    });
  }

  loadUserData() {
    this.http.get<any>(`${environment.apiUrl}/users/user`).subscribe(user => {
      this.userData = user;
      this.userForm.patchValue(user);
      this.imagePreviewUrl = user.imageUrl;
    });
  }

  onUpdateInfo() {
    this.http.put(`${environment.apiUrl}/users/update-profile`, this.userForm.value).subscribe(() => {
      alert('Профіль оновлено');
    });
  }

  onChangePassword() {
    this.http.put(`${environment.apiUrl}/users/change-password`, this.passwordForm.value).subscribe(() => {
      alert('Пароль оновлено');
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      this.http.post(`${environment.apiUrl}/users/upload-photo`, formData).subscribe(() => {
        alert('Фото оновлено');
        this.loadUserData();
      });
    }
  }
}
