import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'odcp-unknown-chip',
  standalone: true,
  imports: [MatChipsModule, MatIconModule],
  styleUrls: ['./chips.styles.scss'],
  template: `
    <mat-chip color="error">
      <mat-icon matChipAvatar>error_outline</mat-icon>
      {{ item.label }}
    </mat-chip>
  `
})
export class UnknownChipComponent {
  @Input({ required: true }) item!: { label: string };
}
