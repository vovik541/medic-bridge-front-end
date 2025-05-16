import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { AuthService } from '../../../core/auth.service';
import { Router } from '@angular/router';
import { RegisterModalComponent } from '../register-modal/register-modal.component';

@Component({
  selector: 'app-header',
  imports: [LoginModalComponent, RegisterModalComponent],
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

}
