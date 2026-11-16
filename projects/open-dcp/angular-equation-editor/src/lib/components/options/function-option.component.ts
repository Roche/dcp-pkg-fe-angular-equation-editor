import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { FunctionChipComponent } from '../chips/function-chip.component';
import { SubtitleOptionComponent } from './sub-title-option.component';

@Component({
  selector: 'odcp-function-option',
  standalone: true,
  imports: [CommonModule, MatListModule, FunctionChipComponent, SubtitleOptionComponent],
  template: `
    <mat-list-item>
      <odcp-function-chip [showParentheses]="true" [item]="item"></odcp-function-chip>
      <odcp-subtitle-option *ngIf="item.subtitle" [text]="item.subtitle"></odcp-subtitle-option>
    </mat-list-item>
  `,
})
export class FunctionOptionComponent {
  @Input({ required: true }) item!: { label: string; subtitle?: string };
}