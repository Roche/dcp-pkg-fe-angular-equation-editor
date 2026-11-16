import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { ParenthesesChipComponent } from '../chips/parentheses-chip.component';

@Component({
  selector: 'odcp-parentheses-option',
  standalone: true,
  imports: [CommonModule, MatListModule, ParenthesesChipComponent],
  template: `
    <mat-list-item>
      <odcp-parentheses-chip [item]="item"></odcp-parentheses-chip>
    </mat-list-item>
  `,
})
export class ParenthesesOptionComponent {
  @Input({ required: true }) item!: { label: string };
}