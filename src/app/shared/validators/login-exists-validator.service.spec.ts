import { TestBed } from '@angular/core/testing';

import { LoginExistsValidatorService } from './login-exists-validator.service';

describe('LoginExistsValidatorService', () => {
  let service: LoginExistsValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginExistsValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
