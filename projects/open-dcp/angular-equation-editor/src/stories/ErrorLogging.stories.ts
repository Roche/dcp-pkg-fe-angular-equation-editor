import { CommonModule, JsonPipe } from "@angular/common";
import { provideAnimations } from "@angular/platform-browser/animations";
import { applicationConfig, moduleMetadata, type Meta, type StoryFn } from "@storybook/angular";
import { FormulaDetails } from "@open-dcp/equation-editor";
import { EquationEditorComponent } from "../lib/components/equation-editor.component";
import { inject, signal, APP_INITIALIZER } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

let translate: TranslateService;

const meta: Meta<EquationEditorComponent> = {
  title: "ErrorLogging",
  component: EquationEditorComponent,
  decorators: [
    moduleMetadata({ imports: [JsonPipe, CommonModule] }),
    applicationConfig({ providers: [provideAnimations(), 
      {
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: () => {
          translate = inject(TranslateService);
          return () => {};
        },
      }
    ] }),
  ],
};
export default meta;

const Template: StoryFn<EquationEditorComponent> = () => {
  const equation: FormulaDetails | undefined = undefined;
  const variables = [
    { label: "x", value: "var_x" },
    { label: "y", value: "var_y" },
    { label: "z", value: "var_z" }
  ];

  const translation = {
    translationPrefix: "@open-dcp/i18n",
    translator: (key: string, params?: Record<string, any>) => {
      const text = translate.instant(key, params);
      return params
      ? text.replace(/\{\s*([\w.]+)\s*\}/g, (m: string, k: string) => (k in params ? String(params[k]) : m))
      : text;
     
    },
  };

  const validationErrors = signal<string[]>([]);

  return {
    props: { equation, variables, validationErrors, translation, onErrors: (errors: string[]) => validationErrors.set(errors)},
    template: `
      <div>
        <p style="margin-bottom: 12px; color: #666;">
          This story displays only validation errors in the UI.
        </p>
        <odcp-equation-editor [(modelValue)]="equation"         
                              [variables]="variables"
                              [translation]="translation"
                              (errorsChange)="onErrors($event)" />
        <div *ngIf="validationErrors().length > 0" style="margin-top: 12px;">
          <h3>Validation Errors</h3>
          <ul>
            @for (error of validationErrors(); track $index) {
              <li>{{ error }}</li>
            }
          </ul>
        </div>

        <h3>Try invalid input, for example:</h3>
        <ul>
          <li>x +</li>
          <li>(x + y</li>
        </ul>
      </div>
    `,
  };
};

export const Default = Template.bind({});