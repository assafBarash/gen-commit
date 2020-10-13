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
      'feat',
      'fix',
      'chore',
      'refactor',
      'test',
      'revert',
      'build',
      'ci',
      'docs',
      'perf',
      'style',
    ].map((commitType) => createChoice({ value: commitType })),
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
    format: (ticketNumber) => (ticketNumber ? `Closes #${ticketNumber}` : ''),
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
