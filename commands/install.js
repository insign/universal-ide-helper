import { helpers } from '../helpers/all'

export default () => {
  // spinner = ora({indent: 2, color: 'yellow'}).start(`Iniciando`)

  helpers.forEach(helper => {
    let spinner = ora({indent: 2}).start(`Installing ${ helper.title }`)
    let hs      = import('../helpers/' + helper.slug)


    hs
        .then(async (module) => {
          await module.prepare(helper)
                      .then(async bundle => {
                        await module.install(bundle, helper)
                                    .then(() => {
                                      spinner.succeed(`Installed ` + chalk.bold(helper.title))
                                    })
                                    .catch((err) => {
                                      spinner.fail(`Fail to install ${ helper.title } - ${ err }`)
                                      spinner.stop()
                                    })
                      })
                      .catch((err) => { console.error(err) })
        })
        .catch((err) => { console.error(err) })
        .finally(() => {
        })
  })
}