import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicianComponent } from './physician.component';

describe('PhysicianComponent', () => {
  let component: PhysicianComponent;
  let fixture: ComponentFixture<PhysicianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhysicianComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
