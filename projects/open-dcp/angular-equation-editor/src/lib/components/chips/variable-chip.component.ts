import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'odcp-variable-chip',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule],
  template: `
    <mat-chip color="primary">
      <mat-icon *ngIf="item.raw?.unknown" matChipAvatar>help_outline</mat-icon>
      {{ item.label }}
    </mat-chip>
  `
})
export class VariableChipComponent {
  @Input({ required: true }) item!: { 
    label: string, 
    raw?: {
      unknown?: boolean;
      data?: Record<string, any>;
    }; 
  };
}
