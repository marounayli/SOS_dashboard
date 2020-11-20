import { TestBed } from '@angular/core/testing';

import { SOSService } from './sos.service';

describe('SOSService', () => {
  let service: SOSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SOSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
