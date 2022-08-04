#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import handleError from './utils/handleError'

yargs(hideBin(process.argv))
  .commandDir('commands', {
    extensions: ['js', 'ts']
  })
  .command(
    '$0',
    'CLI for interfacing with Unleash: https://www.getunleash.io/',
    () => undefined,
    () => {
      yargs.showHelp()
    }
  )
  .strict()
  .alias({ h: 'help', v: 'version' })
  .epilogue('https://github.com/nunogois/unleash-cli')
  .fail(handleError).argv
