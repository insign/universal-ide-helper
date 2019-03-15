import program from 'commander'
import helpers from './commands/helpers'
import install from './commands/install'

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