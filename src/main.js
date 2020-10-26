const prompts = require('prompts');
const { exec, spawn } = require('child_process');
const { commitMessageParamsPrompts } = require('./prompts');
const { customConfig } = require('./config');

async function main({
  execute,
  copyMessage,
  overrideConfig,
  autoscope,
  customParams,
}) {
  const commitMessageParams = await prompts(
    commitMessageParamsPrompts.filter(
      ({ name }) => name !== 'scope' || !autoscope
    )
  );

  const mainMessage = buildCommitMessages({
    ...commitMessageParams,
    autoscope: autoscope ? `(${process.cwd().split('/').pop()})` : '',
  });
  const additionalMessages = await customConfig(overrideConfig).then(
    (messages) =>
      messages
        .filter((message) => message.trim())
        .map((message) => `-m "${message}"`)
        .join(' ')
  );

  const commitCommand = `git commit ${customParams} --allow-empty -m "${mainMessage}" ${additionalMessages}`;

  if (execute) {
    return executeCommit(commitCommand);
  }

  if (copyMessage) {
    const commitMessage = `${mainMessage}\n${additionalMessages
      .split('-m')
      .join('\n')}`;
    copyToClipboard(commitMessage);
  } else {
    copyToClipboard(commitCommand);
  }
}

function buildCommitMessages({ scope, description, type, autoscope }) {
  return `${type}${scope || autoscope}: ${description}`;
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