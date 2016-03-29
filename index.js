var Metalsmith = require('metalsmith')
var markdown = require('metalsmith-markdown')
var layouts = require('metalsmith-layouts')
var permalinks = require('metalsmith-permalinks')
var less = require('metalsmith-less')
var path = require('path')
var cp = require('child_process')
var repo = require('./package').repository.url

Metalsmith(path.join(__dirname))
  .use(loadSource(path.resolve(__dirname,'node_modules','warau-artwork','dist'),'images'))
  .use(markdown())
  .use(layouts('handlebars'))
  .use(permalinks(':title'))
  .use(less({
    render: {
      paths: [
        path.join(__dirname, 'node_modules', 'bootstrap', 'less')
      ]
    }
  }))
  .build(function (err) {
    if (err) throw err;
    if (process.argv[2] === 'deploy') {
      git('init')
      git('add', '.')
      git('commit', '-a', '-m', 'Update github site')
      git('push', '-f', repo  , 'master')
    }
  })

function git ( /** dynamic arguments **/) {
  console.log(cp.execFileSync('git', Array.prototype.slice.apply(arguments), {
    cwd: path.join(__dirname, 'build'),
    env: process.env,
    encoding: 'utf-8'
  }))
}

function loadSource(directory,target) {
  return function(files, metalsmith, done) {
    metalsmith.read(directory, function(err, newFiles) {
      if (err) {
        return done(err)
      }
      Object.keys(newFiles).forEach(function(file) {
        files[`${target}/${file}`] = newFiles[file];
      })
      done()

    });

  }
}
