import { NgComponentOutlet, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, Type, ViewChild } from '@angular/core';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EquationEditor, TokenType } from '@open-dcp/equation-editor';
import { ArgumentSeparatorChipComponent } from './chips/argument-separator-chip.component';
import { FunctionChipComponent } from './chips/function-chip.component';
import { MathSymbolChipComponent } from './chips/math-symbol-chip.component';
import { OperatorChipComponent } from './chips/operator-chip.component';
import { ParenthesesChipComponent } from './chips/parentheses-chip.component';
import { StringChipComponent } from './chips/string-chip.component';
import { UnknownChipComponent } from './chips/unknown-chip.component';
import { VariableChipComponent } from './chips/variable-chip.component';
import { DividerOptionComponent } from './options/divider-option.component';
import { FormattedOption } from '../composable/useOptionFormatter';
import { NumericChipComponent } from './chips/numberic-chip.component';
import { CompleteOptionsComponent } from './complete-options.component';

interface ChipToken {
    label: string;
    value: string;
    type: string;
    raw: any;
}

@Component({
    selector: 'odcp-editor-combobox',
    standalone: true,
    imports: [
        NgComponentOutlet, NgFor, NgIf,
        MatAutocompleteModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule,
        DividerOptionComponent, CompleteOptionsComponent
    ],
    template: `
        <mat-form-field class="formula-field" subscriptSizing="dynamic"
            [floatLabel]="chipTokens.length ? 'always' : 'auto'">
            <mat-label *ngIf="label">{{ label }}</mat-label>
            <div class="formula-field__tokens">
                <ng-container *ngFor="let token of chipTokens">
                    <ng-container *ngComponentOutlet="getChipType(token); inputs: { item: token }"></ng-container>
                </ng-container>
                <input #searchInput matInput class="formula-field__input" autocomplete="off"
                    [matAutocomplete]="auto" (input)="search = searchInput.value"
                    (keydown.enter)="onEnter($event)" (keydown.backspace)="onBackspace()" />
            </div>

            <button *ngIf="chipTokens.length || search" matSuffix mat-icon-button type="button"
                aria-label="Clear" (click)="onClear()">
                <mat-icon>close</mat-icon>
            </button>

            <mat-autocomplete #auto="matAutocomplete" (optionSelected)="onOptionSelected($event)">
                <ng-container *ngFor="let option of visibleOptions">
                    <odcp-divider-option *ngIf="option.type === 'divider'; else selectable" [item]="option">
                    </odcp-divider-option>
                    <ng-template #selectable>
                        <mat-option [value]="option">
                            <odcp-complete-options [item]="{ raw: option, props: null }"></odcp-complete-options>
                        </mat-option>
                    </ng-template>
                </ng-container>
            </mat-autocomplete>
        </mat-form-field>
    `,
    styles: `
        :host {
            display: block;
        }

        .formula-field {
            width: 100%;
        }

        .formula-field__tokens {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 4px;
        }

        .formula-field__input {
            flex: 1 1 60px;
            min-width: 60px;
        }
    `,
})
export class EditorComboboxComponent {
    @Input({ required: true }) editor!: EquationEditor;
    @Input({ required: true }) chipTokens!: ChipToken[];
    @Input({ required: true }) filteredOptions!: FormattedOption[];
    @Input() label?: string;

    @Output() tokensChange = new EventEmitter<any[]>();
    @Output() enter = new EventEmitter<string>();
    @Output() clear = new EventEmitter<void>();

    @ViewChild('searchInput') private searchInput!: ElementRef<HTMLInputElement>;

    search = '';

    get visibleOptions(): FormattedOption[] {
        const term = this.search.trim().toLowerCase();
        if (!term) return this.filteredOptions;
        return this.filteredOptions.filter(
            option => option.type === 'divider' || option.label.toLowerCase().includes(term),
        );
    }

    getChipType(item: { type: string }): Type<unknown> {
        if (item.type === TokenType.MathSymbol) return MathSymbolChipComponent;
        if (item.type === TokenType.Parenthesis) return ParenthesesChipComponent;
        if (item.type === TokenType.LeftBracket) return ParenthesesChipComponent;
        if (item.type === TokenType.RightBracket) return ParenthesesChipComponent;
        if (item.type === TokenType.Number) return NumericChipComponent;
        if (item.type === TokenType.Function) return FunctionChipComponent;
        if (item.type === TokenType.ArgumentSeparator) return ArgumentSeparatorChipComponent;
        if (item.type === TokenType.String) return StringChipComponent;
        if (item.type === TokenType.Variable) return VariableChipComponent;
        if (item.type === TokenType.Operator) return OperatorChipComponent;
        return UnknownChipComponent;
    }

    onOptionSelected(event: MatAutocompleteSelectedEvent): void {
        event.option.deselect();
        this.resetSearch();
        this.tokensChange.emit([...this.chipTokens, event.option.value]);
    }

    onEnter(event: Event): void {
        event.preventDefault();
        const input = this.search.trim();
        if (!input) return;
        this.resetSearch();
        this.enter.emit(input);
    }

    onBackspace(): void {
        if (this.search || !this.chipTokens.length) return;
        this.tokensChange.emit(this.chipTokens.slice(0, -1));
    }

    onClear(): void {
        this.resetSearch();
        this.tokensChange.emit([]);
        this.clear.emit();
    }

    private resetSearch(): void {
        this.search = '';
        this.searchInput.nativeElement.value = '';
    }
}