const prompts = require('prompts');
const { buildMessageSections } = require('./message-section-handlers');
const { copyToClipboard, executeCommand } = require('./utils');

async function main(flags) {
  const { execute, messageOnly, customParams } = flags;

  const commitCommand = `git commit ${customParams} -m ${await buildMessageSections(
    flags
  )}`
    .split(' ')
    .filter(Boolean)
    .join(' ');

  if (execute) return executeCommit(commitCommand, flags);
  else
    copyToClipboard(
      messageOnly
        ? `${commitCommand
            .split('-m')
            .filter((s, idx) => idx)
            .join('\n')}`
            .split('"')
            .join('')
        : commitCommand
    );
}

async function executeCommit(commitCommand, { selectStaging }) {
  console.log(commitCommand);

  await (!selectStaging
    ? executeCommand('git add .')
    : prompts([
        {
          type: 'autocompleteMultiselect',
          name: 'files',
          message: 'Enter files to add',
          hint: '- Space to select. Return to submit',
          choices: (await executeCommand('git diff --name-only'))
            .split('\n')
            .filter(Boolean)
            .map((d) => ({ title: d, value: d })),
        },
      ]).then(({ files }) => executeCommand(`git add ${files.join(' ')}`)));

  return;
  return executeCommand(commitCommand)
    .then(() => console.log('commit SUCCESS'))
    .then(() => executeCommand('git pull --rebase --autostash'))
    .then(() => console.log('pull SUCCESS'))
    .then(() => executeCommand('git push'))
    .then(() => console.log('push SUCCESS'))
    .then(() => console.log('git commands executed'))
    .then(process.exit)
    .catch(console.error);
}

module.exports = main;
