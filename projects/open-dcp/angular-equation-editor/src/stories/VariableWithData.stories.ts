import { CommonModule, JsonPipe } from "@angular/common";
import { provideAnimations } from "@angular/platform-browser/animations";
import { applicationConfig, moduleMetadata, type Meta, type StoryFn } from "@storybook/angular";
import { FormulaDetails, Variable } from "@open-dcp/equation-editor";
import { EquationEditorComponent } from "../lib/components/equation-editor.component";
import { inject, APP_INITIALIZER, signal } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

let translate: TranslateService;

const meta: Meta<EquationEditorComponent> = {
  title: "VariableWithData",
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
  
  // Variables with additional data metadata
  const variables: Variable[] = [
    { 
      label: "temperature", 
      value: "sensor_temp",
      data: {
        unit: "celsius",
        sensorId: "TEMP001",
        description: "Main temperature sensor"
      }
    },
    { 
      label: "pressure", 
      value: "sensor_pressure",
      data: {
        unit: "pascal",
        sensorId: "PRES001",
        description: "Pressure sensor"
      }
    },
    { 
      label: "humidity", 
      value: "sensor_humidity",
      data: {
        unit: "percent",
        sensorId: "HUM001",
        description: "Humidity sensor"
      }
    },
    { 
      label: "altitude", 
      value: "sensor_altitude",
      data: {
        unit: "meters",
        sensorId: "ALT001",
        description: "Altitude sensor"
      }
    }
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

  return {
    props: { equation, variables, translation },
    template: `
      <div>
        <p style="margin-bottom: 12px; color: #666;">
          This story demonstrates variables with additional metadata stored in the <code>data</code> property.
          Each variable contains information about the sensor unit, ID, and description.
        </p>
        <odcp-equation-editor [(modelValue)]="equation"         
                              [variables]="variables"
                              [translation]="translation"
                              label="Try: Druck_P1.U between [10,100]" />
        <div *ngIf="equation" style="margin-top: 24px;">
          <h3>Formula Details</h3>
          <pre style="background: #f5f5f5; padding: 12px; border-radius: 4px;">
            {{ equation | json }}
          </pre>
          <div *ngIf="equation.tokens && equation.tokens.length > 0" style="margin-top: 16px;">
            <h3>Token Data</h3>
            @for (token of equation.tokens; track $index) {
              <div style="margin-bottom: 12px; padding: 8px; background: #f5f5f5; border-radius: 4px;">
                <strong>{{ token.label || token.value }}</strong> ({{ token.type }})
                <div *ngIf="token.data" style="margin-top: 4px; padding-left: 12px;">
                  <code style="font-size: 12px;">{{ token.data | json }}</code>
                </div>
              </div>
            }
          </div>
        </div>
        <div style="margin-top: 24px;">
        <h3>Variable Metadata</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f0f0f0;">
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Label</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Value</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Unit</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Sensor ID</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Description</th>
            </tr>
          </thead>
          <tbody>
            @for (variable of variables; track $index) {
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">{{ variable.label }}</td>
                <td style="padding: 8px; border: 1px solid #ddd;"><code>{{ variable.value }}</code></td>
                <td style="padding: 8px; border: 1px solid #ddd;">{{ variable.data?.unit }}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">{{ variable.data?.sensorId }}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">{{ variable.data?.description }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      </div>
    `,
  };
};

export const VariableWithData = Template.bind({});