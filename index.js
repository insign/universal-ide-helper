const program   = require('commander')
const {version} = require('./package.json')

module.exports = () => {
  program
      .version(version, '-v, --version')


  program
      .command('install')
      .description('download and install all available ide helpers sets')
      .action(function () {
        require('./built/install')
      })
  
  program
      .command('helpers')
      .description('list helper sets available')
      .action(function () {
        require('./built/helpers')
      })

  program.parse(process.argv)
}