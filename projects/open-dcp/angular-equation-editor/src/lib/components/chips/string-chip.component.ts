import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'odcp-string-chip',
  standalone: true,
  imports: [MatChipsModule],
  template: `
    <mat-chip color="primary">
      {{ item.label }}
    </mat-chip>
  `
})
export class StringChipComponent {
  @Input({ required: true }) item!: { label: string };
}
