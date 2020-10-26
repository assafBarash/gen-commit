const fs = require('fs');
const path = require('path');
const _prompts = require('prompts');

const CONFIG_FILE = 'commit-generator.config';

const lookup = (file, options = {}, dir = process.cwd()) => {
  const {
    def,
    ext = 'js',
    stopOn = (p) => p.split(path.sep).pop().toLowerCase().includes('user'),
  } = options;
  const p = path.join(dir, file);

  if (fs.existsSync(`${p}.${ext}`)) return p;
  if (stopOn(p)) return console.info('lookup did not found file') || def;

  const newDir = dir.split(path.sep);
  newDir.shift();

  return lookup(p, options, newDir.join(path.sep));
};

const getGitDir = (depth = 0) => {
  const dir = path.join(
    process.cwd(),
    Array.from(new Array(depth)).join('..'),
    '.git'
  );
  return fs.existsSync(dir) ? dir.replace('.git', '') : getGitDir(depth++);
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
