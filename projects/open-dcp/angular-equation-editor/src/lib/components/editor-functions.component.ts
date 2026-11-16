import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef, booleanAttribute } from '@angular/core';
import { EditorFunctionButtonComponent } from './editor-function-button.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'odcp-editor-functions',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet, EditorFunctionButtonComponent, TranslateModule],
  template: `
    <ng-container *ngTemplateOutlet="copyButtonTemplate || defaultCopyButton; context: { onClick: emitCopy }">
    </ng-container>

    <ng-container *ngTemplateOutlet="rawToggleButtonTemplate || defaultRawToggleButton;
      context: { onClick: emitToggleRaw, icon: rawToggleIcon }">
    </ng-container>

    <ng-template #defaultCopyButton>
      <odcp-editor-function-button *ngIf="!noCopyButton" 
                                   [icon]="'content-copy'" 
                                   [label]="copyLabelKey | translate"
                                   (click)="$event.stopPropagation(); emitCopy()">
      </odcp-editor-function-button>
    </ng-template>

    <ng-template #defaultRawToggleButton>
      <odcp-editor-function-button *ngIf="!noRawToggle" 
                                   [icon]="rawToggleIcon" 
                                   [label]="rawToggleLabelKey | translate"
                                   (click)="$event.stopPropagation(); emitToggleRaw();">
      </odcp-editor-function-button>
    </ng-template>
  `,
})
export class EditorFunctionsComponent {
  @Input({ transform: booleanAttribute }) noCopyButton = false;
  @Input({ transform: booleanAttribute }) noRawToggle = false;
  @Input({ required: true }) showRaw!: boolean;
  @Input() translationPrefix = '';

  @Input() copyButtonTemplate?: TemplateRef<unknown>;
  @Input() rawToggleButtonTemplate?: TemplateRef<unknown>;
  
  @Output() copyClick = new EventEmitter<void>();
  @Output() toggleRaw = new EventEmitter<void>();

  get rawToggleIcon(): string {
    return this.showRaw ? 'tag' : 'text-recognition';
  }

  get copyLabelKey(): string {
    return `${this.translationPrefix}editor-functions.copy`;
  }

  get rawToggleLabelKey(): string {
    const key = this.showRaw ? 'switch-to-chip' : 'switch-to-raw';
    return `${this.translationPrefix}editor-functions.${key}`;
  }

  emitCopy = () => this.copyClick.emit();
  emitToggleRaw = () => this.toggleRaw.emit();
}