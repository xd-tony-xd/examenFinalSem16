import { TestBed } from '@angular/core/testing';

import { Ordenes } from './ordenes';

describe('Ordenes', () => {
  let service: Ordenes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ordenes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
