import { CommonModule, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { SubtitleOptionComponent } from './sub-title-option.component';
import { OperatorChipComponent } from '../chips/operator-chip.component';

@Component({
  selector: 'odcp-operator-option',
  standalone: true,
  imports: [CommonModule, MatListModule, OperatorChipComponent, SubtitleOptionComponent],
  template: `
    <mat-list-item>
      <odcp-operator-chip [item]="item"></odcp-operator-chip>
      <odcp-subtitle-option *ngIf="item.subtitle" [text]="item.subtitle"></odcp-subtitle-option>
    </mat-list-item>
  `,
})
export class OperatorOptionComponent {
  @Input({ required: true }) item!: { label: string; subtitle?: string };
}