const { exec, spawn } = require('child_process');
const {
  getMessageSections,
  buildMessageSection,
} = require('./message-section-handlers');
const { asyncMap } = require('./utils');

async function main(flags) {
  const { execute, messageOnly, customParams } = flags;

  const config = await getMessageSections(flags);

  const commitCommand = `git commit -m ${customParams} ${(
    await asyncMap(config, buildMessageSection)
  )
    .map((str) => `"${str}"`)
    .join(' -m ')}`;

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

  const executeCommand = (cmd) =>
    new Promise((resolve, reject) =>
      exec(cmd, (err, stdout, stderr) =>
        err ? reject({ err, stderr, stdout }) : resolve(stdout)
      )
    );

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

function copyToClipboard(data) {
  const proc = spawn('pbcopy');
  proc.stdin.write(data);
  proc.stdin.end();

  console.log('Copied to clipboard!');
}

module.exports = main;
