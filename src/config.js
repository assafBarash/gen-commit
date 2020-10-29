const fs = require('fs');
const { type } = require('os');
const path = require('path');
const _prompts = require('prompts');

const CONFIG_FILE = 'commit-generator.config';

let DEBUG = false;
const shouldDebug = () => DEBUG;

const lookup = (file, dir = process.cwd()) => {
  const p = path.join(dir, file);

  shouldDebug() && console.log('lookup at', p);

  if (fs.existsSync(p)) return p;
  if (!dir)
    return (shouldDebug() && console.info('lookup did not found file')) || '';

  const newDir = dir.split(path.sep);
  newDir.pop();

  shouldDebug() && console.log('newDir', newDir.join(path.sep));

  return lookup(file, newDir.join(path.sep));
};

const getConfigDir = () => lookup(`${CONFIG_FILE}.js`);
const hasConfig = () => fs.existsSync(getConfigDir());
const readConfig = (overrideDir) => {
  try {
    const config = require(`${overrideDir || getConfigDir()}`);

    if (typeof config === 'object') return Promise.resolve(config);
    if (typeof config === 'function') return config();

    throw Error('invalid config');
  } catch (e) {
    overrideDir &&
      shouldDebug() &&
      console.error(
        `couldn't find overrideConfig at ${path.join(
          overrideDir
        )} from ${process.cwd()}`
      );
    return Promise.resolve([]);
  }
};

const customConfig = (overrideDir, debug) => {
  DEBUG = debug;
  return overrideDir || hasConfig()
    ? readConfig(overrideDir).then((config) =>
        Promise.all(config.map(buildMessage))
      )
    : Promise.resolve([]);
};

const buildMessage = async ({ format, prompts } = {}) => {
  const messageParams = await _prompts(prompts, { onCancel: process.exit });

  if (typeof format === 'string')
    return Object.entries(messageParams).reduce(
      (message, [key, value]) => message.replace(`{{${key}}}`, value),
      format
    );

  if (typeof format === 'function') return format(messageParams);

  throw Error('INVALID_FORMAT');
};

module.exports = { customConfig };
