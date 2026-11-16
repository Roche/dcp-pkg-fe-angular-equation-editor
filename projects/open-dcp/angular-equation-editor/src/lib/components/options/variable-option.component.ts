import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { SubtitleOptionComponent } from './sub-title-option.component';
import { VariableChipComponent } from '../chips/variable-chip.component';

@Component({
  selector: 'odcp-variable-option',
  standalone: true,
  imports: [CommonModule, MatListModule, VariableChipComponent, SubtitleOptionComponent],
  template: `
    <mat-list-item class="auto-height-item">
      <odcp-variable-chip [item]="item"></odcp-variable-chip>
      <odcp-subtitle-option *ngIf="item.subtitle" [text]="item.subtitle"></odcp-subtitle-option>
    </mat-list-item>
  `,
  styles: `
    .auto-height-item {
      --mdc-list-list-item-one-line-container-height: auto;
      --mdc-list-list-item-two-line-container-height: auto;
      --mdc-list-list-item-three-line-container-height: auto;
    }
  `
})
export class VariableOptionComponent {
  @Input({ required: true }) item!: { label: string; subtitle?: string };
}