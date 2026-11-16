import { CommonModule, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectorRef, Component, ContentChild, EventEmitter, Input, OnChanges, OnDestroy,
  OnInit, Output, SimpleChanges, TemplateRef, booleanAttribute, inject,
} from '@angular/core';
import {
  CustomValidatorFunction, EquationEditor, FormulaDetails, Operator, Parenthesis, TokenType, Variable,
  getBuiltInOperatorsForMode, joinTokensNormalized,
} from '@open-dcp/equation-editor';
import { logger } from '@open-dcp/utilities';
import { EditorComboboxComponent } from './editor-combobox.component';
import { EditorDisplayTextComponent } from './editor-display-text.component';
import { EditorFunctionsComponent } from './editor-functions.component';
import { LocalizedFormulaDetails } from '../types';
import { DescriptionVisibility, formatNextOptions, FormattedOption } from '../composable/useOptionFormatter';
import { mapTokensForFormula } from '../composable/useTokenMapper';
import { getLocalizedDisplay, getLocalizedUnfancedDisplay } from '../composable/useFormulaLocalization';
import { normalizeLocalizedOperators } from '../composable/useInputNormalizer';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

type FunctionInput = string | {
  label: string;
  value?: string;
  description?: string;
  data?: Record<string, any>;
};

interface Fence {
  variableOpen?: string;
  variableClose?: string;
  numberOpen?: string | null;
  numberClose?: string | null;
}

interface EditorTranslation {
  translator?: (key: string, params?: Record<string, any>) => string;
  translationPrefix?: string;
}

const EDITOR_OPTION_INPUTS = [
  'variables', 
  'functions', 
  'operators', 
  'fence', 
  'failOnUnknown', 
  'translation', 
  'mode', 
  'ignoreDescription',
  'customValidator', 
  'ignoreInternalErrors'
];

