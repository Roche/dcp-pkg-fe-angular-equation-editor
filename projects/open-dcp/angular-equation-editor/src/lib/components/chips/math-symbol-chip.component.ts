import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

const iconMap: Record<string, string> = {
  '+': 'add',
  '-': 'remove',
  '*': 'close'
};

@Component({
  selector: 'odcp-math-symbol-chip',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-chip color="secondary">
      <mat-icon *ngIf="icon; else label" class="chip-icon">{{icon}}</mat-icon>
      <ng-template #label>
        <span>{{ item.label }}</span>
      </ng-template>
    </mat-chip>
  `,
  styleUrls: ['./chips.styles.scss'],
})
export class MathSymbolChipComponent {
  @Input({ required: true }) item!: { label: string };

  get icon(): string {
    return iconMap[this.item.label] || '';
  }
}