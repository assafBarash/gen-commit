import { ConfigFunction } from './types';

const choiceFromEnum = ([value, description, title = value]: [
  string,
  string,
  string?
]) => ({
  title,
  value,
  description,
});

export enum CommitType {
  feat = 'a new Feature',
  fix = 'a bug fix',
  refactor = 'a code change that neither fixes a bug nor adds a feature',
  chore = "other changes which don't fall under other type and cannot be named refactoring",
  test = 'adding missing tests or correcting existing tests',
  build = 'changes that affect the build system or external dependencies',
  perf = 'a code change that improves performance',
  ci = 'changes to our CI configuration files and scripts',
  style = 'changes that do not affect the meaning of the code',
}

export const defConfig: ConfigFunction = (_, { autoscope }) => ({
  format: ({ type, scope, description }) =>
    `${type}${
      autoscope ? `(${process.cwd().split('/').pop()})` : scope
    }: ${description}`,
  prompts: [
    {
      type: 'autocomplete',
      name: 'type',
      message: 'Select commit type',
      choices: Object.entries(CommitType).map(choiceFromEnum),
    },
    {
      type: !autoscope && 'text',
      name: 'scope',
      message: 'Enter scope',
      initial: process.cwd().split('/').pop(),
      format: (scope) => (scope ? `(${scope})` : ''),
    },
    {
      type: 'text',
      name: 'description',
      message: 'Enter commit message',
      validate: Boolean,
    },
  ],
});
