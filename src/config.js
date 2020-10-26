const fs = require('fs');
const path = require('path');
const _prompts = require('prompts');

const CONFIG_FILE = 'commit-generator.config';

const getGitDir = (depth = 0) => {
  const dir = path.join(
    process.cwd(),
    Array.from(new Array(depth)).join('..'),
    '.git'
  );
  return fs.existsSync(dir) ? dir.replace('.git', '') : getGitDir(depth++);
};

const configDir = path.join(getGitDir(), CONFIG_FILE);
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
