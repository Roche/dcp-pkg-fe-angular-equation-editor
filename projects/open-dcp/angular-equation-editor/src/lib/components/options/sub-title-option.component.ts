import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'odcp-subtitle-option',
    standalone: true,
    imports: [CommonModule],
    template: `
      <span *ngIf="text" class="option-subtitle" [title]="text">{{ text }}</span>
    `,
    styles: `
      :host {
        display: block;
        min-width: 0;
      }

      .option-subtitle {
        display: block;
        font-size: 0.75rem;
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `,
})
export class SubtitleOptionComponent {
  @Input() text?: string;
}