#! /usr/bin/env node

const main = require('./src/main');
const mri = require('mri');

const parseFlags = ({
  // aliases
  e, // execute commit, pull --rebase, push
  m, // strip command to message only
  a, // auto determine scope
  // flags
  execute = e,
  messageOnly = m,
  overrideConfig,
  autoscope = a,
  customParams,
}) => ({
  execute,
  messageOnly,
  overrideConfig,
  autoscope,
  customParams,
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
