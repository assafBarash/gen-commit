import { spawn } from 'child_process';
import prompts from 'prompts';
import { main } from './main';
import { Flags } from './types';

const setupTest = async ({
  flags = {},
  input,
}: {
  flags?: Flags;
  input: string[];
}) => {
  prompts.inject(input);
  await main(flags);

  return new Promise((r) => {
    const child = spawn('pbpaste');

    const data: any = [];
    child.stdout
      .on('data', (chunk) => data.push(chunk))
      .on('end', () => r(data.toString()));
  });
};

describe('commit generator', () => {
  it('should generate commit command when running without flags', async () => {
    const input = ['feat', 'scope-value', 'message-value'];

    const result = await setupTest({
      input,
    });

    const [commitType, scope, message] = input;

    expect(result).toBe(`git commit -m "${commitType}(${scope}): ${message}"`);
  });

  it('should generate commit message when running with --messageOnly flag ()', async () => {
    const input = ['feat', 'scope-value', 'message-value'];

    const result = await setupTest({
      flags: { messageOnly: true },
      input,
    });

    const [commitType, scope, message] = input;

    expect(result).toBe(`${commitType}(${scope}): ${message}`);
  });
});
