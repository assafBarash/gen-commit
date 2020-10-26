# Commit-Generator

## What It Does?

it generates commit commands\messages and copy them to your clipboard

## How Do I Use It?

run `npx commit-generator` and follow the walkthrough. <br/>
you can add the following flags:

## Additional Flags

- `--copyMessage` will strip the commit command and format only it message\*
- `--execute` will run\*
  1. git add .
  2. git commit {generated_message}
  3. git pull --rebase
  4. git push
- `--overrideConfig=./path/to/config` will override any config and will load the config in the path instead

flags with \* will override each other (only one may be used)

you can also add any valid git flag to your generated commit like this: <br>
`npx commit-generator n --execute` <br>
it will add `-n` flag to the generated commit message

## Add Custom Config

you can extend the commit generator by having a `commit-generator.config.js` file in the root of you repo.
the config file should export an array of objects as following:

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

_format_ - the fashion in which the input acquired by the prompts flow will be arranged. the name of each prompt can be used as value by wrapping with double brackets. example: {{prompt_name}} -> user input for that prompt step
