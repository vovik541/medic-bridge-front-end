import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeDoctorComponent } from './become-doctor.component';

describe('BecomeDoctorComponent', () => {
  let component: BecomeDoctorComponent;
  let fixture: ComponentFixture<BecomeDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomeDoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BecomeDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
