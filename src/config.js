const fs = require('fs');
const path = require('path');
const _prompts = require('prompts');

const CONFIG_FILE = 'commit-generator.config';

let DEBUG = false;
const shouldDebug = () => DEBUG;

const lookup = (file, options = {}) => {
  const {
    def,
    ext = 'js',
    stopOn = (depth) => depth > 20,
    depth = 0,
    dir = process.cwd(),
  } = options;

  const p = path.join(dir, file);

  shouldDebug() && console.log('lookup at', p);

  if (fs.existsSync(`${p}.${ext}`)) return p;
  if (!dir || stopOn(depth))
    return (shouldDebug() && console.info('lookup did not found file')) || def;

  const newDir = dir.split(path.sep);
  newDir.pop();

  shouldDebug() && console.log('newDir', newDir.join(path.sep));

  return lookup(file, {
    ...options,
    dir: newDir.join(path.sep),
    depth: 1 + depth,
  });
};

const getConfigDir = () => lookup(CONFIG_FILE);
const hasConfig = () => fs.existsSync(`${getConfigDir()}.js`);
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
    return [];
  }
};

const customConfig = (overrideDir, debug) => {
  DEBUG = debug;
  return hasConfig()
    ? readConfig(overrideDir).then((config) =>
        Promise.all(config.map(buildMessage))
      )
    : Promise.resolve([]);
};

const buildMessage = async ({ format, prompts } = {}) =>
  Object.entries(await _prompts(prompts)).reduce(
    (message, [key, value]) => message.replace(`{{${key}}}`, value),
    format
  );

module.exports = { customConfig };
