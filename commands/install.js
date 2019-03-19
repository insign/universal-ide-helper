import { helpers }      from '../helpers/all'

export default () => {
  // spinner = ora({indent: 2, color: 'yellow'}).start(`Iniciando`)

  const start = async () => {
    await Promise.all(helpers.map(async helper => {
      let spinner = ora({indent: 2})
      let hs      = import('../helpers/' + helper.slug)

      await hs
          .then(async (module) => {
            spinner.start(`Installing ${ helper.title }`)
            await module.prepare(helper)
                        .then(async bundle => {
                          await module.install(bundle, helper)
                                      .then(() => {
                                        spinner.succeed(`Installed ` + chalk.bold(helper.title))
                                      })
                                      .catch((err) => {
                                        spinner.fail(`Fail to install ${ helper.title }`)
                                      })
                        })
                        .catch((err) => {
                          spinner.fail(`Fail to install ${ helper.title }`)
                          // console.error(err)
                        })
          })
          .catch((err) => {
            spinner.fail(`Fail to install ${ helper.title }`)
            spinner.stop()
            // console.error(err)
          })
          .finally(() => {
            spinner.stop()
          })
    }))
    console.log('\n' + chalk.bold.blueBright('Done!') + ' Please, restart your JetBrains IDE then go to Settings > Live Templates and disable what you don\'t need.')
    console.log('\n' + chalk.gray('To check where the files was saved, try ' + chalk.bold('ide paths')))
  }

  start()
}