#! /usr/bin/env node

const { exec } = require('child_process');
const prompts = require('prompts');
const { commitMessageParams, executionFlow } = require('./prompts');

async function main() {
  const commitCommand = buildCommitMessage(await prompts(commitMessageParams));

  console.log(commitCommand);

  executeCommit(commitCommand, await prompts(executionFlow));
}

function buildCommitMessage({ scope, description, type, ticketNumber, crs }) {
  const commitHead = `-m "${type}${scope}: ${description}"`;
  const commitBody = ticketNumber || crs ? `-m "${ticketNumber} ${crs}"` : '';
  return `git commit ${commitHead} ${commitBody}`;
}

async function executeCommit(commitCommand, { commit, pull, push, addDir }) {
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

main();
