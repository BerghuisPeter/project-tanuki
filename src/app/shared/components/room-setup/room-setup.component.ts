import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { debounceTime, Subscription } from "rxjs";

@Component({
  selector: 'app-room-setup',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './room-setup.component.html',
  styleUrl: './room-setup.component.scss'
})
export class RoomSetupComponent implements OnDestroy {
  @Input()
  roomCode: string | undefined;
  @Output()
  roomCodeEntered = new EventEmitter<string>();

  roomCodeInputFormControl: FormControl;
  $roomCodeInputObs: Subscription;
  uuid4Regex: RegExp;

  constructor(private _snackBar: MatSnackBar) {
    this.uuid4Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    this.roomCodeInputFormControl = new FormControl<string>('', Validators.pattern(this.uuid4Regex));

    this.$roomCodeInputObs = this.roomCodeInputFormControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((value) => {
        if (value.length == 36 && this.roomCodeInputFormControl.valid) {
          this.roomCodeEntered.emit(value);
          this._snackBar.open('searching', undefined, { duration: 1000 });
        }
      });
  }

  public copyCodeToClipboard() {
    if (typeof this.roomCode === "string") {
      navigator.clipboard.writeText(this.roomCode).then(() => {
        this._snackBar.open('copied!', 'close', { duration: 1500 });
      });
    }
  }

  ngOnDestroy(): void {
    this.$roomCodeInputObs.unsubscribe();
  }

}
