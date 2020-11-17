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

  if (execute) return executeCommit(commitCommand);
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

async function executeCommit(commitCommand) {
  console.log(commitCommand);

  await executeCommand('git add .');
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
