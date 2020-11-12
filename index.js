#! /usr/bin/env node

const main = require('./src/main');
const mri = require('mri');

const parseFlags = ({
  e,
  m,
  a,
  execute = e,
  messageOnly = m,
  overrideConfig,
  autoscope = a,
  customParams,
  debug,
}) => ({
  execute,
  messageOnly,
  overrideConfig,
  autoscope,
  customParams,
  debug,
});

function parseArgs() {
  const argv = process.argv.slice(2);
  const { _, ...rest } = mri(argv);

  return {
    ...rest,
    customParams: _.map((param) =>
      param.length === 1 ? `-${param}` : `--${param}`
    )
      .join(' ')
      .trim(),
  };
}

main(parseFlags(parseArgs()));
