import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { AuthenticationRequest, AuthService, RegisterRequest } from '../../../core/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-modal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.css'
})
export class RegisterModalComponent {
  @ViewChild('lModalRegister', { static: false }) modal!: ElementRef;

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      login: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      passwordRepeat : ['', Validators.required]
    });
  }

  onSubmitRegister() {
    if (this.registerForm.invalid) return;

    const registrationRequest: RegisterRequest = this.registerForm.value as RegisterRequest;

    this.auth.register(registrationRequest).subscribe({
      next: (res) => {
        this.close();
        this.router.navigate(['/user']);
      },
      error: () => {
        alert('Register failed');
      },
    });
  }

  open() {
    console.log("open register modal")
    this.modal.nativeElement.style.display = 'block';
    this.modal.nativeElement.style.zIndex = 9999;
    this.modal.nativeElement.style.position = 'fixed';
  }

  close() {
    this.modal.nativeElement.style.display = 'none';
  }
}
