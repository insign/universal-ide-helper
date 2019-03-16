import ora from 'ora'

import { helpers } from '../helpers/all'

export default () => {

  let spinner    = ora()
  spinner.indent = 2
  helpers.forEach(helper => {

    spinner.start(`Preparing ${ helper.title }`)

    let hs = import('../helpers/' + helper.slug)

    hs
        .then((module) => {
          module.prepare()
                .then(bundle => {
                  spinner.color = 'yellow'
                  spinner.text  = `Installing ${ helper.title }`

                  module.install(bundle)
                        .then((installed) => {
                          spinner.succeed(`Installed ${ helper.title }`)
                        })
                        .catch((err) => {
                          console.error(err)
                          spinner.fail(`Fail to install ${ helper.title }`)
                        })
                })
                .catch((err) => { console.error(err) })
        })
        .catch((err) => { console.error(err) })


  })

}