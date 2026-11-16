import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MathSymbolChipComponent } from '../chips/math-symbol-chip.component';

@Component({
  selector: 'odcp-math-symbol-option',
  standalone: true,
  imports: [CommonModule, MatListModule, MathSymbolChipComponent],
  template: `
    <mat-list-item>
      <odcp-math-symbol-chip [item]="item"></odcp-math-symbol-chip>
    </mat-list-item>
  `,
})
export class MathSymbolOptionComponent {
  @Input({ required: true }) item!: { label: string };
}