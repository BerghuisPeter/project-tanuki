import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { NgStyle } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { debounceTime } from "rxjs";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-debounced-search-field-component',
  imports: [
    ReactiveFormsModule,
    NgStyle,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './debounced-search-field-component.html',
  styleUrl: './debounced-search-field-component.scss',
})
export class DebouncedSearchFieldComponent {
  readonly control = input.required<FormControl>();
  readonly label = input('Search');
  readonly placeholder = input('');
  readonly icon = input('search');
  readonly debounceMs = input(500);

  readonly animating = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      const control = this.control();
      const debounceMs = this.debounceMs();

      control.valueChanges
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          debounceTime(debounceMs),
        )
        .subscribe(() => {
          this.animating.set(false);
        });

      control.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.restartAnimation();
        });
    });
  }

  private restartAnimation(): void {
    this.animating.set(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.animating.set(true);
      });
    });
  }
}
