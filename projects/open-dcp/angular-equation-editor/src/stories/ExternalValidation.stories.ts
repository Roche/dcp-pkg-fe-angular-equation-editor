import { CommonModule, JsonPipe } from "@angular/common";
import { provideAnimations } from "@angular/platform-browser/animations";
import { applicationConfig, moduleMetadata, type Meta, type StoryFn } from "@storybook/angular";
import { FormulaDetails, FormulaToken } from "@open-dcp/equation-editor";
import { EquationEditorComponent } from "../lib/components/equation-editor.component";
import { inject, APP_INITIALIZER } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

let translate: TranslateService;

const meta: Meta<EquationEditorComponent> = {
  title: "ExternalValidation",
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

  const customValidator = async (formula: string, tokens: FormulaToken[]) => {
    if (tokens.length === 0) return null;

    return ['Custom Validator always says: No'];
  }

  return {
    props: { equation, variables, translation, customValidator},
    template: `
      <div>
        <odcp-equation-editor [(modelValue)]="equation"         
                              [variables]="variables"
                              [translation]="translation"
                              [nbrOfErrorsToShow]="null"
                              [customValidator]="customValidator" />
        <h3>Current Equation Value:</h3>
        <pre>{{ equation | json }}</pre>
      </div>
    `,
  };
};

export const ExternalValidation = Template.bind({});