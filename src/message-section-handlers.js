const _prompts = require('prompts');
const defConfig = require('./def-config');
const { lookup, asyncMap } = require('./utils');

const CONFIG_FILE = 'commit-generator.config';

const getConfigDir = () => lookup(`${CONFIG_FILE}.js`);
const readConfig = (overrideDir, defConfig, flags) => {
  try {
    const config = require(`${overrideDir || getConfigDir()}`);

    if (typeof config === 'object')
      return Promise.resolve([defConfig, ...config]);
    if (typeof config === 'function') return config(defConfig, flags);
  } catch (e) {
    overrideDir &&
      console.error(
        `couldn't find overrideConfig at ${path.join(
          overrideDir
        )} from ${process.cwd()}`
      );
  }
  return [];
};

const buildMessageSection = async ({ format, prompts } = {}) => {
  const messageParams = await _prompts(prompts, { onCancel: process.exit });

  if (typeof format === 'string')
    return Object.entries(messageParams).reduce(
      (message, [key, value]) => message.replace(`{{${key}}}`, value),
      format
    );

  if (typeof format === 'function') return format(messageParams);

  throw Error('INVALID_FORMAT');
};

const getMessageSections = async (flags) => {
  const { overrideConfig } = flags;

  const parsedDefConfig = defConfig(flags);
  const res = await readConfig(overrideConfig, parsedDefConfig, flags);

  if (Array.isArray(res)) return res;
  if (typeof res === 'object') return res(parsedDefConfig, flags);

  return console.log('failed to read config') || [];
};

const buildMessageSections = async (flags) =>
  (
    await asyncMap(
      (await getMessageSections(flags)).filter(Boolean),
      buildMessageSection
    )
  )
    .filter(Boolean)
    .map((str) => `"${str}"`)
    .join(' -m ');

module.exports = { buildMessageSections };
