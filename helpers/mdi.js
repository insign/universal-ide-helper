import { map, template as t }    from 'lodash'
import Octokit                   from '@octokit/rest'
import { jetbrainsConfigFolder } from '../commons'

const fs = require('fs')

const props = {
  slug:     'mdi',
  title:    'Material Design Icons',
  file:     'mdi.js',
  category: 'icons',
}


let prepare, install, templates = [], built = {}

templates = [
  {
    ide:      'jetbrains',
    template: '<template name="${target}" value="${target}" shortcut="ENTER" description="${target}" toReformat="true" toShortenFQNames="true">\n' +
                  '    <context>\n' +
                  '      <option name="VUE_INSIDE_TAG" value="true" />\n' +
                  '    </context>\n' +
                  '</template>\n',
  },
]

built.jetbrains = []

prepare = async () => {
  const octokit = new Octokit()

  let mdi = {owner: 'Templarian', repo: 'MaterialDesign', path: 'icons/svg', ref: 'master'}

  return octokit.repos.getContents(mdi)
                .then(result => {
                  let bundle = map(result.data, 'name')

                  bundle = bundle.map(x => 'mdi-' + x.split('.').slice(0, -1).join('.'))

                  return {list: bundle}
                })
}


install = async (bundle) => {
  // Applies the template
  bundle.list.forEach((target) => {
    templates.forEach((it) => {
      built[ it.ide ].push(t(it.template)({target, props}))
    })
  })

  // Save to JetBrains 
  let jetBrainsFolders = jetbrainsConfigFolder()
  let content          = built.jetbrains.join('\n')

  content = `<templateSet group="${ props.title }">${ content }</templateSet>`

  jetBrainsFolders.forEach(f => {
    fs.writeFileSync(f + '/jba_config/templates/' + props.title + '.xml', content, err => {
      if (err) {
        Promise.reject(err)
      }
      else {
        Promise.resolve(true)
      }
    })
  })

}

export { prepare, install, templates }