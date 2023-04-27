import _prompts from 'prompts';
import { defConfig } from './def-config';
import { lookup, asyncMap } from './utils';
import path from 'path';
import { Config, ConfigObject, Flags } from './types';

const CONFIG_FILE = 'commit-generator.config';

const getConfigDir = () => lookup(`${CONFIG_FILE}.js`);
const readConfig = (
  defConfig: ConfigObject,
  flags: Flags
): Promise<ConfigObject | ConfigObject[]> => {
  const { overrideConfig } = flags;
  try {
    const config: Config = require(`${overrideConfig || getConfigDir()}`);

    if (Array.isArray(config)) return Promise.resolve([defConfig, ...config]);
    if (typeof config === 'object') return Promise.resolve([defConfig, config]);
    if (config) return Promise.resolve(config(defConfig, flags));
  } catch (e) {
    overrideConfig &&
      console.error(
        `couldn't find overrideConfig at ${path.join(
          overrideConfig
        )} from ${process.cwd()}`
      );
  }
  return Promise.resolve([defConfig]);
};

const buildMessageSection = async ({
  format,
  prompts,
}: ConfigObject): Promise<string> => {
  if (!prompts) return Promise.resolve('');
  const messageParams = await _prompts(prompts, {
    // onCancel: () => process.exit(),
  });

  return typeof format === 'function'
    ? format(messageParams)
    : Object.entries(messageParams).reduce(
        (message, [key, value]) => message.replace(`{{${key}}}`, value),
        format
      );
};

const getMessageSections = async (flags: Flags) => {
  const parsedDefConfig = await defConfig(null as any, flags);
  const res = await readConfig(parsedDefConfig, flags);

  if (Array.isArray(res)) return res;
  if (typeof res === 'object') return [res];

  console.log('failed to read config');
  return [];
};

export const buildMessageSections = async (flags: Flags) =>
  (
    await asyncMap(
      (await getMessageSections(flags)).filter(Boolean),
      buildMessageSection
    )
  )
    .filter(Boolean)
    .map((str) => `"${str}"`)
    .join(' -m ');
