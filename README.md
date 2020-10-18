# Commit-Generator

## What it does?

it generates commit commands\messages and copy them to your clipboard

## How i use it?

run `npx commit-generator` and follow the walkthrough. <br/>
you can add the following flags:

- `--copyMessage` will strip the commit command and format only it message
- `--execute` will run
  1. git add .
  2. git commit {generated_message}
  3. git pull --rebase
  4. git push

you can also add any valid git flag to your generated commit like this: <br>
`npx commit-generator n --execute` <br>
it will add `-n` flag to the generated commit message
