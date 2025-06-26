import { TestBed } from '@angular/core/testing';

import { BattleshipService } from './battleship.service';

describe('BattleshipService', () => {
  let service: BattleshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BattleshipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
