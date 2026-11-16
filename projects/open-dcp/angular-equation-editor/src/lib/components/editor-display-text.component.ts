import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { Subject, debounceTime } from 'rxjs';
import { FormattedOption } from '../composable/useOptionFormatter';
import { CompleteOptionsComponent } from './complete-options.component';

@Component({
    selector: 'odcp-editor-display-text',
    standalone: true,
    imports: [
      CdkConnectedOverlay, CdkOverlayOrigin, NgFor, NgIf,
      MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, 
      CompleteOptionsComponent
    ],
    template: `
      <mat-form-field class="suggest-field" subscriptSizing="dynamic" cdkOverlayOrigin #origin="cdkOverlayOrigin">
        <mat-label *ngIf="label">{{ label }}</mat-label>
        <input #inputRef matInput autocomplete="off" [value]="modelValue"
            (focus)="showSuggestions = true" (click)="showSuggestions = true"
            (input)="onInput(inputRef.value)" (keydown.escape)="onEsc()" />
        <button *ngIf="modelValue" matSuffix mat-icon-button type="button" aria-label="Clear" (click)="onClear()">
            <mat-icon>close</mat-icon>
        </button>
      </mat-form-field>

      <ng-template cdkConnectedOverlay [cdkConnectedOverlayOrigin]="origin"
        [cdkConnectedOverlayOpen]="showSuggestions"
        (overlayOutsideClick)="onOutsideClick($event, origin)" (detach)="showSuggestions = false">
        <mat-list class="suggest-panel">
            <odcp-complete-options *ngFor="let option of filteredOptions; trackBy: trackById"
                [item]="{ raw: { type: option.type, label: option.label, subtitle: option.subtitle, data: option.data }, props: option }"
                (click)="onSuggestionClick(option)"></odcp-complete-options>
        </mat-list>
      </ng-template>
    `,
    styles: `
        :host {
            display: block;
        }

        .suggest-field {
            min-width: 200px;
        }

        .suggest-panel {
            min-width: 200px;
            border-radius: 4px;
            background-color: #fff;
            box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 1px 5px rgba(0, 0, 0, 0.12);
        }
    `,
})
export class EditorDisplayTextComponent {
    @Input({ required: true }) modelValue!: string;
    @Input() label?: string;
    @Input() filteredOptions?: FormattedOption[];

    @Output() modelValueChange = new EventEmitter<string>();
    @Output() clear = new EventEmitter<void>();

    @ViewChild('inputRef') private inputRef!: ElementRef<HTMLInputElement>;

    showSuggestions = false;

    private readonly typed = new Subject<string>();

    constructor() {
        this.typed
            .pipe(debounceTime(350), takeUntilDestroyed())
            .subscribe(value => this.modelValueChange.emit(value));
    }

    trackById(_: number, option: FormattedOption) {
        return option.id;
    }

    onInput(value: string): void {
        this.typed.next(value);
    }

    onEsc(): void {
        this.showSuggestions = false;
    }

    onClear(): void {
        this.typed.next('');
        this.clear.emit();
    }

    onOutsideClick(event: MouseEvent, origin: CdkOverlayOrigin): void {
        if (origin.elementRef.nativeElement.contains(event.target as Node)) return;
        this.showSuggestions = false;
    }

    onSuggestionClick(option: FormattedOption): void {
        this.modelValueChange.emit(this.modelValue + option.label);
        this.inputRef.nativeElement.focus();
    }
}