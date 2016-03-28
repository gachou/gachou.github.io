var Metalsmith = require('metalsmith')
var markdown = require('metalsmith-markdown')
var layouts = require('metalsmith-layouts')
var permalinks = require('metalsmith-permalinks')
var less = require('metalsmith-less')
var path = require('path')
var cp = require('child_process')
var repo = require('./package').repository.url

console.log(__dirname)
Metalsmith(path.join(__dirname))
  .destination('dist')
  .use(markdown())
  .use(layouts('handlebars'))
  .use(permalinks(':title'))
  .use(less({
    render: {
      paths: [
        path.join(__dirname, 'node_modles', 'bootstrap', 'less')
      ]
    }
  }))
  .build(function (err) {
    if (err) throw err
    if (process.argv[2] === 'deploy')
      git('init')
    git('add', '.')
    git('commit', '-a', '-m', 'Update github site')
    git('push', '-f', repo, 'master')
  })

function git ( /** dynamic arguments **/) {
  console.log(cp.execFileSync('git', Array.prototype.slice.apply(arguments), {
    cwd: path.join(__dirname, 'dist'),
    env: process.env,
    encoding: 'utf-8'
  }))
}
