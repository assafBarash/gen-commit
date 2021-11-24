import { PromptObject } from 'prompts';

export type Flags = Partial<{
  execute: boolean;
  messageOnly: boolean;
  overrideConfig: string;
  autoscope: boolean;
  selectFiles: boolean;
  customParams: string;
}>;

export type Config = ConfigObject | ConfigObject[] | ConfigFunction;

export type ConfigObject = {
  format: string | ((messageParams: { [key: string]: string }) => string);
  prompts: PromptObject[];
};

export type ConfigFunction = (
  defaultConfig: ConfigObject,
  flags: Flags
) => ConfigObject;
