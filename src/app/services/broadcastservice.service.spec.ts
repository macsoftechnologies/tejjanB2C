import { TestBed } from '@angular/core/testing';

import { BroadcastserviceService } from './broadcastservice.service';

describe('BroadcastserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BroadcastserviceService = TestBed.get(BroadcastserviceService);
    expect(service).toBeTruthy();
  });
});
