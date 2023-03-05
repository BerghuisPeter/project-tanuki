import { Component } from '@angular/core';
import { BattleShipCellStatus } from "./models/battleship.model";

@Component({
  selector: 'app-battleship',
  templateUrl: './battleship.component.html',
  styleUrls: ['./battleship.component.scss']
})
export class BattleshipComponent {
  myBoard: any[][];
  OpponentBoard: any[][];
  shipLocations: number[][];
  hits: number[][];
  gameOver: boolean;
  rows = 5;
  cols = 5;
  numShips = 4;
  shipLength = 3;

  constructor() {
    this.myBoard = this.createBoard(this.rows, this.cols);
    this.OpponentBoard = this.createBoard(this.rows, this.cols);
    this.shipLocations = this.placeShips(this.numShips, this.shipLength, this.myBoard);
    this.hits = [];
    this.gameOver = false;
  }

  fire(rowCol: number[]) {
    if (this.gameOver) {
      return;
    }

    const row = rowCol[0];
    const col = rowCol[1];

    if (this.myBoard[row][col] === BattleShipCellStatus.HIT || this.myBoard[row][col] === BattleShipCellStatus.MISS) {
      return;
    }

    if (this.checkHit(row, col)) {
      this.myBoard[row][col] = BattleShipCellStatus.HIT;
      this.hits.push([row, col]);

      if (this.checkGameOver()) {
        this.gameOver = true;
      }
    } else {
      this.myBoard[row][col] = BattleShipCellStatus.MISS;
    }
  }

  checkHit(row: number, col: number): boolean {
    for (const location of this.shipLocations) {
      if (location[0] === row && location[1] === col) {
        return true;
      }
    }
    return false;
  }

  checkGameOver(): boolean {
    for (const location of this.shipLocations) {
      let hit = false;
      for (const hitLocation of this.hits) {
        if (location[0] === hitLocation[0] && location[1] === hitLocation[1]) {
          hit = true;
          break;
        }
      }
      if (!hit) {
        return false;
      }
    }
    return true;
  }

  createBoard(rows: number, cols: number): any[][] {
    const board = [];

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push(BattleShipCellStatus.IDLE);
      }
      board.push(row);
    }
    return board;
  }

  placeShips(numShips: number, shipLength: number, board: any[][]): number[][] {
    const shipLocations = [];

    for (let i = 0; i < numShips; i++) {
      let row = Math.floor(Math.random() * board.length);
      let col = Math.floor(Math.random() * board[0].length);

      const direction = Math.floor(Math.random() * 2);

      const shipLocation = [];

      for (let j = 0; j < shipLength; j++) {
        shipLocation.push([row, col]);
        if (direction === 0) {
          col++;
        } else {
          row++;
        }
      }

      if (this.checkCollision(shipLocation, board)) {
        i--;
      } else {
        for (const location of shipLocation) {
          board[location[0]][location[1]] = BattleShipCellStatus.BOAT;
        }
        shipLocations.push(...shipLocation);
      }
    }
    return shipLocations;
  }

  checkCollision(shipLocation: number[][], board: any[][]): boolean {
    for (const location of shipLocation) {
      if (location[0] >= board.length || location[1] >= board[0].length || board[location[0]][location[1]] === BattleShipCellStatus.BOAT) {
        return true;
      }
    }
    return false;
  }
}
