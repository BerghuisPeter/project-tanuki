import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BattleShipCellStatus } from "../../models/battleship.model";

@Component({
  selector: 'app-battleship-board',
  templateUrl: './battleship-board.component.html',
  styleUrls: ['./battleship-board.component.scss']
})
export class BattleshipBoardComponent {

  @Input() board: BattleShipCellStatus[][] | undefined;
  @Input() disabled: boolean | undefined;

  @Output() fireEvent = new EventEmitter<[number, number]>;

  public BattleShipCellStatus = BattleShipCellStatus;

  fire(rowIndex: number, colIndex: number) {
    if (!this.disabled) {
      this.fireEvent.emit([rowIndex, colIndex]);
    }
  }

}
