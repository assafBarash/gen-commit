import { ConfigFunction } from './types';

const createChoice = ({
  value,
  title = value,
  description,
}: {
  value: string;
  title?: string;
  description: string;
}) => ({
  title,
  value,
  description,
});

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
      choices: [
        { value: 'feat', description: 'A new feature' },
        { value: 'fix', description: 'A bug fix' },

        {
          value: 'refactor',
          description:
            'A code change that neither fixes a bug nor adds a feature',
        },
        {
          value: 'chore',
          description:
            "Other changes which don't fall under other type and cannot be named refactoring",
        },
        {
          value: 'test',
          description: 'Adding missing tests or correcting existing tests',
        },
        { value: 'revert', description: 'A Commit Revert' },
        {
          value: 'build',
          description:
            'Changes that affect the build system or external dependencies',
        },
        {
          value: 'ci',
          description: 'Changes to our CI configuration files and scripts',
        },
        { value: 'docs', description: 'Documentation only changes' },
        {
          value: 'perf',
          description: 'A code change that improves performance',
        },
        {
          value: 'style',
          description: 'Changes that do not affect the meaning of the code',
        },
      ].map(createChoice),
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
