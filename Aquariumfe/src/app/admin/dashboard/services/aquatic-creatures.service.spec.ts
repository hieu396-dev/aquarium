import { TestBed } from '@angular/core/testing';

import { AquaticCreaturesService } from './aquatic-creatures.service';

describe('AquaticCreaturesService', () => {
  let service: AquaticCreaturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AquaticCreaturesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
