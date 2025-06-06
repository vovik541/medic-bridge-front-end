import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../../../core/auth.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { LoginExistsValidatorService, passwordsMatchValidator } from '../../validators/login-exists-validator.service';
import { emailExistsValidator, loginExistsValidator } from '../../validators/unique-user.validator';
import { strongPasswordValidator } from '../../validators/strong-password.validator';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.css',
})

export class RegisterModalComponent {
  @ViewChild('lModalRegister', { static: false }) modal!: ElementRef;

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private loginValidatorService: LoginExistsValidatorService
  ) {
    this.registerForm = this.fb.group({
  firstname: ['', Validators.required],
  lastname: ['', Validators.required],
  login: [
    '', 
    [Validators.required], 
    [loginExistsValidator(this.loginValidatorService)]
  ],
  email: [
    '', 
    [Validators.required, Validators.email], 
    [emailExistsValidator(this.loginValidatorService)]
  ],
  password: ['', [Validators.required, strongPasswordValidator]],
  passwordRepeat: ['', Validators.required],
}, { validators: passwordsMatchValidator });

  }

  open() {
    this.modal.nativeElement.classList.remove('visually-hidden');
  }

  close() {
    this.modal.nativeElement.classList.add('visually-hidden');
  }

  onSubmitRegister() {
    if (this.registerForm.invalid) return;

    const registrationRequest: RegisterRequest = this.registerForm.value as RegisterRequest;

    this.auth.register(registrationRequest).subscribe({
      next: () => {
        this.close();
        this.router.navigate(['/user/search']);
      },
      error: () => {
        alert('Реєстрація не вдалася');
      },
    });
  }
}
