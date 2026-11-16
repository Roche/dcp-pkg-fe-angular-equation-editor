import { JsonPipe } from "@angular/common";
import { provideAnimations } from "@angular/platform-browser/animations";
import { applicationConfig, moduleMetadata, type Meta, type StoryFn } from "@storybook/angular";
import { FormulaDetails } from "@open-dcp/equation-editor";
import { EquationEditorComponent } from "../lib/components/equation-editor.component";

const meta: Meta<EquationEditorComponent> = {
  title: "Default",
  component: EquationEditorComponent,
  decorators: [
    moduleMetadata({ imports: [JsonPipe] }),
    applicationConfig({ providers: [provideAnimations()] }),
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
  
  const fence = {
    variableOpen: "@",
    variableClose: "@"
  };

  const translation = {
    translationPrefix: "@open-dcp/i18n",
    translator: (key: string) => key
  };

  return {
    props: { equation, variables, fence, translation },
    template: `
      <div>
        <odcp-equation-editor [(modelValue)]="equation" 
                              [variables]="variables" 
                              [fence]="fence" 
                              [failOnUnknown]="true" 
                              [translation]="translation" />
        <h3>Current Equation Value:</h3>
        <pre>{{ equation | json }}</pre>
      </div>
    `,
  };
};

export const Default = Template.bind({});