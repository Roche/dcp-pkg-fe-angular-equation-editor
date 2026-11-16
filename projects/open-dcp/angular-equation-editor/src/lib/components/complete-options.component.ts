import { CommonModule, NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Type } from '@angular/core';
import { TokenType } from '@open-dcp/equation-editor';
import { DividerOptionComponent } from './options/divider-option.component';
import { MathSymbolOptionComponent } from './options/math-symbol-option.component';
import { ParenthesesOptionComponent } from './options/parentheses-option.component';
import { FunctionOptionComponent } from './options/function-option.component';
import { OperatorOptionComponent } from './options/operator-option.component';
import { VariableOptionComponent } from './options/variable-option.component';

interface OptionItem {
  raw: { type: string; label: string; subtitle?: string; data?: Record<string, any> };
  props: any;
}

@Component({
  selector: 'odcp-complete-options',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngComponentOutlet="optionType; inputs: { item: item.raw }"></ng-container>
  `,
  styles: `
    ::ng-deep .mat-mdc-autocomplete-panel .mat-mdc-option {
      height: auto !important;
    }
  `
})
export class CompleteOptionsComponent {
  @Input({ required: true }) item!: OptionItem;

  get optionType(): Type<unknown> {
    const type = this.item.raw.type;
    if (type === 'divider') return DividerOptionComponent;
    if (type === TokenType.MathSymbol) return MathSymbolOptionComponent;
    if (type === TokenType.Parenthesis) return ParenthesesOptionComponent;
    if (type === TokenType.LeftBracket) return ParenthesesOptionComponent;
    if (type === TokenType.RightBracket) return ParenthesesOptionComponent;
    if (type === TokenType.ArgumentSeparator) return MathSymbolOptionComponent;
    if (type === TokenType.Function) return FunctionOptionComponent;
    if (type === TokenType.Operator) return OperatorOptionComponent;
    return VariableOptionComponent;
  }
}
