import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationRequest, AuthService } from '../../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css'
})
export class LoginModalComponent {
  @ViewChild('lModalLogin', {static: false}) modal!: ElementRef;

  form;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmitLogin() {
    if (this.form.invalid) return;

    const credentials: AuthenticationRequest = {
    email: this.form.value.email!,
    password: this.form.value.password!,
    };

    this.auth.login(credentials).subscribe({
    next: (res) => {
      this.close();
      this.router.navigate(['/user/search']);
    },
    error: () => {
      alert('Login failed');
    },
  });
  }


  open() {
    this.modal.nativeElement.classList.remove('visually-hidden');
  }

  close() {
    this.modal.nativeElement.classList.add('visually-hidden');
  }
}
