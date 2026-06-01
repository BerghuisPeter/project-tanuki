import { ChangeDetectionStrategy, Component, effect, forwardRef, input, signal } from '@angular/core';
import { NgStyle } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { debounceTime } from "rxjs";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { toObservable } from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-debounced-search-field-component',
  imports: [
    ReactiveFormsModule,
    NgStyle,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DebouncedSearchFieldComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './debounced-search-field-component.html',
  styleUrl: './debounced-search-field-component.scss',
})
export class DebouncedSearchFieldComponent {
  readonly label = input('Search');
  readonly placeholder = input('');
  readonly icon = input('search');
  readonly debounceMs = input(500);

  readonly value = signal('');
  readonly disabled = signal(false);
  readonly animating = signal(false);

  private readonly value$ = toObservable(this.value);

  constructor() {
    effect(() => {
      const debounceMs = this.debounceMs();

      const sub = this.value$
        .pipe(debounceTime(debounceMs))
        .subscribe(() => {
          this.animating.set(false);
        });

      return () => sub.unsubscribe();
    });
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }

  onInput(value: string): void {
    this.restartAnimation();
    this.value.set(value);
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }

  private onChange: (value: string) => void = () => {
  };

  private onTouched: () => void = () => {
  };

  private restartAnimation(): void {
    this.animating.set(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.animating.set(true);
      });
    });
  }
}
