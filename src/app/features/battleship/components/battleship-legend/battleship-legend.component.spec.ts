import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleshipLegendComponent } from './battleship-legend.component';

describe('BattleshipLegendComponent', () => {
  let component: BattleshipLegendComponent;
  let fixture: ComponentFixture<BattleshipLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BattleshipLegendComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BattleshipLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
