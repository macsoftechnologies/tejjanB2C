import { TestBed } from '@angular/core/testing';

import { AlrajhiumrahService } from './alrajhiumrah.service';

describe('AlrajhiumrahService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlrajhiumrahService = TestBed.get(AlrajhiumrahService);
    expect(service).toBeTruthy();
  });
});