@Component({
  selector: 'odcp-equation-editor',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, EditorComboboxComponent, EditorDisplayTextComponent, 
            EditorFunctionsComponent, TranslateModule],
  template: `
    <div>
      <div class="flex items-center gap-2">
        <odcp-editor-combobox *ngIf="!showRaw; else displayText" [label]="label" [editor]="editor"
            [filteredOptions]="filteredOptions" [chipTokens]="chipTokens" (clear)="editor.clear()"
            (enter)="onEnter($event)" (tokensChange)="onInput($event)"></odcp-editor-combobox>

        <ng-template #displayText>
          <odcp-editor-display-text [filteredOptions]="filteredOptions" [label]="label"
              [modelValue]="modelValue?.display || ''" (clear)="editor.clear()"
              (modelValueChange)="onTextUpdate($event)"></odcp-editor-display-text>
        </ng-template>

        <odcp-editor-functions *ngIf="showEditorFunctions" [noCopyButton]="noCopyButton"
            [noRawToggle]="noRawToggle" [showRaw]="showRaw" [translationPrefix]="translationPrefix"
            [copyButtonTemplate]="copyButtonTemplate" [rawToggleButtonTemplate]="rawToggleButtonTemplate"
            (copyClick)="handleCopy()" (toggleRaw)="handleToggleRaw()"></odcp-editor-functions>
      </div>

      <div *ngIf="hasErrors" class="grid gap-2">
        <div *ngFor="let error of errorsToShow" class="error w-full">
          {{ error | translate }}
        </div>
      </div>
    </div>
  `,
})
export class EquationEditorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() modelValue?: LocalizedFormulaDetails;
  @Input({ required: true }) variables!: Variable[];
  @Input() functions: FunctionInput[] = [];
  @Input() operators: Operator[] = [];
  @Input() customValidator?: CustomValidatorFunction;
  @Input({ transform: booleanAttribute }) ignoreInternalErrors = false;
  @Input() label?: string;
  @Input() fence: Fence = { variableOpen: '{', variableClose: '}', numberOpen: null, numberClose: null };
  @Input({ transform: booleanAttribute }) failOnUnknown = false;
  @Input({ transform: booleanAttribute }) noRawToggle = false;
  @Input({ transform: booleanAttribute }) noCopyButton = false;
  @Input() translation?: EditorTranslation;
  @Input() nbrOfErrorsToShow: number | null = 1;
  @Input({ transform: booleanAttribute }) startInRawMode = false;
  @Input() mode: 'formula' | 'equation' = 'formula';
  @Input() ignoreDescription: DescriptionVisibility = { variables: false, operators: false, functions: false };

  @Output() modelValueChange = new EventEmitter<LocalizedFormulaDetails>();
  @Output() errorsChange = new EventEmitter<string[]>();
  @Output() copyClick = new EventEmitter<void>();
  @Output() toggleRaw = new EventEmitter<boolean>();

  @ContentChild('copyButton') copyButtonTemplate?: TemplateRef<unknown>;
  @ContentChild('rawToggleButton') rawToggleButtonTemplate?: TemplateRef<unknown>;

  editor!: EquationEditor;
  showRaw = false;
  chipTokens: Array<{ label: string; value: string; type: string; raw: any }> = [];
  errors: string[] = [];
  filteredOptions: FormattedOption[] = [];

  private readonly cdr = inject(ChangeDetectorRef);
  private subscriptions: Array<{ unsubscribe: () => void }> = [];

  private readonly translate = inject(TranslateService);

  ngOnInit(): void {
    this.showRaw = this.startInRawMode;
    this.editor = new EquationEditor(
      this.modelValue?.display || '',
      this.variables,
      this.normalizedFunctions,
      this.operators,
      this.editorConfig,
    );
    this.bindSubscriptions();
    this.editor.updateFormula(this.modelValue?.display || '');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.editor) return;
    if (!EDITOR_OPTION_INPUTS.some(name => name in changes)) return;
    this.editor.updateOptions({
      variables: this.variables,
      functions: this.normalizedFunctions,
      operators: this.operators,
      config: this.editorConfig,
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  get translationPrefix(): string {
    const prefix = this.translation?.translationPrefix;
    return `${prefix ? prefix + '.' : ''}equation-editor.`;
  }

  get showEditorFunctions(): boolean {
    return !this.noCopyButton || !this.noRawToggle || !!this.copyButtonTemplate || !!this.rawToggleButtonTemplate;
  }

  get errorsToShow(): string[] {
    if (this.nbrOfErrorsToShow === null) return this.errors;
    return this.errors.slice(0, this.nbrOfErrorsToShow);
  }

  get hasErrors(): boolean {
    return this.errors && this.errors.length > 0;
  }

  get isValid(): boolean {
    return this.errors.length === 0;
  }

  private get normalizedFunctions(): string[] {
    return this.functions.map(fn => (typeof fn === 'string' ? fn : (fn.value ?? fn.label)));
  }

  private get functionMetadataByLabel() {
    const map: Record<string, { description?: string; data?: Record<string, any> }> = {};

    this.functions.forEach(fn => {
      if (typeof fn === 'string') return;

      const key = fn.value ?? fn.label;
      map[key] = {
        description: fn.description ?? fn.data?.['description'],
        data: fn.data,
      };
    });

    return map;
  }

  private get editorConfig() {
    return {
      variableFenceOpen: this.fence.variableOpen ?? '{',
      variableFenceClose: this.fence.variableClose ?? '}',
      numberFenceOpen: this.fence.numberOpen ?? undefined,
      numberFenceClose: this.fence.numberClose ?? undefined,
      failOnUnknown: this.failOnUnknown,
      translator: this.translation?.translator ?? undefined,
      translationPrefix: this.translation?.translationPrefix ?? undefined,
      mode: this.mode,
      customValidator: this.customValidator,
      ignoreInternalErrors: this.ignoreInternalErrors,
    };
  }

  onInput(newTokens: Array<any>): void {
    if (!newTokens) return;

    const filteredTokens = newTokens.filter(token => typeof token === 'object' && token.type);

    const deletedToken = this.chipTokens.length ? this.chipTokens.at(-1)?.raw : null;
    if (
      deletedToken &&
      deletedToken.type === TokenType.Parenthesis &&
      deletedToken.value === Parenthesis.Open
    ) {
      const nextToken = filteredTokens.at(-1);
      if (nextToken && nextToken.type === TokenType.Function) {
        filteredTokens.pop();
      }
    }

    if (filteredTokens.length === 0) {
      this.editor.clear();
      return;
    }

    const mappedTokens = mapTokensForFormula(filteredTokens);

    const formulaString = joinTokensNormalized(
      mappedTokens,
      this.fence.variableOpen ?? '{',
      this.fence.variableClose ?? '}',
      this.fence.numberOpen ?? null,
      this.fence.numberClose ?? null,
    );
    this.editor.updateFormula(formulaString);
  }

  onEnter(input: string, append: boolean = true): void {
    if (input) {
      const currentDisplay = append ? this.modelValue?.display || '' : '';
      const normalizedInput = this.normalizeInputOperators(input);
      this.editor.updateFormula(currentDisplay + ' ' + normalizedInput);
    }
  }

  onTextUpdate(newText: string | null): void {
    if (newText === null) return;

    this.editor.updateFormula(this.normalizeInputOperators(newText));
  }

  reset(newText: string = ''): void {
    if (!newText) {
      this.editor.clear();
      return;
    }

    this.editor.updateFormula(newText);
  }

  handleCopy(): void {
    this.copyClick.emit();

    const formula = this.modelValue?.display || '';
    navigator.clipboard.writeText(formula).catch(err => {
      logger.error('Failed to copy formula to clipboard:', err);
    });
  }

  handleToggleRaw(): void {
    this.showRaw = !this.showRaw;
    this.toggleRaw.emit(this.showRaw);
  }

  private bindSubscriptions(): void {
    this.subscriptions = [
      this.editor.valid$.subscribe(valid => {
        this.errors = valid;
        this.errorsChange.emit(this.errors);
        this.cdr.markForCheck();
      }),

      this.editor.getTokens$().subscribe(tokens => {
        this.chipTokens = tokens.map((token, i) => ({
          label: token.type === TokenType.Variable ? token.value : token.label ?? token.value,
          value: `${token.value}_${i}`,
          type: token.type,
          raw: token,
        }));

        const nextOptions = this.editor.getNextOptions();
        this.filteredOptions = formatNextOptions(nextOptions, {
          functionMetadataByLabel: this.functionMetadataByLabel,
          ignoreDescription: this.ignoreDescription,
        });
        this.cdr.markForCheck();
      }),

      this.editor.formulaDetails$.subscribe((details: FormulaDetails) => {
        const localizedDisplay = getLocalizedDisplay(details, this.fence);
        this.modelValue = {
          ...details,
          localizedDisplay,
          localizedUnfancedDisplay: getLocalizedUnfancedDisplay(localizedDisplay, this.variables, this.fence),
        };
        this.modelValueChange.emit(this.modelValue);
        this.cdr.markForCheck();
      }),
    ];
  }

  private getOperatorAliases(): Array<{ label: string; value: string }> {
    const aliases: Array<{ label: string; value: string }> = [];
    const operatorValues = new Set<string>();

    getBuiltInOperatorsForMode(this.mode).forEach(operator => {
      operatorValues.add(operator.value);
    });

    this.operators.forEach(operator => {
      if (operator.label && operator.value) {
        aliases.push({ label: operator.label, value: operator.value });
        operatorValues.add(operator.value);
      }
    });

    this.filteredOptions.forEach(option => {
      if (option.type === TokenType.Operator && option.label && option.value) {
        aliases.push({ label: option.label, value: option.value });
        operatorValues.add(option.value);
      }
    });

    const translator = this.translation?.translator;
    const translationPrefix = this.translation?.translationPrefix;

    if (translator && translationPrefix) {
      operatorValues.forEach(operatorValue => {
        if (!/^[\p{L}\p{N}_]+$/u.test(operatorValue)) {
          return;
        }

        const key = `${translationPrefix}.filter.operator.${operatorValue}`;
        const translated = translator(key, {
          value: operatorValue,
          key: operatorValue,
          label: operatorValue,
          category: 'comparison',
        });

        if (translated && translated !== key) {
          aliases.push({ label: translated, value: operatorValue });
        }
      });
    }

    return aliases;
  }

  private normalizeInputOperators(input: string): string {
    return normalizeLocalizedOperators(input, this.getOperatorAliases());
  }
}

