const fs = require('fs');
const path = require('path');
const _prompts = require('prompts');

const CONFIG_FILE = 'commit-generator.config';

const lookup = (file, options = {}, dir = process.cwd()) => {
  const {
    def,
    ext = 'js',
    stopOn = (p) => p.split(path.sep).length > 20,
  } = options;
  const p = path.join(dir, file);

  if (fs.existsSync(`${p}.${ext}`)) return p;
  if (stopOn(p)) return console.info('lookup did not found file') || def;

  const newDir = dir.split(path.sep);
  newDir.shift();

  console.log('no conig. lookup to', newDir);

  return lookup(p, options, newDir.join(path.sep));
};

const configDir = lookup(CONFIG_FILE);
const hasConfig = () => fs.existsSync(`${configDir}.js`);
const readConfig = (overrideDir) => {
  try {
    return require(`${overrideDir || configDir}`);
  } catch (e) {
    overrideDir &&
      console.error(
        `couldn't find overrideConfig at ${path.join(
          overrideDir
        )} from ${process.cwd()}`
      );
    return [];
  }
};

const customConfig = (overrideDir) =>
  Promise.all(hasConfig() ? readConfig(overrideDir).map(buildMessage) : []);

const buildMessage = async ({ format, prompts }) =>
  Object.entries(await _prompts(prompts)).reduce(
    (message, [key, value]) => message.replace(`{{${key}}}`, value),
    format
  );

module.exports = { customConfig };
