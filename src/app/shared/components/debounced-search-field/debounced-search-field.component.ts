import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { NgStyle } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { debounceTime } from "rxjs";
import { ControlValueAccessor, NgControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { toObservable } from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-debounced-search-field',
  imports: [
    ReactiveFormsModule,
    NgStyle,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './debounced-search-field.component.html',
  styleUrl: './debounced-search-field.component.scss',
})
export class DebouncedSearchFieldComponent implements ControlValueAccessor {
  readonly label = input('Search');
  readonly placeholder = input('');
  readonly icon = input('search');
  readonly debounceMs = input(500);
  readonly required = input(false);

  readonly value = signal('');
  readonly disabled = signal(false);
  readonly animating = signal(false);

  protected readonly ngControl = inject(NgControl, { optional: true, self: true });

  protected readonly isRequired = computed(() => {
    if (this.required()) {
      return true;
    }

    return this.ngControl?.control?.hasValidator(Validators.required) ?? false;
  });

  private readonly value$ = toObservable(this.value);

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
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

  clear(): void {
    this.value.set('');
    this.onChange('');
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
