import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'odcp-argument-separator-chip',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  styleUrls: ['./chips.styles.scss'],
  template: `
    <mat-chip color="success">
      {{ item.label }}
    </mat-chip>
  `
})
export class ArgumentSeparatorChipComponent {
  @Input({ required: true }) item!: { label: string };
}
