import { Component, OnDestroy, OnInit } from '@angular/core';
import { BattleShipCellStatus } from "./models/battleship.model";
import * as uuid from 'uuid';
import { BattleshipService } from "./services/battleship.service";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-battleship',
  templateUrl: './battleship.component.html',
  styleUrls: ['./battleship.component.scss']
})
export class BattleshipComponent implements OnInit, OnDestroy {
  myBoard: BattleShipCellStatus[][];
  OpponentBoard: BattleShipCellStatus[][];
  shipLocations: number[][];
  hits: number[][];
  gameOver: boolean;
  rows = 5;
  cols = 5;
  numShips = 4;
  shipLength = 3;

  connection: any;

  myRoomCode: string;
  connected$ = this.battleshipService.connected$;
  connectionError$ = this.battleshipService.connectionError$;
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly battleshipService: BattleshipService) {
    this.myBoard = this.createBoard(this.rows, this.cols);
    this.OpponentBoard = this.createBoard(this.rows, this.cols);
    this.shipLocations = this.placeShips(this.numShips, this.shipLength, this.myBoard);
    this.hits = [];
    this.gameOver = false;

    this.myRoomCode = uuid.v4();
  }

  ngOnInit() {

    this.connection = this.battleshipService.connect();
    // console.log(this.connection);

    this.connected$
      .pipe(takeUntil(this.destroy$))
      .subscribe((v) => {
        console.log('component: Socket', v);
        this.battleshipService.joinBattleshipRoom(this.myRoomCode);
      });

    // this.battleshipService.connectionError$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((val) => {
    //     console.log('component: ERROR!', val);
    //     // handle error;
    //   });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  connectToRoom(roomCode: string) {
    console.log(roomCode);
    this.battleshipService.joinBattleshipRoom(roomCode);
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

  createBoard(rows: number, cols: number): BattleShipCellStatus[][] {
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

  placeShips(numShips: number, shipLength: number, board: BattleShipCellStatus[][]): number[][] {
    const shipLocations = [];
    let i = 0;

    while (i < numShips) {
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
        // Retry placement if collision detected
        continue;
      }

      for (const location of shipLocation) {
        board[location[0]][location[1]] = BattleShipCellStatus.BOAT;
      }
      shipLocations.push(...shipLocation);
      i++; // Increment loop counter only on successful placement
    }

    return shipLocations;
  }

  checkCollision(shipLocation: number[][], board: BattleShipCellStatus[][]): boolean {
    for (const location of shipLocation) {
      if (location[0] >= board.length || location[1] >= board[0].length || board[location[0]][location[1]] === BattleShipCellStatus.BOAT) {
        return true;
      }
    }
    return false;
  }
}
