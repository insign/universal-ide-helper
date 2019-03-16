const os   = require('os')
const glob = require('glob')

const homedir     = os.homedir()
const globApps    = '.+(PhpStorm|WebStorm|IntelliJ|PyCharm|Rider|GoLand)*'
const globOptions = {
  dot:    true,
  nocase: true,
}

const jetbrainsConfigFolder = () => {
  let apps
  switch (os.platform()) {
    case 'darwin':
      return glob.sync(homedir + '/Library/Preferences/' + globApps, globOptions)
      break
    case 'win32':
      apps = glob.sync(homedir + '/' + globApps, globOptions)
      return apps.map(x => x + '/config')
      break
    default:
      apps = glob.sync(homedir + '/' + globApps, globOptions)
      return apps.map(x => x + '/config')
      break
  }
}

export { jetbrainsConfigFolder }