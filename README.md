# Do Git Commit

## What It Does?

it generates commit commands\messages and copy them to your clipboard

## How Do I Use It?

run `npx dgc` and follow the walkthrough <br/>

## Flags

- `--overrideConfig=./path/to/config` will override any config and will load the config in the path instead
- `--autoscope | -a` skip scope prompt and uses the current working dir as scope
- `--messageOnly | -m`\* will strip the commit command and format only it message
- `--execute | -e`\* will run

  1. git add .
  2. git commit {generated_message}
  3. git pull --rebase
  4. git push

- `--f | -selectFiles` on execute will enable to select files from git diff instead of running `git add .`

flags with \* will override each other (only one may be used)

## Additional GIT Flags

you can also add any valid git flag to your generated commit like this: <br>
`npx dgc n --execute` <br>
it will add `-n` flag to the generated commit message

## Add Custom Config

you can extend the commit generator by having a `commit-generator.config.js` anywhere above your CWD hierarchy.
the config file should export an array of objects as following:

- the config file can export async function as well, where the first argument is the default steps and the second is the given flags

```
{
   prompts: [
     {
      type: "text",
      name: "keyA"
     },
     {
      type: "text",
      name: "keyB"
      // see prompts docs for further config
     },
   ],
   format: "{{keyA}} {{keyB}}"
}
```

_prompts_ - prompts flow to build a single git `-m` statement. see [prompts docs](https://github.com/terkelg/prompts#readme) for possible config & usage.

_format<string | function>_ - the fashion in which the input acquired by the prompts flow will be arranged. <br>
**when value is string** the name of each prompt can be used as value by wrapping with double brackets. example: {{prompt_name}} -> user input for that prompt step. <br>
**when value is function** the first argument will be an object with keys & values populated from prompts, the returned value should be a string of the formatted message section
