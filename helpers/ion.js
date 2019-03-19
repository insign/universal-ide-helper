import { map, template as t, uniq } from 'lodash'
import { jetbrainsConfigFolder }    from '../commons'

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
  let bundle = [], tree_sha, files

  let repo = {owner: 'ionic-team', repo: 'ionicons', path: 'src', ref: 'master'}

  tree_sha = await octokit.repos.getContents(repo)
  tree_sha = tree_sha.data.find(x => x.name == 'svg')

  repo.tree_sha = tree_sha.sha

  files = await octokit.git.getTree(repo)
  files = files.data.tree
  files = map(files, 'path')

  bundle = files.map(x => 'ion-' + x.split('.').slice(0, -1).join('.'))

  bundle = uniq(bundle)

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