import { TestBed } from '@angular/core/testing';

import { ShoutOutService } from './shout-out.service';

describe('ShoutOutService', () => {
  let service: ShoutOutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoutOutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
