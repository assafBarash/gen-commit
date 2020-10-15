#! /usr/bin/env node

const mri = require('mri');
const prompts = require('prompts');
const { exec, spawn } = require('child_process');
const { commitMessageParamsPrompts, executionFlow } = require('./prompts');

async function main() {
  const {gitflow, copyMessage} = parseArgs();

  const commitMessageParams = await prompts(commitMessageParamsPrompts);
  const {mainMessage, metadataMessage} = buildCommitMessages(commitMessageParams);
  const commitCommand = `git commit -m "${mainMessage}" -m "${metadataMessage}"`;

  if (gitflow) {
    await executeCommit(commitCommand, await prompts(executionFlow));
    return;
  }

  if (copyMessage) {
    const commitMessage = `${mainMessage}\n${metadataMessage}`;
    copyToClipboard(commitMessage);
    return;
  }

  copyToClipboard(commitCommand);
}

function parseArgs() {
  const argv = process.argv.slice(2);
  return mri(argv);
}

function buildCommitMessages({ scope, description, type, ticketNumber, crs }) {
  const mainMessage = `${type}${scope}: ${description}`;
  const metadataMessage = buildMetadataMessage(ticketNumber, crs);

  return {mainMessage, metadataMessage};
}

function buildMetadataMessage(ticketNumber, crs) {
  if (!ticketNumber && !crs)
    return '';

  if (ticketNumber && !crs)
    return `${ticketNumber}`;

  if (!ticketNumber && crs)
    return `${crs}`;

  return `${ticketNumber} ${crs}`;
}

async function executeCommit(commitCommand, { commit, pull, push, addDir }) {
  console.info(commitCommand);

  const executeCommand = (cmd) =>
    new Promise((resolve, reject) =>
      exec(cmd, (err, stdout, stderr) =>
        err ? reject({ err, stderr, stdout }) : resolve(stdout)
      )
    );

  addDir && (await executeCommand('git add .'));
  return (
    commit &&
    executeCommand(commitCommand)
      .then(() => pull && executeCommand('git pull --rebase --autostash'))
      .then(() => push && executeCommand('git push'))
      .then(() => console.log('SUCCESS'))
      .then(process.exit)
      .catch(console.error)
  );
}

function copyToClipboard(data) {
  const proc = spawn('pbcopy');
  proc.stdin.write(data);
  proc.stdin.end();

  console.log('Copied to clipboard!');
}


main();
