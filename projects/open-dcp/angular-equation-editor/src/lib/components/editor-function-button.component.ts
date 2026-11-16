import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'odcp-editor-function-button',
  standalone: true,
  imports: [NgIf, MatIconModule, MatIconButton, MatButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button *ngIf="icon; else textButton" 
            mat-icon-button 
            type="button"
            class="dcp-equation-editor-function-button"
            [attr.aria-label]="accessibleLabel" 
            [title]="tooltipText">
      <mat-icon fontSet="mdi" 
                fontIcon="mdi-{{icon}}" 
                class="dcp-equation-editor-function-button__icon">
      </mat-icon>
    </button>

    <ng-template #textButton>
      <button mat-button 
              type="button"
              class="dcp-equation-editor-function-button__label" 
              [attr.aria-label]="accessibleLabel" 
              [title]="tooltipText">
        {{ label }}
      </button>
    </ng-template>
  `,
  styles: `
    .dcp-equation-editor-function-button {
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 100%;
      background-color: transparent;
      color: inherit;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      cursor: pointer;
      transition: background-color 120ms ease, border-color 120ms ease, transform 120ms ease;
    }

    .dcp-equation-editor-function-button:hover {
      background-color: color-mix(in srgb, currentColor 8%, transparent);
      border-color: color-mix(in srgb, currentColor 28%, transparent);
    }

    .dcp-equation-editor-function-button:active {
      transform: translateY(1px);
    }

    .dcp-equation-editor-function-button:focus-visible {
      outline: 2px solid color-mix(in srgb, currentColor 55%, transparent);
      outline-offset: 1px;
    }

    .dcp-equation-editor-function-button__icon {
      width: 0.95rem;
      height: 0.95rem;
      font-size: 0.95rem;
      line-height: 1;
    }

    .dcp-equation-editor-function-button__label {
      font-size: 0.95rem;
      line-height: 1;
    }
  `,
})
export class EditorFunctionButtonComponent {
  @Input({ required: true }) label!: string;
  @Input() icon?: string;
  @Input() ariaLabel?: string;
  @Input() tooltip?: string;

  get accessibleLabel(): string {
    return this.ariaLabel || this.label;
  }

  get tooltipText(): string {
    return this.tooltip || this.label;
  }
}