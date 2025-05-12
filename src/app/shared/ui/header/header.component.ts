import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-header',
  imports: [LoginModalComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  
  @ViewChild('loginModal', { static: false }) modal!: LoginModalComponent;

  openModal() {
    this.modal.open();
  }
  
  @Output() loginClick = new EventEmitter<void>();

  onLoginClick() {
    this.loginClick.emit();
  }
}
