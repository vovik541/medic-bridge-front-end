import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { AuthService } from '../../../core/auth.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [LoginModalComponent, RegisterModalComponent, RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  
  @ViewChild('loginModal', { static: false }) modalLogin!: LoginModalComponent;
  @ViewChild('registerModal', { static: false }) modalRegister!: RegisterModalComponent;

  openModalLogin() {
    this.modalLogin.open();
  }
  openModalRegister() {
    console.log("register pressed");
    this.modalRegister.open();
  }
    constructor(private auth: AuthService, private router: Router) {}
  logout() {
    this.auth.logout();
    this.router.navigate(['']);
  }

  @Output() loginClick = new EventEmitter<void>();

  onLoginClick() {
    this.loginClick.emit();
  }
  getUserRoles(): string[] {
    const rolesJson = localStorage.getItem('roles');
    return rolesJson ? JSON.parse(rolesJson) : [];
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role.toUpperCase());
  }
}
