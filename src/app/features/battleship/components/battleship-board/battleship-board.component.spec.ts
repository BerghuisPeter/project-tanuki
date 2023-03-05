import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleshipBoardComponent } from './battleship-board.component';

describe('BattleshipBoardComponent', () => {
  let component: BattleshipBoardComponent;
  let fixture: ComponentFixture<BattleshipBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BattleshipBoardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BattleshipBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
