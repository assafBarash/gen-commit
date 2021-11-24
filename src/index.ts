#! /usr/bin/env node

import { main } from './main';
import mri from 'mri';
import { Flags } from './types';

type FlagsParams = Flags & {
  a: boolean;
  e: boolean;
  m: boolean;
  f: boolean;
  p: boolean;
};

const parseFlags = ({
  // aliases
  e, // execute commit, pull --rebase, push
  m, // strip command to message only
  a, // auto determine scope
  f, // select files to stage
  // flags
  execute = e,
  messageOnly = m,
  overrideConfig,
  autoscope = a,
  customParams,
  selectFiles = f,
  ...rest
}: FlagsParams): Flags => ({
  execute,
  messageOnly,
  overrideConfig,
  autoscope,
  selectFiles,
  customParams,
  ...rest,
});

function parseArgs(): FlagsParams {
  const argv = process.argv.slice(2);
  const { _, ...rest } = mri(argv);

  return {
    ...rest,
    customParams: _.map((param) =>
      param.length === 1 ? `-${param}` : `--${param}`
    )
      .join(' ')
      .trim(),
  } as FlagsParams;
}

main(parseFlags(parseArgs()));
