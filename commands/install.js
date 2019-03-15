const ora = require('ora')

import { map } from 'lodash'


export default () => {
  const spinner = ora('Downloading available helpers sets').start()
  // spinner.succeed('10 helpers sets found.')
  // ora('Downloading available helpers sets').start()

  const Octokit = require('@octokit/rest')
  const octokit = new Octokit()

  let mdi = {owner: 'Templarian', repo: 'MaterialDesign', path: 'icons/svg', ref: 'master'}

  octokit.repos.getContents(mdi).then(result => {
    spinner.stop()
    console.info(map(result.data, 'name'))
    // spinner.succeed('10 helpers sets found.')
  })
}