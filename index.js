import program from 'commander'
import dotenv  from 'dotenv'
import Octokit from '@octokit/rest'
import chalk   from 'chalk'
import ora     from 'ora'
import helpers from './commands/helpers'
import install from './commands/install'

dotenv.config()

const gh_token = process.env.GH_TOKEN || null
global.octokit = new Octokit(gh_token ? {auth: 'token ' + process.env.GH_TOKEN} : null)

global.chalk = chalk
global.ora   = ora


program
    .version(require('./package.json').version, '-v, --version')

program
    .command('install')
    .description('download and install all available ide helpers sets')
    .action(install)

program
    .command('helpers')
    .description('list helper sets available')
    .action(helpers)

program.parse(process.argv)