var Metalsmith = require('metalsmith')
var markdown = require('metalsmith-markdown')
var layouts = require('metalsmith-layouts')
var permalinks = require('metalsmith-permalinks')
var path = require('path')

console.log(__dirname);
Metalsmith(path.join(__dirname))
    .destination('build')
    .use(markdown())
    .use(layouts('handlebars'))
    .use(permalinks(':title'))
    .build(function(err) {
        if (err) throw err;
    });
