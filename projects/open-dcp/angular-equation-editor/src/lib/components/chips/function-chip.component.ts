import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'odcp-function-chip',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  styleUrls: ['./chips.styles.scss'],
  template: `
    <mat-chip color="info">
      {{ item.label }}{{ showParentheses ? '()' : '' }}
    </mat-chip>
  `
})
export class FunctionChipComponent {
  @Input({ required: true }) item!: { label: string };
  @Input() showParentheses = false;
}
