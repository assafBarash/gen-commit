import { spawn } from 'child_process';
import prompts from 'prompts';
import { CommitType } from './def-config';
import { main } from './main';
import { Flags } from './types';

type TestCase = [
  string,
  {
    flags: Flags;
    input: [string, string, string] | [CommitType, string];
  }
];

it.each([
  [
    'it should pass',
    {
      flags: {},
      input: ['feat', 'scope-value', 'message-value'],
    },
  ],
] as TestCase[])('commit generator', async (msg, { input, flags }) => {
  prompts.inject(input);
  await main(flags);

  const result = await new Promise((r) => {
    const child = spawn('pbpaste');

    const data: any = [];
    child.stdout
      .on('data', (chunk) => data.push(chunk))
      .on('end', () => r(data.toString()));
  });

  const [commitType, scope, message] = input;

  expect(result).toBe(`git commit -m "${commitType}(${scope}): ${message}"`);
});
