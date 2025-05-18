import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserConsultationsComponent } from './user-consultations.component';

describe('UserConsultationsComponent', () => {
  let component: UserConsultationsComponent;
  let fixture: ComponentFixture<UserConsultationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserConsultationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserConsultationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
