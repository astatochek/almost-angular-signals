import { TestBed } from '@angular/core/testing';

import { AngularSignalsService } from './angular-signals.service';

describe('AngularSignalsService', () => {
  let service: AngularSignalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularSignalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
