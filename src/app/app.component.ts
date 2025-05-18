import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/ui/header/header.component';
import { FooterComponent } from './shared/ui/footer/footer.component';
import { UserComponent } from './shared/ui/user/user.component';
import { AdminComponent } from './shared/ui/admin/admin.component';
import { PhysicianComponent } from './shared/ui/physician/physician.component';
import { SupportComponent } from './shared/ui/support/support.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, UserComponent, AdminComponent, PhysicianComponent, SupportComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 
  

}
