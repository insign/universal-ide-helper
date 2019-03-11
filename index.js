const program   = require('commander')
const {version} = require('./package.json')

module.exports = () => {
  program
      .version(version, '-v, --version')


  program
      .command('install')
      .description('download and install all available ide helpers sets')
      .action(function () {
        require('./commands/install')
      })

  program.parse(process.argv)
}