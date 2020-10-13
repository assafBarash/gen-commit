const createChoice = ({ value, title = value, description }) => ({
  title,
  value,
  description,
});

const commitMessageParams = [
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
      { value: 'perf', description: 'A code change that improves performance' },
      {
        value: 'style',
        description: 'Changes that do not affect the meaning of the code',
      },
    ].map(createChoice),
  },
  {
    type: 'text',
    name: 'scope',
    message: 'Enter scope',
    format: (scope) => (scope ? `(${scope})` : ''),
  },
  {
    type: 'text',
    name: 'description',
    message: 'Enter description',
    validate: Boolean,
  },
  {
    type: 'text',
    name: 'ticketNumber',
    message: 'Enter ticket number',
    format: (ticketNumber) => (ticketNumber ? `#${ticketNumber}` : ''),
  },
  {
    type: 'text',
    name: 'crs',
    message: 'Enter CRs (separated by ,)',
    initial: '',
    format: (crs) =>
      crs
        ? `#cr${crs
            .split(',')
            .map((cr) => `@${cr}`)
            .join('')}`
        : '',
  },
];

const executionFlow = [
  {
    type: 'confirm',
    name: 'addDir',
    message: 'Add current directory?',
    initial: true,
  },
  {
    type: 'confirm',
    name: 'commit',
    message: 'Execute the above commit commit?',
    initial: true,
  },
  {
    type: (prev) => (prev ? 'confirm' : null),
    name: 'pull',
    message: 'Execute pull and rebase?',
    initial: true,
  },
  {
    type: (prev) => (prev ? 'confirm' : null),
    name: 'push',
    message: 'Execute push?',
    initial: true,
  },
];

module.exports = { executionFlow, commitMessageParams };
