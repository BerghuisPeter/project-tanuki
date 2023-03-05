import { Component } from '@angular/core';

@Component({
  selector: 'app-battleship',
  templateUrl: './battleship.component.html',
  styleUrls: ['./battleship.component.css']
})
export class BattleshipComponent {
  board: any[][];
  shipLocations: number[][];
  hits: number[][];
  gameOver: boolean;

  constructor() {
    this.board = this.createBoard(10, 10);
    this.shipLocations = this.placeShips(5, 4, this.board);
    this.hits = [];
    this.gameOver = false;
  }

  fire(event: any) {
    if (this.gameOver) {
      return;
    }

    const row = event.target.parentNode.rowIndex;
    const col = event.target.cellIndex;

    if (this.board[row][col] === 'X' || this.board[row][col] === '*') {
      return;
    }

    if (this.checkHit(row, col)) {
      this.board[row][col] = 'X';
      this.hits.push([row, col]);

      if (this.checkGameOver()) {
        this.gameOver = true;
      }
    } else {
      this.board[row][col] = '*';
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
        row.push('-');
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

      shipLocations.push(...shipLocation);

      if (this.checkCollision(shipLocation, board)) {
        i--;
      } else {
        for (const location of shipLocation) {
          board[location[0]][location[1]] = 'S';
        }
      }
    }

    return shipLocations;
  }

  checkCollision(shipLocation: number[][], board: any[][]): boolean {
    for (const location of shipLocation) {
      if (location[0] >= board.length || location[1] >= board[0].length || board[location[0]][location[1]] === 'S') {
        return true;
      }
    }
    return false;
  }
}
