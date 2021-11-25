import { Flags } from './types';
import prompts from 'prompts';
import { buildMessageSections } from './message-section-handlers';
import { copyToClipboard } from './utils';
import { execSync } from 'child_process';

export async function main(flags: Flags) {
  const { execute, messageOnly, customParams = '', selectFiles } = flags;

  selectFiles &&
    (await prompts([
      {
        type: 'autocompleteMultiselect',
        name: 'files',
        message: 'Enter files to add',
        hint: '- Space to select. Return to submit',
        choices: execSync('git diff --name-only')
          .toString()
          .split('\n')
          .filter(Boolean)
          .map((d: string) => ({ title: d, value: d })),
      },
    ]).then(({ files }: { files: string[] }) =>
      execSync(`git add ${files.join(' ')}`)
    ));

  const commitCommand =
    `git commit ${customParams} -m ${await buildMessageSections(flags)}`
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
            .trim()
        : commitCommand
    );
}

async function executeCommit(commitCommand: string, { selectFiles }: Flags) {
  console.log(commitCommand);

  !selectFiles && (await execSync('git add .'));

  execSync(commitCommand);
  console.log('commit SUCCESS');
  execSync('git pull --rebase --autostash');
  console.log('pull SUCCESS');
  execSync('git push');
  console.log('push SUCCESS');
  console.log('git commands executed');
  process.exit();
}
