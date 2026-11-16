import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'odcp-numeric-chip',
  standalone: true,
  imports: [MatChipsModule],
  template: `
    <mat-chip color="info">
      {{ item.label }}
    </mat-chip>
  `
})
export class NumericChipComponent {
  @Input({ required: true }) item!: { label: string };
}
