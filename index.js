var Metalsmith = require('metalsmith')
var markdown = require('metalsmith-markdown')
var layouts = require('metalsmith-layouts')
var permalinks = require('metalsmith-permalinks')
var less = require('metalsmith-less')
var path = require('path')
var cp = require('child_process')
var repo = require('./package').repository.url
var yargs = require('yargs').argv
var liveServer = require('live-server')
var chokidar = require('chokidar')

var artworkDist = path.resolve(__dirname, 'node_modules', 'warau-artwork', 'dist')
var artworkLess = path.join(__dirname, 'node_modules', 'warau-artwork', 'less')

function build (callback) {
  Metalsmith(path.join(__dirname))
    .clean(!yargs.dev)
    .use(loadSource(artworkDist, 'images'))
    .use(loadSource(path.resolve(__dirname, '..','smiles'), 'smiles'))
    .use(loadSource(path.join(__dirname, 'node_modules', 'bootstrap', 'fonts'), 'fonts'))
    .use(markdown())
    .use(layouts('handlebars'))
    .use(less({
      render: {
        paths: [
          path.join(__dirname, 'node_modules', 'bootstrap', 'less'),
          artworkLess
        ]
      },
      useDynamicSourceMap: true
    }))
    .build(callback)
}

function throwIfError (err) {
  if (err) {
    throw err
  }
  console.log('Done building')
}

build((err) => {
  throwIfError(err)
  if (yargs.deploy) {
    git('init')
    git('add', '.')
    git('commit', '-a', '-m', 'Update github site')
    git('push', '-f', repo, 'master')
  }
})

if (yargs.dev) {
  // Run file watcher an live-server
  chokidar.watch([ 'src/**/*', 'layouts/**/*', `${artworkDist}/**/*`, `${artworkLess}/**/*` ], {
    ignoreInitial: true
  }).on('all', (event, path) => {
    console.log('test')
    build(throwIfError)
  })
  liveServer.start({
    port: 8181,
    root: 'build',
    open: yargs.open
  })
}

function git (/** dynamic arguments **/) {
  console.log(cp.execFileSync('git', Array.prototype.slice.apply(arguments), {
    cwd: path.join(__dirname, 'build'),
    env: process.env,
    encoding: 'utf-8'
  }))
}

/**
 * Metalsmith plugin to load an additional source folder
 * @param directory
 * @param target
 * @returns {Function}
 */
function loadSource (directory, target) {
  return function (files, metalsmith, done) {
    metalsmith.read(directory, function (err, newFiles) {
      if (err) {
        return done(err)
      }
      Object.keys(newFiles).forEach(function (file) {
        files[`${target}/${file}`] = newFiles[file]
      })
      done()
    })
  }
}
