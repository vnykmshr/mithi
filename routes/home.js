/**
 * Home controller
 */

var fs = require('fs');
var path = require('path');
var jade = require('jade');
var debug = require('debug')('home');

var ARTICLES_PATH = path.join(process.cwd(), 'articles');

var excludeFiles = ['includes'];

var home = {
  index: function index(req, res, next) {
    res.locals.title = 'Home';
    res.render('index');
  },

  browse: function browse(req, res, next) {
    debug('serve: ' + req.url);
    req.reqpath = path.join(ARTICLES_PATH, req.url).replace(/.html/i, '.jade');
    fs.exists(req.reqpath, function (exists) {
      if (exists) {
        var stats = fs.statSync(req.reqpath);
        var browse = stats.isFile() ? home.onFile : home.onDirectory;
        browse(req, res, next);
      } else {
        res.render('404');
      }
    });
  },

  onDirectory: function onDirectory(req, res, next) {
    fs.readdir(req.reqpath, function (err, files) {
      var results = [];
      files.forEach(function (file) {
        if (excludeFiles.indexOf(file) > -1) {
          return;
        }

        var filepath = path.join(req.reqpath, file);
        results.push({
          name: file.replace(/.jade/i, ''),
          image: path.join('/images/', encodeURIComponent(file)).replace(/.jade/i, '') + '.png',
          link: path.join(req.url, encodeURIComponent(file)).replace(/.jade/i, '.html')
        });
      });

      res.locals.results = results;
      res.render('directory');
    });
  },

  onFile: function onFile(req, res, next) {
    fs.readFile(req.reqpath, 'utf8', function (err, data) {
      var filename = req.url;
      var html = jade.renderFile(req.reqpath);
      res.locals.article = {
        name: filename,
        image: '/images/' + filename + '.png',
        html: html
      };

      res.render('article');
    });
  }
};

module.exports = home;
