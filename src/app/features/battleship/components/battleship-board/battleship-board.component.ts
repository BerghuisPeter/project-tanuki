import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BattleShipCellStatus } from "../../models/battleship.model";

@Component({
  selector: 'app-battleship-board',
  templateUrl: './battleship-board.component.html',
  styleUrls: ['./battleship-board.component.scss']
})
export class BattleshipBoardComponent {

  @Input() board: any[][] | undefined;
  @Input() yourBoard: boolean | undefined;

  @Output() fireEvent = new EventEmitter<[number, number]>;

  public BattleShipCellStatus = BattleShipCellStatus;

  fire(rowIndex: number, colIndex: number) {
    if (!this.yourBoard) {
      this.fireEvent.emit([rowIndex, colIndex]);
    }
  }

}
