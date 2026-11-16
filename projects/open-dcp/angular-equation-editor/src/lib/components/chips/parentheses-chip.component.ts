import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'odcp-parentheses-chip',
  standalone: true,
  imports: [MatChipsModule],
  styleUrls: ['./chips.styles.scss'],
  template: `
    <mat-chip color="secondary">
      {{ item.label }}
    </mat-chip>
  `
})
export class ParenthesesChipComponent {
  @Input({ required: true }) item!: { label: string };
}
