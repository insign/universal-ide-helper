import { helpers } from '../helpers/all'

import { jetbrainsConfigFolder } from '../commons'

export default () => {
  console.info(jetbrainsConfigFolder())
  console.table(helpers)

  process.exit(0)
}

