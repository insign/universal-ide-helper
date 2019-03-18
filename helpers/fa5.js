import { template as t }    from 'lodash'

import { jetbrainsConfigFolder } from '../commons'

const fs = require('fs')

let prepare, install, templates = [], built = {}

templates = [
  {
    ide:      'jetbrains',
    template: '<template name="${target}" value="${target}" shortcut="ENTER" description="${target}" toReformat="true" toShortenFQNames="true">\n' +
                  ' <context>\n' +
                  '      <option name="HTML" value="true" />\n' +
                  '      <option name="HTML_TEXT" value="false" />\n' +
                  '      <option name="VUE_COMPONENT_DESCRIPTOR" value="false" />\n' +
                  '      <option name="VUE_SCRIPT" value="false" />\n' +
                  '      <option name="VUE_TEMPLATE" value="false" />\n' +
                  '      <option name="VUE_TOP_LEVEL" value="false" />\n' +
                  '      <option name="Vue" value="true" />\n' +
                  ' </context>' +
                  '</template>\n',
  },
]

built.jetbrains = []

prepare = async (props) => {
  let decoded, bundle, content, regex

  let mdi = {owner: 'FortAwesome', repo: 'Font-Awesome', path: 'css/all.css', ref: 'master'}

  content = await octokit.repos.getContents(mdi)


  decoded = Buffer.from(content.data.content, 'base64').toString()

  // tree_sha = tree_sha.data.find(x => x.name == 'svg')
  regex  = /\.fa-[^\s:{]+/mg
  bundle = decoded.match(regex)
  bundle = bundle.map(c => c.substr(1)) // remove . at the beginning

  return {list: bundle}
}


install = async (bundle, props) => {
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