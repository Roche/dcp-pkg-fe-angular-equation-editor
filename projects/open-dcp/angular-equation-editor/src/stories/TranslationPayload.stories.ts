import { CommonModule, JsonPipe } from "@angular/common";
import { provideAnimations } from "@angular/platform-browser/animations";
import { applicationConfig, moduleMetadata, type Meta, type StoryFn } from "@storybook/angular";
import { FormulaDetails } from "@open-dcp/equation-editor";
import { EquationEditorComponent } from "../lib/components/equation-editor.component";
import { inject, APP_INITIALIZER, signal } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

let translate: TranslateService;

const meta: Meta<EquationEditorComponent> = {
  title: "TranslationPayload",
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
  
  const locale = signal('en');
  
  // Variable mirrors the real-world id/label split from translation-related reports.
  const variables = [
    {
      label: "Druck_P1.U",
      value: "D1C00001PI1AbERuYiTbprtUev-SErXP9OeQQMgcCNex6BGA-gBQVplZogwRnvOFcvrEGLCDr3dLsD8g"
    },
    { label: "temperature", value: "sensor_temp" }
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

  // Example fencing: variables with @, numbers with []
  const fence = {
    variableOpen: "{",
    variableClose: "}"
  };

  const changeLocale = (lang: string) => {
    translate.use(lang);
    locale.set(lang);
  };

  return {
    props: { equation, fence, variables, translation, locale,
            localeOptions: ["en", "de"], changeLocale},
    template: `
      <div>
        <h2>Translated Payload Fields</h2>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
          <label for="locale-select" style="color: #555; font-weight: 600;">Locale:</label>
          <select id="locale-select" (change)="changeLocale($any($event.target).value)"
              style="border: 1px solid #ccc; border-radius: 4px; padding: 6px 8px;">
            <option *ngFor="let lng of localeOptions" [value]="lng" [selected]="lng === locale()">{{ lng }}</option>
          </select>
          <span style="color: #555;">Active locale: <strong>{{ locale() }}</strong></span>
        </div>
        <odcp-equation-editor [(modelValue)]="equation"         
                              [variables]="variables"
                              [translation]="translation"
                              [fence]="fence"
                              label="Try: Druck_P1.U between [10,100]" />
        <div style="margin-top: 20px; display: grid; gap: 8px;">
          <div><strong>display:</strong> {{ equation?.display }}</div>
          <div><strong>unfancedDisplay:</strong> {{ equation?.unfancedDisplay }}</div>
          <div><strong>localizedDisplay:</strong> {{ equation?.localizedDisplay }}</div>
          <div><strong>localizedUnfancedDisplay:</strong> {{ equation?.localizedUnfancedDisplay }}</div>
          <div><strong>raw:</strong> {{ equation?.raw }}</div>
          <div><strong>fanciedRaw:</strong> {{ equation?.fanciedRaw }}</div>
        </div>

        <h3 style="margin-top: 20px;">Full Payload</h3>
        <pre style="background: #f5f5f5; padding: 12px; border-radius: 6px; overflow: auto; max-height: 320px;">
          {{ equation | json }}
        </pre>
      </div>
    `,
  };
};

export const TranslationPayload = Template.bind({});