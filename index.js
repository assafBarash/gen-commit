#! /usr/bin/env node

const { exec } = require('child_process');
const prompts = require('prompts');

const executeCommand = (cmd) =>
  new Promise((resolve, reject) =>
    exec(cmd, (err, stdout, stderr) =>
      err ? reject({ err, stderr }) : resolve(stdout)
    )
  );

const createChoice = ({ value, title = value, description }) => ({
  title,
  value,
  description,
});

(async () => {
  const { scope, description, type, ticketNumber, crs } = await prompts([
    {
      type: 'select',
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
      validate: Boolean,
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
      format: (ticketNumber) => ticketNumber,
    },
    {
      type: 'text',
      name: 'crs',
      message: 'Enter CRs (separated by ,)',
      validate: Boolean,
      format: (crs) =>
        crs
          .split(',')
          .map((cr) => `@${cr}`)
          .join(''),
    },
  ]);

  const commitCommand = `git commit -m "${type}(${scope}): ${description}" -m "${ticketNumber} ${
    crs ? `#cr${crs}` : ''
  }"`;
  console.log(commitCommand);

  const { commit, pull, push, addDir } = await prompts([
    {
      type: 'confirm',
      name: 'addDir',
      message: 'add current dir?',
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
  ]);

  addDir && (await executeCommand('git add .'));
  commit &&
    executeCommand(commitCommand)
      .then(() => pull && executeCommand('git pull --rebase --autostash'))
      .then(() => push && executeCommand('git push'))
      .then(() => console.log('SUCCESS'))
      .then(process.exit)
      .catch(console.error);
})();
