import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'odcp-divider-option',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="dcp-equation-editor-option-divider" (click)="$event.stopPropagation()">
            <span class="dcp-equation-editor-option-divider__label">{{ item.label }}</span>
        </div>
    `,
    styles: `
        .dcp-equation-editor-option-divider {
            position: relative;
            display: flex;
            justify-content: center;
            margin: 0.5rem 0;
        }

        .dcp-equation-editor-option-divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            border-top: 1px solid rgba(0, 0, 0, 0.12);
            transform: translateY(-50%);
        }

        .dcp-equation-editor-option-divider__label {
            position: relative;
            z-index: 1;
            padding: 0 0.5rem;
            background-color: #fff;
            font-size: 0.75rem;
            font-weight: 700;
            line-height: 1;
        }
    `,
})
export class DividerOptionComponent {
    @Input({ required: true }) item!: { label: string };
}
