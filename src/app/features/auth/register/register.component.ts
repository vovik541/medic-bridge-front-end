import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  form;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const payload: RegisterRequest = {
      firstname: this.form.value.firstname!,
      lastname: this.form.value.lastname!,
      email: this.form.value.email!,
      password: this.form.value.password!,
    };

    this.auth.register(payload).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        alert('Registration failed');
      },
    });
  }
}
