import { spawn } from 'child_process';
import prompts from 'prompts';
import { main } from './main';
import { Flags } from './types';
import { lookup } from './utils';
import fs from 'fs';

const runDGC = async ({
  flags = {},
  input,
}: {
  flags?: Flags;
  input: Array<string | string[]>;
}) => {
  prompts.inject(input);
  await main(flags);

  return new Promise((resolve, reject) => {
    const child = spawn('pbpaste');

    const data: any = [];
    child.stdout
      .on('data', (chunk) => data.push(chunk))
      .on('error', reject)
      .on('end', () => resolve(data.toString()));
  });
};

describe('commit generator', () => {
  it('should generate commit command when running without flags', async () => {
    const input = ['feat', 'scope-value', 'message-value'];

    const result = await runDGC({
      input,
    });

    const [commitType, scope, message] = input;

    expect(result).toBe(`git commit -m "${commitType}(${scope}): ${message}"`);
  });

  it('should generate commit message when running with --messageOnly flag', async () => {
    const input = ['feat', 'scope-value', 'message-value'];

    const result = await runDGC({
      flags: { messageOnly: true },
      input,
    });

    const [commitType, scope, message] = input;

    expect(result).toBe(`${commitType}(${scope}): ${message}`);
  });

  it('should generate commit message with current scope when running with --autoscope flag', async () => {
    const input = ['feat', 'message-value'];

    const result = await runDGC({
      flags: { autoscope: true },
      input,
    });

    const [commitType, message] = input;

    expect(result).toBe(
      `git commit -m "${commitType}(git-commit): ${message}"`
    );
  });

  it('should generate commit message with custom config', async () => {
    const input = [
      'feat',
      'scope-value',
      'message-value',
      '123',
      ['a', 'b', 'c'],
    ];

    const testConfigTemplatePath = lookup('test.commit-generator.config.js');
    const testConfigPath = testConfigTemplatePath.replace('test.', '');
    fs.renameSync(testConfigTemplatePath, testConfigPath);

    const result = await runDGC({
      input,
    });

    fs.renameSync(testConfigPath, testConfigTemplatePath);
    const [commitType, scope, message] = input;

    expect(result).toBe(
      `git commit -m "${commitType}(${scope}): ${message}" -m "#EE-123 #cr@a,b,c"`
    );
  });

  it('should generate commit message with custom config', async () => {
    const input = [
      'feat',
      'scope-value',
      'message-value',
      '123',
      ['a', 'b', 'c'],
    ];

    const result = await runDGC({
      input,
      flags: { overrideConfig: lookup('test.commit-generator.config.js') },
    });

    const [commitType, scope, message] = input;

    expect(result).toBe(
      `git commit -m "${commitType}(${scope}): ${message}" -m "#EE-123 #cr@a,b,c"`
    );
  });
});
